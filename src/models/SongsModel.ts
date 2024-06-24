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
  static async addSongsApiToDBByGenre({
    genres,
    limit = 10,
  }: {
    genres: string[];
    limit?: number;
  }): Promise<SongType[]> {
    let newSongsFound = 0;
    const initialLimit = limit;
    const maxLimit = 50;

    try {
      // Assuming ITSGooseHandler can handle multiple genres, otherwise, you'll need to adjust this part as well
      const songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition: {
          genre: { $in: genres.map((genre) => new RegExp(genre, "i")) },
        },
      });

      let mappedSongs = (
        Array.isArray(songs) ? songs : songs ? [songs] : []
      ) as SongType[];

      const newSongsArray = [] as any;
      while (newSongsFound < 5 && limit <= maxLimit) {
        const spotifySongs = await SongsModel.fetchSpotifySongs({
          genres, // Pass the genres array directly
          limit,
        });
        const newSongs = this.filterNewSongs(spotifySongs, mappedSongs);

        if (newSongs.length > 0) {
          await this.addNewSongsToDB(newSongs);
          mappedSongs = [...mappedSongs, ...newSongs];
          newSongsFound += newSongs.length;
        }

        if (newSongsFound < 5) {
          limit += initialLimit;
        }

        const mappedSongsFormatPromises = newSongs.map((song) =>
          this.mapSongData(song)
        );

        const resolvedMappedSongs = await Promise.all(
          mappedSongsFormatPromises
        );

        newSongsArray.push(...resolvedMappedSongs);
      }

      return newSongsArray;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async addSongsApiToDB({
    name,
    limit = 10,
  }: {
    name: string;
    limit?: number;
  }): Promise<SongType[]> {
    let newSongsFound = 0;
    const initialLimit = limit;
    const maxLimit = 50;

    const parsedName = name.replace("%", " ");

    try {
      const songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition: { name: { $regex: parsedName, $options: "i" } },
      });

      let mappedSongs = (
        Array.isArray(songs) ? songs : songs ? [songs] : []
      ) as SongType[];

      const newSongsArray = [] as any;
      while (newSongsFound < 5 && limit <= maxLimit) {
        const spotifySongs = await this.fetchSpotifySongs({ name, limit });
        const newSongs = this.filterNewSongs(spotifySongs, mappedSongs);

        if (newSongs.length > 0) {
          await this.addNewSongsToDB(newSongs);
          mappedSongs = [...mappedSongs, ...newSongs];
          newSongsFound += newSongs.length;
        }

        if (newSongsFound < 5) {
          limit += initialLimit;
        }

        const mappedSongsFormatPromises = newSongs.map((song) =>
          this.mapSongData(song)
        );

        const resolvedMappedSongs = await Promise.all(
          mappedSongsFormatPromises
        );

        newSongsArray.push(...resolvedMappedSongs);
      }

      return newSongsArray;
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

  private static async fetchSpotifySongs(options: {
    name?: string;
    genres?: string[];
    limit: number;
  }): Promise<SongType[]> {
    let response;
    if (options.name) {
      response = await ISpotifyAPIManager.getSongByName({
        name: options.name,
        limit: options.limit,
      });
    } else if (options.genres) {
      // Asegúrate de que genres es un array antes de pasarlo
      response = await ISpotifyAPIManager.getSongsByGenres({
        genres: options.genres,
        limit: options.limit,
      });
    } else {
      // Manejar el caso en que ni el nombre ni los géneros son proporcionados
      return [];
    }
    return response?.items || [];
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

    const genres = await ISpotifyAPIManager.fetchGenreForSong(song);

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

  static async getSongsByGenre({
    genre,
    page = 1,
    limit = 5,
  }: {
    genre: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const mapPage = Math.max(page, 1);
      const mapLimit = Math.max(limit, 1);

      const offset = (mapPage - 1) * mapLimit;

      let songs = await ITSGooseHandler.searchAll({
        Model: SongModel,
        condition: { genre: { $regex: genre, $options: "i" } },
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
          name: genre,
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
        `An error occurred while searching for the song by genre. Error: ${error}`
      );
    }
  }

  //TODO:
  static async getSongByAlbum({ idAlbum }: { idAlbum: string }) {
    console.log(idAlbum);
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
