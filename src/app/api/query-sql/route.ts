import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    console.log("Received question:", question);

    // 1️⃣ Prompt GPT to generate SQL safely
    const prompt = `You are an expert SQL generator for Supabase PostgreSQL. Generate a single valid SELECT statement ONLY. No explanations, comments, or code fences. Use only columns from the schema. Do NOT invent new columns. Include filters and conditions exactly as mentioned in the question. Do NOT add LIMIT or ORDER BY unless specified.

Table schema:
products(id, name, description, price, stock, category, created_at, updated_at)

Examples:

Q: "Show products over $20"
SQL: SELECT * FROM products WHERE price > 20;

Q: "List hats with stock < 5"
SQL: SELECT * FROM products WHERE category = 'Hats' AND stock < 5;

Q: "Products in 'Electronics' under 100"
SQL: SELECT * FROM products WHERE category = 'Electronics' AND price < 100;

When using aggregate functions (AVG, SUM, COUNT, MAX, MIN), do not select extra non-aggregated columns unless grouped properly. 
If the user asks for the average of a subset (like “two most recent items”), first SELECT the subset in a subquery, then apply the aggregate function on that result.


Question: ${question}
SQL:
`;

    console.log("Generated prompt for OpenAI:", prompt);

    console.log("Calling OpenAI with model:", process.env.OPEN_AI_MODEL);

    const completion = await openai.chat.completions.create({
      model: process.env.OPEN_AI_MODEL!,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("OpenAI response:", completion);

    let sqlQuery = completion.choices[0]?.message?.content?.trim();

    if (!sqlQuery) {
      throw new Error(
        "Failed to generate SQL query. The response from OpenAI was null or invalid."
      );
    }

    // Remove code fences if GPT included them
    sqlQuery = sqlQuery
      .replace(/```sql/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract only the SELECT portion
    const match = sqlQuery.match(/(SELECT[\s\S]*)/i);
    if (match) {
      sqlQuery = match[1].trim();
    }

    // Remove trailing semicolons
    sqlQuery = sqlQuery.replace(/;+\s*$/, "");

    // 2️⃣ Execute SQL on Supabase
    const { data, error } = await supabase.rpc("execute_sql", {
      query: sqlQuery,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 4️⃣ Summarize results with GPT
    const summaryPrompt = `
You are a helpful but friendly business analytics assistant.  
Here is a user question and the SQL query results.  
Summarize the results clearly in plain English, focusing on the answer to the question. Do not mention technical details such as SQL or the database just answer as if you were talking to a friend casually, still being informative. 
Question: "${question}"  
Results: ${JSON.stringify(data)}
`;

    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + cheap summarization
      messages: [{ role: "user", content: summaryPrompt }],
    });

    const summary = summaryCompletion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ sqlQuery, data, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
