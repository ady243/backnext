import { Model } from "objection";

class User extends Model {
  static tableName = "users";
}

export default User;
