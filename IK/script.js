window.onload= function() {
	canvas = document.getElementById("myCanvas");
	canvas.width  = window.innerWidth; // in pixels
	canvas.height = window.innerHeight; // in pixels
	ctx = canvas.getContext("2d");
	mousePos = { x: canvas.width/2, y: canvas.height/2};
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	setInterval(loop, 20);
	setup();
}

let canvas;
let mousePos;
let mousePressed = false;
let chain1;


function setup() {
	chain1 = new Chain({x:0.0,y:0.0},40,10);
	
	console.time('update');
	chain1.update({x:0.0,y:0.0});
	chain1.draw();
	console.timeEnd('update');
	/*
	console.time('update');
	for (let i = 0; i<100;i++) chain1.segments[1].update({x:0.0,y:0.0});
	console.timeEnd('update');
	*/
}


function loop() {
	/*
	console.timeEnd('loop');
	console.time('loop');
	*/
	// clear screen
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.lineCap="round";
	
	
	
	// update
	chain1.update(mousePos);
	
	// draw
	chain1.draw();
}

function keyDownHandler(evt) {

}

function keyUpHandler(evt) {

}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
}

function mouseDownHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (evt.button==0) {
		mousePressed = true;
	}			
}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (evt.button==0) {
		mousePressed = false;
	}
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

