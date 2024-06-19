import { ITSGooseHandler } from "../data/instances";
import { User, ActivateCode } from "../typegoose/schemasDefinitions";

const UserModel = ITSGooseHandler.createModel<User>({ clazz: User });

const ActivateCodeModel = ITSGooseHandler.createModel<ActivateCode>({
  clazz: ActivateCode,
});

export { UserModel, ActivateCodeModel };
