import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    float alpha = smoothstep(0.5, 0.3, dist); // Градиентный переход
    gl_FragColor = vec4(vec3(1.0), alpha); // Белый цвет с альфа-прозрачностью
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(1, 1);
export const plane = new THREE.Mesh(geometry, material);