import * as KVY from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";

export class PointerRaycasting extends KVY.CoreContextModule<{
	click: [intersection?: THREE.Intersection];
	hover: [intersection: THREE.Intersection];
}> {
	private _objs: THREE.Object3D[] = [];
	constructor() {
		super();
	}

	protected useCtx<TModules extends KVY.ModulesRecord>(
		ctx: KVY.CoreContext<TModules>
	): KVY.ReturnOfUseCtx {
		const canvas = ctx.three.renderer.domElement;

		const onClick = (event: MouseEvent) => {
			if (this._skipNextClick) {
				this._skipNextClick = false;
				return;
			}
			this.intersectionFromPointer(event, ctx, (x) => {
				this.emit("click", x);
			});
		};

		const onMouseMove = (event: MouseEvent) => {
			this.intersectionFromPointer(event, ctx, (x) => {
				x && this.emit("hover", x);
			});
		};

		canvas.addEventListener("click", onClick);
		canvas.addEventListener("mousemove", onMouseMove);

		return () => {
			canvas.removeEventListener("click", onClick);
			canvas.removeEventListener("mousemove", onMouseMove);
		};
	}

	registerObj(obj: THREE.Object3D) {
		this._objs.push(obj);
	}

	unregisterObj(obj: THREE.Object3D) {
		const objs = this._objs;
		const index = objs.indexOf(obj);
		if (index === -1) return;
		objs.splice(index, 1);
	}

	private _skipNextClick = false;

	skipNextClick() {
		this._skipNextClick = true;
	}

	private intersectionFromPointer(
		event: MouseEvent,
		ctx: KVY.CoreContext,
		callback?: (intersection?: THREE.Intersection) => void
	) {
		if (event.currentTarget !== event.target) return;
		const canvas = event.target as HTMLCanvasElement;
		const rect = canvas.getBoundingClientRect();

		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		const raycaster = ctx.three.raycaster;
		const camera = ctx.three.camera;
		raycaster.setFromCamera(mouse, camera);
		const intersection = raycaster.intersectObjects(this._objs, false)[0];
		callback && callback(intersection);
		return intersection;
	}
}

const mouse = new THREE.Vector2();
