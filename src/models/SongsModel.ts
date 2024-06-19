import { ITSGooseHandler } from "../data/instances";
import { SongModel } from "../typegoose/models";
import { ISpotifyAPIManager } from "../data/instances";

class SongsModel {
  static async addSongsApiToDB({
    name,
    mappedSongs = [],
  }: {
    name: string;
    mappedSongs: any;
  }) {
    const spotifySongs =
      (await ISpotifyAPIManager.getSongByName({ name })) || [];

    const spotifySongsMapped = spotifySongs.items;

    await Promise.all(
      spotifySongs.items.map(async (song: any) => {
        const dataMapped = {
          idArtist: song.artists[0].id,
          artistNames: song.artists.map((artist: any) => artist.name),
          name: song.name,
          duration: song.duration_ms,
          urlImage: song.album.images[0].url,
          urlSong: song.external_urls.spotify,
          date: song.album.release_date,
        };

        await ITSGooseHandler.addDocument({
          Model: SongModel,
          data: dataMapped,
        });
      })
    );

    return [...mappedSongs, ...spotifySongsMapped];
  }

  static async getSongByName({ name }: { name: string }) {
    try {
      const songs = await ITSGooseHandler.searchOne({
        Model: SongModel,
        condition: { name: { $regex: name, $options: "i" } },
      });

      const mappedSongs = !songs ? [] : songs;

      if (songs?.length < 5 || !songs) {
        this.addSongsApiToDB({ name, mappedSongs });
      }

      return songs;
    } catch (error) {
      console.error(error);
      return {
        error: `An error ocurred while searching for the song. Error: ${error}`,
      };
    }
  }
}

export default SongsModel;
