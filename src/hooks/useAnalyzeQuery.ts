"use client";
import { analyzeQuery } from "@/app/actions";
import { useState, useCallback } from "react";

export function useAnalyzeQuery() {
  const [data, setData] = useState<any | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setSqlQuery(null);
    setSummary(null);

    try {
      const result = await analyzeQuery(question);

      setData(result.data);
      setSqlQuery(result.sqlQuery);
      setSummary(result.summary);
    } catch (err: any) {
      setError(err.message ?? "Failed to analyze query");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, sqlQuery, summary, loading, error, runQuery };
}
