import * as KVY from "@vladkrutenyuk/three-kvy-core";
import EventEmitter from "eventemitter3";
import * as THREE from "three";
import { Globe } from "./features/Globe";
import { SCENE_COLORS, WORLD_GEOJSON_URL } from "./config";
import { CameraController } from "./modules/CameraController";
import { GeoJsonManager } from "./modules/GeoJsonManager";
import { PointerRaycasting } from "./modules/PointerRaycasting";
import { ThemeModeManager } from "./modules/ThemeModeManager";

type AppAssets = {
	geoJson: GeoJsonFeatureCollection;
};

export type AppCoreCtxModule = {
	pointer: PointerRaycasting;
	geoJson: GeoJsonManager;
	cameraController: CameraController;
	themeMode: ThemeModeManager;
};

export class AppCore extends EventEmitter {
	static async loadAsync(): Promise<AppCore> {
		const geoJson = (await (
			await fetch(WORLD_GEOJSON_URL)
		).json()) as GeoJsonFeatureCollection;

		const assets: AppAssets = {
			geoJson,
		};
		return new AppCore(assets);
	}

	readonly ctx: KVY.CoreContext<AppCoreCtxModule>;
	readonly assets: AppAssets;
	readonly globe: Globe;

	private constructor(assets: AppAssets) {
		super();
		this.assets = assets;
		const ctx = KVY.CoreContext.create(
			THREE,
			{
				pointer: new PointerRaycasting(),
				geoJson: new GeoJsonManager(assets.geoJson, "adm0_a3"),
				cameraController: new CameraController(),
				themeMode: new ThemeModeManager(true),
			},
			{ antialias: true }
		);
		ctx.modules.cameraController.orbitControls.addEventListener("change", () => {
			this.ctx.modules.pointer.skipNextClick();
		});
		this.ctx = ctx;

		ctx.three.renderer.setPixelRatio(window.devicePixelRatio);

		const scene = ctx.three.scene;
		const bgColor = new THREE.Color();
		scene.background = bgColor;
		ctx.modules.themeMode.watch((isDark) => {
			bgColor.set(
				isDark ? SCENE_COLORS.dark.background : SCENE_COLORS.light.background
			);
		});

		// globe
		const globe = KVY.addFeature(new THREE.Group(), Globe);
		ctx.root.add(globe.object);
		this.globe = globe;

		const camera = ctx.three.camera;

		// light
		const dirLight = new THREE.DirectionalLight();
		scene.add(camera);
		camera.add(dirLight);
		dirLight.position.y = 3;
		dirLight.position.x = -1;
        const ambLight = new THREE.AmbientLight();

        ctx.modules.themeMode.watch(isDark => {
            if (isDark) {
                ambLight.removeFromParent();
            } else {
                scene.add(ambLight);
            }
        })
	}
}