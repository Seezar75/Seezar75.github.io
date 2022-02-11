class Marker {
	constructor(_x, _y, _size, _color) {
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.color = _color;
	}

	draw(ctx) {
		ctx.strokeStyle = this.color;
		ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
	}
}