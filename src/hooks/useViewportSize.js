import { useEffect, useState, useContext } from 'react';
import { AppContext } from 'app';

const useViewportSize = elementRef => {
  const { viewportRef } = useContext(AppContext);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const element = elementRef || viewportRef;

  useEffect(() => {
    const updateSize = () => {
      const rect = element.current.getBoundingClientRect();
      setViewportSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [element, viewportRef]);

  return viewportSize;
};

export default useViewportSize;
