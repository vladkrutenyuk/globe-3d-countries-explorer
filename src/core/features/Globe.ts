import * as KVY from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";
import { AppCoreCtxModule } from "../AppCore";
import { GlobeMap } from "./GlobeMap";
import { fresnel, FresnelUniforms } from "../shaders/fresnel";
import { radialFade } from "../shaders/radial-fade";
import { GlobeClickEffect } from "./GlobeClickEffect";
import { SCENE_COLORS } from "../config";

export type GlobeEventTypes = { selection: [countryId: string | null] };

export class Globe extends KVY.Object3DFeature<AppCoreCtxModule, GlobeEventTypes> {
	map!: GlobeMap;

	private _selectedCountry: string | null = null;

	constructor(object: KVY.IFeaturable) {
		super(object);
		// this.map = new GlobeMap();
	}

	protected useCtx(
		ctx: KVY.CoreContext<AppCoreCtxModule>
	): undefined | (() => void) | void {
		const clickEffect = KVY.addFeature(this.object, GlobeClickEffect);
		const map = KVY.addFeature(this.object, GlobeMap);
		this.map = map;

		const globeFresnelUniforms: FresnelUniforms = {
			fresnelPower: new THREE.Uniform(8.0),
			fresnelIntensity: new THREE.Uniform(0.2),
			fresnelColor: new THREE.Uniform(new THREE.Color()),
		};
		const globeMaterial = fresnel(
			new THREE.MeshStandardMaterial({
				map: map.texture,
				emissive: new THREE.Color(0xffffff),
				emissiveMap: map.highlightTexture,
			}),
			globeFresnelUniforms
		);

		const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), globeMaterial);
		this.object.add(sphere);

		const backGlowSpriteMat = radialFade(
			new THREE.SpriteMaterial({
				color: 0xffffff,
				transparent: true,
			})
		);

		const backGlowSprite = new THREE.Sprite(backGlowSpriteMat);
		backGlowSprite.scale.setScalar(2.5);
		sphere.add(backGlowSprite);

		ctx.modules.themeMode.watch((isDark) => {
			const col = isDark ? SCENE_COLORS.dark.backGlow : SCENE_COLORS.light.backGlow;
			backGlowSprite.scale.setScalar(isDark ? 2.5 : 2.8);
			backGlowSpriteMat.color.set(col);
			globeFresnelUniforms.fresnelIntensity.value = isDark ? 0.2 : 0.7;
		});

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
		};

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
