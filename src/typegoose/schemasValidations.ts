import { Ref } from "@typegoose/typegoose";
import { Contact } from "./schemasDefinitions";

export class UserValidations {
  static userNameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9]{6,10}$/.test(v),
    message:
      "Username must be 6-10 characters long and contain only letters and numbers.",
  });

  static emailValidate = () => ({
    validator: (v: string) => /\S+@\S+\.\S+/.test(v),
    message: "Email is not valid!",
  });

  static imageValidate = () => ({
    validator: (v: string) =>
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v),
    message: "Image must be a valid URL.",
  });

  static dateOfBirtValidate = () => ({
    validator: (v: any) => !isNaN(new Date(v).getTime()),
    message: "Date of birth must be a valid date.",
  });

  static contactsValidate = () => ({
    validator: (v: Ref<Contact>[]) => Array.isArray(v),
    message: "Contacts must be an array.",
  });
}

export class GroupValidation {
  static nameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9\s]{1,20}$/.test(v),
    message:
      "Name must be 1-20 characters long and contain only letters, numbers, and spaces.",
  });

  static descriptionValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9\s]{1,200}$/.test(v),
    message: "Description must be 1-200 characters long and contain only letters, numbers, and spaces.",
  });
}

export class ContactValidations {
  static nameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9\s]{1,30}$/.test(v),
    message:
      "Name must be 1-30 characters long and contain only letters, numbers, and spaces.",
  });

  static emailValidate = () => ({
    validator: (v: string) => /\S+@\S+\.\S+/.test(v),
    message: "Email is not valid!",
  });

  static numberValidate = () => ({
    validator: (v: Array<string>) =>
      v.length > 0 && v.every((num) => /^(\+?\d{1,4})?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{3,10}(\*?\d+)?$/.test(num)),
    message:
      "Each number must be a valid phone number and there must be at least one number.",
  });

  static imageValidate = () => ({
    validator: (v: string) =>
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v),
    message: "Image must be a valid URL.",
  });
}
