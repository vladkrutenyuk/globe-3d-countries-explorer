import * as THREE from "three";
import { enableUv } from "./uv";
import { glsl } from "./_glsl";

export function ring<TMat extends THREE.Material>(
	mat: TMat,
	uniforms: {
		radius: THREE.Uniform<number>;
		thickness: THREE.Uniform<number>;
	}
) {
	mat.onBeforeCompile = (program) => {
		Object.assign(program.uniforms, uniforms);

		enableUv(program);

		program.fragmentShader = program.fragmentShader.replace(
			glsl`#include <common>`,
			glsl`
            #include <common>
			uniform float radius;
			uniform float thickness;
          `
		);

		program.fragmentShader = program.fragmentShader.replace(
			glsl`#include <opaque_fragment>`,
			glsl`        
            #include <opaque_fragment>

            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);

            float r = radius / 2.0;
            float th = thickness / 2.0;

            float circle = 1.0 - smoothstep(r, r + 0.01, dist);

            float inner = smoothstep(r - th, r - th + 0.01, dist);
            float ringMask = circle * inner;
    
            gl_FragColor.a *= ringMask;
          `
		);
	};

	return mat;
}
