import { Model } from "objection";
import User from "./User.js";

class Product extends Model {
  static tableName = "products";

  static get relationMappings() {
    return {
      creator: {
        realtion: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "",
          to: "users.id",
        },
      },
    };
  }
}
