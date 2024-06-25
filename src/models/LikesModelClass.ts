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
      // Buscar si ya existe un like del usuario para la canción
      const existingLike = await ITSGooseHandler.searchOne({
        Model: LikeModel,
        condition: { idUser, idSong },
      });

      if (existingLike) {
        // Si existe, eliminar el like (deslikear)
        await ITSGooseHandler.removeDocument({
          Model: LikeModel,
          id: existingLike._id,
        });
        return { message: "Song unliked successfully" };
      } else {
        // Si no existe, agregar el like
        await ITSGooseHandler.addDocument({
          Model: LikeModel,
          data: { idUser, idSong },
        });
        return { message: "Song liked successfully" };
      }
    } catch (error) {
      console.error("Error toggling like on song:", error);
      throw error;
    }
  }
}

export default LikesModelClass;
