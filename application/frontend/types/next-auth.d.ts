import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubLogin?: string;
    };
  }

  interface User {
    githubLogin?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubLogin?: string;
  }
}
