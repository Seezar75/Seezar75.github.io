window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	setup();
	setInterval(loop, dt);
}

let canvas;
let ctx;
let fps = 60;
let dt = 1000 / fps;
let pe = [];
// pe.push(new pendulum(canvas, {
//	x: canvas.width / 2,
//	y: 150
//}, (Math.pow(500/(i+29),2)), Math.PI / 2));
function setup() {
	ang = 2 * Math.PI / 3;
	vAng = 0;
	for (let i = 0; i < 24; i++) {
		pe.push(new pendulum(canvas, {
			x: canvas.width / 2,
			y: 50
		}, (Math.pow(1200/(i+60),2)), Math.PI / 6));
	}
}

function loop() {
	// Clear canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let p of pe) {
		p.draw();
		p.move(dt);
	}

}
