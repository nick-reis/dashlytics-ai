import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function useAnalyzeQuery() {
  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/stream-summary",
      prepareSendMessagesRequest({ messages: uiMessages }) {
        const last = uiMessages[uiMessages.length - 1];
        const question =
          last?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ??
          "";
        return {
          body: {
            messages: uiMessages,
            question,
            data: null,
          },
        };
      },
    }),
  });

  return { messages, setMessages, status, error, sendMessage };
}
