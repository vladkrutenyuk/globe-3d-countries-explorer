import * as THREE from "three/webgpu";
import { ContextModule } from "three-start";

export class PointerRaycasting extends ContextModule<{
	click: [intersection?: THREE.Intersection];
	hover: [intersection: THREE.Intersection];
}> {
	private readonly _raycaster = new THREE.Raycaster();
	private readonly _objs: THREE.Object3D[] = [];
	private _skipNextClick = false;

	onAwake() {
		const canvas = this.ctx.renderer.domElement;

		canvas.addEventListener("click", (event) => {
			if (this._skipNextClick) {
				this._skipNextClick = false;
				return;
			}
			if (event.currentTarget !== event.target) return;
			this.emit("click", this.intersectionFromPointer(event));
		});

		canvas.addEventListener("mousemove", (event) => {
			if (event.currentTarget !== event.target) return;
			const intersection = this.intersectionFromPointer(event);
			intersection && this.emit("hover", intersection);
		});
	}

	onStart() {
		// orbiting the globe must not end up as a click on it
		this.modules.cameraController.orbitControls.addEventListener("change", () => {
			this.skipNextClick();
		});
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

	skipNextClick() {
		this._skipNextClick = true;
	}

	private intersectionFromPointer(event: MouseEvent): THREE.Intersection | undefined {
		const rect = this.ctx.renderer.domElement.getBoundingClientRect();

		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		const raycaster = this._raycaster;
		raycaster.setFromCamera(mouse, this.ctx.camera);
		return raycaster.intersectObjects(this._objs, false)[0];
	}
}

const mouse = new THREE.Vector2();
