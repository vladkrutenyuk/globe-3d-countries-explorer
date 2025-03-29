import { useEffect, useRef, useState } from "react";

//TODO client local cashing via localForage or idb-keyval
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

		fetch(url, { signal, ...init })
			.then((res) => {
				//TODO build custom error with info data and status and code etc
				if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
				return res.json();
			})
			.then(setData)
			.catch((err) => {
				if (err.name !== "AbortError") setError(err.message);
			})
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [url]);

	return { data, loading, error };
}
