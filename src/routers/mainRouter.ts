import { Router } from "express";
import MainController from "../controllers/mainController";
import { ISpotifyAPIManager } from "../data/instances";

const mainRouter = Router();

mainRouter.get("/", MainController.root);

mainRouter.get("/test",  async (_req, res)=>{
    const respuesta = await ISpotifyAPIManager.getSongByName({name: "La locura esta en mi"});
    res.json(respuesta);
});

export default mainRouter;