window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	//setInterval(loop, 30);
	setup();
	window.requestAnimationFrame(loop);
}

let ang = {
	x: -0.73736887807,
	y: 0.67549029426
}
let c = 20;
let scroll = 0;
let max = 1;
let min = 0;
let maxD;
let limit;

function setup() {
	maxD = Math.sqrt(canvas.width*canvas.width+canvas.height*canvas.height)/2;
	console.log((maxD*maxD)/(c*c));
	limit = ((maxD+c)*(maxD+c))/(c*c);
	draw();
}

function loop() {
	draw();
	scroll += 1;
	if (scroll%10==0) {
		max++;
		if (max > limit) {
			min++;
		}
		console.log(max + " - " + min);
	}
	window.requestAnimationFrame(loop);
}

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let incr = {x:1,y:0}
	for (let i=min; i<max+min; i++) {
		let d = c*Math.sqrt(max-i+min+((scroll%10)/10));
		let temp = multiplyScalar(incr, d);
		ctx.beginPath();
		ctx.arc(canvas.width/2+temp.x, canvas.height/2+temp.y, 16, 0, Math.PI * 2);
		let l = d/maxD*360
		ctx.fillStyle = "hsl(" + l + ", 100%, 50%)";
		ctx.fill();
		ctx.closePath();
		incr = multiply(incr, ang);
	}
}

function multiplyScalar(v, s) {
	return {
		x: v.x * s,
		y: v.y * s
	}
}

function multiply(v1, v2) {
	return {
		x: v1.x * v2.x - v1.y * v2.y,
		y: v1.x * v2.y + v1.y * v2.x
	}
}