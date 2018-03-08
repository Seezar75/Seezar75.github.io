class Wall {
	constructor(p1, p2) {
		this.p1 = new Vector(p1.x, p1.y);
		this.p2 = new Vector(p2.x, p2.y);
	}

	draw() {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.lineWidth = 5;
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.stroke();
	}

	getDist(p) {
		let dy = this.p2.y - this.p1.y;
		let dx = this.p2.x - this.p1.x
		let distLine = (dy * p.x - dx * p.y + this.p2.x * this.p1.y - this.p2.y * this.p1.x) / Math.sqrt(dy * dy + dx * dx);
		console.log(distLine);
	}

	getForceVector(s) {
		let v90 = new Vector(0, -1);
		let v = new Vector(0, 0);
		let dy = this.p2.y - this.p1.y;
		let dx = this.p2.x - this.p1.x
		let distLine = (dy * s.x - dx * s.y + this.p2.x * this.p1.y - this.p2.y * this.p1.x) / Math.sqrt(dy * dy + dx * dx);
		let distP1 = Math.sqrt((s.x - this.p1.x) * (s.x - this.p1.x) + (s.y - this.p1.y) * (s.y - this.p1.y));
		let distP2 = Math.sqrt((s.x - this.p2.x) * (s.x - this.p2.x) + (s.y - this.p2.y) * (s.y - this.p2.y));
		let wallLength = Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x) + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y));
		if ((distP1 * distP1 - distLine * distLine) + (distP2 * distP2 - distLine * distLine) < wallLength * wallLength) {
			// Segment
			if (Math.abs(distLine) < s.size + 5) {
				v = new Vector(dx, dy);
				v.normalize();
				v.multiply(v90);
				v.multiplyScalar(Math.sign(distLine) * 10 / Math.pow(Math.abs(distLine) - s.size + 2, 2));
			}
		} else {
			if (distP1 < distP2) {
				// P1
				if (distP1 < s.size + 5) {
					v = new Vector(s.x - this.p1.x, s.y - this.p1.y);
					v.normalize();
					v.multiplyScalar(10 / Math.pow(distP1 - s.size + 2, 2));
				}
			} else {
				// P2
				if (distP2 < s.size + 5) {
					v = new Vector(s.x - this.p2.x, s.y - this.p2.y);
					v.normalize();
					v.multiplyScalar(10 / Math.pow(distP2 - s.size + 2, 2));
				}
			}
		}
		return v;
	}

}
