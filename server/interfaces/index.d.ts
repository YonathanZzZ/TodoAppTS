import {User} from "./user.interface";

export{}

declare global{
    namespace Express {
        export interface Request {
            user?: User
        }
    }
}