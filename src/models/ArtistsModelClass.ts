import { ITSGooseHandler } from "../data/instances";
import { ArtistModel } from "../typegoose/models";

class ArtistModelClass {
  static async getArtistsAll() {
    try {
      const result = ITSGooseHandler.searchAll({ Model: ArtistModel });
      return result;
    } catch (error) {
      console.error("Error fetching artists all:", error);
      throw error;
    }
  }

  static async addArtist({
    id,
    name,
    dateOfJoin,
    urlImage
  }: {
    id: string;
    name: string;
    dateOfJoin: Date;
    urlImage: string;
  }) {
    try {
      const result = ITSGooseHandler.addDocument({
        Model: ArtistModel,
        data: { _id: id, name, dateOfJoin, urlImage },
      });
      return result;
    } catch (error) {
      console.error("Error adding artist:", error);
      throw error;
    }
  }

  static async getArtistById({ id }: { id: string }) {
    try {
      const result = ITSGooseHandler.searchOne({
        condition: { _id: id },
        Model: ArtistModel,
      });
      return result;
    } catch (error) {
      console.error("Error fetching artist by ID:", error);
      throw error;
    }
  }
}

export default ArtistModelClass;
