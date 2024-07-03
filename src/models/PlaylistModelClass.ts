import { ITSGooseHandler } from "../data/instances";
import { PlaylistModel } from "../typegoose/models";

class PlaylistModelClass {
  static async createPlaylist({
    name,
    description,
    idSongs,
    idUser,
  }: {
    name: string;
    description: string;
    idSongs: Array<String>;
    idUser: string;
  }) {
    try {
      const result = ITSGooseHandler.addDocument({
        Model: PlaylistModel,
        data: { name, description, idSongs, idUser },
      });
      return result;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  }

  static async getPlaylistById({ id }: { id: string }) {
    try {
      const result = ITSGooseHandler.searchOne({
        condition: { _id: id },
        Model: PlaylistModel,
        
      });
      return result;
    } catch (error) {
      console.error("Error fetching playlist by ID:", error);
      throw error;
    }
  }

  static async getPlayListByName({ name }: { name: string }) {
    try {
      const result = ITSGooseHandler.searchOne({
        condition: { name },
        Model: PlaylistModel,
      });
      return result;
    } catch (error) {
      console.error("Error fetching playlist by name:", error);
      throw error;
    }
  }

  static editPlaylist({
    name,
    description,
    idSongs,
    idUser,
    idPlaylist,
  }: {
    name: string;
    description: string;
    idSongs: Array<String>;
    idUser: string;
    idPlaylist: string;
  }) {
    try {
      const result = ITSGooseHandler.editDocument({
        Model: PlaylistModel,
        id: idPlaylist,
        newData: { name, description, idSongs, idUser },
      });
      return result;
    } catch (error) {
      console.error("Error editing playlist:", error);
      throw error;
    }
  }

  static async editSongsPlaylist({
    idSongs,
    idPlaylist,
  }: {
    idSongs: Array<String>;
    idPlaylist: string;
  }) {
    try {
      const result = ITSGooseHandler.editDocument({
        Model: PlaylistModel,
        id: idPlaylist,
        newData: { idSongs },
      });
      return result;
    } catch (error) {
      console.error("Error editing songs in playlist:", error);
      throw error;
    }
  }

  static async deletePlaylist({ id }: { id: string }) {
    try {
      const result = ITSGooseHandler.removeDocument({
        Model: PlaylistModel,
        id,
      });
      return result;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw Error;
    }
  }

  static async getAllPlaylistByUser({ idUser }: { idUser: string }) {
    try {
      const result = ITSGooseHandler.searchAll({
        Model: PlaylistModel,
        condition: { idUser: idUser },
      });

      return result;
    } catch (error) {
      console.error("Error fetching all playlists:", error);
      throw error;
    }
  }
}

export default PlaylistModelClass;
