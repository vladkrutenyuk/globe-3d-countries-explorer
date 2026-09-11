import * as THREE from "three/webgpu";
import { addComponent, ThreeStart } from "three-start";
import { Globe } from "./components/Globe";
import { SceneEnvironment } from "./components/SceneEnvironment";
import { CameraController } from "./modules/CameraController";
import { GeoJsonManager } from "./modules/GeoJsonManager";
import { PointerRaycasting } from "./modules/PointerRaycasting";
import worldGeoJson from "@/data/world.geo.json";

export type WorldModules = {
	pointer: PointerRaycasting;
	geoJson: GeoJsonManager;
	cameraController: CameraController;
};

declare module "three-start" {
	interface ThreeStartRegister {
		modules: WorldModules;
	}
}

export class World extends ThreeStart {
	readonly globe: Globe;

	constructor() {
		super();
		this.ctx.renderer.setPixelRatio(window.devicePixelRatio);

		this.addModules({
			pointer: new PointerRaycasting(),
			geoJson: new GeoJsonManager(worldGeoJson, "adm0_a3"),
			cameraController: new CameraController(),
		});

		const scene = this.ctx.scene;
		addComponent(scene, SceneEnvironment);

		const globeObject = new THREE.Group();
		this.globe = addComponent(globeObject, Globe);
		scene.add(globeObject);

		this.start();
	}
}
