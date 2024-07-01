import { Router } from "express";
import SongsController from "../controllers/songsController";

const songRouter = Router();

songRouter.get("/top", SongsController.getTopSongs);
songRouter.get("/getById/:idSong", SongsController.getSongById);
songRouter.get("/genres", SongsController.getGenres)
songRouter.get("/getByGenre/:genre", SongsController.getSongsByGenre2);
songRouter.get("/:songName", SongsController.getSongByName);




songRouter.post("/add", SongsController.addSong);

songRouter.delete("/delete/:id", SongsController.deleteSong);

export default songRouter;
