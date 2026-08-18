"use client";

import { useIngestion } from "@/hooks/use-ingestion";
import { useRepoChat } from "@/hooks/use-repo-chat";
import { IngestionPanel } from "@/components/dashboard/IngestionPanel";
import { ChatPanel } from "@/components/dashboard/ChatPanel";

type Props = {
  owner: string;
  name: string;
  repoUrl?: string;
};

export function RepoAnalysisWorkspace({ owner, name, repoUrl }: Props) {
  const ingestion = useIngestion();
  const chat = useRepoChat();

  function handleStartAnalysis() {
    if (!repoUrl) return;
    ingestion.startIngestion(repoUrl, `${owner}/${name}`);
  }

  function handleAsk(question: string) {
    if (ingestion.repositoryId === null) return;
    chat.askQuestion(question, ingestion.repositoryId);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <IngestionPanel
        owner={owner}
        name={name}
        repoUrl={repoUrl}
        status={ingestion.status}
        result={ingestion.result}
        error={ingestion.error}
        onStart={handleStartAnalysis}
      />

      <ChatPanel
        messages={chat.messages}
        isLoading={chat.isLoading}
        isReady={ingestion.isReady}
        onAsk={handleAsk}
      />
    </div>
  );
}
