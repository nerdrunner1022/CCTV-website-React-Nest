import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

interface CameraModel {
  model: THREE.Group;
  pivot: THREE.Group;
  statusLed: THREE.Mesh;
  statusLedMaterial: THREE.MeshStandardMaterial;
  statusLight: THREE.PointLight;
}

function createCameraModel(): CameraModel {
  const camera = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.position.set(0, 0.35, -0.48);
  const body = new THREE.Group();
  body.position.set(0, -0.35, 0.48);
  pivot.add(body);
  camera.add(pivot);

  const housing = new THREE.MeshStandardMaterial({ color: '#303945', metalness: 0.42, roughness: 0.34 });
  const housingEdge = new THREE.MeshStandardMaterial({ color: '#151c25', metalness: 0.55, roughness: 0.28 });
  const trim = new THREE.MeshStandardMaterial({ color: '#9aa5ae', metalness: 0.86, roughness: 0.2 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#090d12', metalness: 0.12, roughness: 0.55 });
  const lensGlass = new THREE.MeshPhysicalMaterial({
    color: '#075078',
    metalness: 0.42,
    roughness: 0.055,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    emissive: '#06354d',
    emissiveIntensity: 0.24,
  });
  const infrared = new THREE.MeshStandardMaterial({
    color: '#24191c',
    emissive: '#7a2024',
    emissiveIntensity: 0.18,
  });
  const statusLedMaterial = new THREE.MeshStandardMaterial({
    color: '#ff3434',
    emissive: '#ff1010',
    emissiveIntensity: 3,
    toneMapped: false,
  });

  const addMesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: THREE.Vector3,
    parent: THREE.Object3D = body,
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const alongZ = (radiusTop: number, radiusBottom: number, depth: number) => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, depth, 64);
    geometry.rotateX(Math.PI / 2);
    return geometry;
  };

  // Outdoor bullet-camera mount: wall plate, adjustable arm, and swivel joint.
  addMesh(new RoundedBoxGeometry(0.58, 0.84, 0.13, 5, 0.07), housing, new THREE.Vector3(0, 0.42, -1.48), camera);
  for (const y of [0.12, 0.72]) {
    const screw = addMesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.025, 20),
      trim,
      new THREE.Vector3(0, y, -1.4),
      camera,
    );
    screw.rotation.x = Math.PI / 2;
  }
  addMesh(new THREE.SphereGeometry(0.2, 32, 24), housingEdge, new THREE.Vector3(0, 0.35, -1.12), camera);
  addMesh(new RoundedBoxGeometry(0.2, 0.2, 0.66, 4, 0.06), housing, new THREE.Vector3(0, 0.35, -0.78), camera);
  addMesh(new THREE.SphereGeometry(0.23, 32, 24), housingEdge, new THREE.Vector3(0, 0.35, -0.48), camera);
  addMesh(new RoundedBoxGeometry(0.55, 0.18, 0.58, 5, 0.06), housing, new THREE.Vector3(0, 0.35, -0.3), camera);

  // Long, tapered outdoor housing, characteristic top sunshield, and rear cap.
  addMesh(alongZ(0.32, 0.43, 1.34), housing, new THREE.Vector3(0, 0.48, -0.02));
  addMesh(alongZ(0.31, 0.34, 0.16), housingEdge, new THREE.Vector3(0, 0.48, -0.75));
  addMesh(alongZ(0.36, 0.35, 0.1), trim, new THREE.Vector3(0, 0.48, 0.64));
  addMesh(
    new RoundedBoxGeometry(0.92, 0.07, 1.52, 5, 0.035),
    housingEdge,
    new THREE.Vector3(0, 0.87, -0.02),
  );
  addMesh(
    new RoundedBoxGeometry(0.86, 0.035, 0.44, 4, 0.02),
    rubber,
    new THREE.Vector3(0, 0.905, 0.58),
  );

  // Recessed lens, concentric bezel, and visible infrared illuminator ring.
  const lens = new THREE.Group();
  lens.position.set(0, 0.48, 0.72);
  body.add(lens);
  addMesh(alongZ(0.31, 0.31, 0.08), rubber, new THREE.Vector3(0, 0, 0), lens);
  addMesh(alongZ(0.265, 0.265, 0.08), trim, new THREE.Vector3(0, 0, 0.055), lens);
  addMesh(alongZ(0.225, 0.225, 0.045), housingEdge, new THREE.Vector3(0, 0, 0.11), lens);
  addMesh(alongZ(0.19, 0.19, 0.025), lensGlass, new THREE.Vector3(0, 0, 0.14), lens);

  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    addMesh(
      new THREE.SphereGeometry(0.022, 12, 8),
      infrared,
      new THREE.Vector3(Math.cos(angle) * 0.273, Math.sin(angle) * 0.273, 0.12),
      lens,
    );
  }

  // Small weather seal detail and side ventilation ridges.
  addMesh(
    new THREE.TorusGeometry(0.32, 0.012, 10, 64),
    housingEdge,
    new THREE.Vector3(0, 0, -0.05),
    lens,
  );
  for (let index = 0; index < 5; index += 1) {
    addMesh(
      new THREE.BoxGeometry(0.018, 0.1, 0.035),
      housingEdge,
      new THREE.Vector3(0.405, 0.48, -0.38 + index * 0.12),
    );
  }

  const statusLed = addMesh(
    new THREE.SphereGeometry(0.035, 20, 16),
    statusLedMaterial,
    new THREE.Vector3(0.4, 0.7, 0.84),
  );
  const statusLight = new THREE.PointLight('#ff2020', 0, 0.8);
  statusLight.position.set(0.4, 0.7, 0.91);
  body.add(statusLight);

  camera.scale.setScalar(1.42);
  pivot.rotation.y = 0.1;
  pivot.rotation.x = 0.06;

  return { model: camera, pivot, statusLed, statusLedMaterial, statusLight };
}

export const ThreeCameraViewer: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const cameraModelRef = useRef<CameraModel | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const pivotTargetRef = useRef({ x: 0.1, y: 0.06 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(2.35, 1.45, 4);
    camera.lookAt(0, 0.35, 0);
    camera.fov = 30;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.className = 'absolute inset-0 h-full w-full touch-none';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight('#d8efff', '#10151e', 2.6));
    const keyLight = new THREE.DirectionalLight('#ffffff', 4);
    keyLight.position.set(3.5, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const frontLight = new THREE.PointLight('#e4f7ff', 54, 10);
    frontLight.position.set(1.2, 1.4, 4);
    scene.add(frontLight);

    const rimLight = new THREE.PointLight('#35c9ee', 36, 8);
    rimLight.position.set(-3, 1.8, -1);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight('#b5caff', 18, 8);
    fillLight.position.set(2, -1, 3);
    scene.add(fillLight);

    const cameraModel = createCameraModel();
    cameraModelRef.current = cameraModel;
    scene.add(cameraModel.model);

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(host);

    let frameId = 0;
    let previousFrame = performance.now();
    let previousLedState: boolean | null = null;
    const render = () => {
      const now = performance.now();
      const delta = Math.min((now - previousFrame) / 1000, 0.05);
      previousFrame = now;
      const damping = reducedMotion ? 1 : 7;
      cameraModel.pivot.rotation.y = THREE.MathUtils.damp(
        cameraModel.pivot.rotation.y,
        pivotTargetRef.current.x,
        damping,
        delta,
      );
      cameraModel.pivot.rotation.x = THREE.MathUtils.damp(
        cameraModel.pivot.rotation.x,
        pivotTargetRef.current.y,
        damping,
        delta,
      );
      const ledOn = Math.floor(now / 450) % 2 === 0;
      if (ledOn !== previousLedState) {
        cameraModel.statusLedMaterial.color.set(ledOn ? '#ff3434' : '#301013');
        cameraModel.statusLedMaterial.emissiveIntensity = ledOn ? 4 : 0;
        cameraModel.statusLight.intensity = ledOn ? 10 : 0;
        previousLedState = ledOn;
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      cameraModelRef.current = null;
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = THREE.MathUtils.clamp(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -1,
      1,
    );
    const vertical = THREE.MathUtils.clamp(
      ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
      -1,
      1,
    );
    pivotTargetRef.current = {
      x: 0.1 + horizontal * 0.58,
      y: THREE.MathUtils.clamp(0.06 + vertical * 0.34, -0.28, 0.4),
    };
  };

  const handlePointerLeave = () => {
    pivotTargetRef.current = { x: 0.1, y: 0.06 };
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const cameraModel = cameraModelRef.current;
    if (!cameraModel) return;
    const step = 0.12;
    switch (event.key) {
      case 'ArrowLeft':
        pivotTargetRef.current.x = THREE.MathUtils.clamp(pivotTargetRef.current.x - step, -0.48, 0.68);
        break;
      case 'ArrowRight':
        pivotTargetRef.current.x = THREE.MathUtils.clamp(pivotTargetRef.current.x + step, -0.48, 0.68);
        break;
      case 'ArrowUp':
        pivotTargetRef.current.y = THREE.MathUtils.clamp(pivotTargetRef.current.y - step, -0.28, 0.4);
        break;
      case 'ArrowDown':
        pivotTargetRef.current.y = THREE.MathUtils.clamp(pivotTargetRef.current.y + step, -0.28, 0.4);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <div
      ref={hostRef}
      role="group"
      aria-label={
        webglUnavailable
          ? '3D camera preview is unavailable in this browser.'
          : 'Interactive 3D CCTV camera. Its lens follows your cursor; use arrow keys to aim.'
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      tabIndex={webglUnavailable ? -1 : 0}
      className="relative h-[420px] w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4cd7f6] sm:h-[520px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_48%,rgba(76,215,246,0.11),transparent_58%)]" />
      {webglUnavailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-[#bcc9cd]">
          <span className="material-symbols-outlined text-6xl text-[#4cd7f6]">videocam</span>
          <span className="text-sm">3D camera preview is unavailable in this browser.</span>
        </div>
      )}
      <span className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-[#bcc9cd]">
        Move your cursor to guide the camera’s focus
      </span>
    </div>
  );
};
