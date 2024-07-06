import express from "express";
import { PORT } from "./constants";
import { startServer } from "./functions";
import {
  midConnectDB,
  midCors,
  midJson,
  midNotFound,
  midNotJson,
  midValidJson,
  midErrorHandler,
  midToken,
} from "./middlewares/middlewares";
import R from "./routers/allRouters";
import { Routes } from "./enums";

const app = express();

//{ Middlewares
app.use(midJson());
app.use(midValidJson);
app.use(midCors());
app.use(midNotJson);
app.use(midConnectDB);

//!TODO: Colocar de nuevo los tokens
//{ Routes
app.use(Routes.AUTH, R.authRouter);
app.use(Routes.SONGS, midToken, R.songRouter);
app.use(Routes.PLAYLIST, midToken, R.playlistRouter);
app.use(Routes.PROFILE, midToken, R.profileRouter);
app.use(Routes.ARTIST, midToken, R.artistRouter);
app.use(Routes.ALBUM, midToken, R.albumRouter);
app.use(Routes.LIKES, midToken,R.likesRouter);

app.use(midErrorHandler);
app.use(midNotFound);

startServer({ app, PORT });
