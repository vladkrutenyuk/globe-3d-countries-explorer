import * as THREE from "three/webgpu";
import { addComponent, ThreeStart, type ThreeContext } from "three-start";
import { Globe } from "./components/Globe";
import { SceneEnvironment } from "./components/SceneEnvironment";
import { WORLD_GEOJSON_URL } from "./config";
import { CameraController } from "./modules/CameraController";
import { GeoJsonManager } from "./modules/GeoJsonManager";
import { PointerRaycasting } from "./modules/PointerRaycasting";
import { ThemeModeManager } from "./modules/ThemeModeManager";

type AppAssets = {
	geoJson: GeoJsonFeatureCollection;
};

export type AppModules = {
	pointer: PointerRaycasting;
	geoJson: GeoJsonManager;
	cameraController: CameraController;
	themeMode: ThemeModeManager;
};

declare module "three-start" {
	interface ThreeStartRegister {
		modules: AppModules;
	}
}

export class AppCore {
	static async loadAsync(): Promise<AppCore> {
		const renderer = new THREE.WebGPURenderer({ antialias: true });

		// init renderer here instead of ThreeStart's fire-and-forget init:
		// failure lands in the error fallback, and the first frame after mount is drawn
		const [geoJson] = await Promise.all([
			fetch(WORLD_GEOJSON_URL).then(
				(res) => res.json() as Promise<GeoJsonFeatureCollection>
			),
			renderer.init(),
		]);

		return new AppCore(renderer, { geoJson });
	}

	readonly starter: ThreeStart;
	readonly assets: AppAssets;
	readonly globe: Globe;

	get ctx(): ThreeContext {
		return this.starter.ctx;
	}

	private constructor(renderer: THREE.WebGPURenderer, assets: AppAssets) {
		this.assets = assets;
		renderer.setPixelRatio(window.devicePixelRatio);

		const starter = new ThreeStart({ renderer, autoInitRenderer: false }).addModules({
			pointer: new PointerRaycasting(),
			geoJson: new GeoJsonManager(assets.geoJson, "adm0_a3"),
			cameraController: new CameraController(),
			themeMode: new ThemeModeManager(true),
		});
		this.starter = starter;

		const scene = starter.ctx.scene;
		addComponent(scene, SceneEnvironment);

		const globeObject = new THREE.Group();
		this.globe = addComponent(globeObject, Globe);
		scene.add(globeObject);

		starter.start();
	}
}
