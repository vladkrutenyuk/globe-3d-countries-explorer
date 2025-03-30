import { useFetch } from "../../shared/useFetch";

const init: RequestInit = { mode: "cors" };

export const useCountryDataFetch = <F extends RestCountryDataFields = RestCountryDataFields>(
	countryId: string,
	fields?: F[]
) => {
	return useFetch<Pick<RestCountryData, F>>(
		`https://restcountries.com/v3.1/alpha/${countryId.toLowerCase()}?fields=${
			fields ? fields.join(",") : "name"
		}`,
		init
	);
};

export type RestCountryData = {
	name: {
		common: string;
		official: string;
		nativeName: {
			[key: string]: {
				official: string;
				common: string;
			};
		};
	};
	tld: string[];
	currencies: {
		[key: string]: {
			name: string;
			symbol: string;
		};
	};
	capital: [string];
	capitalInfo: {
		latlng: [number, number];
	};
	altSpellings: string[];
	region: string;
	subregion: string;
	languages: Record<string, string>;
	latlng: [number, number];
	area: number;
	flag: string;
	maps: {
		googleMaps: string;
		openStreetMaps: string;
	};
	population: number;
	continents: string[];
	flags: {
		png: string;
		svg: string;
		alt: string;
	};
};

export type RestCountryDataFields = keyof RestCountryData;