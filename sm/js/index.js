// TODO: 
// review checkbounds
// try to force integer coordinates to speed up rendering
// pre-render background?
// quad-tree or spatial parsing
// display bombs and errors on explosion
// restyle settings


let cells = [];
let size = 30;
let gridWidth = 800;
let fontSize = 15;
let templateRels = [];
let density = 0.1;
const textColor = ["#5555FF", "#007700", "#D50000", "#000066", "#550000", "#858585",
	"#AAAA00", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"
];
const highlightCol = "#999999";
const invisibleCol = "#000000";
const visibleCol = "#CCCCCC";
const borderCol = "#555555";
let numMines;
let exploded;
let bgColor = "#FFFFFF";
let poliBorder = [];
let globalScale = 1;
let globalTranslateX = 0;
let globalTranslateY = 0;
let doubleMouse = false;
let shiftPressed = false;
let mousePos;
let menuVisible = false;
let fingerMoved = false;
let posCenterPinch = {
	x: -200,
	y: -200
};
let startTouch = {
	x: -200,
	y: -200
};
let lastTouchPos = null;
let distPinch = 1;
const movementThreshold = 5;
let lastTap = 0;
let offsX = 0;
let offsY = 0;

let dMax = 0;

let timerId = null;
let startTime = 0;

let spatialIndex;

window.onload = function () {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
  ctx.lineJoin = "round";

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	//let ratio = window.screen.width/canvas.width;
	//let vp = document.getElementById("Viewport");
	//vp.content = "initial-scale=" + ratio + ", maximum-scale=" + ratio + ", minimum-scale=" + ratio + ", user-scalable=yes";
	ctx.textAlign = "center";
	canvas.addEventListener("mousedown", mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener("touchstart", touchStartHandler, false);
	canvas.addEventListener('touchend', touchEndHandler, false);
	canvas.addEventListener('touchmove', touchMoveHandler, false);
	canvas.addEventListener('contextmenu', contextMenuHandler, false);
	canvas.addEventListener('wheel', wheelHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", keyDownHandler, false);

	window.addEventListener("resize", onResize);
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	startMousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	setup();
}

function setup() {
  setVizualization();
  //moveMenu();
  setField();
}

function onResize() {
	setVizualization();
	translateField();
}

function translateField() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	fontSize = Math.floor(size / 2);
	ctx.font = "bold " + fontSize + "px Arial";
	ctx.textAlign = "center";


	let deltaX = (canvas.width / 2 - cells[0].x);
	let deltaY = (canvas.height / 2 - cells[0].y);
	console.log(deltaX);

	for (let ce of cells) {
		ce.move(deltaX, deltaY);
	}

	resetZoom();
}

function resetZoom() {
	globalScale = 1;
	globalTranslateX = 0;
	globalTranslateY = 0;
	redraw();
}

function setVizualization() {
	let vp = document.getElementById("Viewport");
	let pop = document.getElementById("pop1");
	let infoBar = document.getElementById('infoBar');
	if (window.innerHeight < window.innerWidth) {
		infoBar.className = 'vertical-menu';
		let newWidth = 800 / window.innerHeight * window.innerWidth;
		vp.content = "user-scalable=no, width=" + newWidth;
		pop.style.width = "30%"
	} else {
		infoBar.className = 'scrollmenu';
		vp.content = "user-scalable=no, width=800";
		pop.style.width = "45%"
	}
	if (window.devicePixelRatio > 2) {
		pop.style.transform = "scale(1.8,1.8)";
		settingsPop.style.transform = "scale(1.8,1.8)";
		if (window.innerHeight < window.innerWidth) {
			infoBar.classList.add("big-vert");
		} else {
			infoBar.classList.add("big-horiz");
		}
	}
}

function chooseRandomElement(arr) {
	let ind = Math.floor(Math.random() * arr.length);
	return arr[ind];
}

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

function redraw() {
  ctx.lineJoin = "round";
	ctx.scale(globalScale, globalScale);
	ctx.translate(globalTranslateX, globalTranslateY);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (let c of cells) {
		c.draw();
	}
	ctx.resetTransform();
}


function setField() {
  // close the message box if open
	let msgBox = document.getElementById("msgBox");
	msgBox.style.visibility = "hidden";

  // reset timer
  document.getElementById("elapsedTime").innerHTML = "00:00";
  // Stop timer if player resets the field without winning or losing
  if (timerId != null) {
    clearTimeout(timerId);
    timerId = null;
  }

  // reset zoom and position
	globalScale = 1;
	globalTranslateX = 0;
	globalTranslateY = 0;
	exploded = false;
	bgColor = "#FFFFFF";

  // prepare parameters for field generation
	size = parseInt(document.getElementById("scaleSlider").value);
	size = gridWidth / size;
	fontSize = Math.floor(size / 2);
	ctx.font = "bold " + fontSize + "px Arial";
	offsX = 0;
	offsY = 0;
	cells = null;
	templateRels = null;
	cells = [];
	templateRels = [];
  
  // extract function names from the combo value
  let functionNames = document.getElementById("gridType").value.split(';');

  // call function to set the correct template for the field type
  runFunction(functionNames[0]);

  // set the overall field shape (external boudary)
	setFieldShape();

  // generate all the cells of the filed 
  console.time('Generation');
  runFunction(functionNames[1]);
  console.timeEnd('Generation');

  // populate the filed with mines
  populateField();

	redraw();
	calc();
	//console.log("Max distance = " + dMax);
}

function generateStandardField() {
  // create the first cell
  cells.push(createCell(templateRels[0][0].t, canvas.width / 2 + (offsX * size), canvas.height / 2 + (offsY * size), templateRels[0][0].shape, templateRels[0][0].props));
  //cells[0].createNeighbors();
  //generate subsequent shells around the first cell and link to the previous shell
  let previousShellStartIndex = 0;
  let previousPreviousShellStartIndex = 0;
  let currentShellStartIndex = 1;
  while (previousPreviousShellStartIndex != currentShellStartIndex) {
    currentShellStartIndex = cells.length;
    for (let j = previousShellStartIndex; j < currentShellStartIndex; j++) {
      cells[j].createShellNeighbors(previousPreviousShellStartIndex);
    }
    previousPreviousShellStartIndex = previousShellStartIndex;
    previousShellStartIndex = currentShellStartIndex;
  }
}

function refreshField() {
  document.getElementById("elapsedTime").innerHTML = "00:00";
  // Stop timer if player resets the field without winning or losing
  if (timerId != null) {
    clearTimeout(timerId);
    timerId = null;
  }
	globalScale = 1;
	globalTranslateX = 0;
	globalTranslateY = 0;
	exploded = false;
	bgColor = "#FFFFFF";
  clearFiled();
  populateField();

	redraw();
	calc();
}

function clearFiled() {
  for (let c of cells) {
		c.isClicked = false;
		c.hasMine = false;
		c.nearMines = 0;
		c.flagged = false;
		c.visible = false;
  }
}

function populateField() {
  numMines = Math.floor((cells.length + 1) * density);
  for (let i = 0; i < numMines; i++) {
    let c = chooseRandomElement(cells);
    if (c.hasMine) {
      i--;
    } else {
      c.hasMine = true;
    }
  }
  for (let ce of cells) {
    ce.countNearMines();
  }
}

// set the polygon of the outer border of the field
function setFieldShape() {
	let i = document.getElementById("gridShape").value;
	poliBorder = null;
	poliBorder = [];
	if (i == 0) {
		//Square
		poliBorder.push({
			x: (canvas.width - gridWidth) / 2 + size - 2,
			y: (canvas.height - gridWidth) / 2 + size - 2
		});
		poliBorder.push({
			x: (canvas.width / 2 + gridWidth / 2) - size + 2,
			y: (canvas.height - gridWidth) / 2 + size - 2
		});
		poliBorder.push({
			x: (canvas.width / 2 + gridWidth / 2) - size + 2,
			y: (canvas.height / 2 + gridWidth / 2) - size + 2
		});
		poliBorder.push({
			x: (canvas.width - gridWidth) / 2 + size - 2,
			y: (canvas.height / 2 + gridWidth / 2) - size + 2
		});
	} else if (i == 1) {
		//Hexagonal

		for (let i = 0; i < 6; i++) {
			poliBorder.push({
				x: (gridWidth / 2 - size - 1) * Math.cos(2 * Math.PI * i / 6) + canvas.width / 2,
				y: (gridWidth / 2 - size - 1) * Math.sin(2 * Math.PI * i / 6) + canvas.height / 2
			});
		}
	}
}

function changeSize() {
	size = parseInt(document.getElementById("scaleSlider").value);
	size = canvas.width / size;
	document.getElementById("densityValue").innerHTML = size;
}

function setDensity() {
	let d = parseInt(document.getElementById("densitySlider").value);
	density = d / 100;
	refreshField();
}

// show all cells content
function showAll() {
	for (let ce of cells) {
		ce.visible = true;
	}
	redraw();
}

// update counters and check for victory
function calc() {
	let flags = 0;
	let hidden = 0;
	for (let ce of cells) {
		if (!ce.visible) hidden++;
		if (ce.flagged) flags++;
	}
	let left = numMines - flags;
	//document.getElementById("minesLeft").innerHTML = " " + left;
	document.getElementById("minesLeft2").innerHTML = " " + left;
	if (hidden == numMines && !exploded) {
		console.log("Victory!!!!!!!");
		bgColor = "#00FF00";
    clearTimeout(timerId);
    timerId = null;
	}
}

// checks if a point is inside the given polygon
function insidePoli(poly, p) {
	// Even–odd rule https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
	let c = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		let int = ((poly[i].y > p.y) != (poly[j].y > p.y)) && (p.x < (poly[j].x - poly[i].x) * (p.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x);
		if (int) c = !c;
	}
	return c;
}

function clearMarked() {
	for (let ce of cells) {
		ce.isClicked = false;
	}
}

function checkFlag() {
	if (highlightedCell.isClicked && !highlightedCell.visible) {
		highlightedCell.flagged = !highlightedCell.flagged
		highlightedCell.isClicked = false;
		fingerMoved = true;
		navigator.vibrate([100]);
	}
	for (let ce of cells) {
		ce.isClicked = false;
	}
	redraw();
	calc();
}

function refreshTimer() {
  if (timerId != null) {
    elapsedTime = Date.now() - startTime;
    elapsedTime /= 1000;
    let seconds = Math.floor(elapsedTime);
    let minutes = Math.floor(seconds/60);
    seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;
    if (minutes < 10) minutes = "0" + minutes;
    document.getElementById("elapsedTime").innerHTML = minutes + ":" + seconds;
  }
}

