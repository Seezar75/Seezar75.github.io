window.onload = function() {
	canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth; // in pixels
	canvas.height = window.innerHeight; // in pixels
	ctx = canvas.getContext("2d");
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener('touchmove', touchMoveHandler, false);
	canvas.addEventListener('touchstart', touchStartHandler, false);
	canvas.addEventListener('touchend', touchEndHandler, false);
	canvas.addEventListener('touchcancel', touchCancelHandler, false);
	setInterval(loop, 20);
	setup();
}

let canvas;
let mousePos;
let mousePressed = false;
let mousePosStart;
let mousePosEnd;
let maxRad = 30;

let bounce = 0;
let bounceOthers = 0;
let avoidObstacles = 1;
let follow = 0;
let aligning = 0;
let grouping = 0;
let noise = 0.1;
let pause = 0;

let touchStatus = 0;
let lastTouch = new Date().getTime();

rightPressed = leftPressed = upPressed = downPressed = false;

let serpentelli = [];
let obstacles = [];

let v;
let v2;

function setup() {

	ctx.font = "12px Comic Sans MS";

	for (let i = 0; i < 10; i++) {
		serpentelli.push(new Serpentello(getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), 0.5 + Math.random() * 6, Math.random() * Math.PI * 2, getRandomInt(5, maxRad)));
	}

	// sorting so smaller ones will be drawn on top
	serpentelli.sort((a, b) => b.size - a.size);

}


function loop() {

	// keyboard control of first Serpentello
	if (rightPressed) {

	} else if (leftPressed) {

	} else if (upPressed) {

	} else if (downPressed) {

	}

	// clear screen
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// bounce with each other
	if (bounceOthers == 1) {
		for (let i = 0; i < serpentelli.length - 1; i++) {
			for (let j = i + 1; j < serpentelli.length; j++) {
				let relative = new Vector(serpentelli[i].x - serpentelli[j].x, serpentelli[i].y - serpentelli[j].y);
				let dist = relative.getModule();
				if (dist < serpentelli[i].size + serpentelli[j].size) {
					relative.normalize();
					let a1 = serpentelli[i].velVect.dot(relative);
					let a2 = serpentelli[j].velVect.dot(relative);
					let opt = 2*(a1-a2)/(serpentelli[i].size+serpentelli[j].size)
					if (opt > 0) {
						console.log("Boing!");
						serpentelli[i].velVect.x += opt*serpentelli[j].size*relative.x;
						serpentelli[i].velVect.y += opt*serpentelli[j].size*relative.y;
						serpentelli[j].velVect.x -= opt*serpentelli[i].size*relative.x;
						serpentelli[j].velVect.y -= opt*serpentelli[i].size*relative.y;
						serpentelli[i].velVect.normalize();
						serpentelli[j].velVect.normalize();
					}
				}
			}
		}
	}

	for (let s of serpentelli) {

		if (pause == 0) {
			// update direction and speed
			s.update(mousePos);

			// increment position
			s.move();

		}
		// draw coso
		s.draw();
	}

	for (let o of obstacles) {
		ctx.beginPath();
		ctx.arc(o.x, o.y, 10, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.fill();
		ctx.closePath();
	}

	if (mousePressed) {
		ctx.beginPath();
		rad = Math.sqrt((mousePosStart.x - mousePosEnd.x) * (mousePosStart.x - mousePosEnd.x) + (mousePosStart.y - mousePosEnd.y) * (mousePosStart.y - mousePosEnd.y));
		if (rad > maxRad) rad = maxRad;
		ctx.arc(mousePosStart.x, mousePosStart.y, rad, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
		ctx.fill();
		ctx.closePath();
	}

	ctx.fillStyle = "grey";

	ctx.fillText("Noise = " + noise.toFixed(2), 10, 20);
	ctx.fillText("Distance = " + serpentelli[0].idealDist, 10, 40);
	if (bounce == 1) ctx.fillText("Bounce on walls", 10, 60);
	if (follow == 1) ctx.fillText("Follow", 10, 80);
	if (aligning == 1) ctx.fillText("Aligning", 10, 100);
	if (grouping == 1) ctx.fillText("Grouping", 10, 120);
	if (bounceOthers == 1) ctx.fillText("Bounce with each other", 10, 140);

	if (touchStatus == 1) {
		ctx.beginPath();
		ctx.arc(canvas.width - 30, 30, 10, 0, Math.PI * 2);
		ctx.fillStyle = 'rgb(255, 0, 0)';
		ctx.fill();
		ctx.closePath();
	} else if (touchStatus == 2) {
		ctx.beginPath();
		ctx.arc(canvas.width - 30, 30, 10, 0, Math.PI * 2);
		ctx.fillStyle = 'rgb(0, 255, 255)';
		ctx.fill();
		ctx.closePath();
	}
}

function keyDownHandler(evt) {
	if (evt.keyCode == 39) { // right
		rightPressed = true;
	} else if (evt.keyCode == 37) { // left
		leftPressed = true;
	} else if (evt.keyCode == 38) { // up
		upPressed = true;
	} else if (evt.keyCode == 40) { // down
		downPressed = true;
	}
}

function keyUpHandler(evt) {
	if (evt.keyCode == 39) { // right
		rightPressed = false;
	} else if (evt.keyCode == 37) { // left
		leftPressed = false;
	} else if (evt.keyCode == 38) { // up
		upPressed = false;
	} else if (evt.keyCode == 40) { // down
		downPressed = false;
	} else if (evt.keyCode == 65) { // A
		// Toggle aligning
		if (aligning == 0) {
			aligning = 1;
		} else {
			aligning = 0;
		}
	} else if (evt.keyCode == 66) { // B
		// Toggle bouncing on walls
		if (bounce == 0) {
			bounce = 1;
		} else {
			bounce = 0;
		}
	} else if (evt.keyCode == 67) { // C
		// Clear obstacles
		obstacles = [];
	} else if (evt.keyCode == 70) { // F
		// Toggle follow mouse
		if (follow == 0) {
			follow = 1;
		} else {
			follow = 0;
		}
	} else if (evt.keyCode == 71) { // G
		// Toggle grouping
		if (grouping == 0) {
			grouping = 1;
		} else {
			grouping = 0;
		}
	} else if (evt.keyCode == 72) { // H
		// Help
		let helpString = "Press:\n" +
			"A: toggle alignment\n" +
			"B: toggle wall bouncing\n" +
			"C: clear obstacles\n" +
			"F: toggle follow mouse\n" +
			"G: toggle grouping\n" +
			"N: change noise\n" +
			"O: place an obstacle at mouse position\n" +
			"P: pause animation\n" +
			"R: toggle serpentelli bouncing with each other\n" +
			"Numpad +: increase distance\n" +
			"Numpad -: decrease distance\n\n" +
			"Click and drag to create another serpentello\n" +
			"Click on a serpentello's head to delete it";
		alert(helpString);
	} else if (evt.keyCode == 78) { // N
		// Change noise level
		noise += 0.05;
		if (noise > 0.7) noise = 0;
	} else if (evt.keyCode == 79) { // O
		// Place obstacle
		obstacles.push(mousePos);
	} else if (evt.keyCode == 80) { // P
		// Pause
		if (pause == 0) {
			pause = 1;
		} else {
			pause = 0;
		}
	} else if (evt.keyCode == 82) { // R
		// Serpentelli bouncing with each other
		if (bounceOthers == 0) {
			bounceOthers = 1;
		} else {
			bounceOthers = 0;
		}
	} else if (evt.keyCode == 107) { // NumPad +
		// Increase distance
		for (let s of serpentelli) {
			s.detectionDist += 10;
			s.idealDist = s.detectionDist / 2;
			s.calcParams(s.intensity);
		}
	} else if (evt.keyCode == 109) { // NumPad -
		// Decrease distance
		for (let s of serpentelli) {
			s.detectionDist -= 10;
			if (s.detectionDist < 20) s.detectionDist = 20;
			s.idealDist = s.detectionDist / 2;
			s.calcParams(s.intensity);
		}
	}
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (mousePressed) {
		mousePosEnd = mousePos;
	}
}

function mouseDownHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	let ind;
	let minDist = canvas.width + canvas.height;
	for (let i = 0; i < serpentelli.length; i++) {
		let dist = serpentelli[i].getDist(mousePos.x, mousePos.y);
		if (dist < serpentelli[i].size && dist < minDist) {
			ind = i;
			minDist = dist;
		}
	}

	if (minDist < canvas.width + canvas.height) {
		serpentelli.splice(ind, 1);
	} else {
		mousePosStart = mousePos;
		mousePosEnd = mousePos;
		if (evt.button == 0) {
			mousePressed = true;
		}
	}

}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (mousePressed) {
		rad = Math.sqrt((mousePosStart.x - mousePosEnd.x) * (mousePosStart.x - mousePosEnd.x) + (mousePosStart.y - mousePosEnd.y) * (mousePosStart.y - mousePosEnd.y));
		if (rad > maxRad) rad = maxRad;
		if (rad > 2) {
			serpentelli.push(new Serpentello(mousePosStart.x, mousePosStart.y, 0.5 + Math.random() * 6, Math.random() * Math.PI * 2, rad));
			serpentelli.sort((a, b) => b.size - a.size);
		}
	}
	if (evt.button == 0) {
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

function touchStartHandler(evt) {
	mousePos.x = Math.floor(evt.targetTouches[0].clientX);
	mousePos.y = Math.floor(evt.targetTouches[0].clientY);
	let curTouch = new Date().getTime();
	if (curTouch - lastTouch < 400) {
		if (touchStatus == 1 && obstacles.length > 1) {
			obstacles.pop();
		}
		touchStatus++;
		if (touchStatus > 2) {
			touchStatus = 0;
		}
	}
	lastTouch = curTouch;
	if (touchStatus == 0) {
		follow = 1;
	} else if (touchStatus == 1) {
		obstacles.push({
			x: mousePos.x,
			y: mousePos.y
		});
	} else {
		mousePressed = true;
		mousePosStart = {
			x: mousePos.x,
			y: mousePos.y
		};
		mousePosEnd = {
			x: mousePos.x,
			y: mousePos.y
		};
	}

	evt.preventDefault();
}

function touchMoveHandler(evt) {
	mousePos.x = Math.floor(evt.targetTouches[0].clientX);
	mousePos.y = Math.floor(evt.targetTouches[0].clientY);
	if (touchStatus == 2) {
		mousePosEnd = {
			x: mousePosStart.x + ((mousePos.x - mousePosStart.x) / 6),
			y: mousePosStart.y + ((mousePos.y - mousePosStart.y) / 6)
		};
	}
}

function touchEndHandler(evt) {
	follow = 0;
	if (mousePressed) {
		rad = Math.sqrt((mousePosStart.x - mousePosEnd.x) * (mousePosStart.x - mousePosEnd.x) + (mousePosStart.y - mousePosEnd.y) * (mousePosStart.y - mousePosEnd.y));
		if (rad > maxRad) rad = maxRad;
		if (rad > 2) {
			serpentelli.push(new Serpentello(mousePosStart.x, mousePosStart.y, 0.5 + Math.random() * 6, Math.random() * Math.PI * 2, rad));
			serpentelli.sort((a, b) => b.size - a.size);
		}
	}
	mousePressed = false;
}

function touchCancelHandler(evt) {
	follow = 0;
	mousePressed = false;
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
