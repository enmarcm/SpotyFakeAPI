"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistModel = exports.AlbumModel = exports.LikeModel = exports.SongModel = exports.SubscriptionModel = exports.ArtistModel = exports.ActivateCodeModel = exports.UserModel = void 0;
const instances_1 = require("../data/instances");
const schemasDefinitions_1 = require("../typegoose/schemasDefinitions");
const UserModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.User });
exports.UserModel = UserModel;
const ActivateCodeModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.ActivateCode,
});
exports.ActivateCodeModel = ActivateCodeModel;
const ArtistModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Artist,
});
exports.ArtistModel = ArtistModel;
const SubscriptionModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Subscription,
});
exports.SubscriptionModel = SubscriptionModel;
const SongModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Song,
});
exports.SongModel = SongModel;
const LikeModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Like,
});
exports.LikeModel = LikeModel;
const AlbumModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Album,
});
exports.AlbumModel = AlbumModel;
const PlaylistModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.Playlist,
});
exports.PlaylistModel = PlaylistModel;
