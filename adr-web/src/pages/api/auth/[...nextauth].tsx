import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`
    return await NextAuth(req, res, {
        providers: [
            GitHubProvider({
                clientId: process.env.GITHUB_CLIENT_ID!,
                clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            }),
            GitLabProvider({
                clientId: process.env.GITLAB_CLIENT_ID!,
                clientSecret: process.env.GITLAB_CLIENT_SECRET!,
            }),
        ],
        callbacks: {
            async jwt({ token, user, account, profile, isNewUser }) {
                // Persist the OAuth access_token to the token right after signin
                if(profile && account) {
                    token.loginName = profile.login;
                    token.access_token = account.access_token;
                }
                // console.log("jwt->token",token);
                // console.log("jwt->user", user);
                // console.log("jwt->account", account);
                // console.log("jwt->profile",profile);
                // console.log("jwt->isNewUser", isNewUser);
                return token
            },
            async signIn(user: any, account: any, profile: any) {
                //console.log("profile login->", user.profile.login);
                const data = { user, idOwner: user.profile.login };
                //console.log("signIn->", user,account,profile);
                return data;
                //return true;
            },
            async session({ session, token, user, account }) {
                // Send properties to the client, like an access_token from a provider.
                
                // session.login = token.login;
                // session.id = token.id;
                // @ts-ignore
                if (token && session.user) {
                    session.user.loginName = token.loginName;
                    session.accessToken = token.access_token
                  }
                //console.log("sessions->", session)
                //console.log("token->", token)
                return session;
            },
        }
    })
}
