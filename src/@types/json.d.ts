/** Country record of the static REST Countries subset (`scripts/build-countries.mjs`) */
type RestCountryData = {
	name: {
		common: string;
		official: string;
	};
	flag: string;
	flags: {
		png: string;
		svg: string;
		alt: string;
	};
	capital: string[];
	capitalInfo: {
		latlng: number[];
	};
	area: number;
	population: number;
	region: string;
	subregion?: string;
	tld: string[];
	currencies: {
		[key: string]: {
			name: string;
			symbol?: string;
		};
	};
	maps: {
		googleMaps: string;
		openStreetMaps: string;
	};
};

declare module "*.geo.json" {
	const value: GeoJsonFeatureCollection;
	export default value;
}

declare module "*countries.json" {
	const value: Partial<Record<string, RestCountryData>>;
	export default value;
}
