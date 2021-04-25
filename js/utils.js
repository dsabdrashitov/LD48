function randomInt(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function modFloat(a, b) {
  let d = a / b;
  return (d - Math.floor(d)) * b;
}
