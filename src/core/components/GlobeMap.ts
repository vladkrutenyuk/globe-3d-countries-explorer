import * as THREE from "three/webgpu";
import { Object3DBehaviour } from "three-start";
import { $isDark } from "@/stores";
import { SCENE_COLORS } from "../scene-colors";
import van from "vanjs-core";

type ColorRgbExpression = `rgb(${number},${number},${number})`;

export class GlobeMap extends Object3DBehaviour {
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

	constructor() {
		super();
		const canvas = van.tags.canvas();
		canvas.width = this.width;
		canvas.height = this.height;
		this.canvas = canvas;
		this.canvasCtx = canvas.getContext("2d")!;
		this.canvasCtx.imageSmoothingEnabled = false;
		this.texture = new THREE.CanvasTexture(canvas);

		const idCanvas = van.tags.canvas();
		idCanvas.width = this.width;
		idCanvas.height = this.height;
		this.idCanvas = idCanvas;
		this.idCanvasCtx = idCanvas.getContext("2d", { willReadFrequently: true })!;
		this.idCanvasCtx.imageSmoothingEnabled = false;
		this.idTexture = new THREE.CanvasTexture(idCanvas);

		const highlightCanvas = van.tags.canvas();
		highlightCanvas.width = this.width;
		highlightCanvas.height = this.height;
		this.highlightCanvas = highlightCanvas;
		this.highlightCanvasCtx = highlightCanvas.getContext("2d")!;
		this.highlightTexture = new THREE.CanvasTexture(highlightCanvas);
	}

	onAwake() {
		const { geoJson } = this.modules;
		this.drawMapId(geoJson.data, geoJson.countryIdPropKey);
		$isDark.subscribe(this.onThemeChange);
	}

	getCountryIdAtUvClick(uv: THREE.Vector2Like) {
		const idCanvas = this.idCanvas;
		const x = Math.floor(uv.x * idCanvas.width);
		// important to invert uv.y bcs canvas has another vertical order (up-down)
		const y = Math.floor((1 - uv.y) * idCanvas.height);

		const pixel = this.idCanvasCtx.getImageData(x, y, 2, 2).data;
		const [r = 0, g = 0, b = 0] = pixel;
		const key = `rgb(${r},${g},${b})` as const;

		return this._countryByIdColors[key];
	}

	highlightCountry(feature: GeoJsonFeature, color: string) {
		const ctx = this.highlightCanvasCtx;

		ctx.fillStyle = color;
		this.drawGeoFeature(ctx, feature);
		this.highlightTexture.needsUpdate = true;
	}

	private readonly onThemeChange = (isDark: boolean) => {
		const colors = isDark ? SCENE_COLORS.dark.map : SCENE_COLORS.light.map;
		this.drawMap(this.modules.geoJson.data, colors.land, colors.water);
	};

	private drawMap(
		geojson: GeoJsonFeatureCollection,
		landCol: string,
		waterCol: string
	) {
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

		for (const [i, feature] of geojson.features.entries()) {
			const color = this.getIdColorByIndex(i);
			const name = feature.properties[countryIdPropKey];

			if (!name) continue;

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

			geometry.coordinates[0]?.forEach(([lon, lat], index) => {
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

				polygon[0]?.forEach(([lon, lat], index) => {
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
