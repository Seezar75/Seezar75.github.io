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
let mousePosStart;
let mousePosEnd;
let maxRad = 30;

let bounce = 1;
let avoidObstacles = 1;
let follow = 0;
let aligning = 0;
let grouping = 0;
let noise = 0.1;

rightPressed = leftPressed = upPressed = downPressed = false;

let serpentelli=[];
let obstacles=[];

let v;
let v2

function setup() {
	
	ctx.font = "12px Comic Sans MS";
	
	for(let i = 0; i<5; i++) {
		serpentelli.push(new Serpentello(getRandomInt(0,canvas.width), getRandomInt(0,canvas.height), 0.5+Math.random()*6, Math.random()*Math.PI*2, getRandomInt(5, maxRad)));
	}

	// sorting so smaller ones will be drawn on top
	serpentelli.sort((a, b) => b.size - a.size);

}


function loop() {

	// keyboard control of first Serpentello
	if(rightPressed) {
		
	} else if(leftPressed) {
		
	} else if(upPressed) {
		
	} else if(downPressed) {
		
	}
	
	// clear screen
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	
	for (let s of serpentelli) {
		
		// follow
		s.follow(mousePos);
		
		// increment position
		s.move();
		
		// interact with borders
		s.borderInteraction();
		
		// draw coso
		s.draw();
	}
	
	for (let o of obstacles) {
		ctx.beginPath();
		ctx.arc(o.x, o.y, 10, 0, Math.PI*2);
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.fill();
		ctx.closePath()
	}
	
	if (mousePressed) {
		ctx.beginPath();
		rad = Math.sqrt((mousePosStart.x - mousePosEnd.x)*(mousePosStart.x - mousePosEnd.x) + (mousePosStart.y - mousePosEnd.y)*(mousePosStart.y - mousePosEnd.y));
		if (rad > maxRad) rad = maxRad;
		ctx.arc(mousePosStart.x, mousePosStart.y, rad, 0, Math.PI*2);
		ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
		ctx.fill();
		ctx.closePath()
	}
	
	ctx.fillStyle = "grey";
	
	ctx.fillText("Noise = " + noise.toFixed(2), 10, 20);
	ctx.fillText("Distance = " + serpentelli[0].idealDist, 10, 40);
	if(bounce == 1) ctx.fillText("Bounce", 10, 60);
	if(follow == 1) ctx.fillText("Follow", 10, 80);
	if(aligning == 1) ctx.fillText("Aligning", 10, 100);
	if(grouping == 1) ctx.fillText("Grouping", 10, 120);
	

	
}

function keyDownHandler(evt) {
	if(evt.keyCode == 39) { // right
        rightPressed = true;
    } else if(evt.keyCode == 37) { // left
        leftPressed = true;
    } else if(evt.keyCode == 38) { // up
		upPressed = true;
    } else if(evt.keyCode == 40) { // down
		downPressed = true;
    }
}

function keyUpHandler(evt) {
	if(evt.keyCode == 39) { // right
        rightPressed = false;
    } else if(evt.keyCode == 37) { // left
        leftPressed = false;
    } else if(evt.keyCode == 38) { // up
		upPressed = false;
    } else if(evt.keyCode == 40) { // down
		downPressed = false;
    }  else if(evt.keyCode == 65) { // A
		// Toggle aligning
		if(aligning == 0) {
			aligning = 1;
		} else {
			aligning = 0;
		}
    } else if(evt.keyCode == 66) { // B
		// Toggle bouncing on walls
		if(bounce == 0) {
			bounce = 1;
		} else {
			bounce = 0;
		}
    } else if(evt.keyCode == 67) { // C
		// Clear obstacles
		obstacles = [];
    } else if(evt.keyCode == 70) { // F
		// Toggle follow mouse
		if(follow == 0) {
			follow = 1;
		} else {
			follow = 0;
		}
    } else if(evt.keyCode == 71) { // G
		// Toggle grouping
		if(grouping == 0) {
			grouping = 1;
		} else {
			grouping = 0;
		}
    } else if(evt.keyCode == 72) { // H
		// Help
		let helpString = "Press:\n" + 
		"A: toggle alignment\n" +
		"B: toggle wall bouncing\n" + 
		"C: clear obstacles\n" +
		"F: toggle follow mouse\n" + 
		"G: toggle grouping\n" +
		"N: change noise\n" +
		"O: place an obstacle at mouse position\n" +
		"Numpad +: increase distance\n" +
		"Numpad -: decrease distance\n\n" +
		"Click and drag to create another serpentello\n" + 
		"Click on a serpentello's head to delete it";
		alert(helpString);
    } else if(evt.keyCode == 78) { // N
		// Place obstacle
		noise += 0.05;
		if (noise > 0.7) noise = 0;
    } else if(evt.keyCode == 79) { // O
		// Place obstacle
		obstacles.push(mousePos);
    } else if(evt.keyCode == 107) { // NumPad +
		// Increase distance
		for (let s of serpentelli) {
			s.detectionDist += 10;
			s.idealDist = s.detectionDist/2;
			s.calcParams(0.15);
		}
    } else if(evt.keyCode == 109) { // NumPad -
		// Decrease distance
		for (let s of serpentelli) {
			s.detectionDist -= 10;
			if (s.detectionDist < 20) s.detectionDist = 20;
			s.idealDist = s.detectionDist/2;
			s.calcParams(0.15);
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
	for (let i=0; i<serpentelli.length; i++) {
		let dist = serpentelli[i].getDist(mousePos.x, mousePos.y);
		if(dist < serpentelli[i].size && dist < minDist) {
			ind = i;
			minDist = dist;
		}
	}
	
	if (minDist < canvas.width + canvas.height) {
		serpentelli.splice(ind, 1);
	} else {
		mousePosStart = mousePos;
		mousePosEnd = mousePos;
		if (evt.button==0) {
			mousePressed = true;
		}
	}
	
}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (mousePressed) {
		rad = Math.sqrt((mousePosStart.x - mousePosEnd.x)*(mousePosStart.x - mousePosEnd.x) + (mousePosStart.y - mousePosEnd.y)*(mousePosStart.y - mousePosEnd.y));
		if (rad > maxRad) rad = maxRad;
		if (rad > 2) {
			serpentelli.push(new Serpentello(mousePosStart.x, mousePosStart.y, 0.5+Math.random()*6, Math.random()*Math.PI*2, rad));
			serpentelli.sort((a, b) => b.size - a.size);
		}
	}
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

