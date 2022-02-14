class Marker {
	constructor(_x, _y, _size, _color) {
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.color = _color;
	}

	draw(ctx) {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.strokeRect(this.x - ((this.size - 1) / 2) - 1, this.y - ((this.size - 1) / 2) - 1, this.size + 2 , this.size + 2 );
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.x+0.5, this.y - 9);
		ctx.lineTo(this.x+0.5, this.y - this.size + 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x+0.5, this.y + 10);
		ctx.lineTo(this.x+0.5, this.y + this.size - 1);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x -9, this.y+0.5);
		ctx.lineTo(this.x - this.size + 2, this.y+0.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x +10, this.y+0.5);
		ctx.lineTo(this.x + this.size - 1, this.y+0.5);
		ctx.stroke();
	}

	check(can) {
		if (this.x < (this.size - 1) / 2) this.x = (this.size - 1) / 2;
		if (this.y < (this.size - 1) / 2) this.y = (this.size - 1) / 2;
		if (this.x > can.width - 1 - (this.size - 1) / 2) this.x = can.width - 1 - (this.size - 1) / 2 ;
		if (this.y > can.height - 1 - (this.size - 1) / 2) this.y = can.height - 1 - (this.size - 1) / 2;
	}
}
