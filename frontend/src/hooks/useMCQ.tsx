import { useEffect, useMemo, useRef, useState } from "react";
import type { MCQQuestion } from "@/types";

export const useMCQ = (content: string) => {
  const [data, setData] = useState<MCQQuestion[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT as string | undefined;

  const body = useMemo(
    () => JSON.stringify({ pageContent: content }),
    [content]
  );

  useEffect(() => {
    if (!content || content.trim().length === 0) {
      setData(undefined);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!apiEndpoint) {
      setData(undefined);
      setIsLoading(false);
      setError(new Error("API endpoint not configured (VITE_API_ENDPOINT)"));
      return;
    }

    // Abort any ongoing request when content changes or on unmount
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let isActive = true;
    setData([]);
    setIsLoading(true);
    setError(null);

    async function run() {
      try {
        const res = await fetch(`${apiEndpoint}/generate-questions-stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/x-ndjson",
          },
          body,
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("ReadableStream not supported");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex = buffer.indexOf("\n");
          while (newlineIndex !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            if (line.length > 0) {
              try {
                const item = JSON.parse(line) as MCQQuestion;
                if (!isActive) return;
                setData((prev) => {
                  const next = Array.isArray(prev) ? prev.slice() : [];
                  next.push(item);
                  return next;
                });
              } catch {
                // Ignore malformed partials; continue accumulating
              }
            }
            newlineIndex = buffer.indexOf("\n");
          }
        }

        // Flush any final line without trailing newline
        const last = buffer.trim();
        if (last.length > 0) {
          try {
            const item = JSON.parse(last) as MCQQuestion;
            if (isActive) {
              setData((prev) => {
                const next = Array.isArray(prev) ? prev.slice() : [];
                next.push(item);
                return next;
              });
            }
          } catch {
            // ignore
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    run();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [apiEndpoint, body]);

  return { data, isLoading, error } as const;
};
