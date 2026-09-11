import * as THREE from "three/webgpu";
import { addComponent, Object3DBehaviour } from "three-start";
import { SCENE_COLORS } from "../config";
import { fresnel, type FresnelUniforms } from "../shaders/fresnel";
import { radialFade } from "../shaders/radial-fade";
import { GlobeClickEffect } from "./GlobeClickEffect";
import { GlobeMap } from "./GlobeMap";

export type GlobeEventTypes = { selection: [countryId: string | null] };

export class Globe extends Object3DBehaviour<GlobeEventTypes> {
	map!: GlobeMap;

	private _clickEffect!: GlobeClickEffect;
	private _sphere!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardNodeMaterial>;
	private _fresnel!: FresnelUniforms;
	private _backGlow!: THREE.Sprite;
	private _backGlowMat!: THREE.SpriteNodeMaterial;
	private _unwatchTheme?: () => void;

	private _selectedCountry: string | null = null;

	onAwake() {
		this._clickEffect = addComponent(this.object, GlobeClickEffect);
		const map = addComponent(this.object, GlobeMap);
		this.map = map;

		const globeMaterial = new THREE.MeshStandardNodeMaterial({
			map: map.texture,
			emissive: new THREE.Color(0xffffff),
			emissiveMap: map.highlightTexture,
		});
		this._fresnel = fresnel(globeMaterial, { power: 8, intensity: 0.2, color: 0x000000 });

		const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), globeMaterial);
		this.object.add(sphere);
		this._sphere = sphere;

		const backGlowMat = radialFade(
			new THREE.SpriteNodeMaterial({
				color: 0xffffff,
				transparent: true,
			})
		);
		const backGlow = new THREE.Sprite(backGlowMat);
		backGlow.scale.setScalar(2.5);
		sphere.add(backGlow);
		this._backGlow = backGlow;
		this._backGlowMat = backGlowMat;
	}

	onEnable() {
		const { pointer, themeMode } = this.modules;
		pointer.registerObj(this._sphere);
		pointer.on("click", this.onClick);
		this._unwatchTheme = themeMode.watch(this.onThemeChange);
	}

	onDisable() {
		const { pointer } = this.modules;
		pointer.off("click", this.onClick);
		pointer.unregisterObj(this._sphere);
		this._unwatchTheme?.();
		this._unwatchTheme = undefined;
	}

	onDestroy() {
		const sphere = this._sphere;
		sphere.removeFromParent();
		sphere.geometry.dispose();
		sphere.material.dispose();
		this._backGlowMat.dispose();
	}

	getSelectedCountry() {
		return this._selectedCountry;
	}

	selectCountry(id: string | null) {
		console.log("select", id);
		const currentId = this._selectedCountry;
		if (currentId === id) return;

		const { geoJson } = this.modules;

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

	private readonly onClick = (intersection?: THREE.Intersection) => {
		if (!intersection) {
			this.selectCountry(null);
			return;
		}
		const { object, uv } = intersection;
		if (object !== this._sphere || !uv) return;

		this._clickEffect.click(intersection);

		const id = this.map.getCountryIdAtUvClick(uv);
		id && this.selectCountry(id);
	};

	private readonly onThemeChange = (isDark: boolean) => {
		const col = isDark ? SCENE_COLORS.dark.backGlow : SCENE_COLORS.light.backGlow;
		this._backGlow.scale.setScalar(isDark ? 2.5 : 2.8);
		this._backGlowMat.color.set(col);
		this._fresnel.intensity.value = isDark ? 0.2 : 0.7;
	};
}
