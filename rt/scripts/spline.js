class Spline {
	constructor(smoothness = 10, color = "red") {
		this.step = 1 / smoothness;
		this.col = color;
		this.points = [];
	}

	getSplinePoint(t, loop = false) {
		let p0, p1, p2, p3;

		if (loop) {
			p1 = Math.floor(t);
			p2 = (p1 + 1) % this.points.length;
			p3 = (p2 + 1) % this.points.length;
			p0 = (p1 - 1) % this.points.length;
			if (p0 < 0) p0 = this.points.length + p0;
		} else {
			p1 = Math.floor(t) + 1;
			p2 = p1 + 1;
			p3 = p2 + 1;
			p0 = p1 - 1;
		}

		t = t - Math.floor(t);

		let tt = t * t;
		let ttt = tt * t;

		let q1 = -ttt + 2.0 * tt - t;
		let q2 = 3.0 * ttt - 5.0 * tt + 2.0;
		let q3 = -3.0 * ttt + 4.0 * tt + t;
		let q4 = ttt - tt;

		let tx =
			0.5 *
			(this.points[p0].x * q1 +
				this.points[p1].x * q2 +
				this.points[p2].x * q3 +
				this.points[p3].x * q4);
		let ty =
			0.5 *
			(this.points[p0].y * q1 +
				this.points[p1].y * q2 +
				this.points[p2].y * q3 +
				this.points[p3].y * q4);

		return new Point2D(tx, ty);
	}

	getSplineGardient(t, loop = false) {
		let p0, p1, p2, p3;

		if (loop) {
			p1 = Math.floor(t);
			p2 = (p1 + 1) % this.points.length;
			p3 = (p2 + 1) % this.points.length;
			p0 = (p1 - 1) % this.points.length;
			if (p0 < 0) p0 = this.points.length + p0;
		} else {
			p1 = Math.floor(t) + 1;
			p2 = p1 + 1;
			p3 = p2 + 1;
			p0 = p1 - 1;
		}

		t = t - Math.floor(t);

		let tt = t * t;
		let ttt = tt * t;

		let q1 = -3.0 * tt + 4.0 * t - 1.0;
		let q2 = 9.0 * tt - 10.0 * t;
		let q3 = -9.0 * tt + 8.0 * t + 1.0;
		let q4 = 3.0 * tt - 2.0 * t;

		let tx =
			0.5 *
			(this.points[p0].x * q1 +
				this.points[p1].x * q2 +
				this.points[p2].x * q3 +
				this.points[p3].x * q4);
		let ty =
			0.5 *
			(this.points[p0].y * q1 +
				this.points[p1].y * q2 +
				this.points[p2].y * q3 +
				this.points[p3].y * q4);
		return new Point2D(tx, ty);
	}

	draw(ctx) {
		ctx.strokeStyle = this.col;
		ctx.beginPath();
		for (let t = 0.0; t < this.points.length; t += this.step) {
			let p = this.getSplinePoint(t, true);
			ctx.lineTo(p.x, p.y);
		}
		ctx.lineTo(this.points[0].x, this.points[0].y);
		ctx.stroke();
	}

	getSplineGardAng(t, loop = false) {
		let g = this.getSplineGardient(t, loop);
		return Math.atan2(g.y, g.x);
	}

	drawPoints(ctx, col = "red") {
		for (let p of this.points) p.draw(ctx, col);
	}

	drawTangent(t, ctx) {
		let g = this.getSplineGardient(t, true);
		let a = g.getAngle();
		let p = this.getSplinePoint(t, true);
		ctx.strokeStyle = "green";
		ctx.beginPath();
		ctx.moveTo(p.x - Math.cos(a) * 50, p.y - Math.sin(a) * 50);
		ctx.lineTo(p.x + Math.cos(a) * 50, p.y + Math.sin(a) * 50);
		ctx.stroke();
		ctx.strokeRect(p.x - 2, p.y - 2, 5, 5);
	}

	drawCar(t, ctx) {
		let g = this.getSplineGardient(t, true);
		let a = g.getAngle();
		let p = this.getSplinePoint(t, true);
		ctx.strokeStyle = "Blue";
		ctx.beginPath();
		ctx.moveTo(p.x + Math.cos(a) * 20, p.y + Math.sin(a) * 20);
		ctx.lineTo(p.x - Math.cos(a + 1) * 12, p.y - Math.sin(a + 1) * 12);
		ctx.lineTo(p.x - Math.cos(a - 1) * 12, p.y - Math.sin(a - 1) * 12);
		ctx.lineTo(p.x + Math.cos(a) * 20, p.y + Math.sin(a) * 20);
		ctx.stroke();
	}
}
