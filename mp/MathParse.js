window.onload = function() {
	canvas = document.getElementById("plotCanvas");
	ctx = canvas.getContext("2d");
	document.addEventListener("keydown", keyDownHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener("wheel", mouseWheelHandler, false);
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	}
	mousePosStart = {
		x: canvas.width / 2,
		y: canvas.height / 2
	}
	setup();
}

let out;
let outs = [];
let formulas = [];
let startX = -5;
let endX = 5;
let startY = 2;
let steps = 200;

let mousePos;
let mousePosStart;
let mousePressed = false;

let rows = 0;

function parseText() {
	out = MathParse.parse(document.getElementById('expr').value.toLowerCase(), 1);
	document.getElementById('output').value = out;
}

function parseT() {
	out = MathParse.parseTree(document.getElementById('expr').value.toLowerCase(), 1);
	document.getElementById('output').value = out.toString() + " = " + out.calculate(1);
}

function plot() {
	console.time("Plot time");
	let scale = canvas.width / (endX - startX);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = "10px Arial";
	ctx.fillStyle = "black";
	let txt;

	//grid
	let step = Math.pow(10, 2 - Math.floor(0.5 + Math.log10(scale)));
	let digits = Math.log10(1 / step);
	if (digits < 0) digits = 0;
	let y1 = Math.floor(((scale * startY) - mousePos.y + mousePosStart.y - canvas.height) / (scale * step));
	let y2 = Math.floor(((scale * startY) - mousePos.y + mousePosStart.y) / (scale * step));
	for (let i = y1; i <= y2; i++) {
		if (i == 0) {
			ctx.strokeStyle = "black";
		} else {
			ctx.strokeStyle = "rgb(220,220,220)";
		}
		ctx.beginPath();
		ctx.moveTo(0, canvas.height + (mousePos.y - mousePosStart.y - ((startY - (i * step)) * scale)));
		ctx.lineTo(canvas.width, canvas.height + (mousePos.y - mousePosStart.y - ((startY - (i * step)) * scale)));
		ctx.stroke();

		ctx.textAlign = "left";
		txt = -i * step;
		ctx.fillText(txt.toFixed(digits), 5, canvas.height + (mousePos.y - mousePosStart.y - ((startY - (i * step)) * scale)) - 1);

	}
	let scale2 = scale * step;
	let x1 = Math.floor((startX + ((mousePosStart.x - mousePos.x) / scale)) / step);
	let x2 = Math.floor((endX + ((mousePosStart.x - mousePos.x) / scale)) / step);

	for (let i = x1; i <= x2; i++) {
		if (i == 0) {
			ctx.strokeStyle = "black";
		} else {
			ctx.strokeStyle = "rgb(220,220,220)";
		}
		ctx.beginPath();
		ctx.moveTo((mousePos.x - mousePosStart.x - ((startX - (i * step)) * scale)), 0);
		ctx.lineTo((mousePos.x - mousePosStart.x - ((startX - (i * step)) * scale)), canvas.height);
		ctx.stroke();

		ctx.textAlign = "center";
		txt = i * step;
		ctx.fillText(txt.toFixed(digits), (mousePos.x - mousePosStart.x - ((startX - (i * step)) * scale)), canvas.height - 5);

	}

	for (let o of outs) {
		if (o == "") continue;
		ctx.beginPath();
		//out = MathParse.parseTree(document.getElementById('expr').value.toLowerCase());
		ctx.strokeStyle = o.color;
		for (let i = 0; i <= steps; i++) {
			let x = (startX + ((mousePosStart.x - mousePos.x) / scale)) + (i * ((endX - startX) / steps));
			let y = mousePosStart.y - mousePos.y + (o.calculate(x) + startY) * scale;
			ctx.lineTo(mousePos.x - mousePosStart.x + (x - startX) * scale, canvas.height - y);
		}
		ctx.stroke();
	}
	console.timeEnd("Plot time");
}

function mouseMoveHandler(evt) {
	if (mousePressed) {
		mousePos = getMousePos(canvas, evt);
		plot();
	}
}

function mouseDownHandler(evt) {
	if (evt.button == 0) {
		mousePressed = true;
	}
	mousePos = getMousePos(canvas, evt);
	mousePosStart = mousePos;
}

function mouseUpHandler(evt) {
	let scale = canvas.width / (endX - startX);
	if (evt.button == 0) {
		mousePressed = false;
		startX += (mousePosStart.x - mousePos.x) / scale;
		endX += (mousePosStart.x - mousePos.x) / scale;
		startY += (mousePosStart.y - mousePos.y) / scale;
		mousePosStart.x = mousePos.x;
		mousePosStart.y = mousePos.y;
		plot();
	}
}

function mouseWheelHandler(evt) {
	let mp = getMousePos(canvas, evt);
	let scale = canvas.width / (endX - startX);
	startX -= evt.deltaY / 1000 * mp.x / scale;
	endX += evt.deltaY / 1000 * (canvas.width - mp.x) / scale;
	startY += evt.deltaY / 1000 * (canvas.height - mp.y) / scale;
	plot();
	evt.preventDefault();
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function keyDownHandler(evt) {
	if (evt.keyCode == 38) { // up
		startX -= (endX - startX) / 10;
		endX += (endX - startX) / 10;
		startY += (endX - startX) / 10;
		plot();
	} else if (evt.keyCode == 40) { // down
		startX += (endX - startX) / 10;
		endX -= (endX - startX) / 10;
		startY -= (endX - startX) / 10;
		plot();
	}

}

function draw() {
	// sin(1+1+tanh(x)+(1+1)+(x*5)) example function
	let maxL = outs[0].getMaxLevel(1);
	let ca = document.getElementById("drawCanvas");
	let ct = ca.getContext("2d");
	ct.fillStyle = "white";
	ct.fillRect(0, 0, ca.width, ca.height);
	ct.strokeStyle = "black";
	ct.strokeRect(0, 0, ca.width, ca.height);

	// Tree graph initialization
	outs[0].setLevel(-1);
	let j = 1;
	for (let i = 0; i < maxL; i++) {
		//console.log("Nodes at level " + i);
		let arr = outs[0].getNodesAtLevel(i);

		for (let n of arr) {
			n.draw(ca, (ca.width / 2) + (40 * (j - 1)) - (40 * (arr.length - 1) / 2));
			j++
		}
		j = 1;
	}

	for (let k = 0; k < 300; k++) {
		ct.fillStyle = "white";
		ct.fillRect(0, 0, ca.width, ca.height);
		ct.strokeStyle = "black";
		ct.strokeRect(0, 0, ca.width, ca.height);
		outs[0].draw(ca, outs[0].pos.x);
		for (let i = 1; i < maxL; i++) {
			//console.log("Nodes at level " + i);
			let arr = outs[0].getNodesAtLevel(i);
			for (let n of arr) {
				let newX = n.pos.x + (n.parent.pos.x - n.pos.x) / 70;
				for (let m of arr) {
					if (n != m) {
						let dist = m.pos.x - n.pos.x;
						if (dist < 40 && dist > -40) {
							newX -= dist / 10;
						}
					}
				}
				n.draw(ca, newX);
				j++
			}
			j = 1;
		}
	}
}


function setup() {
	addRow();
	addRow();
}

function update(id) {
	outs[id] = MathParse.parseTree(formulas[id].value);
	setColor(id);
	plot();
	draw();
}

function addRow() {
	let mainDiv = document.getElementById("mainDiv");
	let innerDiv = document.createElement('div');
	innerDiv.setAttribute('id', 'row' + rows);
	innerDiv.setAttribute('class', 'formula');

	let formula = document.createElement('input');
	formula.setAttribute('type', 'text');
	formula.setAttribute('size', '40');
	if (rows != 0) {
		formula.setAttribute('value', 'x');
	} else {
		formula.setAttribute('value', '(1+x+log(x^2)*x)^2/(x^4+1)');
	}
	formula.setAttribute('onchange', 'update(' + rows + ');');
	innerDiv.appendChild(formula);
	formulas.push(formula);

	let colorPic = document.createElement('input');
	colorPic.setAttribute('id', 'color' + rows);
	colorPic.setAttribute('type', 'color');
	colorPic.setAttribute('onchange', 'setColor(' + rows + ')');
	if (rows != 0) {
		colorPic.setAttribute('value', '#000000');
	} else {
		colorPic.setAttribute('value', '#ff0000');
	}
	innerDiv.appendChild(colorPic);

	if (rows != 0) {
		let minusButton = document.createElement('input');
		minusButton.setAttribute('type', 'button');
		minusButton.setAttribute('value', '-');
		minusButton.setAttribute('onclick', 'removeRow(' + rows + ')');
		innerDiv.appendChild(minusButton);
	}

	mainDiv.appendChild(innerDiv);
	rows++;

	let o = MathParse.parseTree(formula.value);
	outs.push(o);
	o.color = colorPic.value;

	plot();
	draw();
}

function removeRow(id) {
	formulas[id] = "";
	outs[id] = "";
	let element = document.getElementById('row' + id);
	element.parentNode.removeChild(element);
	plot();
}

function setColor(id) {
	let element = document.getElementById('color' + id);
	//out.color = element.value;
	outs[id].color = element.value;
	plot();
}

class MathParse {

	static parse(block, xVal) {
		let currIndex = 0;
		let result = 0;
		let depth = 0;
		// Handle double negatives
		while (block.indexOf('--') != -1 || block.indexOf('-+') != -1) {
			block = block.replace("--", "+");
			block = block.replace("-+", "-");
		}
		// Check for simple number
		if (block.indexOf('+') == -1 &&
			block.indexOf('-') == -1 &&
			block.indexOf('*') == -1 &&
			block.indexOf('/') == -1 &&
			block.indexOf('^') == -1 &&
			block.indexOf('(') == -1 &&
			block.indexOf(')') == -1) {
			if (block == "" || block == null) {
				// handles negative numbers
				return 0;
			} else if (block == "x") {
				return xVal;
			} else {
				return Number(block);
			}
		}
		// Serching + or - operator outside brackets
		depth = 0;
		currIndex = block.length - 1;
		while (currIndex >= 0) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '+') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex), xVal) + MathParse.parse(block.substring(currIndex + 1, block.length), xVal);
			} else if ((block.charAt(currIndex) == '-') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex), xVal) - MathParse.parse(block.substring(currIndex + 1, block.length), xVal);
			}
			currIndex--;
		}
		// Serching * or / operator outside brackets
		depth = 0;
		currIndex = block.length - 1;
		while (currIndex >= 0) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '*') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex), xVal) * MathParse.parse(block.substring(currIndex + 1, block.length), xVal);
			} else if ((block.charAt(currIndex) == '/') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex), xVal) / MathParse.parse(block.substring(currIndex + 1, block.length), xVal);
			}
			currIndex--;
		}
		// Serching ^ operator outside brackets
		depth = 0;
		currIndex = 0;
		while (currIndex < block.length) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '^') && (depth == 0)) {
				return Math.pow(MathParse.parse(block.substring(0, currIndex), xVal), MathParse.parse(block.substring(currIndex + 1, block.length), xVal));
			}
			currIndex++;
		}
		// Verify all the brackets
		if (depth != 0) {
			console.log(depth);
			console.log("Errore, parentesi non coerenti!!!");
		}
		// No operator outside brackets
		if (block.indexOf('(') == 0) {
			// Block with only brackets
			return MathParse.parse(block.substring(1, block.length - 1), xVal);
		} else {
			// Block with Math operation
			let oper = block.substring(0, block.indexOf('('));
			if ("sin" === oper) {
				return Math.sin(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("sinh" === oper) {
				return Math.sinh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("cos" === oper) {
				return Math.cos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("cosh" === oper) {
				return Math.cosh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("asin" === oper) {
				return Math.asin(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("asinh" === oper) {
				return Math.asinh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("acos" === oper) {
				return Math.acos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("acosh" === oper) {
				return Math.acosh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("tan" === oper) {
				return Math.tan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("tanh" === oper) {
				return Math.tanh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("atan" === oper) {
				return Math.atan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("atanh" === oper) {
				return Math.atanh(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("sqrt" === oper) {
				return Math.sqrt(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("log" === oper) {
				return Math.log(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("log10" === oper) {
				return Math.log10(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("log2" === oper) {
				return Math.log2(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("exp" === oper) {
				return Math.exp(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else {
				console.log("Funzione non riconosciuta");
			}
			return 0;
		}
	}

	static parseTree(block) {
		let currIndex = 0;
		let result = 0;
		let depth = 0;
		// Handle double negatives
		while (block.indexOf('--') != -1 || block.indexOf('-+') != -1) {
			block = block.replace("--", "+");
			block = block.replace("-+", "-");
		}
		// Check for simple number
		if (block.indexOf('+') == -1 &&
			block.indexOf('-') == -1 &&
			block.indexOf('*') == -1 &&
			block.indexOf('/') == -1 &&
			block.indexOf('^') == -1 &&
			block.indexOf('(') == -1 &&
			block.indexOf(')') == -1) {
			if (block == "" || block == null) {
				// handles negative numbers
				return new Operation("N", 0);
			} else if (block == "x") {
				return new Operation("X", 0);
			} else {
				return new Operation("N", Number(block));
			}
		}
		// Serching + or - operator outside brackets
		depth = 0;
		currIndex = block.length - 1;
		while (currIndex >= 0) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '+') && (depth == 0)) {
				let add = new Operation("+", 0);
				add.children[0] = MathParse.parseTree(block.substring(0, currIndex));
				add.children[1] = MathParse.parseTree(block.substring(currIndex + 1, block.length));
				return add;
				//return MathParse.parse(block.substring(0, currIndex), xVal) + MathParse.parse(block.substring(currIndex + 1, block.length), xVal);
			} else if ((block.charAt(currIndex) == '-') && (depth == 0)) {
				let sub = new Operation("-", 0);
				sub.children[0] = MathParse.parseTree(block.substring(0, currIndex));
				sub.children[1] = MathParse.parseTree(block.substring(currIndex + 1, block.length));
				return sub;
			}
			currIndex--;
		}
		// Serching * or / operator outside brackets
		depth = 0;
		currIndex = block.length - 1;
		while (currIndex >= 0) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '*') && (depth == 0)) {
				let mult = new Operation("*", 0);
				mult.children[0] = MathParse.parseTree(block.substring(0, currIndex));
				mult.children[1] = MathParse.parseTree(block.substring(currIndex + 1, block.length));
				return mult;
			} else if ((block.charAt(currIndex) == '/') && (depth == 0)) {
				let div = new Operation("/", 0);
				div.children[0] = MathParse.parseTree(block.substring(0, currIndex));
				div.children[1] = MathParse.parseTree(block.substring(currIndex + 1, block.length));
				return div;
			}
			currIndex--;
		}
		// Serching ^ operator outside brackets
		depth = 0;
		currIndex = 0;
		while (currIndex < block.length) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '^') && (depth == 0)) {
				let pow = new Operation("^", 0);
				pow.children[0] = MathParse.parseTree(block.substring(0, currIndex));
				pow.children[1] = MathParse.parseTree(block.substring(currIndex + 1, block.length));
				return pow;
			}
			currIndex++;
		}
		// Verify all the brackets
		if (depth != 0) {
			console.log(depth);
			console.log("Errore, parentesi non coerenti!!!");
		}
		// No operator outside brackets
		if (block.indexOf('(') == 0) {
			// Block with only brackets
			let par = new Operation("()", 0)
			par.children[0] = MathParse.parseTree(block.substring(1, block.length - 1));
			return par;
		} else {
			// Block with Math operation
			let oper = block.substring(0, block.indexOf('('));
			if ("sin" === oper) {
				let op = new Operation("sin", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("sinh" === oper) {
				let op = new Operation("sinh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("cos" === oper) {
				let op = new Operation("cos", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("cosh" === oper) {
				let op = new Operation("cosh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("asin" === oper) {
				let op = new Operation("asin", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("asinh" === oper) {
				let op = new Operation("asinh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("acos" === oper) {
				let op = new Operation("acos", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("acosh" === oper) {
				let op = new Operation("acosh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("tan" === oper) {
				let op = new Operation("tan", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("tanh" === oper) {
				let op = new Operation("tanh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("atan" === oper) {
				let op = new Operation("atan", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("atanh" === oper) {
				let op = new Operation("atanh", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("sqrt" === oper) {
				let op = new Operation("sqrt", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("log" === oper) {
				let op = new Operation("log", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("log10" === oper) {
				let op = new Operation("log10", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("log2" === oper) {
				let op = new Operation("log2", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else if ("exp" === oper) {
				let op = new Operation("exp", 0)
				op.children[0] = MathParse.parseTree(block.substring(block.indexOf('(') + 1, block.length - 1));
				return op;
			} else {
				console.log("Funzione non riconosciuta: " + oper);
			}
			return 0;
		}
	}

}
