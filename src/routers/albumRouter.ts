import { Router } from "express";
import AlbumController from "../controllers/albumController";

const albumRouter = Router();

albumRouter.get("/getId/:id", AlbumController.getAlbumById);
albumRouter.get("/top", AlbumController.getTopAlbum);
albumRouter.get("/artist/:id", AlbumController.getAlbumByIdArtist);


export default albumRouter;