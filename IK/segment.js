class Segment {
	
    constructor (length, start, end, thickness = 5) {
        this.start = start || {x:0.0, y:0.0};
		this.end = end || {x:10.0, y:10.0};
		this.length = length;
		this.inX = 0;
		this.inY = 0;
		let elasticity = 2; // from 0 to 10
		this.multip = length - (length/10)*elasticity;
		this.thickness = thickness;
    }
	
    draw () {
		line(this.start,this.end, this.thickness);
    }
	
	updateOld(point) {
		this.start = point;
		let dist = this.getDist();
		this.end.x += ((dist-this.length)/this.length)*Math.sign(this.start.x - this.end.x);
		this.end.y += ((dist-this.length)/this.length)*Math.sign(this.start.y - this.end.y);
	}
	
	updateOld2(point) {
		this.start = point;
		let dist = this.getDist();
		let ang = this.getAngle();
		let dx = ((dist-this.length)/this.length)*Math.cos(ang)*this.multip;
		let dy = ((dist-this.length)/this.length)*Math.sin(ang)*this.multip+1;
		this.end.x += dx + this.inX;
		this.end.y += dy + this.inY;
		this.inX += dx/100;
		this.inY += dy/100;
		this.inX = this.inX*0.995;
		this.inY = this.inY*0.995;
	}
	
	update(point) {
		this.start = point;
		let dist = this.getDist();
		let ratioX = (this.start.x - this.end.x)/dist;
		let ratioY = (this.start.y - this.end.y)/dist;
		let dx = ((dist-this.length)/this.length)*ratioX*this.multip;
		let dy = ((dist-this.length)/this.length)*ratioY*this.multip+1;
		this.end.x += dx + this.inX;
		this.end.y += dy + this.inY;
		// inertia
		this.inX += dx/70;
		this.inY += dy/70;
		//dumping
		this.inX = this.inX*0.995;
		this.inY = this.inY*0.995;
	}
	
	getDist() {
		return Math.sqrt((this.start.y - this.end.y)*(this.start.y - this.end.y) + (this.start.x - this.end.x)*(this.start.x - this.end.x));
	}
	
	getAngle() {
		var ang2 = Math.atan2(this.start.y - this.end.y, this.start.x - this.end.x);
		while (ang2 < -Math.PI) ang2 += 2*Math.PI;
		while (ang2 > Math.PI) ang2 -= 2*Math.PI;
		return ang2;
	}
	
}

function line(start,end,thickness) {
	ctx.lineWidth=thickness;
	ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.lineTo(end.x,end.y);
    ctx.strokeStyle = 'rgba(255,0,20,1)';
    ctx.stroke();
	ctx.closePath();
}
