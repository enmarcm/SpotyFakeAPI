import { ITSGooseHandler } from "../data/instances";
import { User, ActivateCode, Artist, Subscription, Song, Like, Album, Playlist } from "../typegoose/schemasDefinitions";

const UserModel = ITSGooseHandler.createModel<User>({ clazz: User });

const ActivateCodeModel = ITSGooseHandler.createModel<ActivateCode>({
  clazz: ActivateCode,
});

const ArtistModel = ITSGooseHandler.createModel<Artist>({
  clazz: Artist,
});

const SubscriptionModel = ITSGooseHandler.createModel<Subscription>({
  clazz: Subscription,
});

const SongModel = ITSGooseHandler.createModel<Song>({
  clazz: Song,
});

const LikeModel = ITSGooseHandler.createModel<Like>({
  clazz: Like,
});

const AlbumModel = ITSGooseHandler.createModel<Album>({
  clazz: Album,
});

const PlaylistModel = ITSGooseHandler.createModel<Playlist>({
  clazz: Playlist,
});

export { UserModel, ActivateCodeModel, ArtistModel, SubscriptionModel, SongModel, LikeModel, AlbumModel, PlaylistModel };