import { Router } from "express";
import SongsController from "../controllers/songsController";

const songRouter = Router();

songRouter.get("/:songName", SongsController.getSongByName);

export default songRouter;
