"use client";

import { useState, useCallback } from "react";
import { retrieveAnswer, type RetrievedChunk } from "@/lib/worker";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  chunks?: RetrievedChunk[];
  timestamp: number;
};

export function useRepoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = useCallback(
    async (question: string, repositoryId: number, topK?: number) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: question,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const result = await retrieveAnswer(question, repositoryId, topK);

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: result.answer,
          chunks: result.chunks,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const assistantError: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: `Failed to get answer: ${err instanceof Error ? err.message : "Unknown error"}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantError]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, askQuestion, clearMessages };
}
