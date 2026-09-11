import { atom, computed } from "nanostores";
import type { World } from "./core/World";
import countries from "./data/countries.json";

/** The world, `null` until created */
export const $world = atom<World | null>(null);

export const $isDark = atom(document.documentElement.classList.contains("dark"));

/** Selected country id (globe geojson `adm0_a3`), `null` when none */
export const $selectedCountryId = atom<string | null>(null);

/** Globe geojson ids (Natural Earth adm0_a3) which differ from ISO alpha-3 keys of countries.json */
const ISO_A3_BY_COUNTRY_ID: Partial<Record<string, string>> = {
	KOS: "UNK",
	SAH: "ESH",
	PSX: "PSE",
};

/** Data of the selected country, `null` when none is selected or there is no data for it */
export const $selectedCountry = computed($selectedCountryId, (id) =>
	id ? (countries[ISO_A3_BY_COUNTRY_ID[id] ?? id] ?? null) : null
);
