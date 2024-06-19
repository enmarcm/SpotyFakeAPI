export class UserValidations {
  static userNameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]{6,10}$/.test(v),
    message:
      "Username must be 6-10 characters long and contain only letters and numbers, including accents and Ñ.",
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
}

export class ArtistValidations {
  static nameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜ]{3,50}$/.test(v),
    message: "Name must be 3-50 characters long and contain only letters, including accents and Ñ.",
  });

  static dateOfJoinValidate = () => ({
    validator: (v: any) => !isNaN(new Date(v).getTime()),
    message: "Date of join must be a valid date.",
  });
}

export class SongValidations {
  static nameValidate = () => ({
    validator: (v: string) => v.length >= 2 && v.length <= 100,
    message: "Name must be between 2 and 100 characters long.",
  });

  static durationValidate = () => ({
    validator: (v: number) => v > 0 && v < 3600,
    message: "Duration must be between 0 and 3600 seconds.",
  });
}

export class AlbumValidations {
  static yearValidate = () => ({
    validator: (v: any) =>
      !isNaN(new Date(v).getTime()) &&
      new Date(v).getFullYear() >= 1900 &&
      new Date(v).getFullYear() <= new Date().getFullYear(),
    message: "Year must be a valid year between 1900 and the current year.",
  });
}

export class PlaylistValidations {
  static nameValidate = () => ({
    validator: (v: string) => v.length >= 2 && v.length <= 100,
    message: "Name must be between 2 and 100 characters long.",
  });
}
