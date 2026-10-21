"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { BookModel } from "@/components/book-model";

interface BookSceneProps {
  isOpen: boolean;
  onOpen: () => void;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Forces the camera's position and aim every frame instead of trusting
 * the Canvas `camera` prop's default behavior — I have no way to
 * preview this canvas directly, so rather than assume whether R3F's
 * default camera auto-aims at the origin, this makes it true outright,
 * every frame, regardless.
 *
 * Used to be a single fixed position for both states: [0, 2.0, 8.0],
 * pitched down just enough (~14°) that the CLOSED book's top edge
 * reads as a solid 3-D object instead of a flat sticker, while still
 * close to the reference photo's straight-on look. That part still
 * works and is unchanged for the closed pose.
 *
 * But that same fixed pitch turned out to be the real reason the OPEN
 * book kept reading as "tomma sidor" no matter what OPEN_MODEL_ROTATION
 * in book-model.tsx was set to (tried -1.0 down to -0.08 rad across
 * many rounds) — rotating the book itself only changes how bowl-shaped
 * vs. flat the spread looks, not how much of the pages' blank top
 * surface is facing a camera that's still looking at it from roughly
 * the same angle every time. The pages have no printed content baked
 * into their material at all (see the "Book" model's own comment in
 * book-model.tsx) — hiding them was never going to be a rotation
 * problem, it needed a camera that looks across the open spread rather
 * than down onto it.
 *
 * So the camera now eases to a SEPARATE, flatter target position when
 * the book is open — lower (less height above the book) and a touch
 * further back, using the exact same progress/easing shape BookModel
 * uses for the book's own tilt (duplicated here rather than shared
 * state, so this stays a self-contained, independently-reasoned-about
 * rig like everything else in this file). CLOSED_CAMERA_POS is the
 * untouched, known-good value; OPEN_CAMERA_POS is a first guess at
 * "shallow enough to show spine/edge more than page tops" — I can't
 * render this to confirm the exact angle, so treat the open-state
 * numbers as the ones most likely to need a follow-up tweak, same as
 * every other blind guess in this project.
 */
const CLOSED_CAMERA_POS: [number, number, number] = [0, 2.0, 8.0];
const OPEN_CAMERA_POS: [number, number, number] = [0, 0.6, 8.6];

function CameraRig({ isOpen }: { isOpen: boolean }) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  useFrame((_state, delta) => {
    const target = isOpen ? 1 : 0;
    progressRef.current += (target - progressRef.current) * Math.min(delta * 1.8, 1);
    const p = easeInOutCubic(progressRef.current);
    camera.position.set(
      CLOSED_CAMERA_POS[0] + (OPEN_CAMERA_POS[0] - CLOSED_CAMERA_POS[0]) * p,
      CLOSED_CAMERA_POS[1] + (OPEN_CAMERA_POS[1] - CLOSED_CAMERA_POS[1]) * p,
      CLOSED_CAMERA_POS[2] + (OPEN_CAMERA_POS[2] - CLOSED_CAMERA_POS[2]) * p,
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * The WebGL canvas holding the 3D book. Click-to-open is handled by an
 * invisible HTML button laid over the canvas by the caller (simpler and
 * more reliable than wiring pointer events through Three.js), so this
 * component only renders the scene itself.
 */
export function BookScene({ isOpen }: BookSceneProps) {
  return (
    <Canvas
      camera={{ position: CLOSED_CAMERA_POS, fov: 24 }}
      dpr={[1, 2]}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.3} />
      <pointLight position={[-2, 1.2, 2]} intensity={0.6} color="#c9a24b" />
      {/* Rim/back light — bumped up a bit so the cover picks up a visible
          highlight along its edge instead of being flat-lit all over,
          one of the cues that was making the closed book read as a flat
          image rather than a solid object. */}
      <pointLight position={[2, 0.6, -1.5]} intensity={0.4} color="#5b93ab" />
      <CameraRig isOpen={isOpen} />
      <Suspense fallback={null}>
        <BookModel isOpen={isOpen} />
      </Suspense>
      {/* A soft grounding shadow under the (still floating — this isn't
          "resting on a table") book. Without any shadow at all it reads
          as pasted onto the background rather than a solid object
          hanging in space; this gives it a contact point for the eye
          without implying an actual visible surface. Sized/placed under
          the closed, standing book, which is the state this mattered
          most for. Opacity bumped from 0.5 and blur tightened a touch —
          part of the "ser inklistrad ut" fix (point 1): a shadow that's
          too soft/faint to really notice doesn't do its job of anchoring
          the book as a solid thing with a contact point, not a sticker
          floating with no relationship to anything below it. */}
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.68}
        scale={4.5}
        blur={2}
        far={2.5}
        color="#000000"
      />
    </Canvas>
  );
}
