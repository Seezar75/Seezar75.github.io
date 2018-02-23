class Wall {
	constructor(p1, p2) {
		this.p1 = new Vector(p1.x, p1.y);
		this.p2 = new Vector(p2.x, p2.y);
	}

	draw() {
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.lineWidth=5;
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.stroke();
	}

	getDist(p) {
		let dy = this.p2.y - this.p1.y;
		let dx = this.p2.x - this.p1.x
		let m = dy / dx;
		let dl = (dy * p.x - dx * p.y + this.p2.x * this.p1.y - this.p2.y * this.p1.x) / Math.sqrt(dy * dy + dx * dx);
    console.log(dl);
	}

  getForceVector(p, s) {
    let v90 = new Vector(0,-1);
    let v = new Vector(0,0);
    let dy = this.p2.y - this.p1.y;
		let dx = this.p2.x - this.p1.x
		let dl = (dy * p.x - dx * p.y + this.p2.x * this.p1.y - this.p2.y * this.p1.x) / Math.sqrt(dy * dy + dx * dx);
    let d1 = Math.sqrt((p.x-this.p1.x)*(p.x-this.p1.x)+(p.y-this.p1.y)*(p.y-this.p1.y));
    let d2 = Math.sqrt((p.x-this.p2.x)*(p.x-this.p2.x)+(p.y-this.p2.y)*(p.y-this.p2.y));
    let ds = Math.sqrt((this.p1.x-this.p2.x)*(this.p1.x-this.p2.x)+(this.p1.y-this.p2.y)*(this.p1.y-this.p2.y));
    if ((d1*d1-dl*dl)+(d2*d2-dl*dl) < ds*ds) {
      // Segment
      if (Math.abs(dl) < s+5) {
        v = new Vector(dx,dy);
        v.multiply(v90);
        v.multiplyScalar(1.5/(dl+5)/Math.abs(dl+5));
      }
    } else {
      if (d1 < d2) {
        // P1
      } else {
        // P2
      }
    }
    return v;
  }

}
