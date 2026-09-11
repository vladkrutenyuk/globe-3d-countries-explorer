import { ContextModule } from "three-start";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class CameraController extends ContextModule {
	public get orbitControls() {
		const oc = this._orbitControls;
		if (!oc) {
			throw new Error("trying access orbit controls before its initialization");
		}
		return oc;
	}
	private _orbitControls?: OrbitControls;

	onAwake() {
		const { camera, renderer } = this.ctx;
		camera.position.setScalar(2);
		camera.lookAt(0, 0, 0);

		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.minDistance = 1.5;
		orbitControls.maxDistance = 10;
		orbitControls.enablePan = false;
		this._orbitControls = orbitControls;
	}
}
