// D. Frettlöh, E. Harriss, F. Gähler: Tilings encyclopedia, https://tilings.math.uni-bielefeld.de/
const A1 = Math.PI / 5;
const GOLD = (1 + Math.sqrt(5)) / 2;
const LF = 2 * GOLD * Math.cos(A1);
const LT = 2 * GOLD * Math.cos(2 * A1);
const HPI = Math.PI/2;
const SQ2 = Math.sqrt(2);
const SQ5 = Math.sqrt(5);
const A2 = Math.acos(2/SQ5);
const L1 = Math.sqrt(GOLD*GOLD+1);
const A3 = Math.acos(1/L1);

const TileType = {
  PenKite: 0,
  PenDart: 1,
  PenThin: 2,
  PenFat: 3,
  Chair: 4,
  FibSquare1: 5,
  FibSquare2: 6,
  FibRect: 7
};

let subParams = {};

class SubstitutionTile extends Cell {
  constructor(_type, _rx, _ry, _a, _s) {
    super(_rx, _ry, 0, null);
    this.type = _type;
    this.rx = _rx;
    this.ry = _ry;
    this.angle = _a;
    this.size = _s;
    this.relations = [];
    this.poli = [];
    switch (this.type) {
      case TileType.PenKite:
        if (this.angle < 0) this.angle += 10;
        if (this.angle >= 10) this.angle -= 10;
        this.x = this.rx + this.size*GOLD/1.7*Math.cos(this.angle*A1);
        this.y = this.ry - this.size*GOLD/1.7*Math.sin(this.angle*A1)
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+GOLD*_s*Math.cos((_a-1)*A1), y: this.ry-GOLD*_s*Math.sin((_a-1)*A1)});
        this.poli.push({x: this.rx+GOLD*_s*Math.cos((_a)*A1), y: this.ry-GOLD*_s*Math.sin((_a)*A1)});
        this.poli.push({x: this.rx+GOLD*_s*Math.cos((_a+1)*A1), y: this.ry-GOLD*_s*Math.sin((_a+1)*A1)});
        break;
      case TileType.PenDart:
        if (this.angle < 0) this.angle += 10;
        if (this.angle >= 10) this.angle -= 10;
        this.x = this.rx - this.size/1.5*Math.cos(this.angle*A1);
        this.y = this.ry + this.size/1.5*Math.sin(this.angle*A1)
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx-GOLD*_s*Math.cos((_a-1)*A1), y: this.ry+GOLD*_s*Math.sin((_a-1)*A1)});
        this.poli.push({x: this.rx-1*_s*Math.cos((_a)*A1), y: this.ry+1*_s*Math.sin((_a)*A1)});
        this.poli.push({x: this.rx-GOLD*_s*Math.cos((_a+1)*A1), y: this.ry+GOLD*_s*Math.sin((_a+1)*A1)});
        break;
      case TileType.PenThin:
        if (this.angle < 0) this.angle += 10;
        if (this.angle >= 10) this.angle -= 10;
        this.x = this.rx - this.size*LT/2*Math.cos(this.angle*A1);
        this.y = this.ry + this.size*LT/2*Math.sin(this.angle*A1)
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx-GOLD*_s*Math.cos((_a-2)*A1), y: this.ry+GOLD*_s*Math.sin((_a-2)*A1)});
        this.poli.push({x: this.rx-LT*_s*Math.cos((_a)*A1), y: this.ry+LT*_s*Math.sin((_a)*A1)});
        this.poli.push({x: this.rx-GOLD*_s*Math.cos((_a+2)*A1), y: this.ry+GOLD*_s*Math.sin((_a+2)*A1)});
        break;
      case TileType.PenFat:
        if (this.angle < 0) this.angle += 10;
        if (this.angle >= 10) this.angle -= 10;
        this.x = this.rx + this.size*LF/2*Math.cos(this.angle*A1);
        this.y = this.ry - this.size*LF/2*Math.sin(this.angle*A1)
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+GOLD*_s*Math.cos((_a-1)*A1), y: this.ry-GOLD*_s*Math.sin((_a-1)*A1)});
        this.poli.push({x: this.rx+LF*_s*Math.cos((_a)*A1), y: this.ry-LF*_s*Math.sin((_a)*A1)});
        this.poli.push({x: this.rx+GOLD*_s*Math.cos((_a+1)*A1), y: this.ry-GOLD*_s*Math.sin((_a+1)*A1)});
        break;
      case TileType.Chair:
        this.angle = this.angle % 4;
        this.x = _rx+_s/SQ2*Math.cos((_a+0.5)*HPI);
        this.y = _ry+_s/SQ2*Math.sin((_a+0.5)*HPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+2*_s*Math.cos(_a*HPI), y: this.ry+2*_s*Math.sin(_a*HPI)});
        this.poli.push({x: this.rx+SQ5*_s*Math.cos(_a*HPI+A2), y: this.ry+SQ5*_s*Math.sin(_a*HPI+A2)});
        this.poli.push({x: this.rx+SQ2*_s*Math.cos((_a+0.5)*HPI), y: this.ry+SQ2*_s*Math.sin((_a+0.5)*HPI)});
        this.poli.push({x: this.rx+SQ5*_s*Math.cos((_a+1)*HPI-A2), y: this.ry+SQ5*_s*Math.sin((_a+1)*HPI-A2)});
        this.poli.push({x: this.rx+2*_s*Math.cos((_a+1)*HPI), y: this.ry+2*_s*Math.sin((_a+1)*HPI)});
        break;
      case TileType.FibSquare1:
        this.angle = this.angle % 4;
        this.x = _rx+_s/SQ2*Math.cos((_a+0.5)*HPI);
        this.y = _ry+_s/SQ2*Math.sin((_a+0.5)*HPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s*Math.cos(_a*HPI), y: this.ry+_s*Math.sin(_a*HPI)});
        this.poli.push({x: this.rx+SQ2*_s*Math.cos((_a+0.5)*HPI), y: this.ry+SQ2*_s*Math.sin((_a+0.5)*HPI)});
        this.poli.push({x: this.rx+_s*Math.cos((_a+1)*HPI), y: this.ry+_s*Math.sin((_a+1)*HPI)});
        break;
      case TileType.FibSquare2:
        this.angle = this.angle % 4;
        this.x = _rx+_s/SQ2/GOLD*Math.cos((_a+0.5)*HPI);
        this.y = _ry+_s/SQ2/GOLD*Math.sin((_a+0.5)*HPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos(_a*HPI), y: this.ry+_s/GOLD*Math.sin(_a*HPI)});
        this.poli.push({x: this.rx+SQ2*_s/GOLD*Math.cos((_a+0.5)*HPI), y: this.ry+SQ2*_s/GOLD*Math.sin((_a+0.5)*HPI)});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos((_a+1)*HPI), y: this.ry+_s/GOLD*Math.sin((_a+1)*HPI)});
        break;
      case TileType.FibRect:
        this.angle = this.angle % 4;
        this.x = _rx+_s*L1/GOLD/2*Math.cos(_a*HPI+A3);
        this.y = _ry+_s*L1/GOLD/2*Math.sin(_a*HPI+A3);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos(_a*HPI), y: this.ry+_s/GOLD*Math.sin(_a*HPI)});
        this.poli.push({x: this.rx+_s*L1/GOLD*Math.cos(_a*HPI+A3), y: this.ry+_s*L1/GOLD*Math.sin(_a*HPI+A3)});
        this.poli.push({x: this.rx+_s*Math.cos((_a+1)*HPI), y: this.ry+_s*Math.sin((_a+1)*HPI)});
        break;
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

  // checks weather a point is inside of the tile polygon
  isInside(p) {
    return insidePoli(this.poli, p);
  }
}

// https://tilings.math.uni-bielefeld.de/substitution/penrose-kite-dart/
function setPenroseP2() {
  let slider = parseInt(document.getElementById("scaleSlider").value);
  subParams.type = TileType.PenDart;
  subParams.gen = Math.ceil(0.0769230 * slider + 3.4615384);
  subParams.factor = (-slider + 46) % 13;
  subParams.startSize = 17.8461538 * subParams.factor +375;
  subParams.ratio = GOLD;
  subParams.removeDuplicates = true;
  subParams.indexMargin = GOLD;
  subParams.indexSpacing = 2*GOLD*Math.cos(A1/2);
  subParams.useTouch = false;
}

// https://tilings.math.uni-bielefeld.de/substitution/penrose-rhomb/
function setPenroseP3() {
  let slider = parseInt(document.getElementById("scaleSlider").value);
  subParams.type = TileType.PenFat;
  subParams.gen = Math.ceil(0.0769230 * slider + 3.4615384);
  subParams.factor = (-slider + 46) % 13;
  subParams.startSize = 17.8461538 * subParams.factor +375;
  subParams.ratio = GOLD;
  subParams.removeDuplicates = true;
  subParams.indexMargin = GOLD;
  subParams.indexSpacing = 2*GOLD*Math.cos(A1/2);
  subParams.useTouch = false;
}

// https://tilings.math.uni-bielefeld.de/substitution/chair/
function setChair() {
  let slider = parseInt(document.getElementById("scaleSlider").value) - 1;
  subParams.type = TileType.Chair;
  subParams.gen = Math.ceil(0.053 * slider + 3.986);
  subParams.factor = (-slider + 57) % 19;
  subParams.startSize = 802*Math.pow(2, subParams.factor/19);
  subParams.ratio = 2;
  subParams.removeDuplicates = false;
  subParams.indexMargin = 3;
  subParams.indexSpacing = 3.1;
  subParams.useTouch = false;
}

// https://tilings.math.uni-bielefeld.de/substitution/fibonacci-times-fibonacci-variant/
function setFibonacci() {
  let slider = parseInt(document.getElementById("scaleSlider").value) - 1;
  subParams.type = TileType.FibSquare1;
  subParams.gen = Math.ceil(0.077 * slider + 4.45);
  subParams.factor = (-slider + 59) % 13;
  subParams.startSize = 802*Math.pow(GOLD, subParams.factor/13);
  subParams.ratio = GOLD;
  subParams.removeDuplicates = false;
  subParams.indexMargin = 2;
  subParams.indexSpacing = 2 * GOLD;
  subParams.useTouch = true;
}

function generateSubdivideField() {
  templateRels.push([]);
  console.log("Gen = " + subParams.gen + ", factor = " + subParams.factor + ", size = " + subParams.startSize);
  console.time("Cell generation");
  cells = setupInitialTiles();
  for (let i = 0; i < subParams.gen; i++) {
    let newCells = [];
    for (let c of cells) {
      newCells.push(...subdivideTile(c));
    }
    if (subParams.removeDuplicates) {
      cells = removeDuplicates(newCells);
    } else {
      cells = newCells;
    }
  }
  console.timeEnd("Cell generation");

  setFieldShape();

  // delete all cells outside the field shape
  cells = cells.filter(cell => insidePoli(poliBorder, {x: cell.x, y: cell.y}));

  // prepare the spatial index for linking cells
  setSpatialIndex();
  
  console.time('Link');
  for (let c of cells) {
    if (subParams.useTouch) {
      // see if any vertex of the cell touches a segment of it's neighbours
      addNeighborsTouch(c);
    } else {
      // see if any vertex is in common with a neighbours
      addNeighborsFast(c);
    }
  }
  console.timeEnd('Link');
  console.log("cells = " + cells.length);
}

// set the initial cells to be later subdivided
function setupInitialTiles() {
  let init = [];
  switch (subParams.type) {
    case TileType.PenDart:
      for (let i = 0; i < 5; i++) {
        init.push(new SubstitutionTile(TileType.PenKite, canvas.width / 2, canvas.height / 2, 2*i+1.5, subParams.startSize));
      }
      break;
    case TileType.PenFat:
      for (let i = 0; i < 5; i++) {
        init.push(new SubstitutionTile(TileType.PenFat, canvas.width / 2, canvas.height / 2,  2*i+1.5, subParams.startSize));
      }
      break;
    case TileType.Chair:
      init.push(new SubstitutionTile(TileType.Chair, canvas.width/2-subParams.startSize, canvas.height/2-subParams.startSize/2, 0, subParams.startSize));
      break;
    case TileType.FibSquare1:
      init.push(new SubstitutionTile(TileType.FibSquare1, canvas.width/2-subParams.startSize/2, canvas.height/2-subParams.startSize/2, 0, subParams.startSize));
      break;
  }
  return init;
}

function subdivideTile(tile) {
  let children = [];
  let newSize = tile.size / subParams.ratio;;
  let newx = null;
  let newy = null;
  switch (tile.type) {
    case TileType.PenDart:
      children.push(new SubstitutionTile(TileType.PenKite, tile.rx, tile.ry, tile.angle + 5, newSize));
      children.push(new SubstitutionTile(TileType.PenDart,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle-4)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle-4)*A1),
        tile.angle-4,
        newSize));
      children.push(new SubstitutionTile(TileType.PenDart,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle+4)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle+4)*A1),
        tile.angle+4,
        newSize));
      size = newSize;
      break;
    case TileType.PenKite:
      children.push(new SubstitutionTile(TileType.PenDart, tile.rx, tile.ry, tile.angle + 4, newSize));
      children.push(new SubstitutionTile(TileType.PenDart, tile.rx, tile.ry, tile.angle - 4, newSize));
      children.push(new SubstitutionTile(TileType.PenKite,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle-1)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle-1)*A1),
        tile.angle+3,
        newSize));
      children.push(new SubstitutionTile(TileType.PenKite,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle+1)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle+1)*A1),
        tile.angle-3,
        newSize));
      break;
    case TileType.PenFat:
      children.push(new SubstitutionTile(TileType.PenFat,
        tile.rx+tile.size*LF*Math.cos(tile.angle*A1),
        tile.ry-tile.size*LF*Math.sin(tile.angle*A1),
        tile.angle + 5,
        newSize));
      newx = tile.rx + tile.size*GOLD*Math.cos((tile.angle - 1)*A1);
      newy = tile.ry - tile.size*GOLD*Math.sin((tile.angle - 1)*A1);
      children.push(new SubstitutionTile(TileType.PenFat, newx, newy, tile.angle + 4, newSize));
      children.push(new SubstitutionTile(TileType.PenThin, newx, newy, tile.angle - 4, newSize));
      newx = tile.rx + tile.size*GOLD*Math.cos((tile.angle + 1)*A1);
      newy = tile.ry - tile.size*GOLD*Math.sin((tile.angle + 1)*A1);
      children.push(new SubstitutionTile(TileType.PenFat, newx, newy, tile.angle - 4, newSize));
      children.push(new SubstitutionTile(TileType.PenThin, newx, newy, tile.angle + 4, newSize));
      break;
    case TileType.PenThin:
      newx = tile.rx - tile.size*LT*Math.cos(tile.angle*A1);
      newy = tile.ry + tile.size*LT*Math.sin(tile.angle*A1);
      children.push(new SubstitutionTile(TileType.PenThin, newx, newy, tile.angle + 3, newSize));
      children.push(new SubstitutionTile(TileType.PenThin, newx, newy, tile.angle - 3, newSize));
      children.push(new SubstitutionTile(TileType.PenFat,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle-3)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle-3)*A1),
        tile.angle + 2,
        newSize));
      children.push(new SubstitutionTile(TileType.PenFat,
        tile.rx+tile.size*GOLD*Math.cos((tile.angle+3)*A1),
        tile.ry-tile.size*GOLD*Math.sin((tile.angle+3)*A1),
        tile.angle - 2,
        newSize));
      break;
    case TileType.Chair:
      children.push(new SubstitutionTile(TileType.Chair, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+SQ2*newSize*Math.cos((tile.angle+0.5)*HPI),
        tile.ry+SQ2*newSize*Math.sin((tile.angle+0.5)*HPI),
        tile.angle,
        newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+2*tile.size*Math.cos(tile.angle*HPI),
        tile.ry+2*tile.size*Math.sin(tile.angle*HPI),
        tile.angle+1,
        newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+2*tile.size*Math.cos((tile.angle+1)*HPI),
        tile.ry+2*tile.size*Math.sin((tile.angle+1)*HPI),
        tile.angle+3,
        newSize));
      size = newSize;
      break;
    case TileType.FibSquare1:
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.FibSquare2, 
        tile.rx+SQ2/GOLD*tile.size*Math.cos((tile.angle+0.5)*HPI),
        tile.ry+SQ2/GOLD*tile.size*Math.sin((tile.angle+0.5)*HPI),
        tile.angle,
        newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+1/GOLD*tile.size*Math.cos((tile.angle)*HPI),
        tile.ry+1/GOLD*tile.size*Math.sin((tile.angle)*HPI),
        tile.angle,
        newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+SQ2/GOLD*tile.size*Math.cos((tile.angle+0.5)*HPI),
        tile.ry+SQ2/GOLD*tile.size*Math.sin((tile.angle+0.5)*HPI),
        tile.angle+1,
        newSize));
      size = newSize;
      break;
    case TileType.FibSquare2:
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      size = newSize;
      break;
    case TileType.FibRect:
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+SQ2/GOLD*tile.size*Math.cos((tile.angle+0.5)*HPI),
        tile.ry+SQ2/GOLD*tile.size*Math.sin((tile.angle+0.5)*HPI),
        tile.angle+1,
        newSize));
      size = newSize;
      break;
  }
  return children;
}

// similar to addNeighborsFast but considering when a vertex lies on a segment of another cell
function addNeighborsTouch(cell) {
  // get all the tiles that are in the same spatial index cell and in the neighboring ones
	for (let otherCell of spatialIndex.getNearElements(cell.x, cell.y)) {
    // skip the current cell
		if (cell === otherCell) continue;
		let link = false;
    // for each point of the starting cell polygon
		for (let p1 of cell.poli) {
      // for each segment of the other cell
			for (let i = 0; i < otherCell.poli.length; i++) {
        // link the cell if a vertex is part of one of the other cell's segment
				if (isOnSegment(otherCell.poli[i], otherCell.poli[(i+1)%otherCell.poli.length], p1)) {
					link = true;
					break;
				}
			}
			if (link == true) {
        cell.relations.push(otherCell);
				break;
			}
		}
	}
}

function addNeighborsFast(cell) {
  // get all the tiles that are in the same spatial index cell and in the neighboring ones
  for (let otherCell of spatialIndex.getNearElements(cell.x, cell.y)) {
    // skip the current cell
    if (cell === otherCell) continue;
    let link = false;
    // for each point of the starting cell polygon
    for (let p1 of cell.poli) {
      // for each point of the other cell polygon
      for (let p2 of otherCell.poli) {
        // link the cell if they have at least one point in common
        // (orthogonal distance in less than 0.01)
        if ((Math.abs(p1.x-p2.x)<0.01) && (Math.abs(p1.y-p2.y)<0.01)) {
          link = true;
          break;
        }
      }
      if (link == true) {
        cell.relations.push(otherCell);
        break;
      }
    }
  }
}

// check if point c is on segment a-b
function isOnSegment(a, b, c) {
  return distance(a, c) + distance(c, b) < distance(a, b) + 0.1;
}

//distance between point a and point b
function distance(a, b) {
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
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
	
	minX -= size*subParams.indexMargin;
	maxX += size*subParams.indexMargin;
	minY -= size*subParams.indexMargin;
	maxY += size*subParams.indexMargin;
	
	spatialIndex = new SpatialIndex(minX, maxX, minY, maxY, 1+size*subParams.indexSpacing);
	for (let c of cells) {
		spatialIndex.addElement(c);
	}
	console.timeEnd('Spatial Index');
}

function removeDuplicates(arr) {
  // use a dictionary with coordinates as key to store just one instance of a cell
  // two cells are the same cell if their centroids are in the same position within two decimal places
  let dict = new Object();
  for (let c of arr) {
    // construct the key with coordinates
    let key = c.x.toFixed(2) + "-" + c.y.toFixed(2);
    // add only if an instance with the same key is not already present
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
