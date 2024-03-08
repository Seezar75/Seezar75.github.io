// https://rosettacode.org/wiki/Penrose_tiling
const G = (1 + Math.sqrt(5)) / 2; // golden ratio
const T = Math.PI * 36 / 180; // theta
const Lf = 2 * G * Math.cos(T);
const Lt = 2 * G * Math.cos(2 * T);

const PenroseType = {
  P2: 0,
  P3: 1
};

let penroseType = PenroseType.P3;

const PenroseTileType = {
  Kite: 0,
  Dart: 1,
  Thin: 2,
  Fat: 3
};

class PenroseTile extends Cell {
  constructor(_t, _rx, _ry, _a, _s) {
    super(_rx, _ry, 0, null);
    this.type = _t;
    this.rx = _rx;
    this.ry = _ry;
    this.angle = _a;
    this.size = _s;
    this.relations = [];

    if (this.type == PenroseTileType.Kite) {
      this.x = this.rx + this.size*G/1.7*Math.cos(this.angle);
      this.y = this.ry - this.size*G/1.7*Math.sin(this.angle)
    } else if (this.type == PenroseTileType.Dart) {
      this.x = this.rx - this.size/1.5*Math.cos(this.angle);
      this.y = this.ry + this.size/1.5*Math.sin(this.angle)
    } else if (this.type == PenroseTileType.Thin) {
      this.x = this.rx - this.size*Lt/2*Math.cos(this.angle);
      this.y = this.ry + this.size*Lt/2*Math.sin(this.angle)
    } else if (this.type == PenroseTileType.Fat) {
      this.x = this.rx + this.size*Lf/2*Math.cos(this.angle);
      this.y = this.ry - this.size*Lf/2*Math.sin(this.angle)
    }

    // limit angle between 0 and 2*PI
    if (this.angle < 0) this.angle += 2*Math.PI;
    if (this.angle > 2*Math.PI) this.angle -= 2*Math.PI;

    let dist = [[G, G, G], [-G, -1, -G], [-G, -Lt, -G], [G, Lf, G]];
    let angleIncrements = [T, T, 2*T, T]
    let angle = this.angle - angleIncrements[this.type];
    this.poli = [];
    this.poli.push({x: this.rx, y: this.ry});
    for (let i = 0; i < 3; i++) {
      let x = this.rx + dist[this.type][i] * this.size * Math.cos(angle);
      let y = this.ry - dist[this.type][i] * this.size * Math.sin(angle);
      this.poli.push({x: x, y: y});
      angle += angleIncrements[this.type];
  }}
	
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

	isInside(p) {
		return insidePoli(this.poli, p);
	}
}

function setPenroseP2() {
  penroseType = PenroseType.P2;
}

function setPenroseP3() {
  penroseType = PenroseType.P3;
}

function setupInitialTiles(w, h, s) {
	let proto = [];

  if (penroseType == PenroseType.P2) {
		for (let a = Math.PI / 2 + T; a < 5 / 2 * Math.PI; a += 2 * T)
			proto.push(new PenroseTile(PenroseTileType.Kite, w / 2, h / 2, a, s));
	} else {
		for (let a = Math.PI / 2 + T; a < 5 / 2 * Math.PI; a += 2 * T) {
			proto.push(new PenroseTile(PenroseTileType.Fat, w / 2, h / 2, a, s));
		}
	}
	return proto;
}

 function subdividePenroseTiles(tls, generation) {
  if (generation <= 0)
  return tls;

  next = [];

  for (let tile of tls) {
    let x = tile.rx
    let y = tile.ry
    let a = tile.angle
    let nx
    let ny;
    let newSize = tile.size / G;
    size = newSize;

    if (tile.type == PenroseTileType.Dart) {
      next.push(new PenroseTile(PenroseTileType.Kite, x, y, a + 5 * T, newSize));
      for (let i = 0, sign = 1; i < 2; i++, sign *= -1) {
        nx = x + Math.cos(a - 4 * T * sign) * G * tile.size;
        ny = y - Math.sin(a - 4 * T * sign) * G * tile.size;
        next.push(new PenroseTile(PenroseTileType.Dart, nx, ny, a - 4 * T * sign, newSize));
      }

    } else if (tile.type == PenroseTileType.Kite) {
      for (let i = 0, sign = 1; i < 2; i++, sign *= -1) {
        next.push(new PenroseTile(PenroseTileType.Dart, x, y, a - 4 * T * sign, newSize));

        nx = x + Math.cos(a - T * sign) * G * tile.size;
        ny = y - Math.sin(a - T * sign) * G * tile.size;
        next.push(new PenroseTile(PenroseTileType.Kite, nx, ny, a + 3 * T * sign, newSize));
      }
    } else if (tile.type == PenroseTileType.Thin) {
      nx = x - Math.cos(a) * Lt * tile.size;
      ny = y + Math.sin(a) * Lt * tile.size;
      next.push(new PenroseTile(PenroseTileType.Thin, nx, ny, a + 3 * T, newSize));
      next.push(new PenroseTile(PenroseTileType.Thin, nx, ny, a - 3 * T, newSize));

      for (let i = 0, sign = 1; i < 2; i++, sign *= -1) {
        nx = x + Math.cos(a - 3 * T * sign) * G * tile.size;
        ny = y - Math.sin(a - 3 * T * sign) * G * tile.size;
        next.push(new PenroseTile(PenroseTileType.Fat, nx, ny, a + 2 * T * sign, newSize));
      }
    } else if (tile.type == PenroseTileType.Fat) {
      nx = x + Math.cos(a) * Lf * tile.size;
      ny = y - Math.sin(a) * Lf * tile.size;
      next.push(new PenroseTile(PenroseTileType.Fat, nx, ny, a + Math.PI, newSize));

      for (let i = 0, sign = 1; i < 2; i++, sign *= -1) {
        nx = x + Math.cos(a - T * sign) * G * tile.size;
        ny = y - Math.sin(a - T * sign) * G * tile.size;
        next.push(new PenroseTile(PenroseTileType.Fat, nx, ny, a + 4 * T * sign, newSize));
        next.push(new PenroseTile(PenroseTileType.Thin, nx, ny, a - 4 * T * sign, newSize));
      }
  }	}
  // remove duplicates
  tls = removeDuplicates(next);

  return subdividePenroseTiles(tls, generation - 1);
}

function removeDuplicates(arr) {
	// use a dictionary with coordinates as key to store just one instance of a cell
	let dict = new Object();
	for (let c of arr) {
    // construct the key with coordinates
		let key = c.x.toFixed(2) + "-" + c.y.toFixed(2);
    // add only if an instance with the same key is not present
		if(dict[key]) continue;
		dict[key] = c;
	}
  // convert the dictionary back into an array
	let newArr = [];
	for(let key in dict) {
	  newArr.push(dict[key]);
	}
	return newArr;
}

function generatePenroseField() {
  templateRels.push([]);
  // calculate initial size and number of generation
  // for the correct amount of cells based on the slider
	let slider = parseInt(document.getElementById("scaleSlider").value);
  let factor = (-slider + 46) % 13;
	let startSize = 17.8461538 * factor +375
	let gen = Math.ceil(0.0769230 * slider + 3.4615384);
  // generate all the Penrose tiles
	console.time('Cell generation');
	cells = subdividePenroseTiles(setupInitialTiles(canvas.width, canvas.height, startSize), gen);
	console.timeEnd('Cell generation');
  // set the overall filed shape
	setFieldShape();
  // delete all cells outside the field shape
	cells = cells.filter(cell => insidePoli(poliBorder, {x: cell.x, y: cell.y}));
  // set up the spatial index to speed up cell linking
	setSpatialIndex();
  // link all cells to their neighbors
	console.time('Link');
	for (let c of cells) {
		addNeighborsFast(c);
	}
	console.timeEnd('Link');
  // reset font size
	fontSize = Math.floor(size / 2);
	ctx.font = "bold " + fontSize + "px Arial";
}

function setSpatialIndex() {
	console.time('Spatial Index');
	let minX = 1000000;
	let maxX = -1000000;
	let minY = 1000000;
	let maxY = -1000000;
	
	for (let p of poliBorder) {
		if (p.x < minX) minX = p.x;
		if (p.x > maxX) maxX = p.x;
		if (p.y < minY) minY = p.y;
		if (p.y > maxY) maxY = p.y;
	}
	
	minX -= size*G;
	maxX += size*G;
	minY -= size*G;
	maxY += size*G;
	
  // the spatial index size is set to one more of the maximum distance between cell centers
	spatialIndex = new SpatialIndex(minX, maxX, minY, maxY, 1 + 2*G*Math.cos(T/2)*size);
	for (let c of cells) {
		spatialIndex.addElement(c);
	}
	console.timeEnd('Spatial Index');
}

function addNeighborsFast(cell) {
	for (let otherCell of spatialIndex.getNearElements(cell.x, cell.y)) {
		if (cell === otherCell) continue;
		let link = false;
		for (let p1 of cell.poli) {
			for (let p2 of otherCell.poli) {
				if ((Math.abs(p1.x-p2.x)<0.01) && (Math.abs(p1.y-p2.y)<0.01)) {
					link = true;
					break;
				}
			}
			if (link == true) {
        cell.relations.push({ref: otherCell});
				break;
			}
		}
  }
}
