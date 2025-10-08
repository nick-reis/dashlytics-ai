"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/conversation";
import { Message, MessageContent } from "@/components/ai/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputToolbar,
} from "@/components/ai/prompt-input";
import { Response } from "@/components/ai/response";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useAnalyzeQuery } from "@/hooks/useAnalyzeQuery";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage, status, error } =
    useAnalyzeQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      {messages.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia className="rounded-lg text-primary">
              <ChartNoAxesCombined />
            </EmptyMedia>
            <EmptyTitle>What can I help you with?</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              className="text-primary truncate"
              variant="outline"
              onClick={() =>
                sendMessage({ text: "Who is the most repeat customer?" })
              }
            >
              "Who is the most repeat customer?"
            </Button>
            <Button
              className="text-primary truncate"
              variant="outline"
              onClick={() =>
                sendMessage({ text: "Create a sales graph for T-Shirts" })
              }
            >
              "Create a sales graph for T-Shirts"
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <MessageContent key={index}>
                    <Response>{part.text}</Response>
                  </MessageContent>
                ) : null
              )}
            </Message>
          ))}

          {status === "streaming" && (
            <div className="flex items-center gap-2 p-4">
              <span className="text-muted-foreground text-sm">Thinking...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-500 text-sm">{error.toString()}</div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4">
        <PromptInput onSubmit={handleSubmit} className="bg-none">
          <PromptInputTextarea
            value={input}
            placeholder="Ask a question..."
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={status !== "ready"}
          />
          <PromptInputToolbar className="p-2">
            <Button
              size={null}
              className="text-foreground/40 hover:text-foreground p-2 text-xs"
              variant={null}
              onClick={() => {
                // Clear conversation
                setInput("");
                setMessages([]);
              }}
            >
              <Plus className="w-1 -mx-1" />
              New Chat
            </Button>
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() || status !== "ready"}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
