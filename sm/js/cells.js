
function createCell(type, x, y, shape, props) {
	if (shape == 0) {
		return new Cell(x, y, type, props);
	} else if (shape == 1) {
		return new Square(x, y, type, props);
	} else if (shape == 2) {
		return new Hex(x, y, type, props);
	} else if (shape == 3) {
		return new RegPoli(x, y, type, props);
	} else if (shape == 4) {
		return new Rect(x, y, type, props);
	} else if (shape == 5) {
		return new Custom(x, y, type, props);
	}
}

class Cell {
	constructor(x_, y_, type, props) {
		this.x = x_;
		this.y = y_;
		this.type = type;
		if (props) {
			this.props = props;
		} else {
			this.props = {
				scale: 1,
				rot: 1,
				sides: 4,
				ratio: 0.5,
				sides: 4
			};
		}
		this.isClicked = false;

		this.relations = [];
		for (let i = 0; i < templateRels[type].length; i++) {
			this.relations.push({
				ref: null
			});
		}
		this.hasMine = false;
		this.nearMines = 0;
		this.flagged = false;
		this.visible = false;
	}

	draw() {
		if (this.isClicked) {
			ctx.strokeStyle = highlightCol;
			ctx.fillStyle = highlightCol;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.props.scale * size / 2, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			if (this.visible) {
				ctx.fillStyle = visibleCol;
			} else {
				ctx.fillStyle = invisibleCol;
			}
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.props.scale * size / 2, 0, 2 * Math.PI);
			ctx.strokeStyle = borderCol;
			ctx.fill();
			ctx.stroke();
		}
		this.drawContent(this.x, this.y);
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	drawContent(x, y) {
		if (this.visible) {
			if (this.hasMine == true) {
				ctx.fillStyle = "#FF0000";
				ctx.beginPath();
				ctx.arc(x, y, size / 5, 0, 2 * Math.PI);
				ctx.fill();
			} else {
				if (this.nearMines > 0) {
					ctx.fillStyle = textColor[this.nearMines - 1];
					ctx.fillText(this.nearMines, x, y + fontSize / 2.8);
				}
			}
		} else {
			if (this.flagged == true) {
				ctx.fillStyle = "#0000FF";
				ctx.beginPath();
				ctx.arc(x, y, size / 5, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}

	click() {
    if (exploded) return;
    if(timerId == null) {
      startTime = Date.now();
      timerId = setInterval(refreshTimer, 100);
    }
		if (!this.flagged) {
			if (this.nearMines == 0 && this.visible == false) {
				this.visible = true;
				for (let r of this.relations) {
					if (r.ref === null) {} else {
						r.ref.click();
					}
				}
			}
			if (this.hasMine) {
				exploded = true;
				bgColor = "#FF0000";
        clearTimeout(timerId);
        timerId = null;
				showPopup();
			}
			this.visible = true;
		}
	}

	isInside(p) {
		return (Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y)) <= this.props.scale * size / 2);
	}

  // returns true if the distance from the cell center is less than 1 (accurate enough)
	isSameCell(p) {
		return ((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) <= 1);
	}

  // checks if the cell is inside the borders of the field
	isInCanvas() {
		//return this.x>size && this.y>size && this.x<canvas.width-size && this.y<canvas.height-size;
		let t = insidePoli(poliBorder, {
			x: this.x,
			y: this.y
		});
		return t;
	}

  // highlights neighboring cells
	markNeigh() {
		for (let r of this.relations) {
			if (!(r.ref === null) && !r.ref.visible && !r.ref.flagged) {
				r.ref.isClicked = true;
			}
		}
	}

  // counts the nimes of the neighboirng cells
	countNearMines() {
		let n = 0;
		for (let r of this.relations) {
			if (r.ref === null) {

			} else {
				if (r.ref.hasMine) {
					n++;
				}
			}
		}
		this.nearMines = n;
	}

  // clicks on all the neighboring cells if the number of flagged neighboring cells
  // is equal to the number of neighboring mines
	clearNumber() {
		if (this.visible) {
			let n = 0;
			let neigh = 0;
			for (let r of this.relations) {
				if (!(r.ref === null) && r.ref.flagged) n++;
				if (!(r.ref === null)) neigh++;
			}
			if (this.nearMines == n) {
				for (let r of this.relations) {
					if (!(r.ref === null) && !r.ref.visible) r.ref.click();
				}
			}
		}
	}

	createNeighborsRecursive() {
    // for each neighboring cell in the template for this cell type
		for (let i = 0; i < templateRels[this.type].length; i++) {
      // check if there os already a cell in the given position
			let fi = findCell(templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y);
      // if there is no cell
			if (fi === null) {
        // create the new cell
				let c = createCell(templateRels[this.type][i].t, templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y, templateRels[this.type][i].shape, templateRels[this.type][i].props);
        // if it is inside the border of the field
				if (c.isInCanvas()) {
          // link the new cell to this cell, add it to the total cells list and recursively generate it's neighbors
					this.relations[i].ref = c;
					cells.push(c);
					c.createNeighbors();
				}
      // if there is already a cell in the position then link it to this cell
			} else {
				this.relations[i].ref = fi;
			}
		}
	}

  createShellNeighbors(startIndex) {
		for (let i = 0; i < templateRels[this.type].length; i++) {
      // check if there os already a cell in the given position
			let fi = findCellRange(templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y, startIndex);
      // if there is no cell
			if (fi === null) {
        // create the new cell
				let c = createCell(templateRels[this.type][i].t, templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y, templateRels[this.type][i].shape, templateRels[this.type][i].props);
        // if it is inside the border of the field
				if (c.isInCanvas()) {
          // link the new cell to this cell, add it to the total cells list
					this.relations[i].ref = c;
					cells.push(c);
				}
      // if there is already a cell in the position then link it to this cell
			} else {
				this.relations[i].ref = fi;
			}
		}
  }

}

class Square extends Cell {
	constructor(x_, y_, type, props) {
		super(x_, y_, type, props);
		let d = this.props.scale * size / 2;
		this.x1 = this.x - d;
		this.x2 = this.x + d;
		this.y1 = this.y - d;
		this.y2 = this.y + d;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
		this.x1 += dx;
		this.y1 += dy;
		this.x2 += dx;
		this.y2 += dy;
	}

	draw() {
		if (this.isClicked) {
			ctx.strokeStyle = highlightCol;
			ctx.fillStyle = highlightCol;
			ctx.fillRect(this.x1, this.y1, this.props.scale * size, this.props.scale * size);
		} else {
			if (this.visible) {
				ctx.fillStyle = visibleCol;
			} else {
				ctx.fillStyle = invisibleCol;
			}
			ctx.fillRect(this.x1, this.y1, this.props.scale * size, this.props.scale * size);
			ctx.strokeStyle = borderCol;
			ctx.strokeRect(this.x1, this.y1, this.props.scale * size, this.props.scale * size);
		}
		this.drawContent(this.x, this.y);
	}

	isInside(p) {
		return p.x > this.x1 && p.x < this.x2 && p.y > this.y1 && p.y < this.y2;
	}
}

class RegPoli extends Cell {
	constructor(x_, y_, type, props) {
		super(x_, y_, type, props);
		let si = size * this.props.scale / 2;
		this.poli = [];
		for (let i = 0; i < props.sides; i++) {
			this.poli.push({
				x: this.x + si * Math.cos(2 * Math.PI * i / props.sides + props.rot),
				y: this.y + si * Math.sin(2 * Math.PI * i / props.sides + props.rot)
			});
		}
	}

	draw() {
		if (this.isClicked) {
			ctx.strokeStyle = highlightCol;
			ctx.fillStyle = highlightCol;
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.props.sides; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.fill();
		} else {
			if (this.visible) {
				ctx.fillStyle = visibleCol;
			} else {
				ctx.fillStyle = invisibleCol;
			}
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.props.sides; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.strokeStyle = borderCol;
			ctx.fill();
			ctx.stroke();
		}
		this.drawContent(this.x, this.y);
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
		for (let p of this.poli) {
			p.x += dx;
			p.y += dy;
		}
	}

	isInside(p) {
		return insidePoli(this.poli, p);
	}
}

class Custom extends Cell {
	constructor(x_, y_, type, props) {
		super(x_, y_, type, props);
		let si = size * this.props.scale;
		this.poli = [];
		//console.log(props.points);
		for (let i = 0; i < props.points.length; i++) {
			this.poli.push({
				x: this.x + si * (Math.cos(props.rot) * props.points[i].x - Math.sin(props.rot) * props.points[i].y),
				y: this.y + si * (Math.sin(props.rot) * props.points[i].x + Math.cos(props.rot) * props.points[i].y)
			});
		}
	}

	draw() {
		if (this.isClicked) {
			ctx.strokeStyle = highlightCol;
			ctx.fillStyle = highlightCol;
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.poli.length; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.fill();
		} else {
			if (this.visible) {
				ctx.fillStyle = visibleCol;
			} else {
				ctx.fillStyle = invisibleCol;
			}
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.poli.length; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.strokeStyle = borderCol;
			ctx.fill();
			ctx.stroke();
		}
		this.drawContent(this.x, this.y);
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
		for (let p of this.poli) {
			p.x += dx;
			p.y += dy;
		}
	}

	isInside(p) {
		return insidePoli(this.poli, p);
	}
}

class Rect extends Cell {
	//ratio:0.29516724 for 2:1
	constructor(x_, y_, type, props) {
		super(x_, y_, type, props);
		let si = size * this.props.scale / 2;
		this.poli = [];
		this.poli.push({
			x: this.x + si * Math.cos(0.5 * Math.PI * props.ratio + props.rot),
			y: this.y + si * Math.sin(0.5 * Math.PI * props.ratio + props.rot)
		});
		this.poli.push({
			x: this.x + si * Math.cos(0.5 * Math.PI * (2 - props.ratio) + props.rot),
			y: this.y + si * Math.sin(0.5 * Math.PI * (2 - props.ratio) + props.rot)
		});
		this.poli.push({
			x: this.x + si * Math.cos(0.5 * Math.PI * (2 + props.ratio) + props.rot),
			y: this.y + si * Math.sin(0.5 * Math.PI * (2 + props.ratio) + props.rot)
		});
		this.poli.push({
			x: this.x + si * Math.cos(0.5 * Math.PI * (4 - props.ratio) + props.rot),
			y: this.y + si * Math.sin(0.5 * Math.PI * (4 - props.ratio) + props.rot)
		});
	}

	draw() {
		if (this.isClicked) {
			ctx.strokeStyle = highlightCol;
			ctx.fillStyle = highlightCol;
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.props.sides; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.fill();
		} else {
			if (this.visible) {
				ctx.fillStyle = visibleCol;
			} else {
				ctx.fillStyle = invisibleCol;
			}
			ctx.beginPath();
			ctx.moveTo(this.poli[0].x, this.poli[0].y);
			for (let i = 1; i < this.props.sides; i++) {
				ctx.lineTo(this.poli[i].x, this.poli[i].y);
			}
			ctx.closePath();
			ctx.strokeStyle = borderCol;
			ctx.fill();
			ctx.stroke();
		}
		this.drawContent(this.x, this.y);
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
		for (let p of this.poli) {
			p.x += dx;
			p.y += dy;
		}
	}

	isInside(p) {
		return insidePoli(this.poli, p);
	}
}

// find a cell within all the cells
function findCell(x, y) {
	let c = null;
	for (let ce of cells) {
		if (ce.isSameCell({
				x: x,
				y: y
			})) {
			c = ce;
			break;
		}
	}
	return c;
}

// find a cell starting from a given index
function findCellRange(x, y, startIndex) {
	let c = null;
	for (let i = startIndex; i < cells.length; i++) {
		if (cells[i].isSameCell({
				x: x,
				y: y
			})) {
			c = cells[i];
			break;
		}
	}
	return c;
}
