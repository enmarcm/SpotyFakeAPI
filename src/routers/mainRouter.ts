import { Router } from "express";
import MainController from "../controllers/mainController";
import SpotifyAPIManager from "../components/SpotifyAPIManager";

const mainRouter = Router();

mainRouter.get("/", MainController.root);

mainRouter.get("/test", SpotifyAPIManager.obtainTokenSpotify);

export default mainRouter;