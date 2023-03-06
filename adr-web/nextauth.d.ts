// nextauth.d.ts
//https://reacthustle.com/blog/extend-user-session-nextauth-typescript
import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
    /**
     * user name login
     */
    loginName: string;
}

declare module "next-auth" {
    interface User extends IUser { }
    interface Session {
        user?: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends IUser {}
}