import { ITSGooseHandler } from "../data/instances";
import {
  User,
  Group,
  Contact,
  GroupContact,
  ActivateCode,
} from "../typegoose/schemasDefinitions";

const UserModel = ITSGooseHandler.createModel<User>({ clazz: User });

const GroupModel = ITSGooseHandler.createModel<Group>({ clazz: Group });

const ContactModel = ITSGooseHandler.createModel<Contact>({ clazz: Contact });

const GroupContactModel = ITSGooseHandler.createModel<GroupContact>({
  clazz: GroupContact,
});

const ActivateCodeModel = ITSGooseHandler.createModel<ActivateCode>({
  clazz: ActivateCode,
});

export {
  UserModel,
  GroupModel,
  ContactModel,
  GroupContactModel,
  ActivateCodeModel,
};
