import { Router } from "express";
import SongsController from "../controllers/songsController";

const songRouter = Router();

songRouter.get("/getById/:idSong", SongsController.getSongById);
songRouter.get("/:songName", SongsController.getSongByName);



songRouter.post("/getByGenre", SongsController.getSongsByGenre);

songRouter.post("/add", SongsController.addSong);

songRouter.delete("/delete/:id", SongsController.deleteSong);

export default songRouter;
