function plural(text = '', number = 0) {
  return `${number} ${text}${number > 1 ? 's' : ''}`;
}

export default plural;
