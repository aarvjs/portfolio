const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

const particles = [];
const colors = ["#ff4d4d", "#4dff4d", "#4d4dff", "#ffff4d", "#ff4dff", "#4dffff", "#ffa64d"];

for (let i = 0; i < 100; i++) {
  const angle = Math.random() * Math.PI * 2;
  const length = Math.random() * 300 + 100;
  const size = Math.random() * 5 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];

  particles.push({ angle, length, size, color });
}

let isDragging = false;
let lastMouseX, lastMouseY;

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;

    targetRotationY += dx * 0.01;
    targetRotationX += dy * 0.01;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center dot (very low brightness)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fill();

  for (let p of particles) {
    // 3D style projection with rotation
    const x = Math.cos(p.angle + rotationY) * p.length;
    const y = Math.sin(p.angle + rotationY) * p.length * Math.cos(rotationX);

    const endX = centerX + x;
    const endY = centerY + y;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.stroke();

    // Draw colorful square
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(p.angle + rotationY + rotationX);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

function animate() {
  // Smooth transition
  rotationX += (targetRotationX - rotationX) * 0.05;
  rotationY += (targetRotationY - rotationY) * 0.05;

  draw();
  requestAnimationFrame(animate);
}

animate();
