import * as THREE from "three/webgpu";
import { distance, float, materialOpacity, smoothstep, uv, vec2 } from "three/tsl";
import { Object3DBehaviour } from "three-start";
import { $isDark } from "@/stores";
import { SCENE_COLORS } from "../scene-colors";

const DURATION = 0.6; // seconds
const FROM = { scale: 0, opacity: 3 };
const TO = { scale: 1, opacity: 0 };

export class GlobeClickEffect extends Object3DBehaviour {
	private readonly _root = new THREE.Group();
	private _ringPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicNodeMaterial>;
	/** seconds since click, negative while idle */
	private _elapsed = -1;

	onAwake() {
		const root = this._root;
		root.visible = false;
		this.object.add(root);

		const ringMat = ring(
			new THREE.MeshBasicNodeMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				transparent: true,
			}),
			{ radius: 0.85, thickness: 0.2 }
		);
		const ringPlane = new THREE.Mesh(_planeGeom, ringMat);
		root.add(ringPlane);
		this._ringPlane = ringPlane;

		this.modules.cameraController.orbitControls.addEventListener("change", this.onCameraChange);
		this.onCameraChange();
		$isDark.subscribe(this.onThemeChange);
	}

	onUpdate() {
		if (this._elapsed < 0) return;

		this._elapsed += this.ctx.getDeltaTime();
		const t = Math.min(this._elapsed / DURATION, 1);
		const k = 1 - (1 - t) ** 3; // cubic ease-out

		const plane = this._ringPlane;
		plane.scale.setScalar(THREE.MathUtils.lerp(FROM.scale, TO.scale, k));
		plane.material.opacity = THREE.MathUtils.lerp(FROM.opacity, TO.opacity, k);

		if (t === 1) this.stop();
	}

	click(intersection: THREE.Intersection) {
		const { normal, point } = intersection;
		if (!normal) return;

		const root = this._root;
		root.position.copy(_vt.copy(normal).multiplyScalar(0.01).add(point));
		root.quaternion.setFromUnitVectors(zAxis, normal);

		const plane = this._ringPlane;
		plane.scale.setScalar(FROM.scale);
		plane.material.opacity = FROM.opacity;

		this._elapsed = 0;
		root.visible = true;
	}

	private stop() {
		this._elapsed = -1;
		this._root.visible = false;
	}

	private readonly onCameraChange = () => {
		const cameraDistance = this.modules.cameraController.orbitControls.getDistance();
		this._root.scale.setScalar(cameraDistance * 0.04);
	};

	private readonly onThemeChange = (isDark: boolean) => {
		const col = isDark ? SCENE_COLORS.dark.ring : SCENE_COLORS.light.ring;
		this._ringPlane.material.color.set(col);
	};
}

const zAxis = new THREE.Vector3(0, 0, 1);
const _vt = new THREE.Vector3();
const _planeGeom = new THREE.PlaneGeometry();

/** Masks opacity to a ring centered in uv space. Sizes are in uv units. */
function ring<T extends THREE.NodeMaterial>(
	material: T,
	params: { radius: number; thickness: number }
): T {
	const dist = distance(uv(), vec2(0.5));
	const r = float(params.radius / 2);
	const th = float(params.thickness / 2);

	const circle = smoothstep(r, r.add(0.01), dist).oneMinus();
	const inner = smoothstep(r.sub(th), r.sub(th).add(0.01), dist);

	// opacity is tweened from above 1 – saturate, since scenePass renders into
	// a float target where alpha is not clamped to [0, 1] before blending
	material.opacityNode = materialOpacity.mul(circle.mul(inner)).saturate();
	return material;
}
