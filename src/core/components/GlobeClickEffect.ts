import * as THREE from "three/webgpu";
import { Object3DBehaviour } from "three-start";
import { SCENE_COLORS } from "../config";
import { ring } from "../shaders/ring";

const DURATION = 0.6; // seconds
const FROM = { scale: 0, opacity: 3 };
const TO = { scale: 1, opacity: 0 };

export class GlobeClickEffect extends Object3DBehaviour {
	private readonly _root = new THREE.Group();
	private _ringPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicNodeMaterial>;
	/** seconds since click, negative while idle */
	private _elapsed = -1;
	private _unwatchTheme?: () => void;

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
	}

	onEnable() {
		const { cameraController, themeMode } = this.modules;
		cameraController.orbitControls.addEventListener("change", this.onCameraChange);
		this.onCameraChange();
		this._unwatchTheme = themeMode.watch(this.onThemeChange);
	}

	onDisable() {
		this.modules.cameraController.orbitControls.removeEventListener(
			"change",
			this.onCameraChange
		);
		this._unwatchTheme?.();
		this._unwatchTheme = undefined;
		this.stop();
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

	onDestroy() {
		this._root.removeFromParent();
		this._ringPlane.material.dispose();
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
		const distance = this.modules.cameraController.orbitControls.getDistance();
		this._root.scale.setScalar(distance * 0.04);
	};

	private readonly onThemeChange = (isDark: boolean) => {
		const col = isDark ? SCENE_COLORS.dark.ring : SCENE_COLORS.light.ring;
		this._ringPlane.material.color.set(col);
	};
}

const zAxis = new THREE.Vector3(0, 0, 1);
const _vt = new THREE.Vector3();
const _planeGeom = new THREE.PlaneGeometry();
