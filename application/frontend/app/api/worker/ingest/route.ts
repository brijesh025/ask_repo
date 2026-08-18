import { NextResponse, type NextRequest } from "next/server";

const WORKER_URL = process.env.WORKER_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const workerRes = await fetch(`${WORKER_URL}/repos/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await workerRes.json();
    return NextResponse.json(data, { status: workerRes.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Worker ingestion failed",
      },
      { status: 502 },
    );
  }
}
