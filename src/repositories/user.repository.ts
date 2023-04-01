import BaseRepository from "./base.repository";
import UserModel from "../model/user.model";

class UserRepository extends BaseRepository{
    constructor() {
        super(UserModel);
    }
}
export default UserRepository
