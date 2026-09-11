/**
 * `fetch` with json response. Throws `FetchError` on non-ok status.
 */
export async function fetcher(url: RequestInfo | URL, init?: RequestInit) {
	const res = await fetch(url, init);
	const json = await res.json();
	if (!res.ok) {
		console.log("status", res.statusText);
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
