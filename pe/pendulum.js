class pendulum {

	constructor(can, base, length, startAng) {
		this.ctx = canvas.getContext("2d");
		this.base = base;
		this.ang = startAng;
		this.vAng = 0;
		this.len = length;
	}


	draw() {
		let x = this.base.x + (this.len * Math.sin(this.ang));
		let y = this.base.y + (this.len * Math.cos(this.ang));

		// Draw cord
		this.ctx.strokeStyle = "rgb(30,30,30)";
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(this.base.x, this.base.y);
		this.ctx.stroke();

		// Draw bob
		this.ctx.beginPath();
		this.ctx.arc(x, y, 10, 0, Math.PI * 2);
		this.ctx.fillStyle = "rgb(230,0,0)";
		this.ctx.fill();
	}

	move(dt) {
		// Gravity
		let gr = (-0.0030 / this.len) * Math.sin(this.ang);
		// Friction (fluid)
		let fr = this.len * this.vAng / 60000000;

		this.vAng += (gr - fr) * dt;

		this.ang += this.vAng * dt;
	}
}
