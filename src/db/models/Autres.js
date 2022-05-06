import { Model } from "objection";
import Come from "./Come.js";

class Product extends Model {
  static tableName = "comments";

  static get relationMappings() {
    return {
      creator: {
        realtion: Model.BelongsToOneRelation,
        modelClass: Come,
        join: {
          from: "",
          to: "comments.id",
        },
      },
    };
  }
}
