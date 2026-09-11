import * as THREE from "three/webgpu";
import { distance, float, materialOpacity, smoothstep, uv, vec2 } from "three/tsl";

/** Masks opacity to a ring centered in uv space. Sizes are in uv units. */
export function ring<T extends THREE.NodeMaterial>(
	material: T,
	params: { radius: number; thickness: number }
): T {
	const dist = distance(uv(), vec2(0.5));
	const r = float(params.radius / 2);
	const th = float(params.thickness / 2);

	const circle = smoothstep(r, r.add(0.01), dist).oneMinus();
	const inner = smoothstep(r.sub(th), r.sub(th).add(0.01), dist);

	// opacity is tweened from above 1 – saturate, since scenePass renders into
	// a float target where alpha is not clamped to [0, 1] before blending
	material.opacityNode = materialOpacity.mul(circle.mul(inner)).saturate();
	return material;
}
