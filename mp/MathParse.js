function parseText() {
	let out = MathParse.parse(document.getElementById('expr').value.toLowerCase());
	document.getElementById('output').value = out;
}

class MathParse {

	static parse(block) {
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
			} else {
				return Number(block);
			}
		}
		// Serching + or - operator outside brackets
		depth = 0;
		currIndex = 0;
		while (currIndex < block.length) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '+') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex)) + MathParse.parse(block.substring(currIndex + 1, block.length));
			} else if ((block.charAt(currIndex) == '-') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex)) - MathParse.parse(block.substring(currIndex + 1, block.length));
			}
			currIndex++;
		}
		// Serching * or / operator outside brackets
		depth = 0;
		currIndex = 0;
		while (currIndex < block.length) {
			if (block.charAt(currIndex) == '(') {
				depth++;
			} else if (block.charAt(currIndex) == ')') {
				depth--;
			} else if ((block.charAt(currIndex) == '*') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex)) * MathParse.parse(block.substring(currIndex + 1, block.length));
			} else if ((block.charAt(currIndex) == '/') && (depth == 0)) {
				return MathParse.parse(block.substring(0, currIndex)) / MathParse.parse(block.substring(currIndex + 1, block.length));
			}
			currIndex++;
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
				return Math.pow(MathParse.parse(block.substring(0, currIndex)), MathParse.parse(block.substring(currIndex + 1, block.length)));
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
			return MathParse.parse(block.substring(1, block.length - 1));
		} else {
			// Block with Math operation
			let oper = block.substring(0, block.indexOf('('));
			if ("sin" === oper) {
				return Math.sin(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("cos" === oper) {
				return Math.cos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("asin" === oper) {
				return Math.asin(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("acos" === oper) {
				return Math.acos(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("tan" === oper) {
				return Math.tan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("atan" === oper) {
				return Math.atan(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("sqrt" === oper) {
				return Math.sqrt(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("log" === oper) {
				return Math.log(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else if ("exp" === oper) {
				return Math.exp(MathParse.parse(block.substring(block.indexOf('(') + 1, block.length - 1)));
			} else {
				console.log("Funzione non riconosciuta");
			}
			return 0;
		}
	}
}
