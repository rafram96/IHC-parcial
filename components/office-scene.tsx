"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function OfficeScene({
  close,
  reduced,
  visitors,
}: {
  close: boolean;
  reduced: boolean;
  visitors: "neighbors" | "notary" | "none";
}) {
  const host = useRef<HTMLDivElement>(null);
  const target = useRef({ close, reduced });

  useEffect(() => {
    target.current = { close, reduced };
  }, [close, reduced]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      element.dataset.failed = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor("#c6c1af");
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#c6c1af", 12, 30);
    const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 50);
    camera.position.set(0, 2.5, 5.5);
    const look = new THREE.Vector3(0, 1.25, -0.8);
    const materials: THREE.Material[] = [];
    const mat = (color: string, roughness = 0.9) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness });
      materials.push(m);
      return m;
    };
    const plaster = mat("#e3ddc8"),
      wood = mat("#79563c"),
      edge = mat("#493c2e"),
      olive = mat("#69745c"),
      paper = mat("#eee8d3");
    function box(
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      material: THREE.Material,
      group: THREE.Object3D = scene,
    ) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }
    scene.add(new THREE.HemisphereLight("#fff6dc", "#696b56", 2.6));
    const sun = new THREE.DirectionalLight("#ffedc2", 4);
    sun.position.set(-4, 7, 1);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    box(16, 0.15, 17, 0, -0.08, 0, mat("#a6967a"));
    box(13, 6, 0.2, 0, 2.8, -5, plaster);
    box(0.2, 6, 12, 6, 2.8, 0, plaster);
    box(0.2, 6, 12, -6, 2.8, 0, plaster);
    box(13, 0.28, 0.3, 0, 0.22, -4.8, wood);
    // Window and layered mountain silhouettes, modeled locally (no external assets).
    box(3.6, 2.7, 0.18, -3.5, 3, -4.82, edge);
    box(3.3, 2.4, 0.2, -3.5, 3, -4.69, mat("#b8cbd0"));
    for (let i = 0; i < 6; i++) {
      const peak = new THREE.Mesh(
        new THREE.ConeGeometry(0.8 + i * 0.06, 1.4 + (i % 3) * 0.3, 4),
        mat(i % 2 ? "#8e9a83" : "#728776"),
      );
      peak.position.set(-4.65 + i * 0.45, 2.6, -4.48 + i * 0.02);
      peak.scale.z = 0.15;
      scene.add(peak);
    }
    box(0.1, 2.6, 0.2, -3.5, 3, -4.2, wood);
    box(3.5, 0.1, 0.2, -3.5, 3, -4.2, wood);
    box(3.8, 0.12, 0.65, -3.5, 1.63, -4.3, wood);
    // Shelves, folders, framed sign, clock.
    box(2.3, 2.6, 0.55, 3.85, 1.3, -4.5, edge);
    for (let level = 0; level < 3; level++) {
      box(2.4, 0.09, 0.7, 3.85, 0.3 + level * 0.9, -4.35, wood);
      for (let i = 0; i < 7; i++)
        box(
          0.16,
          0.58 + (i % 2) * 0.13,
          0.38,
          2.95 + i * 0.26,
          0.65 + level * 0.9,
          -4.2,
          mat(["#b39168", "#737c68", "#b6ac91"][i % 3]),
        );
    }
    box(2.2, 1, 0.1, 0.1, 3.5, -4.8, wood);
    box(2.05, 0.84, 0.12, 0.1, 3.5, -4.72, paper);
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#eee8d3";
    ctx.fillRect(0, 0, 640, 256);
    ctx.fillStyle = "#425544";
    ctx.textAlign = "center";
    ctx.font = "32px Georgia";
    ctx.fillText("JUZGADO DE PAZ", 320, 115);
    ctx.font = "20px sans-serif";
    ctx.fillText("COMUNIDAD DE SANTA ROSA", 320, 165);
    const texture = new THREE.CanvasTexture(canvas);
    const signMat = new THREE.MeshBasicMaterial({ map: texture });
    materials.push(signMat);
    box(2, 0.8, 0.01, 0.1, 3.5, -4.64, signMat);
    const clock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.07, 40),
      paper,
    );
    clock.rotation.x = Math.PI / 2;
    clock.position.set(2, 3.65, -4.75);
    scene.add(clock);
    box(0.025, 0.23, 0.04, 2, 3.74, -4.68, edge);
    box(0.19, 0.025, 0.04, 2.08, 3.65, -4.68, edge);
    // The desk in the foreground, with a powered-on tablet.
    box(6.5, 0.2, 3.4, 0, 0.95, 2.7, wood);
    for (let i = 0; i < 12; i++)
      box(
        6.48,
        0.006,
        0.014,
        0,
        1.055,
        1.05 + i * 0.28,
        mat(i % 2 ? "#725039" : "#876044"),
      );
    box(1.3, 0.07, 0.9, -2.05, 1.1, 2.2, olive);
    box(1.23, 0.045, 0.83, -2.05, 1.15, 2.2, paper);
    const pen = box(0.035, 0.035, 0.65, -1.3, 1.1, 2.55, edge);
    pen.rotation.y = -0.3;
    const tablet = new THREE.Group();
    tablet.position.set(0.15, 1.14, 2.5);
    tablet.rotation.x = -0.14;
    scene.add(tablet);
    box(2.05, 0.085, 1.43, 0, 0, 0, mat("#252d2a"), tablet);
    box(1.87, 0.009, 1.24, 0, 0.049, 0, mat("#c0cbbb"), tablet);
    box(0.55, 0.014, 0.4, 0, 0.059, 0, olive, tablet);
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.15, 0.34, 24),
      mat("#d3c5a7"),
    );
    cup.position.set(2.35, 1.23, 2.15);
    scene.add(cup);
    // Simple, respectful stylized figures in ordinary clothing.
    function person(x: number, shirt: string, skirt: boolean) {
      const group = new THREE.Group();
      group.position.set(x, 0, -0.6);
      scene.add(group);
      const skin = mat("#aa7959"),
        clothing = mat(shirt),
        hair = mat("#302e29"),
        pants = mat("#454a44");
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.29, 0.35, 0.72, 12),
        clothing,
      );
      torso.position.y = 1.37;
      group.add(torso);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.235, 20, 16),
        skin,
      );
      head.position.y = 2.02;
      head.scale.y = 1.16;
      group.add(head);
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.243,
          20,
          12,
          0,
          Math.PI * 2,
          0,
          Math.PI * 0.49,
        ),
        hair,
      );
      cap.position.y = 2.06;
      group.add(cap);
      for (const side of [-1, 1]) {
        const arm = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.095, 0.6, 5, 10),
          clothing,
        );
        arm.position.set(side * 0.37, 1.31, 0.01);
        arm.rotation.z = side * 0.12;
        group.add(arm);
        const hand = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          skin,
        );
        hand.position.set(side * 0.41, 0.96, 0.02);
        group.add(hand);
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.11, 0.85, 10),
          pants,
        );
        leg.position.set(side * 0.17, 0.48, 0);
        group.add(leg);
        box(0.22, 0.12, 0.37, side * 0.17, 0.1, 0.08, hair, group);
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), hair);
        eye.position.set(side * 0.085, 2.04, 0.214);
        group.add(eye);
      }
      if (skirt) {
        const skirtMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.33, 0.45, 0.62, 14),
          clothing,
        );
        skirtMesh.position.y = 0.87;
        group.add(skirtMesh);
      }
      return group;
    }
    if (visitors === "neighbors") {
      person(-0.85, "#a58a6f", false);
      person(0.9, "#637e78", true);
    }
    if (visitors === "notary") person(0.3, "#966d59", true);
    const resize = () => {
      renderer.setSize(element.clientWidth, element.clientHeight);
      camera.aspect = element.clientWidth / element.clientHeight;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    let frame = 0;
    const animate = () => {
      const desired = target.current.close
        ? new THREE.Vector3(0.1, 2.6, 4.25)
        : new THREE.Vector3(0, 2.5, 5.5);
      camera.position.lerp(desired, target.current.reduced ? 1 : 0.055);
      look.lerp(
        target.current.close
          ? new THREE.Vector3(0.1, 1, 2)
          : new THREE.Vector3(0, 1.55, -1.5),
        target.current.reduced ? 1 : 0.055,
      );
      camera.lookAt(look);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [visitors]);
  return (
    <div
      ref={host}
      className="office-scene"
      aria-label="Oficina 3D del juzgado de paz: escritorio, tableta y visitantes"
    >
      {
        <div className="scene-fallback">
          Juzgado de paz · Santa Rosa
          <br />
          La vista 3D no está disponible. Puedes abrir la tableta y completar
          toda la jornada.
        </div>
      }
    </div>
  );
}
