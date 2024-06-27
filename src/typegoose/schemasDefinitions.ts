//TODO: AGREGAR VALIDACIONES QUE YA SE CREAERON
//TODO: AL USUARIO LE FALTA EL ROL
import { prop, Ref } from "@typegoose/typegoose";
import { UserValidations } from "./schemasValidations";

export class User {
  @prop({
    required: true,
    type: String,
    validate: UserValidations.userNameValidate(),
  })
  public userName!: string;

  @prop({
    required: true,
    type: String,
    validate: UserValidations.emailValidate(),
  })
  public email!: string;

  @prop({
    required: true,
    type: String,
  })
  public password!: string;

  @prop({
    required: false,
    type: String,
    validate: UserValidations.imageValidate(),
  })
  public image!: string;

  @prop({
    required: false,
    type: Date,
    validate: UserValidations.dateOfBirtValidate(),
  })
  public dateOfBirth!: Date;

  @prop({ required: false, type: String, default: "user" })
  public role!: string;

  @prop({ required: false, type: Number, default: 3 })
  public attempts!: number;

  @prop({ required: false, type: Boolean, default: false })
  public blocked!: boolean;

  @prop({ required: false, type: Boolean, default: false })
  public active!: boolean;

  @prop({ required: false, type: String })
  public idArtist?: string;
}

export class ActivateCode {
  @prop({ required: true, type: String })
  public code!: string;

  @prop({ required: true, type: String })
  public idUser!: string;

  @prop({ default: Date.now, type: Date })
  public createdAt?: Date;

  @prop({ expires: 12000, type: Date })
  public expireAt?: Date;
}

export class Artist {
  @prop({ required: true, type: String })
  public _id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: Date })
  public dateOfJoin!: Date;

  @prop({ required: false, type: String })
  public urlImage?: string;
}

export class Subscription {
  @prop({ ref: () => Artist, required: true, type: String })
  public idArtist!: Ref<Artist>;

  @prop({ ref: () => User, required: true, type: String })
  public idUser!: Ref<User>;
}

export class Song {
  @prop({ required: true, type: String })
  public _id!: string;

  @prop({ ref: () => Artist, required: false, type: Array<String> })
  public idArtist?: Ref<Artist>[];

  @prop({ required: false, type: Array<String> })
  public artistNames?: string[];

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: Number })
  public duration!: number;

  @prop({ required: true, type: Date })
  public date!: Date;

  @prop({ required: true, type: String })
  public urlImage!: string;

  @prop({ required: true, type: String })
  public urlSong!: string;

  @prop({ required: false, type: Array<String> })
  public genres?: Array<String>;

  @prop({ required: false, type: String })
  public albumName?: string;
}

export class Like {
  @prop({ ref: () => User, required: true, type: String })
  public idUser!: Ref<User>;

  @prop({ ref: () => Song, required: true, type: String })
  public idSong!: Ref<Song>;
}

export class Album {
  @prop({ required: true, type: String })
  public _id!: string;

  @prop({ required: true, type: Date })
  public year!: Date;

  @prop({ ref: () => Song, required: true, type: [String] })
  public songs!: Ref<Song>[];

  @prop({ ref: () => Artist, required: true, type: [String] })
  public idArtist!: Ref<Artist>[];
}

export class Playlist {
  @prop({ ref: () => Song, required: true, type: Array<String> })
  public idSongs!: Ref<Song>[];

  @prop({ ref: () => User, required: true, type: String })
  public idUser!: Ref<User>;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: false, type: String })
  public description!: string;

  @prop({ required: false, type: String })
  public urlQr!: string;
}
