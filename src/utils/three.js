export const clean = scene => {
  scene.traverse(object => {
    if (!object.isMesh) return;

    object.geometry.dispose();

    if (object.material.isMaterial) {
      cleanMaterial(object.material);
    } else {
      // an array of materials
      for (const material of object.material) cleanMaterial(material);
    }
  });
};

const cleanMaterial = material => {
  material.dispose();

  // dispose textures
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  }
};

export const returnSphericalCoordinates = (latitude, longitude, size, radius) => {
  latitude = ((latitude - size.width) / size.width) * -180;
  longitude = ((longitude - size.height) / size.height) * -90;

  const outputRadius = Math.cos(longitude / 180 * Math.PI) * radius;
  const x = Math.cos(latitude / 180 * Math.PI) * outputRadius;
  const y = Math.sin(longitude / 180 * Math.PI) * radius;
  const z = Math.sin(latitude / 180 * Math.PI) * outputRadius;

  return { x, y, z };
};
