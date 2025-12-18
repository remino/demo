const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

let vminPx;
let sprite, sw, sh;

let x = 10; // in vmin
let y = 10;
let vx = 0.6; // vmin per frame
let vy = 0.6;

let hue = Math.random() * 360;
let rafId = null;

const TEXT_SIZE_VMIN = 16;

function updateVmin() {
	vminPx = Math.min(window.innerWidth, window.innerHeight) / 100;
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	updateVmin();
	rebuildSprite();
}
window.addEventListener("resize", resize);

function changeColour() {
	hue = (hue + 60 + Math.random() * 60) % 360;
	rebuildSprite();
}

function rebuildSprite() {
	const t = document.createElement("canvas");
	const tctx = t.getContext("2d");

	const fontPx = TEXT_SIZE_VMIN * vminPx;
	tctx.font = `italic bold ${fontPx}px sans-serif`;

	const text = "DVD";
	const metrics = tctx.measureText(text);

	t.width = Math.ceil(metrics.width) + fontPx;
	t.height = Math.ceil(fontPx * 1.4);

	tctx.font = `italic bold ${fontPx}px sans-serif`;
	tctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
	tctx.textBaseline = "top";
	tctx.fillText(text, fontPx * 0.5, fontPx * 0.2);

	// trim transparent pixels
	const img = tctx.getImageData(0, 0, t.width, t.height);
	const { data, width, height } = img;

	let minX = width,
		minY = height,
		maxX = 0,
		maxY = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[(y * width + x) * 4 + 3] > 0) {
				minX = Math.min(minX, x);
				minY = Math.min(minY, y);
				maxX = Math.max(maxX, x);
				maxY = Math.max(maxY, y);
			}
		}
	}

	sw = maxX - minX + 1;
	sh = maxY - minY + 1;

	sprite = document.createElement("canvas");
	sprite.width = sw;
	sprite.height = sh;
	sprite
		.getContext("2d")
		.putImageData(tctx.getImageData(minX, minY, sw, sh), 0, 0);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	x += vx;
	y += vy;

	const px = x * vminPx;
	const py = y * vminPx;

	let bounced = false;

	if (px <= 0 || px + sw >= canvas.width) {
		vx *= -1;
		bounced = true;
	}

	if (py <= 0 || py + sh >= canvas.height) {
		vy *= -1;
		bounced = true;
	}

	if (bounced) changeColour();

	ctx.drawImage(sprite, px, py);
	rafId = requestAnimationFrame(draw);
}

resize();
if (!rafId) draw();
