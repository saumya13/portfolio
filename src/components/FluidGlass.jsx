'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, Preload, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { easing } from 'maath';

// Trimmed from the React Bits original: lens mode only (with an `overlay` option that draws just the lens), one line of type instead of the scrolling gallery, and an
// `active` flag so the canvas stops rendering while it is hidden.
export default function FluidGlass({
  text = 'Saumya',
  font,
  lensProps = {},
  fontSize,
  letterSpacing = -0.05,
  backgroundColor,
  textColor = '#ffffff',
  overlay = false,
  active = true
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ backgroundColor: overlay ? 'transparent' : (backgroundColor ?? 'transparent') }}
    >
      <Lens modeProps={lensProps} backgroundColor={backgroundColor} overlay={overlay}>
        <Typography text={text} font={font} fontSize={fontSize} letterSpacing={letterSpacing} textColor={textColor} />
        <Preload />
      </Lens>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  backgroundColor,
  overlay = false,
  ...props
}) {
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(
        <>
          {backgroundColor && (
            <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
              <planeGeometry />
              <meshBasicMaterial color={backgroundColor} toneMapped={false} />
            </mesh>
          )}
          {children}
        </>,
        scene
      )}
      {/* In overlay mode only the lens is drawn: everything outside it is left to the page underneath. */}
      {!overlay && (
        <mesh scale={[vp.width, vp.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
        </mesh>
      )}
      <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry} {...props}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Typography({ text, font, fontSize: fixedSize, letterSpacing, textColor }) {
  const DEVICE = {
    mobile: { fontSize: 0.8 },
    tablet: { fontSize: 0.8 },
    desktop: { fontSize: 0.8 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fontSize = fixedSize ?? DEVICE[device].fontSize;

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.15}
      font={font}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}
