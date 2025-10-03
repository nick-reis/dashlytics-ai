"use server";

import { openai } from "@/lib/openai";
import { queryDatabase } from "@/app/actions/supabase";
import { sqlGeneratorPrompt, sqlSummaryPrompt } from "@/lib/prompts";

//  Generate relevant SQL from question
export async function generateSQL(question: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: process.env.OPEN_AI_MODEL!,
    messages: [{ role: "user", content: sqlGeneratorPrompt(question) }],
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

// Summarize results using OpenAI
export async function summarizeData(question: string, data: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: sqlSummaryPrompt(question, data) }],
  });

  return completion.choices[0]?.message?.content?.trim() ?? null;
}

export async function analyzeQuery(question: string) {
  const sqlQuery = await generateSQL(question);
  console.log(sqlQuery);
  const data = await getQueryData(sqlQuery);
  console.log(data);
  const summary = await summarizeData(question, data);

  return { sqlQuery, data, summary };
}
