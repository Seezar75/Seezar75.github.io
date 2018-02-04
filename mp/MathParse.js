window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
}

function parseText() {
	let out = MathParse.parse(document.getElementById('expr').value.toLowerCase(), 0);
	document.getElementById('output').value = out;
}

function plot() {
	console.time("Plot time");
	let steps = 100;
	let scaleX = canvas.width/steps;
	let scaleY = scaleX;
	let out = 0;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = "red";
	for(let i = 0; i <= steps; i++) {
		out = MathParse.parse(document.getElementById('expr').value.toLowerCase(), i);
		ctx.lineTo(i*scaleX, canvas.height-(out*scaleY));
	}
	ctx.stroke();
	console.timeEnd("Plot time");
}

class MathParse {

	static parse(block, xVal) {
		let currIndex = 0;
		let result = 0;
		let depth = 0;
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
		currIndex = block.length-1;
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
		currIndex = block.length-1;
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
			} else if ("cos" === oper) {
				return Math.cos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("asin" === oper) {
				return Math.asin(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("acos" === oper) {
				return Math.acos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("tan" === oper) {
				return Math.tan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("atan" === oper) {
				return Math.atan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("sqrt" === oper) {
				return Math.sqrt(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("log" === oper) {
				return Math.log(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else if ("exp" === oper) {
				return Math.exp(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1), xVal));
			} else {
				console.log("Funzione non riconosciuta");
			}
			return 0;
		}
	}
}
