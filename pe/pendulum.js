window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	setup();
	setInterval(loop, dt);
}

let canvas;
let ctx;
let ang;
let vAng;
let len = 200;
let fps = 60;
let dt = 1000 / fps;

function setup() {
	ang = Math.PI / 3;
	vAng = 0;
}

function loop() {

  // Clear canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let x = (canvas.width / 2) + (len * Math.sin(ang));
	let y = 150 - (len * Math.cos(ang));

  // Draw cord
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(canvas.width / 2, 150);
	ctx.stroke();

  // Draw bob
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();

	// Gravity
	vAng += (0.001 / len) * Math.sin(ang) * dt;
	// Friction (fluid)
	vAng -= (vAng / 30000) * dt;

	ang += vAng * dt;
}
