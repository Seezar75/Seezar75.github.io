class Vector {
	
	constructor(x_, y_) {
		this.x = x_;
		this.y = y_;
	}
	
	getAngle() {
		return Math.atan2(this.y, this.x);
	}
	
	getModule() {
		return Math.sqrt(this.y*this.y + this.x*this.x);
	}
	
	normalize() {
		let m = this.getModule();
		this.multiplyScalar(1/m);
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
		this.x = this.x*m;
		this.y = this.y*m;
	}
	
	multiply(v) {
		let tempX = this.x;
		this.x = this.x*v.x - this.y*v.y;
		this.y = tempX*v.y + this.y*v.x;
	}
	
	static sumVector(v1, v2) {
		return new Vector(v1.x+v2.x, v1.y+v2.y);
	}
	
}
