"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = exports.Album = exports.Like = exports.Song = exports.Subscription = exports.Artist = exports.ActivateCode = exports.User = void 0;
//TODO: AGREGAR VALIDACIONES QUE YA SE CREAERON
//TODO: AL USUARIO LE FALTA EL ROL
const typegoose_1 = require("@typegoose/typegoose");
const schemasValidations_1 = require("./schemasValidations");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
        validate: schemasValidations_1.UserValidations.userNameValidate(),
    })
], User.prototype, "userName", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
        validate: schemasValidations_1.UserValidations.emailValidate(),
    })
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
    })
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: false,
        type: String,
        validate: schemasValidations_1.UserValidations.imageValidate(),
    })
], User.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: false,
        type: Date,
        validate: schemasValidations_1.UserValidations.dateOfBirtValidate(),
    })
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String, default: "user" })
], User.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Number, default: 10000 })
], User.prototype, "attempts", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Boolean, default: false })
], User.prototype, "blocked", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Boolean, default: false })
], User.prototype, "active", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], User.prototype, "idArtist", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], User);
let ActivateCode = class ActivateCode {
};
exports.ActivateCode = ActivateCode;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], ActivateCode.prototype, "code", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], ActivateCode.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, type: Date })
], ActivateCode.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ expires: 12000, type: Date })
], ActivateCode.prototype, "expireAt", void 0);
exports.ActivateCode = ActivateCode = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], ActivateCode);
let Artist = class Artist {
};
exports.Artist = Artist;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Artist.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Artist.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Date })
], Artist.prototype, "dateOfJoin", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Artist.prototype, "urlImage", void 0);
exports.Artist = Artist = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Artist);
let Subscription = class Subscription {
};
exports.Subscription = Subscription;
__decorate([
    (0, typegoose_1.prop)({ ref: () => Artist, required: true, type: String })
], Subscription.prototype, "idArtist", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => User, required: true, type: String })
], Subscription.prototype, "idUser", void 0);
exports.Subscription = Subscription = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Subscription);
let Song = class Song {
};
exports.Song = Song;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Song.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Artist, required: false, type: (Array) })
], Song.prototype, "idArtist", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: (Array) })
], Song.prototype, "artistNames", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Song.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Number })
], Song.prototype, "duration", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Date })
], Song.prototype, "date", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Song.prototype, "urlImage", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Song.prototype, "urlSong", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: (Array) })
], Song.prototype, "genres", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Song.prototype, "albumName", void 0);
exports.Song = Song = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Song);
let Like = class Like {
};
exports.Like = Like;
__decorate([
    (0, typegoose_1.prop)({ ref: () => User, required: true, type: String })
], Like.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Song, required: true, type: String })
], Like.prototype, "idSong", void 0);
exports.Like = Like = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Like);
let Album = class Album {
};
exports.Album = Album;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Album.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Date })
], Album.prototype, "year", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Song, required: true, type: [String] })
], Album.prototype, "songs", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Artist, required: true, type: [String] })
], Album.prototype, "idArtist", void 0);
exports.Album = Album = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Album);
let Playlist = class Playlist {
};
exports.Playlist = Playlist;
__decorate([
    (0, typegoose_1.prop)({ ref: () => Song, required: true, type: (Array) })
], Playlist.prototype, "idSongs", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => User, required: true, type: String })
], Playlist.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Playlist.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Playlist.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Playlist.prototype, "urlQr", void 0);
exports.Playlist = Playlist = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Playlist);
