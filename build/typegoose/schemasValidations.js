"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistValidations = exports.AlbumValidations = exports.SongValidations = exports.ArtistValidations = exports.UserValidations = void 0;
class UserValidations {
}
exports.UserValidations = UserValidations;
UserValidations.userNameValidate = () => ({
    validator: (v) => /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]{6,10}$/.test(v),
    message: "Username must be 6-10 characters long and contain only letters and numbers, including accents and Ñ.",
});
UserValidations.emailValidate = () => ({
    validator: (v) => /\S+@\S+\.\S+/.test(v),
    message: "Email is not valid!",
});
UserValidations.imageValidate = () => ({
    validator: (v) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v),
    message: "Image must be a valid URL.",
});
UserValidations.dateOfBirtValidate = () => ({
    validator: (v) => !isNaN(new Date(v).getTime()),
    message: "Date of birth must be a valid date.",
});
class ArtistValidations {
}
exports.ArtistValidations = ArtistValidations;
ArtistValidations.nameValidate = () => ({
    validator: (v) => /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜ]{3,50}$/.test(v),
    message: "Name must be 3-50 characters long and contain only letters, including accents and Ñ.",
});
ArtistValidations.dateOfJoinValidate = () => ({
    validator: (v) => !isNaN(new Date(v).getTime()),
    message: "Date of join must be a valid date.",
});
class SongValidations {
}
exports.SongValidations = SongValidations;
SongValidations.nameValidate = () => ({
    validator: (v) => v.length >= 2 && v.length <= 100,
    message: "Name must be between 2 and 100 characters long.",
});
SongValidations.durationValidate = () => ({
    validator: (v) => v > 0 && v < 3600,
    message: "Duration must be between 0 and 3600 seconds.",
});
class AlbumValidations {
}
exports.AlbumValidations = AlbumValidations;
AlbumValidations.yearValidate = () => ({
    validator: (v) => !isNaN(new Date(v).getTime()) &&
        new Date(v).getFullYear() >= 1900 &&
        new Date(v).getFullYear() <= new Date().getFullYear(),
    message: "Year must be a valid year between 1900 and the current year.",
});
class PlaylistValidations {
}
exports.PlaylistValidations = PlaylistValidations;
PlaylistValidations.nameValidate = () => ({
    validator: (v) => v.length >= 2 && v.length <= 100,
    message: "Name must be between 2 and 100 characters long.",
});
