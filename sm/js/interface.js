
function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left) / globalScale - globalTranslateX,
		y: (evt.clientY - rect.top) / globalScale - globalTranslateY
	};

}

function mouseDownHandler(evt) {
	//console.log("down = " + evt.button + " " + evt.buttons);
	mousePos = getMousePos(canvas, evt);
	if (evt.buttons == 3) {
		doubleMouse = true;
		for (let ce of cells) {
			if (ce.isInside(mousePos)) {
				if (!ce.flagged) {
					ce.markNeigh();
					ce.clearNumber();
					//console.log("Near mines = " + ce.nearMines);
				}
				break;
			}
		}
	} else if (evt.button == 0) {
		if (shiftPressed) {

		} else {
			for (let ce of cells) {
				if (ce.isInside(mousePos)) {
					ce.click();
					break;
				}
			}
		}

	} else if (evt.button == 2) {
		for (let ce of cells) {
			if (ce.isInside(mousePos)) {
				if (!ce.visible) ce.flagged = !ce.flagged;
				break;
			}
		}
	}
	evt.preventDefault();
	evt.stopPropagation();
	redraw();
	calc();
}

function mouseUpHandler(evt) {
	//console.log("up = " + evt.button + " " + evt.buttons);
	if (doubleMouse) {
		doubleMouse = false;
	}
	for (let ce of cells) {
		ce.isClicked = false;
	}
	redraw();
	calc();
	evt.preventDefault();
	evt.stopPropagation();
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (evt.buttons == 1) {
		globalTranslateX += evt.movementX / globalScale;
		globalTranslateY += evt.movementY / globalScale;
		checkPanZoonBounds();
		redraw();
	}
}

function contextMenuHandler(evt) {
	evt.preventDefault();
	evt.stopPropagation();
}

function wheelHandler(evt) {
	let mp = getMousePos(canvas, evt);
	if (evt.deltaY < 0) {
		if (globalScale < 10) {
			globalScale = globalScale * 1.2;
			globalTranslateX -= mp.x / globalScale * 0.2;
			globalTranslateY -= mp.y / globalScale * 0.2;
		}

	} else {
		globalTranslateX += mp.x / globalScale * 0.2;
		globalTranslateY += mp.y / globalScale * 0.2;
		globalScale = globalScale / 1.2;
	}

	checkPanZoonBounds();
	redraw();
	evt.preventDefault();
	evt.stopPropagation();
}

function keyDownHandler(evt) {
	if (evt.keyCode == 16) {
		// SHIFT
		shiftPressed = true;
		//console.log("SP");
	}
	evt.preventDefault();
	evt.stopPropagation();
}

function keyUpHandler(evt) {

	if (evt.keyCode == 39) {
		// right
		globalTranslateX += 20 / globalScale;
	} else if (evt.keyCode == 37) {
		// left
		globalTranslateX -= 20 / globalScale;
	} else if (evt.keyCode == 38) {
		// up
		globalTranslateY += 20 / globalScale;
	} else if (evt.keyCode == 40) {
		// down
		globalTranslateY -= 20 / globalScale;
	} else if (evt.keyCode == 16) {
		// SHIFT
		shiftPressed = false;
	}
	evt.preventDefault();
	evt.stopPropagation();
	checkPanZoonBounds();
	redraw();
}

function checkPanZoonBounds() {
	//console.log(globalScale);
	if (globalScale < 1) {
		globalScale = 1;
	}
	if (globalScale > 10) {
		globalScale = 10;
	}
	if (globalTranslateX > 0) {
		globalTranslateX = 0;
	}
	if (globalTranslateX < canvas.width * (1 / globalScale - 1)) {
		globalTranslateX = canvas.width * (1 / globalScale - 1);
	}
	if (globalTranslateY > 0) {
		globalTranslateY = 0;
	}
	if (globalTranslateY < canvas.height * (1 / globalScale - 1)) {
		globalTranslateY = canvas.height * (1 / globalScale - 1);
	}
}


function touchStartHandler(evt) {
	evt.preventDefault();
	if (evt.touches.length == 1 && evt.changedTouches.length == 1) {
		startTouch.x = evt.changedTouches[0].pageX;
		startTouch.y = evt.changedTouches[0].pageY;
		if (!fingerMoved) {
			let rect = canvas.getBoundingClientRect();
			pos = {
				x: (evt.changedTouches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.changedTouches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			console.log(pos);
			for (let ce of cells) {
				if (ce.isInside(pos)) {
					// Set timeout for long press = set flag
					setTimeout(checkFlag, 400);
					highlightedCell = ce;
					ce.isClicked = true;
					if (!ce.flagged) {
						// Double tap = clear neighbour cells
						let now = new Date().getTime();
						if ((now - lastTap) < 500 && ce === highlightedCell) {
							highlightedCell.clearNumber();
							highlightedCell.markNeigh();
							setTimeout(clearMarked, 300);
						}
						lastTap = now;
					}
					break;
				}
			}
		}
		fingerMoved = false;
	} else if (evt.touches.length == 2) {
		fingerMoved = true;
		if (evt.touches.length > 1) {
			let rect = canvas.getBoundingClientRect();
			let pos1 = {
				x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			let pos2 = {
				x: (evt.touches[1].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.touches[1].pageY - rect.top) / globalScale - globalTranslateY
			};
			posCenterPinch.x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
			posCenterPinch.y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;
			distPinch = Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));
			//invisibleCol = "#FFFFFF";
		}
	} else {
		fingerMoved = true;
	}
	redraw();
	calc();
}


function touchEndHandler(evt) {
	evt.preventDefault();
	highlightedCell.isClicked = false;

	if (evt.touches.length == 0 && evt.changedTouches.length == 1) {
		if (!fingerMoved) {
			let rect = canvas.getBoundingClientRect();
			pos = {
				x: (evt.changedTouches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.changedTouches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			console.log(pos);
			for (let ce of cells) {
				if (ce.isInside(pos)) {
					ce.click();
					break;
				}
			}
		}
		fingerMoved = false;
	}
	redraw();
	calc();
}

function touchMoveHandler(evt) {
	evt.preventDefault();

	if (evt.touches.length > 1) {
		// at least two fingers: Pinch zoom and pan
		highlightedCell.isClicked = false;
		fingerMoved = true;
		let rect = canvas.getBoundingClientRect();
		let pos1 = {
			x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
		};
		let pos2 = {
			x: (evt.touches[1].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[1].pageY - rect.top) / globalScale - globalTranslateY
		};
		let distTemp = Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));

		let pinchTempX = (pos1.x + pos2.x) / 2;
		let pinchTempY = (pos1.y + pos2.y) / 2;

		//posCenterPinch.x = (pos1.x+pos2.x)/2;
		//posCenterPinch.y = (pos1.y+pos2.y)/2;

		globalScale *= distTemp / distPinch;
		if (globalScale < 10 && globalScale > 1) {
			globalTranslateX += pinchTempX / globalScale * (1 - distTemp / distPinch);
			globalTranslateY += pinchTempY / globalScale * (1 - distTemp / distPinch);
		}

		globalTranslateX += (((evt.touches[0].pageX + evt.touches[1].pageX) / 2) - posCenterPinch.x) / globalScale;
		globalTranslateY += (((evt.touches[0].pageY + evt.touches[1].pageY) / 2) - posCenterPinch.y) / globalScale;

		posCenterPinch.x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
		posCenterPinch.y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;

		checkPanZoonBounds();


	} else if (evt.touches.length == 1) {
		let rect = canvas.getBoundingClientRect();
		let pos1 = {
			x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
		};
		if (!highlightedCell.isInside(pos1)) {
			// finger has moved outside the cell
			highlightedCell.isClicked = false;
			fingerMoved = true;

			//move with one finger
			globalTranslateX += (evt.changedTouches[0].pageX - startTouch.x) / globalScale;
			globalTranslateY += (evt.changedTouches[0].pageY - startTouch.y) / globalScale;

			startTouch.x = evt.changedTouches[0].pageX;
			startTouch.y = evt.changedTouches[0].pageY;

			checkPanZoonBounds();
		}
	}
	redraw();
}

function moveMenu() {
	let menu = document.getElementById("mainMenu");
	if (menuVisible) {
		menu.style.transform = "translateY(80px) scale(1.8)";
	} else {
		menu.style.transform = "scale(1) translateY(-168px)";
	}
	menuVisible = !menuVisible;
}

function showPopup() {
	let msgBox = document.getElementById("msgBox2");
	if (msgBox.style.opacity == "0") {
		msgBox.style.opacity = "1";
		msgBox.style.visibility = "visible";
	} else if (msgBox.style.opacity == "1") {
		msgBox.style.opacity = "0";
		msgBox.style.visibility = "hidden";
	} else {
		msgBox.style.opacity = "1";
		msgBox.style.visibility = "visible";
	}
}

function showSettings() {
	let settings = document.getElementById("settings");
	if (settings.style.opacity == "0") {
		settings.style.opacity = "1";
		settings.style.visibility = "visible";
	} else if (settings.style.opacity == "1") {
		settings.style.opacity = "0";
		settings.style.visibility = "hidden";
	} else {
		settings.style.opacity = "1";
		settings.style.visibility = "visible";
	}
}
