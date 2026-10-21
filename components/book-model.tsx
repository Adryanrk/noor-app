"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BookModelProps {
  isOpen: boolean;
}

// "Quran 3D Free" by Muhammed Reca Mermutluoğlu (sketchfab.com/3d-models/
// quran-3d-free-63021dc03fa0409ca8392b1eddfcbf18), CC-BY-4.0 — credited in
// the page footer. Computed its real bounding box by hand from the GLB's
// own accessor data before touching this file (couldn't render it to
// measure visually): the asset's two meshes, once all its baked FBX→glTF
// node transforms are composed, occupy X≈0.165 / Y≈0.029 / Z≈0.236 world
// units, centered within a millimeter of the origin already. That's the
// SAME "thin in Y" convention this file's own procedural geometry already
// uses (X=width, Y=thickness, Z=height-when-lying-flat) — convenient, since
// it means the model can share the exact same tiltX rotation as everything
// else here with no extra axis remapping, just a uniform scale to bring its
// ~0.236 height up to this scene's ~2.64 unit book height.
//
// Bumped up twice from the original 11.19 (asked for bigger both
// rounds), landing on 15 — see point 1 in the function doc comment for
// why this was the only lever left on the closed book's realism after
// the yaw experiment backfired.
//
// Pulled back down to 12.5 this round. Point 8 below tried fixing
// "toppen försvinner ibland ränder" with a constant downward
// REPOSITION (CLOSED_VERTICAL_OFFSET, now removed) instead — that was
// the wrong lever: the camera always looks straight at the origin, so
// the model was already vertically centered in frame with essentially
// ZERO margin top or bottom at scale 15 (that's exactly why the tiny
// idle bob was enough to clip the top "ibland" — only on the frames
// where the bob pushed it a fraction over). Shifting the whole book
// down didn't add margin anywhere, it just moved that same zero-margin
// edge to the bottom instead — which is why the fix made the BOTTOM
// disappear outright rather than fixing anything. The only way to get
// real margin on both edges at once is to make the model itself take
// up less of the camera's fixed vertical FOV, so scale is the correct
// knob here, not position. 12.5 is a guess at "enough breathing room
// without reading as small" — still bigger than the original 11.19.
const CLOSED_MODEL_SCALE = 12.5;
// Was 0.28 (~16°) — reverted to 0. See point 1 below: this yaw, combined
// with the camera's own downward pitch (needed for the open book), was
// producing a keystoning effect — verticals reading as leaning/crooked
// even though nothing was actually sheared. Left as a named constant
// (rather than deleted outright) in case a much smaller value is worth
// trying later once the keystoning is verified gone at 0.
const CLOSED_MODEL_YAW = 0;
useGLTF.preload("/models/quran-closed.glb");

// "Book" by Pixel (sketchfab.com/3d-models/book-48a029617a0646ea996b16e26e243606),
// CC-BY-4.0 — credited in the page footer alongside the closed-book model.
// Same measure-by-hand approach as above: this asset is a SINGLE mesh, one
// baked JPEG material, already modeled as a complete open spread (fanned
// pages + cover, no separate moving parts) rather than a rigged book — which
// is exactly what's needed for the hard-swap design below, and also means
// there's no "inside of the book" to see: the texture is whatever generic
// page/cover look is baked into that one JPEG, never Quran text.
//
// Its composed world-space bounding box: X≈103.07 / Y≈12.58 / Z≈70.88 local
// units, center at (0, 4.59, −0.72) — NOT sitting on the origin like the
// closed model was, so this one needs a recentering offset as well as a
// scale. It uses the exact same axis convention as everything else here
// (X=width, Y=thickness/fan-height, Z=depth) and is already left-right
// symmetric about X=0 (the spine sits dead-center), which is what lets the
// whole mesh just be dropped in as one static block with no per-wing
// positioning math. Scaled so its Z axis also lands on this scene's ~2.64
// unit convention — the same page-height number the closed model and the
// old procedural wings both targeted, so all three stay physically
// consistent in scale.
const OPEN_MODEL_SCALE = 0.03725;
const OPEN_MODEL_OFFSET: [number, number, number] = [0, -0.171, 0.027];
// Was -1.0 rad (~-57°, bowl-shaped), then -0.35 rad (~-20°, still
// "lutad uppåt"), then -0.18 rad — at THAT value, no blank-page
// complaint came back, only "still a little tilted up." Pushed once
// more to -0.08 rad to flatten it further, and that's exactly where the
// predicted trade-off from the comment above caught up: blank pages
// became visible again. Pulling back to -0.14 rad — partway back toward
// the -0.18 that was known-safe on the blank-pages front, rather than
// fully reverting, since the tilt complaint was real too. This is a
// compromise guess, not a verified value: hiding the blank pages is the
// hard requirement from day one of this feature, the flatness is a
// softer preference, so if -0.14 still shows any blank page, the next
// move should be back toward -0.18 (or further, not toward 0), not
// another cut in the same direction.
const OPEN_MODEL_ROTATION: [number, number, number] = [-0.14, 0, 0];
useGLTF.preload("/models/book-open.glb");

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * A procedural 3D book, floating gently rather than resting on a table
 * (matching the actual scene — it hangs in front of the sky/sea
 * background, there's no implied surface under it).
 *
 * History of confirmed-by-standalone-renderer fixes (I can't preview
 * this canvas directly, so every geometry change here was verified in
 * a hand-built vanilla-JS renderer before being ported in):
 *
 * 1. `tiltRef.rotation.y` was left set to a small constant (0.08) on
 *    the SAME object as the big standing/lying `rotation.x`. Once
 *    rotation.x is close to 90°, even a small rotation.y on that same
 *    object stops behaving like a turntable turn and starts behaving
 *    like a shear/roll — that's what was bending the cover into a
 *    rhombus. Removed entirely; this object's rotation.y is never set.
 *
 *    Later, viewing the closed book dead-on (no yaw at all) turned out
 *    to have its own problem: with no visible spine edge and no
 *    perspective foreshortening, it read as a flat image pasted onto a
 *    card rather than a solid object ("ser lite inklistrad ut"). Tried
 *    fixing it with a fixed yaw (CLOSED_MODEL_YAW), kept on a SEPARATE,
 *    outer, never-animated group wrapping closedRef so it couldn't
 *    recreate the shear above — and that part worked, no shear. But it
 *    introduced a DIFFERENT problem: the camera is pitched down (needed
 *    for the open book, see book-scene.tsx), and a pitched camera
 *    combined with a yawed, tall, upright object produces keystoning —
 *    the same effect that makes tall buildings look like they're
 *    leaning in architecture photos shot at an angle. Nothing was
 *    actually sheared, but it read exactly like "the book is sideways."
 *    CLOSED_MODEL_YAW is back to 0 — but the book STILL read as
 *    crooked after that change, because the idle sway (spinRef's
 *    rotation.y, meant to read as "solid, not a still image") is ALSO a
 *    yaw on this same tall, upright object under the same pitched
 *    camera. It's animated rather than static, but a single screenshot
 *    just catches whatever phase it happened to be in — same keystoning
 *    mechanism, just intermittent instead of constant. The sway is now
 *    removed entirely rather than just shrunk; the sense of volume
 *    comes from driftRef's position bob (plain position, no rotation at
 *    all, so nothing for the pitched camera to keystone) and the
 *    contact shadow alone. A non-rotational "alive" cue (e.g. a subtle
 *    scale breathe) is a reasonable thing to try later if this now
 *    reads as too static, but isn't worth the keystoning risk a third
 *    time without seeing this round's result first.
 *
 * 2. The camera was framing the book by its base, but the book's own
 *    vertical center is above that — cropping the top. Fixed by
 *    centering the book on the origin in both states and framing the
 *    camera to match (see book-scene.tsx).
 *
 * 3. (Historical — superseded by point 7 below.) The "open" state used
 *    to be procedural pages with only the cover flapping over, and the
 *    whole assembly recentered itself via `tiltRef.position.x` as the
 *    cover swung around its hinge. That math is gone now that the open
 *    state is a single pre-built, already-symmetric mesh — see point 7.
 *
 * 4. (Historical — superseded by point 7 below.) The procedural spine
 *    used to need its own shrink animation so it didn't stand up like a
 *    wall once the book went flat. There's no separate spine piece
 *    anymore; the new open-book mesh already models its own gutter.
 *
 * 5. Two purely cosmetic additions, both isolated from the tilt/cover
 *    rotation math so they can't reintroduce the earlier shear bug: a
 *    slow, tiny idle rotation.y on its own OUTER group (spinRef, parent
 *    of everything else) so the closed book isn't perfectly static — a
 *    little parallax over time reads as "real volume" much more than a
 *    still image does — and slightly glossier cover materials (a touch
 *    of roughness/metalness instead of flat matte) so it picks up a
 *    highlight instead of looking uniformly flat-lit.
 *
 * 6. The closed state is the real "Quran 3D Free" model (see the
 *    constant above) instead of procedural boxes — a proper modeled
 *    asset with real bevels reads as "a real book" in a way flat
 *    BoxGeometry just can't. It can't open itself (it's a static mesh,
 *    not rigged), so it only ever shows the closed pose: it and the
 *    open-book model below are TWO SEPARATE objects, and which one is
 *    visible is a hard swap at the halfway point of the cover's swing
 *    (coverP crossing 0.5) rather than a cross-fade — no material
 *    opacity juggling, just one boolean flip. The swap is masked by a
 *    brief flash timed in page.tsx around that same moment, so it reads
 *    as "the light catches the page as it turns" rather than a visible
 *    pop. Both objects share the exact same tiltX rotation so they tilt
 *    in lockstep right up to the moment one replaces the other.
 *
 * 7. The open state is now also a real modeled asset (see the "Book" by
 *    Pixel constant above) instead of procedural boxes — picked
 *    specifically because it's a single complete mesh (fanned pages +
 *    cover already modeled as one open spread) with nothing of the
 *    inside visible, matching "man ska inte se själva innehållet, bara
 *    sidor... och att det är jämt." Because it's a finished, symmetric
 *    mesh rather than a hinged cover wing, the old recentering-shift
 *    math (point 3) and spine-shrink math (point 4) are both gone —
 *    there's nothing left that moves asymmetrically, so the group just
 *    sits still at local origin and only inherits the shared tiltX.
 *    UNVERIFIED: this model's own rest orientation, not a pose I asked
 *    for — the reference screenshot was the user's own camera angle in
 *    Sketchfab's viewer, not how the mesh actually sits by default.
 *    OPEN_MODEL_ROTATION above is a first real guess now (tipped back
 *    on its local X axis) rather than identity, reasoned from its
 *    bounding box reading as "lying flat, viewed from above" by default
 *    — which is exactly the angle that was exposing the blank spread —
 *    but still just a guess, and will very likely need tuning (possibly
 *    even the sign) once there's a real screenshot of it in the scene.
 *    UPDATE: round 5 feedback said still "lite lutad uppåt" at -0.18
 *    rad — cut it roughly in half, to -0.08 rad. Round 6 feedback
 *    confirmed the predicted trade-off actually hit: the blank pages
 *    were visible again at -0.08. Settled on -0.14 rad, partway back
 *    toward the known-safe -0.18 rather than a full revert — see point
 *    9 below.
 *
 * 8. Round 5 feedback, two fixes to the closed book's standing pose:
 *    - "Lite framåtlutad" (slightly leaning forward). tiltX's standing
 *      target was 1.5 rad (~85.9°) — a deliberate few degrees short of
 *      fully upright from an earlier round, matching a reference photo.
 *      Nudged to 1.56 rad (~89.4°), closer to dead vertical, to back
 *      that lean off without touching yaw (still a pure rotation.x
 *      change, no keystoning risk).
 *    - "Ibland försvinner typ toppen av boken" (the top sometimes
 *      disappears) — first attempt was a constant downward REPOSITION
 *      of the closed book. Wrong fix, see point 9.
 *
 * 9. Round 6 feedback: the point-8 reposition fix made the BOTTOM of
 *    the standing book disappear instead — worse, and constant rather
 *    than intermittent. Root cause: the camera always looks straight at
 *    the origin (CameraRig, book-scene.tsx), so the book was already
 *    perfectly vertically centered in frame with essentially ZERO
 *    margin top or bottom at CLOSED_MODEL_SCALE=15 — that's exactly why
 *    the tiny idle bob (driftRef, ±0.035 units) was enough to clip the
 *    top only "ibland" (whichever frames the bob happened to be
 *    positive on). Shifting the whole book down didn't add margin
 *    anywhere, it just relocated that same zero-margin edge to the
 *    bottom — hence a worse, now-constant clip there. Reverted the
 *    reposition entirely and shrank CLOSED_MODEL_SCALE (15 → 12.5)
 *    instead, which is the only change that actually creates margin on
 *    BOTH edges at once, since it reduces how much of the camera's
 *    fixed vertical FOV the model occupies in the first place.
 */
export function BookModel({ isOpen }: BookModelProps) {
  const spinRef = useRef<THREE.Group>(null);
  const driftRef = useRef<THREE.Group>(null);
  const closedRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const { scene: closedBookScene } = useGLTF("/models/quran-closed.glb");
  const { scene: openBookScene } = useGLTF("/models/book-open.glb");

  useFrame((state, delta) => {
    const target = isOpen ? 1 : 0;
    progressRef.current += (target - progressRef.current) * Math.min(delta * 1.8, 1);
    const p = easeInOutCubic(progressRef.current);
    const idle = 1 - progressRef.current;

    // Drives the hard swap between the closed GLB and the open GLB —
    // see point 6/7 above. Nothing else depends on this now; the old
    // cover-hinge angle and recentering shift it used to also drive are
    // gone along with the procedural cover wing.
    const coverP = THREE.MathUtils.clamp((progressRef.current - 0.35) / 0.5, 0, 1);

    // spinRef intentionally does nothing here now — see point 1 above.
    // Its rotation.y idle sway was removed entirely: it's a yaw on the
    // same tall, upright, pitched-camera-viewed object as the closed
    // book's cover, and it turned out to keystone exactly like the
    // static yaw did, just intermittently (whatever phase a screenshot
    // happened to catch). driftRef's position bob below is the only
    // idle motion left on the closed book.

    if (driftRef.current) {
      // The only other motion on the closed book: a tiny vertical drift.
      // No rotation at all on this group — nothing here to combine with
      // tiltRef's rotation.x, so there's nothing left that can shear.
      driftRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.035 * idle;
    }

    // Shared by both the GLB closed-book group and the GLB open-book
    // group, so they tilt in exact lockstep right up to the moment one
    // swaps for the other — see point 6/7 above.
    const tiltX = THREE.MathUtils.lerp(1.56, 0, p);
    const wingsVisible = coverP >= 0.5;

    if (closedRef.current) {
      closedRef.current.rotation.x = tiltX;
      // Hard swap, not a fade — see point 6 above for why.
      closedRef.current.visible = !wingsVisible;
    }

    if (tiltRef.current) {
      // ~86° = standing upright, straight-on, matching the reference
      // photo when closed. 0 = fully flat when open. This is the ONLY
      // rotation axis set on this object — no rotation.y here, ever.
      tiltRef.current.rotation.x = tiltX;
      // Hard swap, not a fade — see point 6/7 above for why.
      tiltRef.current.visible = wingsVisible;
    }
  });

  return (
    <group ref={spinRef}>
      <group ref={driftRef}>
        {/* Fixed yaw, isolated on its own outer group — see point 1
            above. Never touched in useFrame; only the inner closedRef
            group's rotation.x animates. */}
        <group rotation={[0, CLOSED_MODEL_YAW, 0]}>
          {/* The real modeled closed book. Rotation.y left at 0 as a
              first guess for which way the cover art faces — I can't
              render this GLB myself to check, so if it loads backwards
              (showing the blank papers side instead of the cover)
              that's the one line to flip to Math.PI. */}
          <group ref={closedRef} scale={CLOSED_MODEL_SCALE} rotation={[0, 0, 0]}>
            <primitive object={closedBookScene} />
          </group>
        </group>

        {/* The real modeled open book — see point 7 above. Position
            recenters its off-origin mesh to local (0,0,0) so it tilts
            about its own middle; rotation is an unverified first guess
            for its rest pose (see point 7 above). */}
        <group ref={tiltRef}>
          <group scale={OPEN_MODEL_SCALE} position={OPEN_MODEL_OFFSET} rotation={OPEN_MODEL_ROTATION}>
            <primitive object={openBookScene} />
          </group>
        </group>
      </group>
    </group>
  );
}
