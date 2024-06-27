import { Router } from "express";
import AlbumController from "../controllers/albumController";

const albumRouter = Router();

albumRouter.get("/top", AlbumController.getTopAlbum);


export default albumRouter;