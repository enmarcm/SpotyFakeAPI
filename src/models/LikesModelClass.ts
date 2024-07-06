import { ITSGooseHandler } from "../data/instances";
import { LikeModel } from "../typegoose/models";

class LikesModelClass {
  static async toggleLikeSong({
    idUser,
    idSong,
  }: {
    idUser: string;
    idSong: string;
  }) {
    try {
      const existingLike = await ITSGooseHandler.searchOne({
        Model: LikeModel,
        condition: { idUser, idSong },
      });

      if (existingLike) {
        await ITSGooseHandler.removeDocument({
          Model: LikeModel,
          id: existingLike._id,
        });
        return { message: "Song unliked successfully" };
      } else {

        const data = {idUser, idSong}
         await ITSGooseHandler.addDocument({
          Model: LikeModel,
          data,
        });
        return { message: "Song liked successfully" };
      }
    } catch (error) {
      console.error("Error toggling like on song:", error);
      throw error;
    }
  }

  static async getLikesByUser({ idUser }: { idUser: string }) {
    try {
      console.log(idUser)
      // Buscar todos los likes del usuario
      const likes = await ITSGooseHandler.searchAll({
        Model: LikeModel,
        condition: { idUser },
      });

      return likes;
    } catch (error) {
      console.error("Error getting likes by user:", error);
      throw error;
    }
  }

  static async getLikesBySong({ idSong }: { idSong: string }) {
    try {
      // Buscar todos los likes de la canción
      const likes = await ITSGooseHandler.searchAll({
        Model: LikeModel,
        condition: { idSong },
      });

      return likes;
    } catch (error) {
      console.error("Error getting likes by song:", error);
      throw error;
    }
  }

  static async verifySongLikedByUser({
    idUser,
    idSong,
  }: {
    idUser: string;
    idSong: string;
  }) {
    try {
      // Buscar si el usuario ya le dio like a la canción
      const existingLike = await ITSGooseHandler.searchOne({
        Model: LikeModel,
        condition: { idUser, idSong },
      });

      return !!existingLike;
    } catch (error) {
      console.error("Error verifying song liked by user:", error);
      throw error;
    }
  }

}

export default LikesModelClass;
