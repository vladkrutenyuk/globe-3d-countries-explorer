import * as THREE from 'three'
export function ring<TMat extends THREE.Material>(mat: TMat, uniforms: object) {
    mat.onBeforeCompile = (program) => {
		Object.assign(program.uniforms, uniforms);

        program.fragmentShader = program.fragmentShader.replace(
			/*glsl*/ `#include <common>`,
			/*glsl*/ `
            #include <common>
			uniform float radius;     // Радиус кольца
			uniform float thickness;  // Ширина кольца
          `
		);
    }

    return mat;
}