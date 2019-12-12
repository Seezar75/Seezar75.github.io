class Point2D {
	constructor(_x, _y) {
		this.x = _x;
		this.y = _y;
	}

	setCoord(p) {
		this.x = p.x;
		this.y = p.y;
	}

	draw(ctx, col = "red", size = 5) {
		ctx.strokeStyle = col;
		ctx.strokeRect(this.x - size / 2, this.y - size / 2, size, size);
	}

	dist(point) {
		return Math.sqrt(
			(point.y - this.y) * (point.y - this.y) +
				(point.x - this.x) * (point.x - this.x)
		);
	}
	
	dot(v) {
		return (this.x*v.x) + (this.y*v.y);
	}

	getAngle() {
		return Math.atan2(this.y, this.x);
	}

	getModule() {
		return Math.sqrt(this.y * this.y + this.x * this.x);
	}

	normalize() {
		let m = this.getModule();
		this.multiplyScalar(1 / m);
	}

	neg() {
		this.x = -this.x;
		this.y = -this.y;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
	}

	multiplyScalar(m) {
		this.x = this.x * m;
		this.y = this.y * m;
	}

	multiply(v) {
		let tempX = this.x;
		this.x = this.x * v.x - this.y * v.y;
		this.y = tempX * v.y + this.y * v.x;
	}

	divide(v) {
		let tempX = this.x;
		let den = v.x * v.x + v.y * v.y;
		this.x = (this.x * v.x + this.y * v.y) / den;
		this.y = (this.y * v.x - tempX * v.y) / den;
	}
}

class Intersection {
	constructor(_x, _y, _line, _prevIndex) {
		this.x = _x;
		this.y = _y;
		this.line = _line;
		this.prevIndex = _prevIndex;
	}

	draw(ctx, col = "red", size = 5) {
		ctx.strokeStyle = col;
		ctx.strokeRect(this.x - size / 2, this.y - size / 2, size, size);
	}

	dist(point) {
		return Math.sqrt(
			(point.y - this.y) * (point.y - this.y) +
				(point.x - this.x) * (point.x - this.x)
		);
	}
}
