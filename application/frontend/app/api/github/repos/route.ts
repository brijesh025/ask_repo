import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

const perPage = 100;
const maxPages = 10;

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token?.accessToken) {
    return NextResponse.json(
      { error: "GitHub session is required" },
      { status: 401 },
    );
  }

  const repos: GitHubRepo[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetch(
      `https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&sort=updated&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token.accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch GitHub repositories" },
        { status: response.status },
      );
    }

    const pageRepos = (await response.json()) as GitHubRepo[];
    repos.push(...pageRepos);

    if (pageRepos.length < perPage) {
      break;
    }
  }

  return NextResponse.json({
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
    })),
  });
}
