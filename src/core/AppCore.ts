import * as KVY from "@vladkrutenyuk/three-kvy-core";
import EventEmitter from "eventemitter3";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Globe } from "./features/Globe";
// import { GeoJsonManager } from "./modules/GeoJsonManager";
import { PointerRaycasting } from "./modules/PointerRaycasting";
import { GeoJsonManager } from "./modules/GeoJsonManager";
import { plane } from "./features/RadialGradient";

type AppAssets = {
	geoJson: GeoJsonFeatureCollection;
};

export type AppCoreCtxModule = { pointer: PointerRaycasting; geoJson: GeoJsonManager };

export class AppCore extends EventEmitter {
	static async loadAsync(): Promise<AppCore> {
		const geoJson = (await (
			await fetch("/world.geo.json")
		).json()) as GeoJsonFeatureCollection;

		const assets: AppAssets = {
			geoJson,
		};
        // saveMappedGeoJson(geoJson)
		return new AppCore(assets);
	}

	readonly ctx: KVY.CoreContext<{ pointer: PointerRaycasting }>;
	readonly orbitControls: OrbitControls;
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
			},
			{ antialias: true, logarithmicDepthBuffer: true }
		);

		this.ctx = ctx;

		const scene = ctx.three.scene;
		scene.background = new THREE.Color("rgb(16,16,16)");
		const renderer = ctx.three.renderer;
		renderer.setPixelRatio(window.devicePixelRatio);
        plane.scale.setScalar(2.3)
        scene.add(plane);

		// globe
		const globe = KVY.addFeature(new THREE.Group(), Globe);
		ctx.root.add(globe.object);
		this.globe = globe;

		// camera
		const camera = ctx.three.camera;
		camera.position.setScalar(2);
		camera.lookAt(new THREE.Vector3());
		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.enablePan = false;
		this.orbitControls = orbitControls;

		this.conciliateSceneControls();
	}

	private conciliateSceneControls() {
		//TODO переделать через сравнивания timestamp
		this.orbitControls.addEventListener("change", () => {
			this.ctx.modules.pointer.skipNextClick();
		});
	}
}

// function objToJsonFile(obj: object, name?: string) {
// 	const jsonString = JSON.stringify(obj);
// 	const file = new File([jsonString], name ?? "unnamed.json", {
// 		type: "application/json",
// 		lastModified: Date.now(),
// 	});
// 	return file;
// }

// function saveFile(file: File) {
// 	const url = URL.createObjectURL(file);
// 	const a = document.createElement("a");
// 	a.href = url;
// 	a.download = file.name;
// 	document.body.appendChild(a);
// 	a.click();
// 	document.body.removeChild(a);
// 	URL.revokeObjectURL(url);
// }

// function saveMappedGeoJson(geoJson: GeoJsonFeatureCollection) {
// 	const features = geoJson.features
// 		.filter((f) => {
// 			const type = f.geometry.type;
// 			return type === "MultiPolygon" || type === "Polygon";
// 		})
// 		.map((f) => {
// 			const adm0_a3 = f.properties.adm0_a3;
//             console.log(adm0_a3)
// 			f.properties = { adm0_a3 };
// 			return f;
// 		});
// 	geoJson.features = features;
// 	const file = objToJsonFile(geoJson, "world.geo.json");
// 	saveFile(file);
// }
