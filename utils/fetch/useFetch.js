import { useState, useEffect } from "react";

export function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  const fetchData = async (url, options = {}) => {
    setLoading(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch(url, { ...options, signal: abortController.signal });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = () => {
    if (controller) {
      controller.abort();
      setError("Cancelled Request");
    }
  };

  return { data, loading, error, fetchData, handleCancelRequest };
}