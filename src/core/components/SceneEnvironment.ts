import * as THREE from "three/webgpu";
import { Object3DBehaviour } from "three-start";
import { SCENE_COLORS } from "../config";

/** Theme-aware background and lighting. Attach to the scene root. */
export class SceneEnvironment extends Object3DBehaviour {
	private readonly _background = new THREE.Color();
	private readonly _dirLight = new THREE.DirectionalLight();
	private readonly _ambLight = new THREE.AmbientLight();
	private _unwatchTheme?: () => void;

	onAwake() {
		this.ctx.scene.background = this._background;

		// attached to camera so the lit side always faces the viewer
		this._dirLight.position.set(-1, 3, 0);
		this.ctx.camera.add(this._dirLight);
	}

	onEnable() {
		this._unwatchTheme = this.modules.themeMode.watch(this.onThemeChange);
	}

	onDisable() {
		this._unwatchTheme?.();
		this._unwatchTheme = undefined;
	}

	onDestroy() {
		const scene = this.ctx.scene;
		if (scene.background === this._background) scene.background = null;

		this._dirLight.removeFromParent();
		this._dirLight.dispose();
		this._ambLight.removeFromParent();
		this._ambLight.dispose();
	}

	private readonly onThemeChange = (isDark: boolean) => {
		this._background.set(
			isDark ? SCENE_COLORS.dark.background : SCENE_COLORS.light.background
		);

		if (isDark) {
			this._ambLight.removeFromParent();
		} else {
			this.object.add(this._ambLight);
		}
	};
}
