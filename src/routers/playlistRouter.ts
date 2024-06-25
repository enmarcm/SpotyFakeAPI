import { Router } from "express";
import PlaylistController from "../controllers/playlistController";

const playlistRouter = Router();
playlistRouter.get("/user", PlaylistController.getAllPlaylistByUser)
playlistRouter.get("/getById/:id", PlaylistController.getPlaylistById);

playlistRouter.post("/create", PlaylistController.createPlaylist);
playlistRouter.put("/edit/:idPlaylist", PlaylistController.editPlaylist);
playlistRouter.put("/editSongs/:idPlaylist", PlaylistController.editSongsPlaylist);

playlistRouter.delete("/delete/:id", PlaylistController.deletePlaylist);



export default playlistRouter;