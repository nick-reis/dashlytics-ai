import { NextRequest } from "next/server";
import { streamText, convertToModelMessages, TextPart, ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { sqlSummaryPrompt } from "@/lib/prompts";
import { generateSQL, getQueryData } from "@/app/actions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !messages.length)
      return new Response("Missing messages", { status: 400 });

    // Convert UIMessage[] → ModelMessage[]
    const modelMessages = convertToModelMessages(messages);

    const last = messages[messages.length - 1];
    const question =
      last?.parts
        ?.map((p: { type: string; text?: string }) => p.text ?? "")
        .join("") ?? "";

    const plainMessages = flattenModelMessages(modelMessages);

    // Generate SQL + fetch data
    const sqlQuery = await generateSQL(question, plainMessages);
    const data = await getQueryData(sqlQuery);

    console.log(sqlQuery, data);

    // Stream AI summary using proper messages
    const result = await streamText({
      model: openai(process.env.OPEN_AI_MODEL!),
      messages: [
        { role: "system", content: sqlSummaryPrompt },
        ...modelMessages,
        {
          role: "user",
          content: `Question: ${question}\nResults: ${JSON.stringify(data)}`,
        },
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    console.error("Error in stream-summary route:", err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

function flattenModelMessages(modelMessages: ModelMessage[]) {
  return modelMessages.map((m) => {
    let content = "";

    if (typeof m.content === "string") {
      content = m.content;
    } else if (Array.isArray(m.content)) {
      // Only include text parts; ignore images, files, tools, etc.
      content = m.content
        .map((part) => {
          if (typeof (part as any).text === "string") {
            return (part as any).text;
          }
          return "";
        })
        .join(" ");
    }

    return { role: m.role, content };
  });
}
