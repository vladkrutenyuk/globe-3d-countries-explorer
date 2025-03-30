import { CoreContext, IFeaturable, Object3DFeature } from "@vladkrutenyuk/three-kvy-core";
import { AppCoreCtxModule } from "../AppCore";
import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

export class GlobeClickEffect extends Object3DFeature<AppCoreCtxModule> {
	readonly root: THREE.Group;
	plane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

	private _tweenGroup = new TWEEN.Group();
	private _tween = new TWEEN.Tween({ scale: 0, opacity: 3, t: 0 }, this._tweenGroup);

	private _tweenTo = { scale: 0.15, opacity: 0, t: 1 };

	constructor(object: IFeaturable) {
		super(object);
		const root = new THREE.Group();
		root.visible = false;
		this.root = root;
	}

	protected useCtx(
		ctx: CoreContext<AppCoreCtxModule>
	): undefined | (() => void) | void {
		const root = this.root;
		this.object.add(root);

		const plane = new THREE.Mesh(
			_planeGeom,
			new THREE.MeshBasicMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				transparent: true,
                
			})
		);
		root.add(plane);
		this.plane = plane;

		return () => {
			this.object.remove(root);
			root.remove(plane);
			plane.material.dispose();
		};
	}

	onBeforeRender(ctx: CoreContext<AppCoreCtxModule>): void {
		this._tweenGroup.update();
	}

	click(intersection: THREE.Intersection) {
		const { normal, point } = intersection;
		if (!normal) return;

		this._tween.stop();

		const root = this.root;

		const adjustedPoint = _vt.copy(normal).multiplyScalar(0.01).add(point);
		_qt.setFromUnitVectors(zAxis, normal);
		root.position.copy(adjustedPoint);
		root.quaternion.copy(_qt);

		const plane = this.plane;
		if (!plane) return;

		this._tween
			.to(this._tweenTo)
			.duration(600)
			.easing(TWEEN.Easing.Cubic.Out)
			.onStart(() => {
				root.visible = true;
			})
			.onUpdate((obj) => {
				root.scale.setScalar(obj.scale);
				plane.material.opacity = obj.opacity;
			})
			.onComplete(() => {
				root.visible = false;
			})
			.start();
	}

	// on
	stop() {}
}

const zAxis = new THREE.Vector3(0, 0, 1);
const _vt = new THREE.Vector3();
const _qt = new THREE.Quaternion();
const _planeGeom = new THREE.PlaneGeometry();
