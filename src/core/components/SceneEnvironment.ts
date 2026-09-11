import * as THREE from "three/webgpu";
import { Object3DBehaviour } from "three-start";
import { $isDark } from "@/stores";
import { SCENE_COLORS } from "../scene-colors";

/** Theme-aware background and lighting. Attach to the scene root. */
export class SceneEnvironment extends Object3DBehaviour {
	private readonly _background = new THREE.Color();
	private readonly _dirLight = new THREE.DirectionalLight();
	private readonly _ambLight = new THREE.AmbientLight();

	onAwake() {
		this.ctx.scene.background = this._background;

		// attached to camera so the lit side always faces the viewer
		this._dirLight.position.set(-1, 3, 0);
		this.ctx.camera.add(this._dirLight);

		this.object.add(this._ambLight);

		$isDark.subscribe(this.onThemeChange);
	}

	private readonly onThemeChange = (isDark: boolean) => {
		this._background.set(
			isDark ? SCENE_COLORS.dark.background : SCENE_COLORS.light.background
		);
		this._ambLight.visible = !isDark;
	};
}
