import { Router } from "express";
import ArtistController from "../controllers/artistsController";

const artistRouter = Router();

artistRouter.get("/getAll", ArtistController.getArtistsAll);

artistRouter.get("/getId/:id", ArtistController.getArtistById);

export default artistRouter;
