class Car {
	constructor(p, v, col = "Aqua") {
		this.p = new Point2D(p.x, p.y);
		let t = new Point2D(v.x, v.y);
		this.col = col;
		t.normalize();
		this.velVec = t;
		this.vel = 0.0;
	}

	update() {
		let v = new Point2D(this.velVec.x, this.velVec.y);
		v.multiplyScalar(this.vel);
		this.p.add(v);
		if (
			this.p.x < 0 ||
			this.p.x > canvas.width ||
			this.p.y < 0 ||
			this.p.y > canvas.height
		) {
			this.vel = 0.0;
		}
	}
	
	accel() {
		this.vel += 0.015;
	}
	
	break() {
		this.vel -= 0.025;
		if (this.vel < 0) this.vel = 0;
	}
	
	steer(dir) {
		if (dir) {
			this.velVec.multiply(new Point2D(1, -0.04));
			//this.velVec.multiply(new Point2D(1, -this.vel/10));
			this.velVec.normalize();
		} else {
			this.velVec.multiply(new Point2D(1, 0.04));
			//this.velVec.multiply(new Point2D(1, this.vel/10));
			this.velVec.normalize();
		}
	}
	
	inside() {
		insideTrack(this.p);
	}

	draw(ctx) {
		let a = this.velVec.getAngle();
		ctx.strokeStyle = this.col;
		ctx.beginPath();
		ctx.moveTo(this.p.x + Math.cos(a) * 20, this.p.y + Math.sin(a) * 20);
		ctx.lineTo(
			this.p.x - Math.cos(a + 1) * 12,
			this.p.y - Math.sin(a + 1) * 12
		);
		ctx.lineTo(
			this.p.x - Math.cos(a - 1) * 12,
			this.p.y - Math.sin(a - 1) * 12
		);
		ctx.lineTo(this.p.x + Math.cos(a) * 20, this.p.y + Math.sin(a) * 20);
		ctx.stroke();
	}
	
}

class Car2 {
	
	constructor(p, v, col = "GreenYellow") {
		//car = new Car(s1.points[0], s1.getSplineGardient(0, true));
		this.p = new Point2D(p.x, p.y);
		this.v = new Point2D(0, 0);
		this.col = col;
		this.a = Math.atan2(v.y, v.x);
		this.drag = 0.97;
		this.av = 0;
		this.aDrag = 0.91;
		this.pow = 0.075;
		this.ts = 0.003;
	}
	
	update() {
		this.p.add(this.v);
		this.v.multiplyScalar(this.drag);
		this.a += this.av;
		if (this.a > Math.PI) this.a -= Math.PI*2;
		if (this.a < -Math.PI) this.a += Math.PI*2;
		this.av *= this.aDrag;
	}
	
	accel() {
		this.v.x += Math.cos(this.a) * this.pow;
		this.v.y += Math.sin(this.a) * this.pow;
	}
	
	break() {
		this.v.x -= Math.cos(this.a) * this.pow / 2;
		this.v.y -= Math.sin(this.a) * this.pow / 2;
	}
	
	steer(dir) {
		// get direction relative to heading to reverse steering if going backwards
		let temp = new Point2D(Math.cos(this.a), Math.sin(this.a));
		let ang = Math.acos(temp.dot(this.v)/this.v.getModule());
		let sign = 1;
		if (ang>Math.PI/2) {
			sign = -2;
		}
		if (dir) {
			this.av -= (this.ts * (0.2 + this.v.getModule() / 2)) * sign;
		} else {
			this.av += (this.ts * (0.2 + this.v.getModule() / 2)) * sign;
		}
	}
	
	inside() {
		if (insideTrack(this.p)) {
			this.drag = 0.97;
			this.ts = 0.003;
		} else {
			this.drag = 0.85;
			this.ts = 0.005;
		}
	}
	
	draw(ctx) {
		ctx.strokeStyle = this.col;
		ctx.beginPath();
		ctx.moveTo(this.p.x + Math.cos(this.a) * 20, this.p.y + Math.sin(this.a) * 20);
		ctx.lineTo(
			this.p.x - Math.cos(this.a + 1) * 12,
			this.p.y - Math.sin(this.a + 1) * 12
		);
		ctx.lineTo(
			this.p.x - Math.cos(this.a - 1) * 12,
			this.p.y - Math.sin(this.a - 1) * 12
		);
		ctx.lineTo(this.p.x + Math.cos(this.a) * 20, this.p.y + Math.sin(this.a) * 20);
		ctx.stroke();
	}
}