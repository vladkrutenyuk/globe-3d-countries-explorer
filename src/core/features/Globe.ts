import { addFeature, CoreContext, IFeaturable, Object3DFeature } from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";
import { AppCoreCtxModule } from "../AppCore";
import { GlobeMap } from "./GlobeMap";
import { fresnel } from "../shaders/fresnel";
import { radialFade } from "../shaders/radial-fade";
import { GlobeClickEffect } from "./GlobeClickEffect";

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
		const geoJson = ctx.modules.geoJson;
		const map = this.map;
		map.initByGeojson(geoJson.data, geoJson.countryIdPropKey);

		const globeMaterial = new THREE.MeshStandardMaterial({
			map: map.texture,
			emissive: new THREE.Color(0xffffff),
			emissiveMap: map.highlightTexture,
		});
		fresnel(globeMaterial, {
			fresnelPower: new THREE.Uniform(8.0),
			fresnelIntensity: new THREE.Uniform(0.2),
			fresnelColor: new THREE.Uniform(new THREE.Color(1.0, 1.0, 1.0)),
		});

		const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), globeMaterial);
		this.object.add(sphere);

		const backGlowSpriteMat = new THREE.SpriteMaterial({
			color: 0xffffff,
			transparent: true,
		});
		radialFade(backGlowSpriteMat);

		const backGlowSprite = new THREE.Sprite(backGlowSpriteMat);
		backGlowSprite.scale.setScalar(2.5);
		sphere.add(backGlowSprite);

        const clickEffect = addFeature(this.object, GlobeClickEffect);

		const pointer = ctx.modules.pointer;
		pointer.registerObj(sphere);

        const onClick = (intersection?: THREE.Intersection) => {
			if (!intersection) {
				this.selectCountry(null);
				return;
			}
			const { object, uv } = intersection;
			if (object !== sphere || !uv) return;
            
            clickEffect.click(intersection);

			const id = map.getCountryIdAtUvClick(uv);
			id && this.selectCountry(id);
        }

		pointer.on("click", onClick);

		return () => {
            pointer.off("click", onClick);
			pointer.unregisterObj(sphere);
			this.object.remove(sphere);
			this.object.remove(sphere);
			sphere.geometry.dispose();
			sphere.material.dispose();
            backGlowSpriteMat.dispose();
			map.dispose();
		};
	}

	getSelectedCountry() {
		return this._selectedCountry;
	}

	selectCountry(id: string | null) {
		console.log("select", id);
		const currentId = this._selectedCountry;
		if (currentId === id) return;

		const { geoJson } = this.ctx.modules;

		const feature = id ? geoJson.getFeatureById(id) : null;
		const currentFeature = currentId ? geoJson.getFeatureById(currentId) : null;

		if (currentFeature) {
			this.map.highlightCountry(currentFeature, "#000000");
		}

		if (feature) {
			this.map.highlightCountry(feature, "#606065");
		}
		this._selectedCountry = id;
		this.emit("selection", id);
	}
}
