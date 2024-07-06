import { Router } from "express";
import LikeController from "../controllers/likesController";

const likesRouter = Router();

likesRouter.get("/toggleLike/:idSong", LikeController.toggleLikeSong);

likesRouter.get("/getLikeByUser", LikeController.getLikesByUser);

likesRouter.get("/verifySong/:idSong", LikeController.verifySongLikedByUser);

export default likesRouter;