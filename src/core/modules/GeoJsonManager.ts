import { ContextModule } from "three-start";

/**
 *  Country alpha-code (ISO 3166-1 alpha-3)
 */
export type Country = string;

export class GeoJsonManager extends ContextModule {
	readonly data: GeoJsonFeatureCollection;
	readonly countryIdPropKey: string;
	private readonly _featuresById: Partial<Record<string, GeoJsonFeature>> = {};

	constructor(data: GeoJsonFeatureCollection, countryIdPropKey: string) {
		super();
		this.data = data;
		this.countryIdPropKey = countryIdPropKey;

		for (const feature of data.features) {
			const id = this.getIdOfFeature(feature);
			if (!id) continue;
			this._featuresById[id] = feature;
		}
	}

	getFeatureById(id: string) {
		const feature = this._featuresById[id];
		if (!feature) {
			console.warn("GeoJsonFeature was not found by providen id", id);
		}
		return feature;
	}

	getIdOfFeature(feature: GeoJsonFeature) {
		return feature.properties[this.countryIdPropKey]?.toString();
	}
}
