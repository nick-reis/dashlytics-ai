import { NextRequest } from "next/server";
import { streamText, convertToModelMessages, ModelMessage, TextPart } from "ai";
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

    // Get latest user question text
    const last = messages[messages.length - 1];
    const question =
      last?.parts
        ?.map((p: { type: string; text?: string }) => p.text ?? "")
        .join(" ") ?? "";

    // Convert model messages to plain text context
    const plainMessages = flattenModelMessages(modelMessages);

    // Generate SQL and run query
    const sqlQuery = await generateSQL(question, plainMessages);
    const data = await getQueryData(sqlQuery);

    console.log(sqlQuery, data);

    // Format query results for Markdown (e.g. wrap in code block)
    const formattedResults =
      "```json\n" + JSON.stringify(data, null, 2) + "\n```";

    const cleanedQuestion = cleanMarkdown(question);
    const cleanedData = cleanMarkdown(JSON.stringify(data, null, 2));
    // Stream a Markdown-formatted AI summary
    const result = await streamText({
      model: openai(process.env.OPEN_AI_MODEL!),
      messages: [
        {
          role: "system",
          content: sqlSummaryPrompt,
        },
        ...modelMessages,
        {
          role: "user",
          content: `**Question:** ${cleanedQuestion}\n\n**SQL Query:**\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\n**Results:**\n\`\`\`json\n${cleanedData}\n\`\`\`\n\nPlease summarize the results using Markdown.`,
        },
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    console.error("Error in stream-summary route:", err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

// Safely flattens ModelMessage content → plain strings
function flattenModelMessages(modelMessages: ModelMessage[]) {
  return modelMessages.map((m) => {
    let content = "";

    if (typeof m.content === "string") {
      content = m.content;
    } else if (Array.isArray(m.content)) {
      content = m.content
        .filter(
          (part): part is TextPart =>
            typeof (part as any).text === "string" &&
            !!(part as any).text.trim()
        )
        .map((part) => (part as any).text)
        .join(" ");
    }

    return { role: m.role, content };
  });
}

function cleanMarkdown(text: string): string {
  return (
    text
      // Convert escaped asterisks or extra asterisks around numbers
      .replace(/\*\*\s*(\d+)\s*\*\*/g, "**$1**")
      // Fix double-encoded markdown like \*\*
      .replace(/\\\*\\\*/g, "**")
      // Ensure underscores in math-like text are escaped
      .replace(/([A-Za-z])_([A-Za-z])/g, "$1\\_$2")
      // Trim any broken bold markers
      .replace(/\*{3,}/g, "**")
  );
}
