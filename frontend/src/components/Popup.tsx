import type { PageContent } from "@/content";

import { useState, useEffect } from "react";

const Popup = () => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPageContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found");
      }

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPageContent",
      });

      if (response) {
        setPageContent(response);
      } else {
        throw new Error("No content received from page");
      }
    } catch (err) {
      console.error("Error getting page content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get page content"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically get content when popup opens
    getPageContent();
  }, []);

  return (
    <div className="w-96 h-96 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Study Buddy</h1>

      <button
        onClick={getPageContent}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Get Page Content"}
      </button>

      {error && <div className="text-red-500 text-sm mb-4">Error: {error}</div>}

      {pageContent && (
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold">Title:</h3>
            <p className="text-sm text-gray-600">{pageContent.title}</p>
          </div>

          <div>
            <h3 className="font-semibold">URL:</h3>
            <p className="text-sm text-blue-500 break-all">{pageContent.url}</p>
          </div>

          <div>
            <h3 className="font-semibold">Content Preview:</h3>
            <div className="text-xs text-gray-600 max-h-32 overflow-y-auto border p-2 rounded">
              {pageContent.content.substring(0, 500)}
              {pageContent.content.length > 500 && "..."}
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Content length: {pageContent.content.length} characters
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
