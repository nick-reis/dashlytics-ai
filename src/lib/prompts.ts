// Prompt for generating SQL queries
export const sqlGeneratorPrompt = (question: string) => `
You are an expert SQL generator for Supabase PostgreSQL. Generate a single valid SELECT statement ONLY. No explanations, comments, or code fences. Use only columns from the schema. Include filters exactly as mentioned. Do NOT invent columns. Do NOT add LIMIT or ORDER BY unless specified.

Table schema:
products(id, name, description, price, stock, category, created_at, updated_at)

Guidelines:
- Always return the full product (all columns) using SELECT *.
- If the user mentions an item type but not a category, internally map it to likely keywords in the description (e.g., "Tech" → "laptop", "monitor", "keyboard", "mouse"). Use these keywords in ILIKE filters.
- Use category filtering only if explicitly mentioned.
- Respect numerical or textual filters exactly (price, stock, etc.).
- When using aggregate functions (AVG, SUM, COUNT, MAX, MIN), use subqueries as needed but still select all columns for the relevant rows.
- Do not omit any columns in the output.

Examples:

Q: "List tech products under $500"
SQL: SELECT * FROM products WHERE (description ILIKE '%laptop%' OR description ILIKE '%monitor%' OR description ILIKE '%keyboard%' OR description ILIKE '%mouse%') AND price < 500;

Q: "Show products over $20"
SQL: SELECT * FROM products WHERE price > 20;

Q: "Products in 'Electronics' under 100"
SQL: SELECT * FROM products WHERE category = 'Electronics' AND price < 100;

Question: ${question}
SQL:

`;

// Prompt for summarizing query results
export const sqlSummaryPrompt = (question: string, data: unknown) => `
You are a helpful but friendly business analytics assistant.  
Here is a user question and the SQL query results.  
Summarize the results clearly in plain English, focusing on the answer to the question.
If some of the data is irrelevent to the initial question or doesnt match then you can ingore it. 
Do not mention technical details such as SQL or the database.  

Question: "${question}"  
Results: ${JSON.stringify(data)}
`;
