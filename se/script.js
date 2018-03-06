window.onload = function() {
	canvas = document.getElementById("myCanvas");
	menu = document.getElementById("mainMenu");
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
	//canvas.addEventListener('contextmenu', contextHandler, false);
	setInterval(loop, 20);
	setup();
}

let canvas;
let menu;
let mousePos;
let mousePressed = false;
let mousePosStart;
let mousePosEnd;
let maxRad = 30;
let wallStart = null;

let bounce = 0;
let bounceOthers = 0;
let avoidObstacles = 1;
let follow = 0;
let aligning = 0;
let grouping = 0;
let noise = 0.1;
let pause = 0;
let showMenu = 0;
let mode = 0;

let touchStatus = 0;
let lastTouch = new Date().getTime();

rightPressed = leftPressed = upPressed = downPressed = false;

let serpentelli = [];
let obstacles = [];
let walls = [];
let food = [];
let foodType = 0;
const foodColors = ['rgb(0, 255, 0)', 'rgb(0, 90, 0)', 'rgb(255, 255, 0)', 'rgb(90, 90, 0)', 'rgb(255, 0, 255)', 'rgb(90, 0, 90)'];
const foodNames = ['Bigger', 'Smaller', 'Faster', 'Slower', 'Longer', 'Shorter'];
const modeNames = ['Serpentelli', 'Food', 'Walls', 'Obstacles'];

function setup() {

	ctx.font = "12px Comic Sans MS";
	ctx.lineCap = "round";

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

	for (let w of walls) {
		w.draw();
	}

	for (let o of obstacles) {
		ctx.beginPath();
		ctx.arc(o.x, o.y, 10, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.fill();
		ctx.closePath();
	}

	for (let f of food) {
		ctx.beginPath();
		ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
		ctx.fillStyle = foodColors[f.t];
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

	//ctx.fillText("Noise = " + noise.toFixed(2), 10, 20);
	//ctx.fillText("Distance = " + serpentelli[0].idealDist, 10, 40);
	//if (bounce == 1) ctx.fillText("Bounce on walls", 10, 60);
	//if (follow == 1) ctx.fillText("Follow", 10, 80);
	//if (aligning == 1) ctx.fillText("Aligning", 10, 100);
	//if (grouping == 1) ctx.fillText("Grouping", 10, 120);
	//if (bounceOthers == 1) ctx.fillText("Bounce with each other", 10, 140);
	//ctx.fillText("Food type: " + foodNames[foodType], 10, 140);

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

	if (wallStart != null) {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
		ctx.lineWidth = 5;
		ctx.moveTo(wallStart.x, wallStart.y);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = "rgba(200,200,200,0.4)";
	ctx.rect(2, 2, 38, 38);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.moveTo(10, 12);
	ctx.lineTo(32, 12);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(10, 21);
	ctx.lineTo(32, 21);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(10, 30);
	ctx.lineTo(32, 30);
	ctx.stroke();


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
		toggleBounceBorder();
	} else if (evt.keyCode == 67) { // C
		// Clear obstacles and walls
		obstacles = [];
		walls = [];
	} else if (evt.keyCode == 69) { // E
		// Place food
		food.push({
			x: mousePos.x,
			y: mousePos.y,
			t: foodType
		});
	} else if (evt.keyCode == 70) { // F
		// Toggle follow mouse
		toggleFollow();
	} else if (evt.keyCode == 71) { // G
		// Toggle grouping
		if (grouping == 0) {
			grouping = 1;
			bounceOthers = 0;
		} else {
			grouping = 0;
		}
	} else if (evt.keyCode == 72) { // H
		// Help
		let helpString = "Press:\n" +
			"A: toggle alignment\n" +
			"B: toggle wall bouncing\n" +
			"C: clear obstacles\n" +
			"E: place food at mouse position\n" +
			"F: toggle follow mouse\n" +
			"G: toggle grouping\n" +
			"N: change noise\n" +
			"O: place an obstacle at mouse position\n" +
			"P: pause animation\n" +
			"R: toggle serpentelli bouncing with each other\n" +
			"T: change food type\n" +
			"W: draw walls, W to start, move mouse and then W again to end\n" +
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
			grouping = 0;
		} else {
			bounceOthers = 0;
		}
	} else if (evt.keyCode == 84) { // T
		// Change type of food
		cycleFoodType();
	} else if (evt.keyCode == 87) { // W
		// Draw wall
		if (wallStart == null) {
			wallStart = {
				x: mousePos.x,
				y: mousePos.y
			}
		} else {
			walls.push(new Wall(wallStart, {
				x: mousePos.x,
				y: mousePos.y
			}));
			wallStart = null;
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
	if (mousePos.x < 30 && mousePos.y < 30) {
		toggleMenu();
		return;
	}
	if (mode == 0) {
		// Serpentelli
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
	} else if (mode == 1) {
		// Food
		food.push({
			x: mousePos.x,
			y: mousePos.y,
			t: foodType
		});
	} else if (mode == 2) {
		// Walls
		if (evt.button == 0) {
			wallStart = {
				x: mousePos.x,
				y: mousePos.y
			}
		}
	} else if (mode == 3) {
		// Obstacles
		obstacles.push(mousePos);
	}

}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (mode == 0) {
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
	} else if (mode == 2 && wallStart != null) {
		// Walls
		if (evt.button == 0) {
			walls.push(new Wall(wallStart, {
				x: mousePos.x,
				y: mousePos.y
			}));
			wallStart = null;
		}
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
	if (curTouch - lastTouch < 230) {
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

function toggleMenu() {
	if (showMenu == 0) {
		showMenu = 1;
		menu.style.display = "block";
	} else {
		showMenu = 0;
		menu.style.display = "none";
	}
}

function touchCancelHandler(evt) {
	follow = 0;
	mousePressed = false;
}

function contextHandler(evt) {
	evt.preventDefault();
	menu.style.display = "block";
}

function cycleFoodType() {
	let s = document.getElementById("foodP");
	foodType++;
	if (foodType >= foodColors.length) {
		foodType = 0;
	}
	s.innerHTML = foodNames[foodType];
}

function cycleModes() {
	let s = document.getElementById("modeP");
	mode++;
	if (mode >= modeNames.length) {
		mode = 0;
	}
	s.innerHTML = modeNames[mode];
}

function toggleFollow() {
	let s = document.getElementById("followP");
	if (follow == 0) {
		follow = 1;
		s.style.color = '#0B0';
		s.innerHTML = "ON";
	} else {
		follow = 0;
		s.style.color = '#F00';
		s.innerHTML = "OFF";
	}
}

function toggleBounceOthers() {
	let s = document.getElementById("otherP");
	if (bounceOthers == 0) {
		bounceOthers = 1;
		s.style.color = '#0B0';
		s.innerHTML = "ON";
		if (aligning == 1) toggleFlocking();
	} else {
		bounceOthers = 0;
		s.style.color = '#F00';
		s.innerHTML = "OFF";
	}
}

function toggleFlocking() {
	let s = document.getElementById("flockingP");
	if (aligning == 0) {
		aligning = 1;
		grouping = 1;
		s.style.color = '#0B0';
		s.innerHTML = "ON";
		if (bounceOthers == 1) toggleBounceOthers();
	} else {
		aligning = 0;
		grouping = 0;
		s.style.color = '#F00';
		s.innerHTML = "OFF";
	}
}

function toggleBounceBorder() {
	let s = document.getElementById("borderP");
	if (bounce == 0) {
		bounce = 1;
		s.style.color = '#0B0';
		s.innerHTML = "ON";
	} else {
		bounce = 0;
		s.style.color = '#F00';
		s.innerHTML = "OFF";
	}
}

function setNoise(value) {
	noise = Number(value);
}

function setDistance(value) {
	for (let s of serpentelli) {
		s.detectionDist = Number(value) * 2;
		s.idealDist = Number(value);
		s.calcParams(s.intensity);
	}
}

function cls() {
	obstacles = [];
	walls = [];
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
