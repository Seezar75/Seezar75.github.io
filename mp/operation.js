class Operation {

	constructor(type, value) {
		this.type = type;
		this.value = value;
		this.children = [];
		this.pos = {
			x: 0,
			y: 0
		};
		this.level = 0;
		this.parent;
		this.color = "#FF0000";
	}

	calculate(xVal) {
		if (this.type == "N") {
			return this.value;
		} else if (this.type == "X") {
			return xVal;
		} else if (this.type == "+") {
			return this.children[0].calculate(xVal) + this.children[1].calculate(xVal);
		} else if (this.type == "-") {
			return this.children[0].calculate(xVal) - this.children[1].calculate(xVal);
		} else if (this.type == "*") {
			return this.children[0].calculate(xVal) * this.children[1].calculate(xVal);
		} else if (this.type == "/") {
			return this.children[0].calculate(xVal) / this.children[1].calculate(xVal);
		} else if (this.type == "^") {
			return Math.pow(this.children[0].calculate(xVal), this.children[1].calculate(xVal));
		} else if (this.type == "()") {
			return this.children[0].calculate(xVal);
		} else if (this.type == "sin") {
			return Math.sin(this.children[0].calculate(xVal));
		} else if (this.type == "sinh") {
			return Math.sinh(this.children[0].calculate(xVal));
		} else if (this.type == "cos") {
			return Math.cos(this.children[0].calculate(xVal));
		} else if (this.type == "cosh") {
			return Math.cosh(this.children[0].calculate(xVal));
		} else if (this.type == "asin") {
			return Math.asin(this.children[0].calculate(xVal));
		} else if (this.type == "asinh") {
			return Math.asinh(this.children[0].calculate(xVal));
		} else if (this.type == "acos") {
			return Math.acos(this.children[0].calculate(xVal));
		} else if (this.type == "acosh") {
			return Math.acosh(this.children[0].calculate(xVal));
		} else if (this.type == "tan") {
			return Math.tan(this.children[0].calculate(xVal));
		} else if (this.type == "tanh") {
			return Math.tanh(this.children[0].calculate(xVal));
		} else if (this.type == "atan") {
			return Math.atan(this.children[0].calculate(xVal));
		} else if (this.type == "atanh") {
			return Math.atanh(this.children[0].calculate(xVal));
		} else if (this.type == "sqrt") {
			return Math.sqrt(this.children[0].calculate(xVal));
		} else if (this.type == "log") {
			return Math.log(this.children[0].calculate(xVal));
		} else if (this.type == "log10") {
			return Math.log10(this.children[0].calculate(xVal));
		} else if (this.type == "log2") {
			return Math.log2(this.children[0].calculate(xVal));
		} else if (this.type == "exp") {
			return Math.exp(this.children[0].calculate(xVal));
		} else {
			return 1;
		}
	}

	toString() {
		if (this.type == "N") {
			return this.value;
		} else if (this.type == "X") {
			return "x";
		} else if (this.type == "+") {
			return this.children[0].toString() + " + " + this.children[1].toString();
		} else if (this.type == "-") {
			return this.children[0].toString() + " - " + this.children[1].toString();
		} else if (this.type == "*") {
			return this.children[0].toString() + " * " + this.children[1].toString();
		} else if (this.type == "/") {
			return this.children[0].toString() + " / " + this.children[1].toString();
		} else if (this.type == "^") {
			return this.children[0].toString() + "^" + this.children[1].toString();
		} else if (this.type == "()") {
			return "(" + this.children[0].toString() + ")";
		} else if (this.type == "sin") {
			return "sin(" + this.children[0].toString() + ")";
		} else if (this.type == "sinh") {
			return "sinh(" + this.children[0].toString() + ")";
		} else if (this.type == "cos") {
			return "cos(" + this.children[0].toString() + ")";
		} else if (this.type == "cosh") {
			return "cosh(" + this.children[0].toString() + ")";
		} else if (this.type == "asin") {
			return "asin(" + this.children[0].toString() + ")";
		} else if (this.type == "asinh") {
			return "asinh(" + this.children[0].toString() + ")";
		} else if (this.type == "acos") {
			return "acos(" + this.children[0].toString() + ")";
		} else if (this.type == "acosh") {
			return "acosh(" + this.children[0].toString() + ")";
		} else if (this.type == "tan") {
			return "tan(" + this.children[0].toString() + ")";
		} else if (this.type == "tanh") {
			return "tanh(" + this.children[0].toString() + ")";
		} else if (this.type == "atan") {
			return "atan(" + this.children[0].toString() + ")";
		} else if (this.type == "atanh") {
			return "atanh(" + this.children[0].toString() + ")";
		} else if (this.type == "sqrt") {
			return "sqrt(" + this.children[0].toString() + ")";
		} else if (this.type == "log") {
			return "log(" + this.children[0].toString() + ")";
		} else if (this.type == "log10") {
			return "log10(" + this.children[0].toString() + ")";
		} else if (this.type == "log2") {
			return "log2(" + this.children[0].toString() + ")";
		} else if (this.type == "exp") {
			return "exp(" + this.children[0].toString() + ")";
		} else {
			return "Boh!!";
		}
	}

	drawOld(canv, level, parent, x, y, maxLevel) {
		let context = canv.getContext("2d");
		this.pos = {
			x: x,
			y: y
		};
		context.beginPath();
		context.arc(x, y, 15, 0, Math.PI * 2);
		context.strokeStyle = "red";
		context.stroke();
		context.closePath();
		context.font = "20px Arial";
		context.fillStyle = "black";
		context.textAlign = "center";
		let txt = this.type;
		if (txt == "N") txt = this.value;
		context.fillText(txt, x, y + 8);
		let i = 1;
		let spacing = 31 * (maxLevel - level);
		for (let c of this.children) {
			let p = this.pos.x + (spacing * (i - 1)) - (spacing * (this.children.length - 1) / 2);
			c.draw(canv, level + 1, this, p, this.pos.y + 40, maxLevel);
			i++;
		}
		if (level > 0) {
			//let diag = Math.sqrt(Math.pow(parent.pos.x - this.pos.x, 2) + Math.pow(parent.pos.y - this.pos.y, 2));
			let ang = Math.atan2(parent.pos.y - this.pos.y, parent.pos.x - this.pos.x);
			console.log(ang);
			context.strokeStyle = "red";
			context.beginPath();
			context.moveTo(this.pos.x - 15 * cos(ang), this.pos.y - 15 * sin(ang));
			context.lineTo(parent.pos.x + 15 * cos(ang), parent.pos.y + 15 * sin(ang));
			context.stroke();
		}
	}

	draw(canv, x) {
		let y = 40 * (this.level + 1);
		this.pos = {
			x: x,
			y: y
		};
		let context = canv.getContext("2d");
		context.beginPath();
		context.arc(x, y, 15, 0, Math.PI * 2);
		context.strokeStyle = "red";
		context.stroke();
		context.closePath();
		context.font = "20px Arial";
		context.fillStyle = "black";
		context.textAlign = "center";
		let txt = this.type;
		if (txt == "N") txt = this.value;
		context.fillText(txt, x, y + 8);
		if (this.level > 0) {
			let ang = Math.atan2(this.parent.pos.y - this.pos.y, this.parent.pos.x - this.pos.x);
			context.strokeStyle = "red";
			context.beginPath();
			context.moveTo(this.pos.x + 15 * Math.cos(ang), this.pos.y + 15 * Math.sin(ang));
			context.lineTo(this.parent.pos.x - 15 * Math.cos(ang), this.parent.pos.y - 15 * Math.sin(ang));
			context.stroke();
		}
	}

	getMaxLevel(startLevel) {
		if (this.children.length == 0) {
			return startLevel;
		} else {
			let max = 0;
			for (let c of this.children) {
				let cLevel = c.getMaxLevel(startLevel + 1);
				if (cLevel > max) max = cLevel;
			}
			return max;
		}
	}


	setLevel(parentLevel) {
		this.level = parentLevel + 1;
		for (let c of this.children) {
			c.parent = this;
			c.setLevel(this.level);
		}
	}

	getNodesAtLevel(level) {
		let arr = [];
		if (this.level == level) {
			arr.push(this);
		} else {
			for (let c of this.children) {
				arr = arr.concat(c.getNodesAtLevel(level));
			}
		}
		return arr;
	}

}
