import * as THREE from "three/webgpu";
import { distance, materialOpacity, smoothstep, uv, vec2 } from "three/tsl";

/** Fades opacity out from the uv center: opaque up to 0.1, transparent from 0.5. */
export function radialFade<T extends THREE.NodeMaterial>(material: T): T {
	const dist = distance(uv(), vec2(0.5));
	material.opacityNode = materialOpacity.mul(smoothstep(0.1, 0.5, dist).oneMinus());
	return material;
}
