import { ITSGooseHandler } from "../data/instances";
import { SongModel } from "../typegoose/models";
import { ISpotifyAPIManager } from "../data/instances";
import { MappedSongType, SongType } from "../types";

class SongsModel {
  static async addSongsApiToDB({
    name,
    mappedSongs = [],
    limit = 10,
  }: {
    name: string;
    mappedSongs: SongType[];
    limit?: number;
  }): Promise<SongType[]> {
    let newSongsFound = 0;
    const initialLimit = limit;
    const maxLimit = 50; // Establece un límite máximo para evitar llamadas excesivas

    try {
      const newSongsArray = [];
      while (newSongsFound < 5 && limit <= maxLimit) {
        const spotifySongs = await this.fetchSpotifySongs(name, limit);
        const newSongs = this.filterNewSongs(spotifySongs, mappedSongs);

        if (newSongs.length > 0) {
          await this.addNewSongsToDB(newSongs);
          mappedSongs = [...mappedSongs, ...newSongs];
          newSongsFound += newSongs.length;
        }

        if (newSongsFound < 5) {
          limit += initialLimit;
        }

        const mappedSongsFormat = newSongs.map((song) => this.mapSongData(song));

        newSongsArray.push(...mappedSongsFormat);
      }

      return newSongsArray as any;
    } catch (error) {
      console.error(error);
      return [];
    }

    return mappedSongs;
  }

  private static async fetchSpotifySongs(
    name: string,
    limit: number
  ): Promise<SongType[]> {
    const response = await ISpotifyAPIManager.getSongByName({ name, limit });
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
          const dataMapped = this.mapSongData(song);
          await ITSGooseHandler.addDocument({
            Model: SongModel,
            data: dataMapped,
          });
        }
      })
    );
  }

  private static mapSongData(song: SongType): MappedSongType {
    return {
      _id: song.id,
      idArtist: song.artists[0].id,
      artistNames: song.artists.map((artist) => artist.name),
      name: song.name,
      duration: song.duration_ms,
      urlImage: song.album.images[0].url,
      urlSong: song.external_urls.spotify,
      date: song.album.release_date,
    };
  }

  static async getSongByName({ name }: { name: string }) {
    try {
      const songs = await ITSGooseHandler.searchOne({
        Model: SongModel,
        condition: { name: { $regex: name, $options: "i" } },
      });

      const mappedSongs = Array.isArray(songs) ? songs : songs ? [songs] : [];

      if (songs?.length < 5 || !songs) {
        const result = await this.addSongsApiToDB({
          name,
          mappedSongs,
          limit: 10,
        });

        return result;
      }

      return songs;
    } catch (error) {
      console.error(error);
      return {
        error: `An error occurred while searching for the song. Error: ${error}`,
      };
    }
  }
}

export default SongsModel;
