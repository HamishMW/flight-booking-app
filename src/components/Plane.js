import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { useViewportSize } from 'hooks';
import planeModel from 'assets/a320.glb';
import { clean } from 'utils/three';

export default function Plane({ canvasHeight, ...props }) {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const rendererRef = useRef();
  const animationFrameRef = useRef();
  const modelRef = useRef();
  const viewportSize = useViewportSize();
  const initViewportSize = useRef(viewportSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width } = initViewportSize;
    const loader = new GLTFLoader();

    rendererRef.current = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    cameraRef.current = new PerspectiveCamera(40, width / canvasHeight, 0.1, 800);
    cameraRef.current.position.z = 200;
    sceneRef.current = new Scene();
    rendererRef.current.setClearColor(0x000000, 0);
    rendererRef.current.setPixelRatio(2);
    rendererRef.current.gammaOutput = true;
    rendererRef.current.gammaFactor = 2.2;

    controlsRef.current = new OrbitControls(cameraRef.current, canvas);
    controlsRef.current.enableKeys = false;
    controlsRef.current.enablePan = false;
    controlsRef.current.enableZoom = false;
    controlsRef.current.enableDamping = true;
    controlsRef.current.enableRotate = true;
    controlsRef.current.autoRotate = true;
    controlsRef.current.autoRotateSpeed = -0.5;

    const ambientLight = new AmbientLight(0xFFFFFF, 0.8);
    const dirLight = new DirectionalLight(0xFFFFFF, 0.8);
    dirLight.position.set(30, 20, 32);
    sceneRef.current.add(ambientLight);
    sceneRef.current.add(dirLight);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    loader.load(planeModel, gltf => {
      const scale = 0.54;
      modelRef.current = gltf.scene;
      sceneRef.current.add(modelRef.current);
      modelRef.current.scale.x = scale;
      modelRef.current.scale.y = scale;
      modelRef.current.scale.z = scale;
      modelRef.current.rotation.y = 5.2;
      modelRef.current.position.x = 200;
      cameraRef.current.position.y = -120;
      gsap.to(modelRef.current.position, 2, { x: 0, ease: 'power2.out' });
      gsap.to(cameraRef.current.position, 2, { y: 65, ease: 'power2.out' });
      render();
    });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clean(sceneRef.current);
      rendererRef.current.dispose();
      sceneRef.current.dispose();
      cameraRef.current = null;
      rendererRef.current.domElement = null;
      rendererRef.current.forceContextLoss();
    };
  }, [canvasHeight]);

  useEffect(() => {
    const { width } = viewportSize;
    rendererRef.current.setSize(width, canvasHeight);
    cameraRef.current.aspect = width / canvasHeight;
    cameraRef.current.updateProjectionMatrix();
  }, [canvasHeight, viewportSize]);

  return (
    <PlaneCanvas ref={canvasRef} {...props} />
  );
}

Plane.defaultProps = {
  canvasHeight: 300,
};

const PlaneCanvas = styled.canvas`
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &:focus {
    outline: none;
  }
`;
