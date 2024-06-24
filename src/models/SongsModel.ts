import { ITSGooseHandler } from "../data/instances";
import { SongModel } from "../typegoose/models";
import { ISpotifyAPIManager } from "../data/instances";
import {
  AddSongModelType,
  DeleteSongType,
  MappedSongType,
  SongType,
} from "../types";

class SongsModel {
  static async addSongsApiToDB({
    name,
    genres,
    limit = 10,
  }: {
    name?: string;
    genres?: string[];
    limit?: number;
  }): Promise<SongType[]> {
    let newSongsFound = 0;
    const initialLimit = limit;
    const maxLimit = 50;

    try {
      const condition = name
        ? { name: { $regex: name.replace("%", " "), $options: "i" } }
        : { genres: { $in: genres } };

      const songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition,
      });

      let mappedSongs = (
        Array.isArray(songs) ? songs : songs ? [songs] : []
      ) as SongType[];

      const newSongsArray = [];
      while (newSongsFound < 5 && limit <= maxLimit) {
        let spotifySongs = [];

        if (name) {
          spotifySongs = await this.fetchSpotifySongs({ name, limit });

        } else if (genres && genres.length > 0) {

          for (const genre of genres) {
            const genreSongs = await this.fetchSpotifySongs({
              genre: genre,
              limit,
            });

            spotifySongs.push(...genreSongs);
          }

        }
        const newSongs = this.filterNewSongs(spotifySongs, mappedSongs);

        if (newSongs.length > 0) {
          await this.addNewSongsToDB(newSongs);
          mappedSongs = [...mappedSongs, ...newSongs];
          newSongsFound += newSongs.length;
        } else {
          break;
        }

        if (newSongsFound < 5) {
          limit += initialLimit;
        }

        // Asegurarse de que limit no exceda maxLimit
        if (limit > maxLimit) {
          limit = maxLimit;
        }

        const mappedSongsFormatPromises = newSongs.map((song) =>
          this.mapSongData(song)
        );

        const resolvedMappedSongs = await Promise.all(
          mappedSongsFormatPromises
        );
        newSongsArray.push(...resolvedMappedSongs);
      }

      return newSongsArray as any;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async getSongByName({
    name,
    page = 1,
    limit = 5,
  }: {
    name: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const mapPage = Math.max(page, 1);
      const mapLimit = Math.max(limit, 1);

      const offset = (mapPage - 1) * mapLimit;

      const mappedName = name.replace("%", " ");

      let songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition: { name: { $regex: mappedName, $options: "i" } },
        limit: mapLimit,
        offset,
      });

      let mappedSongs: any = Array.isArray(songs)
        ? songs
        : songs
        ? [songs]
        : [];

      if (mappedSongs.length < mapLimit) {
        const totalSongsNeeded = mapPage * mapLimit;
        const additionalSongsNeeded =
          totalSongsNeeded - (songs ? songs.length : 0);
        const newSongs = await this.addSongsApiToDB({
          name,
          limit: additionalSongsNeeded,
        });

        if (mapPage === 1) {
          mappedSongs = [...mappedSongs, ...newSongs.slice(0, mapLimit)];
        } else {
          const effectiveOffset = Math.max(
            0,
            additionalSongsNeeded - (mapPage - 1) * mapLimit
          );

          mappedSongs = newSongs?.slice(
            effectiveOffset,
            effectiveOffset + mapLimit
          );
        }
      }

      return mappedSongs;
    } catch (error) {
      console.error(error);
      throw new Error(
        `An error occurred while searching for the song. Error: ${error}`
      );
    }
  }

  static async getSongByGenre({
    genres,
    page = 1,
    limit = 5,
  }: {
    genres: string[];
    page?: number;
    limit?: number;
  }) {
    try {
      const mapPage = Math.max(page, 1);
      const mapLimit = Math.max(limit, 1);

      const offset = (mapPage - 1) * mapLimit;

      let songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition: {
          genre: { $in: genres.map((genre) => new RegExp(genre, "i")) },
        },
        limit: mapLimit,
        offset,
      });

      let mappedSongs: any = Array.isArray(songs)
        ? songs
        : songs
        ? [songs]
        : [];

      if (mappedSongs.length < mapLimit) {
        const totalSongsNeeded = mapPage * mapLimit;
        const additionalSongsNeeded =
          totalSongsNeeded - (songs ? songs.length : 0);

        const newSongs = await this.addSongsApiToDB({
          genres,
          limit: additionalSongsNeeded,
        });

        if (mapPage === 1) {
          mappedSongs = [...mappedSongs, ...newSongs.slice(0, mapLimit)];
        } else {
          const effectiveOffset = Math.max(
            0,
            additionalSongsNeeded - (mapPage - 1) * mapLimit
          );

          mappedSongs = newSongs?.slice(
            effectiveOffset,
            effectiveOffset + mapLimit
          );
        }
      }

      return mappedSongs;
    } catch (error) {
      console.error(error);
      throw new Error(
        `An error occurred while searching for songs by genre. Error: ${error}`
      );
    }
  }

  private static async fetchSpotifySongs(options: {
    name?: string;
    genre?: string;
    limit: number;
  }): Promise<SongType[]> {
    console.log(options);

    let response;
    if (options.name) {
      response = await ISpotifyAPIManager.getSongByName({
        name: options.name,
        limit: options.limit,
      });
    } else if (options.genre) {
      response = await ISpotifyAPIManager.getSongByGenre({
        genre: options.genre,
        artistLimit: options.limit,
        trackLimit: options.limit,
      });
    } else {
      return [];
    }

    return response || [];
  }

  private static filterNewSongs(
    spotifySongs: SongType[],
    mappedSongs: SongType[]
  ): SongType[] {
    return spotifySongs.filter(
      (song) => !mappedSongs.some((mappedSong) => mappedSong.id === song.id)
    );
  }

  //TODO: Cambiar esto ya que gasta mucho ancho de banda
  private static async addNewSongsToDB(newSongs: SongType[]): Promise<void> {
    await Promise.all(
      newSongs.map(async (song) => {
        const existingSong = await ITSGooseHandler.searchOne({
          Model: SongModel,
          condition: { _id: song.id },
        });

        if (!existingSong) {
          const dataMapped = await this.mapSongData(song);

          await ITSGooseHandler.addDocument({
            Model: SongModel,
            data: dataMapped,
          });
        }
      })
    );
  }

  private static async mapSongData(
    song: any
  ): Promise<MappedSongType | SongType | void> {
    if (song._id && song.idArtist && song.artistNames) {
      return song;
    }

    const isValidBeforeFormatting =
      song.id &&
      song.name &&
      song.artists &&
      song.artists.some((artist: any) => artist.id && artist.name);

    if (!isValidBeforeFormatting) {
      console.log("Canción inválida, será omitida.");
      return;
    }

    const genres = await ISpotifyAPIManager.fetchGenreForSong(song.id);

    const newSong = {
      _id: song?.id,
      idArtist:
        song?.artists?.length > 0
          ? song.artists?.map((artist: any) => artist?.id)
          : ["unknown"],
      artistNames: song.artists?.map((artist: any) => artist.name),
      name: song?.name,
      duration: song?.duration_ms,
      urlImage: song.album?.images[0]
        ? song?.album?.images[0].url
        : "defaultImageUrl",
      urlSong: song?.external_urls?.spotify,
      date: song?.album?.release_date,
      genres: genres,
    };

    return newSong;
  }

  //TODO:
  static async addSong({
    name,
    idArtist,
    idAlbum,
    duration,
    urlSong,
    urlImage,
    date,
  }: AddSongModelType) {
    try {
      const song = await ITSGooseHandler.addDocument({
        Model: SongModel,
        data: { idArtist, name, duration, urlSong, urlImage, date, idAlbum },
      });

      return song;
    } catch (error) {
      console.error(error);
      return {
        error: `An error occurred while adding the song. Error: ${error}`,
      };
    }
  }

  //TODO:
  static async deleteSong({ idSong, idUser }: DeleteSongType) {
    try {
      console.log(idSong, idUser); //TODO: Quitar esto

      //Verificar que la cancion existe
      const song = await ITSGooseHandler.searchOne({
        Model: SongModel,
        condition: { _id: idSong },
      });

      if (!song || song.error) throw new Error("Song not found");

      //verificar que el usuario sea dueño de esa cancion
      //Encontrar el artista a partir del idUser

      //Eliminar de los albunes que pertenezca

      //Eliminar de las listas de reproduccion que pertenezca

      //Eliminar de los likes

      //Eliminar la cancion
      const deletedSong = await ITSGooseHandler.removeDocument({
        Model: SongModel,
        id: idSong,
      });

      return deletedSong;
    } catch (error) {
      console.error(error);
      return {
        error: `An error occurred while deleting the song. Error: ${error}`,
      };
    }
  }

  //TODO
  static async editSong({
    idSong,
    newData,
  }: {
    idSong: string;
    newData: AddSongModelType;
  }) {
    console.log(idSong, newData);
  }
}

export default SongsModel;
