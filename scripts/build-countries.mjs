// Generates public/countries.json — a trimmed subset of the REST Countries dataset keyed by ISO alpha-3.
// The public REST Countries API v1–v4 was shut down (v5 requires an API key), so the app serves this file statically.
// Source: https://gitlab.com/restcountries/restcountries (MPL-2.0)
import { writeFile } from "node:fs/promises";

const SOURCE_URL =
	"https://gitlab.com/restcountries/restcountries/-/raw/master/src/main/resources/countriesV3.1.json";
const OUTPUT_PATH = new URL("../public/countries.json", import.meta.url);

const res = await fetch(SOURCE_URL);
if (!res.ok) throw new Error(`Failed to fetch ${SOURCE_URL}: ${res.status}`);
const countries = await res.json();

const byAlpha3 = {};
for (const c of countries) {
	byAlpha3[c.cca3] = {
		name: { common: c.name.common, official: c.name.official },
		flag: c.flag,
		flags: c.flags,
		// some territories (e.g. Antarctica) have no capital / currencies / tld
		capital: c.capital ?? [],
		capitalInfo: { latlng: c.capitalInfo?.latlng ?? [] },
		area: c.area,
		population: c.population,
		region: c.region,
		subregion: c.subregion,
		tld: c.tld ?? [],
		currencies: c.currencies ?? {},
		maps: c.maps,
	};
}

await writeFile(OUTPUT_PATH, JSON.stringify(byAlpha3));
console.log(`Wrote ${Object.keys(byAlpha3).length} countries to ${OUTPUT_PATH.pathname}`);
