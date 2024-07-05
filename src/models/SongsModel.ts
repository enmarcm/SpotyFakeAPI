import { ITSGooseHandler } from "../data/instances";
import { LikeModel, PlaylistModel, SongModel } from "../typegoose/models";
import { ISpotifyAPIManager } from "../data/instances";
import {
  AddSongModelType,
  DeleteSongType,
  MappedSongType,
  SongType,
} from "../types";
import ArtistModelClass from "./ArtistsModelClass";
import UserModelClass from "./UserModelClass";
import PlaylistModelClass from "./PlaylistModelClass";
import CryptManager from "../utils/CryptManager";

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
    retry = false,
  }: {
    name: string;
    page?: number;
    limit?: number;
    retry?: boolean;
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

      const mappSongsArtists = songs.map((song: any)=>{
        const newObject = {
          ...song,
          artists: song.idArtist.map((idArtist: any) => ISpotifyAPIManager.getArtistById({id: idArtist}))
        }

        return newObject
      });

      let mappedSongs: any = Array.isArray(mappSongsArtists)
        ? mappSongsArtists
        : mappSongsArtists
        ? [mappSongsArtists]
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

      if (mappedSongs.length === 0 && !retry) {
        this.getSongByName({ name, page: mapPage, limit, retry: true });
      }

      return mappedSongs;
    } catch (error) {
      console.error(error);
      throw new Error(
        `An error occurred while searching for the song. Error: ${error}`
      );
    }
  }

  static async getSongById(id: string){
    try {
      const resultDB = await ITSGooseHandler.searchId({
        Model: SongModel,
        id
      });

      if(!resultDB || resultDB?.length === 0 || resultDB?.error){
        const resultSpotify = await ISpotifyAPIManager.getSongById({id});

        if(!resultSpotify || resultSpotify?.error) throw new Error("Song not found");
        const dataMapped = await this.mapSongData(resultSpotify);
        return dataMapped;
      }

      return resultDB;
    } catch (error) {
      console.error(error)
      throw new Error(`An error occurred while searching for the song. Error: ${error}`);
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
    spotifySongs: any,
    mappedSongs: SongType[]
  ): SongType[] {
    const newData = spotifySongs.items;

    return newData?.filter(
      (song: any) =>
        !mappedSongs.some((mappedSong) => mappedSong.id === song.id)
    );
  }

  //TODO: Cambiar esto ya que gasta mucho ancho de banda
  private static async addNewSongsToDB(newSongs: SongType[]): Promise<void> {
    await Promise.all(
      newSongs.map(async (song: any) => {
        const existingSong = await ITSGooseHandler.searchOne({
          Model: SongModel,
          condition: { _id: song.id },
        });

        if (!existingSong) {
          // Iterar sobre el array de artistas de la canción
          await Promise.all(
            song.artists.map(async (artist: any) => {
              const existingArtist = await ArtistModelClass.getArtistById({
                id: artist.id,
              });

              if (!existingArtist) {

                const artistData = await ISpotifyAPIManager.getArtistInfoById(artist.id);

                if (!artistData) {
                  console.log("No se encontró información del artista.");
                  return;
                }

                await ArtistModelClass.addArtist({
                  id: artist.id,
                  name: artist.name,
                  dateOfJoin: new Date(),
                  urlImage: artistData.images[0]?.url || "https://lastfm.freetls.fastly.net/i/u/770x0/dd90f6548472acf19dd781ef269b9d62.jpg#dd90f6548472acf19dd781ef269b9d62"
                }).catch((error) => console.error(error)); // Manejo de errores en caso de que la promesa sea rechazada
              }
            })
          );

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
      urlSong:
        song?.preview_url ||
        "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
      date: song?.album?.release_date,
      genres: genres,
      albumName: song?.album?.name,
    };

    return newSong;
  }

  static async addSong({
    name,
    idArtist,
    albumName,
    duration,
    urlSong = "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
    urlImage = "https://i.scdn.co/image/ab67616d0000b273e63232b00577a053120ca08f",
    date,
    idUser
  }: AddSongModelType) {
    try {
      const userArtist = await UserModelClass.getUserInfo({ idUser });
      if (!userArtist.idArtist) throw new Error("User is not an artist");

      const _id = CryptManager.generateRandom()
      
      const song = await ITSGooseHandler.addDocument({
        Model: SongModel,
        data: {_id, idArtist, name, duration, urlSong, urlImage, date, albumName },
      });

      return song;
    } catch (error) {
      console.error(error);
      return {
        error: `An error occurred while adding the song. Error: ${error}`,
      };
    }
  }

  static async deleteSong({ idSong, idUser }: DeleteSongType) {
    try {
      //Verificar que la cancion existe
      const song = await ITSGooseHandler.searchOne({
        Model: SongModel,
        condition: { _id: idSong },
      });

      if (!song || song.error) throw new Error("Song not found");

      //verificar que el usuario sea dueño de esa cancion
      const userArtist = await UserModelClass.getUserInfo({ idUser });

      if (!userArtist.idArtist) throw new Error("User is not an artist");

      if (song.idArtist !== userArtist.idArtist)
        throw new Error("User is not the owner of the song");

      //Eliminar de las listas de reproduccion que pertenezca
      const playlists = await ITSGooseHandler.searchAll({
        Model: PlaylistModel,
        condition: { idSongs: { $in: [idSong] } },
      });

      if (playlists && playlists.length > 0) {
        playlists.forEach(async (playlist: any) => {
          const updatedSongs = playlist.idSongs.filter(
            (idSong: any) => idSong !== idSong
          );

          await PlaylistModelClass.editSongsPlaylist({
            idPlaylist: playlist._id,
            idSongs: updatedSongs,
          });
        });
      }

      //Eliminar de los likes
      await ITSGooseHandler.removeAllDocumentsByCondition({
        Model: LikeModel,
        condition: { idSong },
      });

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
}

export default SongsModel;
