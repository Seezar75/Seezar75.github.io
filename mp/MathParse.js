window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
}

let out;

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
	let steps = 100;
	let scaleX = canvas.width / steps;
	let scaleY = scaleX;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = "red";
	out = MathParse.parseTree(document.getElementById('expr').value.toLowerCase());
	for (let i = 0; i <= steps; i++) {
		ctx.lineTo(i * scaleX, canvas.height - (out.calculate(i) * scaleY));
	}
	ctx.stroke();
	console.timeEnd("Plot time");
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
				console.log("Funzione non riconosciuta");
			}
			return 0;
		}
	}

}
