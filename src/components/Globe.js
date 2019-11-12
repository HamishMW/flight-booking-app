import React, { useRef, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/macro';
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Group,
  Texture,
  TextureLoader,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Vector3,
  Geometry,
  SphereGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import globeData from 'data/globe';
import { useViewportSize } from 'hooks';
import { clean, returnSphericalCoordinates } from 'utils/three';

function Globe({ globeRadius, mapSize, colours, alphas, status, collapsed, ...props }) {
  const viewportSize = useViewportSize();
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const globeElementRef = useRef();
  const animationFrameRef = useRef();
  const initViewportSize = useRef(viewportSize);
  const { globeColors } = useContext(ThemeContext);

  const cameraRef = useRef({
    object: null,
    controls: null,
    angles: {
      current: {
        azimuthal: null,
        polar: null,
      },
    }
  });

  const groupsRef = useRef({
    main: null,
    globe: null,
    globeDots: null,
  });

  const animationsRef = useRef({
    dots: {
      current: 0,
      total: 170,
      points: [],
    },
    globe: {
      current: 0,
      total: 80,
    },
  });

  useEffect(() => {
    const { width, height } = initViewportSize.current;
    const canvas = canvasRef.current;

    sceneRef.current = new Scene();
    rendererRef.current = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      shadowMapEnabled: false,
    });

    rendererRef.current.setSize(width, (height / 2));
    rendererRef.current.setPixelRatio(2);
    rendererRef.current.setClearColor(0x000000, 0);
    cameraRef.current.object = new PerspectiveCamera(60, width / (height / 2), 1, 10000);
    cameraRef.current.object.position.z = globeRadius * 2.2;
    cameraRef.current.controls = new OrbitControls(cameraRef.current.object, canvas);
    cameraRef.current.controls.enableKeys = false;
    cameraRef.current.controls.enablePan = false;
    cameraRef.current.controls.enableZoom = false;
    cameraRef.current.controls.enableDamping = true;
    cameraRef.current.controls.enableRotate = true;
    cameraRef.current.controls.autoRotate = true;
    cameraRef.current.controls.autoRotateSpeed = 0.5;
    cameraRef.current.angles.current.azimuthal = -Math.PI;
    cameraRef.current.angles.current.polar = 0;
    groupsRef.current.main = new Group();
    groupsRef.current.main.name = 'Main';
    sceneRef.current.add(groupsRef.current.main);

    const introAnimate = () => {
      const { dots, globe } = animationsRef.current;

      if (dots.current <= dots.total) {
        const points = groupsRef.current.globeDots.geometry.vertices;
        const totalLength = points.length;

        for (let i = 0; i < totalLength; i++) {
          // Get ease value and add delay based on loop iteration
          let dotProgress = easeInOutCubic(dots.current / dots.total);
          dotProgress = dotProgress + (dotProgress * (i / totalLength));

          if (dotProgress > 1) {
            dotProgress = 1;
          }

          // Move the point
          points[i].x = dots.points[i].x * dotProgress;
          points[i].y = dots.points[i].y * dotProgress;
          points[i].z = dots.points[i].z * dotProgress;
        }

        dots.current++;
        groupsRef.current.globeDots.geometry.verticesNeedUpdate = true;
      }

      if (dots.current >= (dots.total * 0.65) && globe.current <= globe.total) {
        const globeProgress = easeOutCubic(globe.current / globe.total);
        globeElementRef.current.material.opacity = alphas.globe * globeProgress;
        globe.current++;
      }
    };

    const addGlobeDots = () => {
      const geometry = new Geometry();
      const canvasSize = 8;
      const halfSize = canvasSize / 2;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = canvasSize;
      textureCanvas.height = canvasSize;
      const canvasContext = textureCanvas.getContext('2d');
      canvasContext.beginPath();
      canvasContext.arc(halfSize, halfSize, halfSize, 0, 2 * Math.PI);
      canvasContext.fillStyle = colours.globeDots;
      canvasContext.fill();

      const texture = new Texture(textureCanvas);
      texture.needsUpdate = true;

      const material = new PointsMaterial({
        map: texture,
        size: globeRadius / 120,
      });

      const addDot = function ({ x, y }) {
        const point = new Vector3(0, 0, 0);
        geometry.vertices.push(point);
        const result = returnSphericalCoordinates(x, y, mapSize, globeRadius);
        animationsRef.current.dots.points.push(new Vector3(result.x, result.y, result.z));
      };

      for (let i = 0; i < globeData.points.length; i++) {
        addDot(globeData.points[i]);
      }

      for (let country in globeData.countries) {
        addDot(globeData.countries[country]);
      }

      groupsRef.current.globeDots = new Points(geometry, material);
      groupsRef.current.globe.add(groupsRef.current.globeDots);
    };

    const addGlobe = () => {
      const textureLoader = new TextureLoader();
      textureLoader.setCrossOrigin(true);

      const radius = globeRadius - (globeRadius * .02);
      const segments = 64;
      const rings = 64;

      const canvasSize = 128;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = canvasSize;
      textureCanvas.height = canvasSize;
      const canvasContext = textureCanvas.getContext('2d');
      canvasContext.rect(0, 0, canvasSize, canvasSize);
      const canvasGradient = canvasContext.createLinearGradient(0, 0, 0, canvasSize);

      canvasGradient.addColorStop(0, globeColors[0]);
      canvasGradient.addColorStop(.5, globeColors[1]);
      canvasGradient.addColorStop(1, globeColors[2]);
      canvasContext.fillStyle = canvasGradient;
      canvasContext.fill();

      const texture = new Texture(textureCanvas);
      texture.needsUpdate = true;

      const geometry = new SphereGeometry(radius, segments, rings);
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
      });

      globeElementRef.current = new Mesh(geometry, material);
      groupsRef.current.globe = new Group();
      groupsRef.current.globe.rotation.y = -1;
      groupsRef.current.globe.name = 'Globe';
      groupsRef.current.globe.add(globeElementRef.current);
      groupsRef.current.main.add(groupsRef.current.globe);

      addGlobeDots();
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (groupsRef.current.globeDots) {
        introAnimate();
      }

      cameraRef.current.controls.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current.object);
    };

    addGlobe();
    animate();

    return () => {
      sceneRef.current.remove(globeElementRef.current);
      cancelAnimationFrame(animationFrameRef.current);
      clean(sceneRef.current);
      rendererRef.current.dispose();
      sceneRef.current.dispose();
      cameraRef.current = null;
      rendererRef.current.domElement = null;
      rendererRef.current.forceContextLoss();
    };
  }, [alphas.globe, colours.globeDots, globeColors, globeRadius, mapSize]);

  useEffect(() => {
    const { width, height } = viewportSize;
    cameraRef.current.object.aspect = width / (height / 2);
    cameraRef.current.object.updateProjectionMatrix();
    rendererRef.current.setSize(width, (height / 2));
  }, [viewportSize]);

  return (
    <GlobeContainer status={status} {...props}>
      <GlobeCanvas
        viewportSize={viewportSize}
        ref={canvasRef}
        collapsed={collapsed}
      />
    </GlobeContainer>
  );
}

Globe.defaultProps = {
  mapSize: {
    width: 1024,
    height: 512,
  },
  globeRadius: 200,
  colours: {
    globeDots: 'rgb(255, 255, 255)',
  },
  alphas: {
    globe: 0.4,
    lines: 0.5,
  },
};

const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const easeOutCubic = t => (--t) * t * t + 1;

const GlobeContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${props => props.status === 'exiting' ? 0 : 1};
  transition: opacity 0.4s ease;
`;

const GlobeCanvas = styled.canvas.attrs(({ viewportSize, collapsed }) => ({
  style: {
    transform: collapsed
      ? `translate3d(0, ${(viewportSize.height * 0.1)}px, 0)`
      : `translate3d(0, ${(viewportSize.height / 4) + (viewportSize.height * 0.05)}px, 0)`,
  }
}))`
  display: block;
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};

  &:focus {
    outline: none;
  }
`;

export default Globe;
