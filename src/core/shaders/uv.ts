import * as THREE from "three";
import { glsl } from "./_glsl";

export function enableUv(program: THREE.WebGLProgramParametersWithUniforms) {
	program.vertexShader = program.vertexShader.replace(
		glsl`#include <common>`,
		glsl`
        #define USE_UV true
        #include <common>
      `
	);
	program.fragmentShader = program.fragmentShader.replace(
		glsl`#include <common>`,
		glsl`
        #define USE_UV true
        #include <common>
      `
	);
}
