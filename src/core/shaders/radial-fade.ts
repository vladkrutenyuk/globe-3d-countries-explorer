import * as THREE from "three";
import { enableUv } from "./uv";
import { glsl } from "./_glsl";

export function radialFade(mat: THREE.SpriteMaterial) {
    mat.onBeforeCompile = (program) => {
        enableUv(program);

        program.fragmentShader = program.fragmentShader.replace(
            glsl`#include <opaque_fragment>`,
           glsl`        
                #include <opaque_fragment>
    
                vec2 _center = vec2(0.5, 0.5);
                float _dist = distance(vUv, _center);
                float _alpha = smoothstep(0.5, 0.1, _dist);
        
                gl_FragColor.a *= _alpha;
              `
        );
    };
    return mat
}

