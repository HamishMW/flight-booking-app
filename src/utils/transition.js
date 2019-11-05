export function isVisible(status) {
  return status === 'entered' || status === 'entering';
}

export const getDirection = (child, index, prevIndex) => {
  if (index > prevIndex) return child.props.in ? 1 : -1;
  return child.props.in ? -1 : 1;
};

export const reflow = node => node && node.offsetHeight;
