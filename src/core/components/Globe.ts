import * as THREE from "three/webgpu";
import {
	distance,
	dot,
	float,
	materialOpacity,
	mix,
	normalView,
	output,
	positionViewDirection,
	smoothstep,
	uniform,
	uv,
	vec2,
	vec4,
} from "three/tsl";
import { addComponent, Object3DBehaviour } from "three-start";
import { $isDark, $selectedCountryId } from "@/stores";
import { SCENE_COLORS } from "../scene-colors";
import { GlobeClickEffect } from "./GlobeClickEffect";
import { GlobeMap } from "./GlobeMap";

export class Globe extends Object3DBehaviour {
	map!: GlobeMap;

	private _clickEffect!: GlobeClickEffect;
	private _sphere!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardNodeMaterial>;
	private _fresnel!: FresnelUniforms;
	private _backGlow!: THREE.Sprite;
	private _backGlowMat!: THREE.SpriteNodeMaterial;

	private _highlightedCountry: string | null = null;

	onAwake() {
		this._clickEffect = addComponent(this.object, GlobeClickEffect);
		const map = addComponent(this.object, GlobeMap);
		this.map = map;

		const globeMaterial = new THREE.MeshStandardNodeMaterial({
			map: map.texture,
			emissive: new THREE.Color(0xffffff),
			emissiveMap: map.highlightTexture,
		});
		this._fresnel = fresnel(globeMaterial, {
			power: 8,
			intensity: 0.2,
			color: 0x000000,
		});

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

		const { pointer } = this.modules;
		pointer.registerObj(sphere);
		pointer.on("click", this.onClick);

		$isDark.subscribe(this.onThemeChange);
		$selectedCountryId.subscribe(this.onSelectionChange);
	}

	private readonly onClick = (intersection?: THREE.Intersection) => {
		if (!intersection) {
			$selectedCountryId.set(null);
			return;
		}
		const { object, uv: uvPoint } = intersection;
		if (object !== this._sphere || !uvPoint) return;

		this._clickEffect.click(intersection);

		const id = this.map.getCountryIdAtUvClick(uvPoint);
		id && $selectedCountryId.set(id);
	};

	private readonly onSelectionChange = (id: string | null) => {
		const currentId = this._highlightedCountry;
		if (currentId === id) return;
		console.log("select", id);

		const { geoJson } = this.modules;

		const feature = id ? geoJson.getFeatureById(id) : null;
		const currentFeature = currentId ? geoJson.getFeatureById(currentId) : null;

		if (currentFeature) {
			this.map.highlightCountry(currentFeature, "#000000");
		}

		if (feature) {
			this.map.highlightCountry(feature, "#606065");
		}
		this._highlightedCountry = id;
	};

	private readonly onThemeChange = (isDark: boolean) => {
		const col = isDark ? SCENE_COLORS.dark.backGlow : SCENE_COLORS.light.backGlow;
		this._backGlow.scale.setScalar(isDark ? 2.5 : 2.8);
		this._backGlowMat.color.set(col);
		this._fresnel.intensity.value = isDark ? 0.2 : 0.7;
	};
}

/**
 * Blends the lit output towards `color` at grazing view angles.
 * Returns uniforms to tweak the effect at runtime.
 */
function fresnel(
	material: THREE.NodeMaterial,
	params: { power: number; intensity: number; color: THREE.ColorRepresentation }
) {
	const uniforms = {
		power: uniform(params.power),
		intensity: uniform(params.intensity),
		color: uniform(new THREE.Color(params.color)),
	};

	const factor = float(1)
		.sub(dot(positionViewDirection, normalView).abs())
		.pow(uniforms.power)
		.mul(uniforms.intensity)
		.saturate();

	material.outputNode = mix(output, vec4(uniforms.color, 1), factor);

	return uniforms;
}

type FresnelUniforms = ReturnType<typeof fresnel>;

/** Fades opacity out from the uv center: opaque up to 0.1, transparent from 0.5. */
function radialFade<T extends THREE.NodeMaterial>(material: T): T {
	const dist = distance(uv(), vec2(0.5));
	material.opacityNode = materialOpacity.mul(smoothstep(0.1, 0.5, dist).oneMinus());
	return material;
}
