import { Request, Response } from "express";
import LikesModelClass from "../models/LikesModelClass";
import SongsModel from "../models/SongsModel";

class LikeController {
  static async toggleLikeSong(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const { idSong } = req.params;

      const response = await LikesModelClass.toggleLikeSong({ idUser, idSong });
      console.log(response)
      return res.json(response);
    } catch (error) {
      console.error("Error toggling like on song:", error);
      return res.status(500).json({
        error: `An error occurred while toggling like on song. Error: ${error}`,
      });
    }
  }

  static async getLikesByUser(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const response = await LikesModelClass.getLikesByUser({ idUser });

      const songsLiked = await Promise.all(response.map(async (like: any) => {
        const songData = await SongsModel.getSongById(like.idSong);
        return songData;
      }));

      return res.json(songsLiked);
    } catch (error) {
      console.error("Error getting likes by user:", error);
      return res.status(500).json({
        error: `An error occurred while getting likes by user. Error: ${error}`,
      });
    }
  }

  static async verifySongLikedByUser(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const { idSong } = req.params;
      const response = await LikesModelClass.verifySongLikedByUser({
        idUser,
        idSong,
      });
      return res.json(response);
    } catch (error) {
      console.error("Error verifying song liked by user:", error);
      return res.status(500).json({
        error: `An error occurred while verifying song liked by user. Error: ${error}`,
      });
    }
  }
}

export default LikeController;
