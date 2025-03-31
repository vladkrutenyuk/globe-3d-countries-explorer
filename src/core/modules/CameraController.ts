import {
    CoreContext,
    CoreContextModule,
    ModulesRecord,
    ReturnOfUseCtx,
} from "@vladkrutenyuk/three-kvy-core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AppCoreCtxModule } from "../AppCore";

export class CameraController extends CoreContextModule<AppCoreCtxModule> {
    public get orbitControls() {
        const oc = this._orbitControls;
        if (!oc) {
            throw new Error("trying access orbit controls before its initialization")
        }
        return oc
    }
    private _orbitControls?: OrbitControls;

	protected useCtx<TModules extends ModulesRecord>(
		ctx: CoreContext<TModules>
	): ReturnOfUseCtx {
		const camera = ctx.three.camera;
		camera.position.setScalar(2);
		camera.lookAt(new THREE.Vector3());
		const orbitControls = new OrbitControls(camera, ctx.three.renderer.domElement);
        orbitControls.minDistance = 1.5;
        orbitControls.maxDistance = 10;
		orbitControls.enablePan = false;
		this._orbitControls = orbitControls;

        return () => {
            this._orbitControls = undefined
            orbitControls.disconnect();
            orbitControls.dispose();
        }
	}
}
