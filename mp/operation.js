class Operation {

	constructor(type, value) {
		this.type = type;
		this.value = value;
		this.children = [];
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

}
