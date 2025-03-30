import { CoreContext, IFeaturable, Object3DFeature } from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";
import { AppCoreCtxModule } from "../AppCore";
import { SCENE_COLORS } from "../config";

type ColorRgbExpression = `rgb(${number},${number},${number})`;

export class GlobeMap extends Object3DFeature<AppCoreCtxModule> {
	canvas: HTMLCanvasElement;
	canvasCtx: CanvasRenderingContext2D;
	texture: THREE.CanvasTexture;
	idCanvas: HTMLCanvasElement;
	idCanvasCtx: CanvasRenderingContext2D;
	idTexture: THREE.CanvasTexture;

	highlightCanvas: HTMLCanvasElement;
	highlightCanvasCtx: CanvasRenderingContext2D;
	highlightTexture: THREE.CanvasTexture;

	width = 4096;
	height = 4096;

	private readonly _countryByIdColors: Partial<Record<ColorRgbExpression, string>> = {};

	constructor(object: IFeaturable) {
		super(object);
		const canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		this.canvas = canvas;
		this.canvasCtx = canvas.getContext("2d")!;
		this.canvasCtx.imageSmoothingEnabled = false;
		this.texture = new THREE.CanvasTexture(canvas);

		const idCanvas = document.createElement("canvas");
		idCanvas.width = this.width;
		idCanvas.height = this.height;
		this.idCanvas = idCanvas;
		this.idCanvasCtx = idCanvas.getContext("2d", { willReadFrequently: true })!;
		this.idCanvasCtx.imageSmoothingEnabled = false;
		this.idTexture = new THREE.CanvasTexture(idCanvas);

		const highlightCanvas = document.createElement("canvas");
		highlightCanvas.width = this.width;
		highlightCanvas.height = this.height;
		this.highlightCanvas = highlightCanvas;
		this.highlightCanvasCtx = highlightCanvas.getContext("2d")!;
		this.highlightTexture = new THREE.CanvasTexture(highlightCanvas);
	}

	protected useCtx(
		ctx: CoreContext<AppCoreCtxModule>
	): undefined | (() => void) | void {
		const { geoJson, themeMode } = ctx.modules;

		this.drawMapId(geoJson.data, geoJson.countryIdPropKey);
		const unwatch = themeMode.watch((isDark) => {
			const land = isDark ? SCENE_COLORS.dark.map.land : SCENE_COLORS.light.map.land;
			const water = isDark ? SCENE_COLORS.dark.map.water : SCENE_COLORS.light.map.water;
			this.drawMap(geoJson.data, land, water);
		})
		return () => {
			unwatch();
			this.dispose();
		};
	}

	dispose() {
		this.texture.dispose();
		this.idTexture.dispose();
		this.highlightTexture.dispose();

		const instance = this as Partial<typeof this>;
		instance.canvas = undefined;
		instance.canvasCtx = undefined;
		instance.idCanvasCtx = undefined;
		instance.idCanvas = undefined;
		instance.highlightCanvas = undefined;
		instance.highlightCanvasCtx = undefined;
	}

	getCountryIdAtUvClick(uv: THREE.Vector2Like) {
		const idCanvas = this.idCanvas;
		const x = Math.floor(uv.x * idCanvas.width);
		// important to invert uv.y bcs canvas has another vertical order (up-down)
		const y = Math.floor((1 - uv.y) * idCanvas.height);

		const pixel = this.idCanvasCtx.getImageData(x, y, 2, 2).data;
		const [r, g, b] = pixel;
		const key = `rgb(${r},${g},${b})` as const;

		return this._countryByIdColors[key];
	}

	highlightCountry(feature: GeoJsonFeature, color: string) {
		const ctx = this.highlightCanvasCtx;

		ctx.fillStyle = color;
		this.drawGeoFeature(ctx, feature);
		this.highlightTexture.needsUpdate = true;
	}

	private drawMap(geojson: GeoJsonFeatureCollection, landCol: string, waterCol: string) {
		const ctx = this.canvasCtx;
		ctx.clearRect(0, 0, this.width, this.height);

		ctx.fillStyle = waterCol;
		ctx.fillRect(0, 0, this.width, this.height);

		ctx.fillStyle = landCol;
		geojson.features.forEach((feature: GeoJsonFeature) => {
			this.drawGeoFeature(ctx, feature);
		});

		this.texture.needsUpdate = true;
	}

	private drawMapId(geojson: GeoJsonFeatureCollection, countryIdPropKey: string) {
		const idCanvas = this.idCanvas;
		const idCtx = this.idCanvasCtx;

		idCtx.clearRect(0, 0, idCanvas.width, idCanvas.height);

		for (let i = 0; i < geojson.features.length; i++) {
			const feature = geojson.features[i];

			const color = this.getIdColorByIndex(i);
			const name = feature.properties[countryIdPropKey];

			if (!name) return;

			this._countryByIdColors[color] = name.toString();

			idCtx.fillStyle = color;
			this.drawGeoFeature(idCtx, feature);
		}

		console.log(this._countryByIdColors);
		this.idTexture.needsUpdate = true;
	}

	private getIdColorByIndex(i: number): ColorRgbExpression {
		const r = (i + 1) % 255;
		const g = ((i + 10) * 7) % 255;
		const b = ((i + 50) * 3) % 255;
		return `rgb(${r},${g},${b})`;
	}

	private drawGeoFeature(ctx: CanvasRenderingContext2D, feature: GeoJsonFeature) {
		const geometry = feature.geometry;

		if (geometry.type === "Polygon") {
			ctx.beginPath();

			geometry.coordinates[0].forEach(([lon, lat], index) => {
				const x = ((lon + 180) / 360) * this.width;
				const y = ((-lat + 90) / 180) * this.height;
				if (index === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			});

			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		} else if (geometry.type === "MultiPolygon") {
			geometry.coordinates.forEach((polygon) => {
				ctx.beginPath();

				polygon[0].forEach(([lon, lat], index) => {
					const x = ((lon + 180) / 360) * this.width;
					const y = ((-lat + 90) / 180) * this.height;
					if (index === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				});

				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			});
		}
	}
}
