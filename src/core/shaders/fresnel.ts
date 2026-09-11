import * as THREE from "three/webgpu";
import { dot, float, mix, normalView, output, positionViewDirection, uniform, vec4 } from "three/tsl";

/**
 * Blends the lit output towards `color` at grazing view angles.
 * Returns uniforms to tweak the effect at runtime.
 */
export function fresnel(
	material: THREE.NodeMaterial,
	params: { power: number; intensity: number; color: THREE.ColorRepresentation }
) {
	const uniforms = {
		power: uniform(params.power),
		intensity: uniform(params.intensity),
		color: uniform(new THREE.Color(params.color)),
	};

	const factor = float(1)
		.sub(dot(positionViewDirection, normalView).abs())
		.pow(uniforms.power)
		.mul(uniforms.intensity)
		.saturate();

	material.outputNode = mix(output, vec4(uniforms.color, 1), factor);

	return uniforms;
}

export type FresnelUniforms = ReturnType<typeof fresnel>;
