import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Group,
  Vector3,
  Shape,
  Path,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  BoxGeometry,
  CatmullRomCurve3,
  TubeGeometry,
  SphereGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  PMREMGenerator,
  ACESFilmicToneMapping,
  DoubleSide,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function ribbonGeometry(curve, width) {
  const positions = [],
    indices = [];
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= 180; i++) {
    const p = curve.getPoint(i / 180),
      t = curve.getTangent(i / 180),
      side = new Vector3().crossVectors(t, up).normalize();
    for (const [direction, height] of [
      [-1, 0],
      [1, 0],
      [-1, -0.12],
      [1, -0.12],
    ]) {
      const point = p.clone().addScaledVector(side, width * direction);
      point.y += height;
      if (height < 0) point.y -= 0.14;
      positions.push(point.x, point.y, point.z);
    }
    if (i < 180) {
      const a = i * 4,
        b = (i + 1) * 4;
      indices.push(
        a,
        b,
        a + 1,
        a + 1,
        b,
        b + 1,
        a + 2,
        a + 3,
        b + 2,
        a + 3,
        b + 3,
        b + 2,
        a,
        a + 2,
        b,
        a + 2,
        b + 2,
        b,
        a + 1,
        b + 1,
        a + 3,
        a + 3,
        b + 1,
        b + 3,
      );
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createScene(element, { paused = false } = {}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x101110, 0);
  const scene = new Scene(),
    camera = new PerspectiveCamera(38, 1, 0.1, 100),
    group = new Group();
  scene.add(group);
  const pmrem = new PMREMGenerator(renderer),
    room = new RoomEnvironment(),
    environment = pmrem.fromScene(room, 0.05);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const red = new MeshStandardMaterial({
    color: 0xad1908,
    metalness: 0.12,
    roughness: 0.44,
    side: DoubleSide,
  });
  const steel = new MeshStandardMaterial({
    color: 0xa1a69e,
    metalness: 1,
    roughness: 0.3,
    envMapIntensity: 1.3,
  });
  const light = new MeshBasicMaterial({ color: 0xff5d3d });
  const dots = [];
  const kind = element.dataset.scene;
  if (kind === "signal") {
    camera.position.set(0, 1.3, 11);
    camera.lookAt(0, 0, 0);
    const shape = new Shape();
    shape.moveTo(-0.75, -1.35);
    shape.lineTo(0.75, -1.35);
    shape.lineTo(0.75, 1.35);
    shape.lineTo(-0.75, 1.35);
    shape.closePath();
    const hole = new Path();
    hole.moveTo(-0.45, -1);
    hole.lineTo(-0.45, 1);
    hole.lineTo(0.45, 1);
    hole.lineTo(0.45, -1);
    hole.closePath();
    shape.holes.push(hole);
    const aperture = new Mesh(
      new ExtrudeGeometry(shape, {
        depth: 0.32,
        bevelEnabled: true,
        bevelThickness: 0.045,
        bevelSize: 0.045,
        bevelSegments: 3,
        steps: 1,
      }),
      steel,
    );
    aperture.position.x = 1;
    aperture.rotation.y = -0.3;
    group.add(aperture);
    const platform = new Mesh(
      new BoxGeometry(16, 0.1, 2),
      new MeshStandardMaterial({
        color: 0x070806,
        metalness: 0.15,
        roughness: 0.65,
      }),
    );
    platform.position.set(0, -1.52, 0);
    group.add(platform);
    for (const y of [-1.16, 1.16])
      for (const x of [0.44, 1.56]) {
        const bolt = new Mesh(new SphereGeometry(0.045, 10, 8), steel);
        bolt.scale.z = 0.35;
        bolt.position.set(x, y, 0.36);
        group.add(bolt);
      }
    for (let lane = 0; lane < 5; lane++) {
      const points = [];
      for (let i = 0; i <= 70; i++) {
        const t = i / 70,
          x = -8 + t * 16;
        const distortion =
          x < 0.85 ? Math.pow(Math.max(0, (0.85 - x) / 8.85), 0.55) : 0;
        const y =
          (lane - 2) * 0.35 + Math.sin(t * 13 + lane * 0.9) * distortion * 0.85;
        const z = Math.cos(t * 10 + lane) * distortion * 0.45;
        points.push(new Vector3(x, y, z));
      }
      const curve = new CatmullRomCurve3(points);
      group.add(new Mesh(new TubeGeometry(curve, 130, 0.011, 5, false), light));
      const dot = new Mesh(
        new SphereGeometry(0.035, 8, 6),
        new MeshBasicMaterial({ color: 0xffe4d6 }),
      );
      group.add(dot);
      dots.push({ dot, curve, offset: lane / 5 });
    }
    group.rotation.y = -0.1;
  } else {
    camera.position.set(0, 5.5, 11);
    camera.lookAt(0, 0, -2);
    const curve = new CatmullRomCurve3([
      new Vector3(-11, -2, 4),
      new Vector3(-5, -1, 3),
      new Vector3(2, 0, 1),
      new Vector3(6, 0.1, -2),
      new Vector3(3, 0.5, -5),
      new Vector3(0, 1, -7),
      new Vector3(4, 1.4, -10),
      new Vector3(9, 2, -12),
    ]);
    group.add(new Mesh(ribbonGeometry(curve, 0.65), red));
    group.add(new Mesh(new TubeGeometry(curve, 180, 0.015, 5, false), light));
    const dot = new Mesh(
      new SphereGeometry(0.045, 8, 6),
      new MeshBasicMaterial({ color: 0xffdbc4 }),
    );
    group.add(dot);
    dots.push({ dot, curve, offset: 0 });
    group.position.set(0, -0.6, 0);
    group.rotation.z = -0.12;
  }
  element.append(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  let width = 0,
    height = 0,
    inView = false,
    raf = 0,
    previous = 0,
    elapsed = 0,
    lost = false;
  const pointer = { x: 0, y: 0 };
  function resize() {
    width = element.clientWidth;
    height = element.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width / height < 1.5 ? 48 : 38;
    camera.updateProjectionMatrix();
    render();
  }
  function render() {
    if (!lost && width && height) renderer.render(scene, camera);
  }
  function frame(now) {
    raf = 0;
    if (paused || !inView || document.hidden || lost) return;
    if (now - previous > 30) {
      elapsed += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      group.rotation.y +=
        ((kind === "signal" ? -0.23 : 0) +
          pointer.x * 0.09 -
          group.rotation.y) *
        0.04;
      group.rotation.x += (pointer.y * 0.03 - group.rotation.x) * 0.04;
      dots.forEach(({ dot, curve, offset }) =>
        dot.position.copy(curve.getPoint((elapsed * 0.07 + offset) % 1)),
      );
      render();
    }
    raf = requestAnimationFrame(frame);
  }
  function schedule() {
    if (!raf && !paused && inView && !document.hidden && !lost) {
      previous = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  const visibility = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      if (inView) schedule();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { threshold: 0.01 },
  );
  visibility.observe(element);
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(element);
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else schedule();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const onPointer = (event) => {
    const box = element.getBoundingClientRect();
    pointer.x = (event.clientX - box.left) / box.width - 0.5;
    pointer.y = (event.clientY - box.top) / box.height - 0.5;
  };
  element.addEventListener("pointermove", onPointer, { passive: true });
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    element.classList.remove("scene-loaded");
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    lost = false;
    render();
    element.classList.add("scene-loaded");
    schedule();
  });
  resize();
  element.classList.add("scene-loaded");
  return {
    setPaused(value) {
      paused = value;
      if (paused) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else schedule();
    },
    dispose() {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      element.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) {
          const mats = Array.isArray(object.material)
            ? object.material
            : [object.material];
          mats.forEach((material) => material.dispose());
        }
      });
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      element.classList.remove("scene-loaded");
    },
  };
}
