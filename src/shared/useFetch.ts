import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to make requests through `fetch` and json data response.
 * Including all states handling and cancellation on unmount by url deps
 */
export function useFetch<T>(url: RequestInfo | URL, init?: RequestInit) {
	const requestInitRef = useRef(init);
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!url) return;
		const init = requestInitRef.current;
		const controller = new AbortController();
		const signal = controller.signal;

		setLoading(true);
		setError(null);

		fetcher(url, { signal, ...init })
			.then(setData)
			.catch((err) => {
				if (err.name !== "AbortError") setError(err.message);
			})
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [url]);

	return { data, loading, error };
}

async function fetcher(url: RequestInfo | URL, init?: RequestInit) {
	const res = await fetch(url, init);
	const json = await res.json();
	if (!res.ok) {
		throw new FetchError(res, json);
	}
	return json;
}

export class FetchError extends Error {
	status: number;
	data: unknown;
	constructor(res: Response, data: unknown) {
		super(res.statusText);
		this.status = res.status;
		this.data = data;
		this.name = "CustomFetchError";
	}
}
