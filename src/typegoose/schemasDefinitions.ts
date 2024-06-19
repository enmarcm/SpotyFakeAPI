import { prop } from "@typegoose/typegoose";
import {
  UserValidations,
} from "./schemasValidations";

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

  // @prop({
  //   required: false,
  //   ref: () => "Contact",
  //   type: () => [Schema.Types.ObjectId],
  //   validate: UserValidations.contactsValidate(),
  //   default: () => [],
  // })
  // public contacts!: Ref<Contact>[];

  @prop({ required: false, type: Number, default: 3 })
  public attempts!: number;

  @prop({ required: false, type: Boolean, default: false })
  public blocked!: boolean;

  @prop({ required: false, type: Boolean, default: false })
  public active!: boolean;
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