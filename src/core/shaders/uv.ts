import * as THREE from "three";

export function enableUv(program: THREE.WebGLProgramParametersWithUniforms) {
	program.vertexShader = program.vertexShader.replace(
		"#include <common>",
		/*glsl*/ `
        #define USE_UV true
        #include <common>
      `
	);
	program.fragmentShader = program.fragmentShader.replace(
		"#include <common>",
		/*glsl*/ `
        #define USE_UV true
        #include <common>
      `
	);
}
