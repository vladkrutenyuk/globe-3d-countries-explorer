import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to make requests through `fetch` and json data response.
 * Including all states handling and cancellation on unmount by url deps
 */
export function useFetch<T>(url: RequestInfo | URL, init?: RequestInit) {
	const requestInitRef = useRef(init);
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FetchError | null>(null);

	useEffect(() => {
		if (!url) return;
		const init = requestInitRef.current;
		const controller = new AbortController();
		const signal = controller.signal;

		setLoading(true);
		setError(null);
		setData(null);

		fetcher(url, { signal, ...init })
			.then(setData)
			.catch((err) => {
				console.error(err)
				if (err.name !== "AbortError") setError(err);
			})
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [url]);

	return { data, loading, error };
}

export async function fetcher(url: RequestInfo | URL, init?: RequestInit) {
	const res = await fetch(url, init);
	const json = await res.json();
	if (!res.ok) {
		console.log("status", res.statusText)
		throw new FetchError(res, json);
	}
	return json;
}

export class FetchError extends Error {
	status: number;
	data: unknown;
	name = "FetchError";

	constructor(res: Response, data: unknown) {
		super(res.statusText || `Error ${res.status}: Fetch Failed`);
		this.status = res.status;
		this.data = data;
	}
}
