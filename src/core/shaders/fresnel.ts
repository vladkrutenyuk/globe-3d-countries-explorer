import * as THREE from "three";

export function fresnel<T extends THREE.Material>(
	material: T,
	uniforms: {
		fresnelPower: THREE.Uniform<number>;
		fresnelIntensity: THREE.Uniform<number>;
		fresnelColor: THREE.Uniform<THREE.Color>;
	}
): T {
	material.onBeforeCompile = (program) => {
		Object.assign(program.uniforms, uniforms);

		program.fragmentShader = program.fragmentShader.replace(
			/*glsl*/ `#include <common>`,
			/*glsl*/ `
            #include <common>
			uniform float fresnelPower;
			uniform float fresnelIntensity;
			uniform vec3 fresnelColor;
          `
		);

		program.fragmentShader = program.fragmentShader.replace(
			/*glsl*/ `#include <opaque_fragment>`,
			/*glsl*/ `        
            #include <opaque_fragment>
    
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(viewDir, normal)), fresnelPower);
            fresnel = clamp(fresnel * fresnelIntensity, 0.0, 1.0);
            
            vec4 curCol = gl_FragColor;
            gl_FragColor = mix(curCol, vec4(fresnelColor,1.0), fresnel);
          `
		);

		material.userData.shader = program;
	};
	return material;
}
