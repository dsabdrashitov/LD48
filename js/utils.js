function randomInt(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

function mod(a, b) {
  return ((a % b) + b) % b;
}
