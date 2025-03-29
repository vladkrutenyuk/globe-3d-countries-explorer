import { CoreContext, IFeaturable, Object3DFeature } from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";
import { AppCoreCtxModule } from "../AppCore";
import { GlobeMap } from "./GlobeMap";

export type GlobeEventTypes = { selection: [countryId: string | null] };

export class Globe extends Object3DFeature<AppCoreCtxModule, GlobeEventTypes> {
	readonly map: GlobeMap;

    private _selectedCountry: string | null = null;

	constructor(object: IFeaturable) {
		super(object);
		this.map = new GlobeMap();
	}

	protected useCtx(
		ctx: CoreContext<AppCoreCtxModule>
	): undefined | (() => void) | void {
		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(1, 64, 32),
			new THREE.MeshBasicMaterial()
		);
		this.object.add(sphere);

		const pointer = ctx.modules.pointer;
		pointer.registerObj(sphere);

		const geoJson = ctx.modules.geoJson;

		const map = this.map;
		map.initByGeojson(geoJson.data, geoJson.countryIdPropKey);
		sphere.material.map = map.texture;

		pointer.on("click", (intersection) => {
			if (!intersection) {
				this.selectCountry(null);
				return;
			}
			const { object, uv } = intersection;
			if (object !== sphere || !uv) return;

			const id = map.getCountryIdAtUvClick(uv);
			id && this.selectCountry(id);
		});

		return () => {
			pointer.unregisterObj(sphere);
			this.object.remove(sphere);
			sphere.geometry.dispose();
			sphere.material.dispose();
			map.dispose();
		};
	}

	getSelectedCountry() {
		return this._selectedCountry;
	}

	selectCountry(id: string | null) {
        console.log("select", id)
		const currentId = this._selectedCountry;
		if (currentId === id) return;

		const { geoJson } = this.ctx.modules;

		const feature = id ? geoJson.getFeatureById(id) : null;
        const currentFeature = currentId ? geoJson.getFeatureById(currentId) : null
        
		if (currentFeature) {
			this.map.fillCountryByFeature(currentFeature, "#323235");
		}

		if (feature) {
			this.map.fillCountryByFeature(feature, "#929295");
		}
		this._selectedCountry = id;
		this.emit("selection", id)
	}
}
