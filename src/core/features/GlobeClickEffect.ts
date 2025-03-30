import {
	CoreContext,
	IFeaturable,
	Object3DFeature,
	ReturnOfUseCtx,
} from "@vladkrutenyuk/three-kvy-core";
import { AppCoreCtxModule } from "../AppCore";
import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { ring } from "../shaders/ring";

export class GlobeClickEffect extends Object3DFeature<AppCoreCtxModule> {
	private readonly _root: THREE.Group;
	private _ringPlane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

	private _tweenGroup = new TWEEN.Group();
	private _tween = new TWEEN.Tween({ scale: 0, opacity: 3, t: 0 }, this._tweenGroup);
	private _tweenTo = { scale: 0.15, opacity: 0, t: 1 };

	constructor(object: IFeaturable) {
		super(object);
		const root = new THREE.Group();
		root.visible = false;
		this._root = root;
	}

	protected useCtx(ctx: CoreContext<AppCoreCtxModule>): ReturnOfUseCtx {
		const root = this._root;
		this.object.add(root);

		const ringMat = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			transparent: true,
		});
		ring(ringMat, {
			radius: new THREE.Uniform(0.85),
			thickness: new THREE.Uniform(0.2),
		});
		const ringPlane = new THREE.Mesh(_planeGeom, ringMat);

		root.add(ringPlane);
		this._ringPlane = ringPlane;

		return () => {
            this.object.remove(root);

			ringPlane.removeFromParent();
			ringPlane.material.dispose();
            this._ringPlane = undefined;

            this._tween.stop();
		};
	}

	onBeforeRender(ctx: CoreContext<AppCoreCtxModule>): void {
		this._tweenGroup.update();
	}

	click(intersection: THREE.Intersection) {
		const { normal, point } = intersection;
		if (!normal) return;

		this._tween.stop();

		const root = this._root;

		const adjustedPoint = _vt.copy(normal).multiplyScalar(0.01).add(point);
		_qt.setFromUnitVectors(zAxis, normal);
		root.position.copy(adjustedPoint);
		root.quaternion.copy(_qt);

		const plane = this._ringPlane;
		if (!plane) return;

		this._tween
			.to(this._tweenTo)
			.duration(600)
			.easing(TWEEN.Easing.Cubic.Out)
			.onStart(() => {
				root.visible = true;
			})
			.onUpdate((obj) => {
				plane.scale.setScalar(obj.scale);
				plane.material.opacity = obj.opacity;
			})
			.onComplete(() => {
				root.visible = false;
			})
			.start();
	}
}

const zAxis = new THREE.Vector3(0, 0, 1);
const _vt = new THREE.Vector3();
const _qt = new THREE.Quaternion();
const _planeGeom = new THREE.PlaneGeometry();
