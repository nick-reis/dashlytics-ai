"use server";

import { openai } from "@/lib/openai";
import { queryDatabase } from "@/app/actions/supabase";
import { sqlGeneratorPrompt, sqlSummaryPrompt } from "@/lib/prompts";
import { ModelMessage } from "ai";

//  Generate relevant SQL from question
export async function generateSQL(
  question: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const context = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const completion = await openai.chat.completions.create({
    model: process.env.OPEN_AI_MODEL!,
    messages: [
      {
        role: "user",
        content: `
Conversation so far:
${context}
${sqlGeneratorPrompt(question)}
`,
      },
    ],
  });

  let sqlQuery = completion.choices[0]?.message?.content?.trim();
  if (!sqlQuery) throw new Error("Failed to generate SQL query");

  // Clean SQL
  sqlQuery = sqlQuery
    .replace(/```sql/gi, "")
    .replace(/```/g, "")
    .replace(/;+\s*$/, "")
    .trim();

  const match = sqlQuery.match(/(SELECT[\s\S]*)/i);
  if (match) sqlQuery = match[1].trim();

  return sqlQuery;
}

// Query database
export async function getQueryData(sqlQuery: string) {
  const data = await queryDatabase(sqlQuery);
  return data;
}
