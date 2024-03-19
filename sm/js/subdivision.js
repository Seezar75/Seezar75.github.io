// D. Frettlöh, E. Harriss, F. Gähler: Tilings encyclopedia, https://tilings.math.uni-bielefeld.de/
const hPI = Math.PI/2;
const sq2 = Math.sqrt(2);
const sq5 = Math.sqrt(5);
const phi = Math.acos(2/sq5);
const l1 = Math.sqrt(GOLD*GOLD+1);
const a1 = Math.acos(1/l1);

const TileType = {
  Chair: 0,
  FibSquare1: 1,
  FibSquare2: 2,
  FibRect: 3
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
      case TileType.Chair:
        this.x = _rx+_s/sq2*Math.cos((_a+0.5)*hPI);
        this.y = _ry+_s/sq2*Math.sin((_a+0.5)*hPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+2*_s*Math.cos(_a*hPI), y: this.ry+2*_s*Math.sin(_a*hPI)});
        this.poli.push({x: this.rx+sq5*_s*Math.cos(_a*hPI+phi), y: this.ry+sq5*_s*Math.sin(_a*hPI+phi)});
        this.poli.push({x: this.rx+sq2*_s*Math.cos((_a+0.5)*hPI), y: this.ry+sq2*_s*Math.sin((_a+0.5)*hPI)});
        this.poli.push({x: this.rx+sq5*_s*Math.cos((_a+1)*hPI-phi), y: this.ry+sq5*_s*Math.sin((_a+1)*hPI-phi)});
        this.poli.push({x: this.rx+2*_s*Math.cos((_a+1)*hPI), y: this.ry+2*_s*Math.sin((_a+1)*hPI)});
        break;
      case TileType.FibSquare1:
        this.x = _rx+_s/sq2*Math.cos((_a+0.5)*hPI);
        this.y = _ry+_s/sq2*Math.sin((_a+0.5)*hPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s*Math.cos(_a*hPI), y: this.ry+_s*Math.sin(_a*hPI)});
        this.poli.push({x: this.rx+sq2*_s*Math.cos((_a+0.5)*hPI), y: this.ry+sq2*_s*Math.sin((_a+0.5)*hPI)});
        this.poli.push({x: this.rx+_s*Math.cos((_a+1)*hPI), y: this.ry+_s*Math.sin((_a+1)*hPI)});
        break;
      case TileType.FibSquare2:
        this.x = _rx+_s/sq2/GOLD*Math.cos((_a+0.5)*hPI);
        this.y = _ry+_s/sq2/GOLD*Math.sin((_a+0.5)*hPI);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos(_a*hPI), y: this.ry+_s/GOLD*Math.sin(_a*hPI)});
        this.poli.push({x: this.rx+sq2*_s/GOLD*Math.cos((_a+0.5)*hPI), y: this.ry+sq2*_s/GOLD*Math.sin((_a+0.5)*hPI)});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos((_a+1)*hPI), y: this.ry+_s/GOLD*Math.sin((_a+1)*hPI)});
        break;
      case TileType.FibRect:
        this.x = _rx+_s*l1/GOLD/2*Math.cos(_a*hPI+a1);
        this.y = _ry+_s*l1/GOLD/2*Math.sin(_a*hPI+a1);
        this.poli.push({x: this.rx, y: this.ry});
        this.poli.push({x: this.rx+_s/GOLD*Math.cos(_a*hPI), y: this.ry+_s/GOLD*Math.sin(_a*hPI)});
        this.poli.push({x: this.rx+_s*l1/GOLD*Math.cos(_a*hPI+a1), y: this.ry+_s*l1/GOLD*Math.sin(_a*hPI+a1)});
        this.poli.push({x: this.rx+_s*Math.cos((_a+1)*hPI), y: this.ry+_s*Math.sin((_a+1)*hPI)});
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

// https://tilings.math.uni-bielefeld.de/substitution/chair/
function setChair() {
  let slider = parseInt(document.getElementById("scaleSlider").value) - 1;
  subParams.type = TileType.Chair;
  subParams.gen = Math.ceil(0.053 * slider + 3.986);
  subParams.factor = (-slider + 57) % 19;
  subParams.startSize = 802*Math.pow(2, subParams.factor/19);
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

  setSpatialIndex();

  console.time('Link');
  for (let c of cells) {
    if (subParams.useTouch) {
      // see if any vertex of the cell touches a segment of it's neighbours
      addNeighborsTouch(c);
    } else {
      // see if any vertex is in common with a  neighbours
      addNeighborsFast(c);
    }
  }
  console.timeEnd('Link');
  console.log("cells = " + cells.length);
}

function setupInitialTiles() {
  let init = [];
  switch (subParams.type) {
    case TileType.Chair:
      init.push(new SubstitutionTile(TileType.Chair, canvas.width/2-subParams.startSize, canvas.height/2-subParams.startSize/2, 0, subParams.startSize));
      break;
    case TileType.FibSquare1:
      init.push(new SubstitutionTile(TileType.FibSquare1, canvas.width/2-subParams.startSize/2, canvas.height/2-subParams.startSize/2, 0, subParams.startSize));
      break;
  }
  console.log(init);
  return init;
}

function subdivideTile(tile) {
  let children = [];
  let newSize = 0;
  switch (tile.type) {
    case TileType.Chair:
      newSize = tile.size / 2;
      children.push(new SubstitutionTile(TileType.Chair, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+sq2*newSize*Math.cos((tile.angle+0.5)*hPI),
        tile.ry+sq2*newSize*Math.sin((tile.angle+0.5)*hPI),
        tile.angle,
      newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+2*tile.size*Math.cos(tile.angle*hPI),
        tile.ry+2*tile.size*Math.sin(tile.angle*hPI),
        tile.angle+1,
      newSize));
      children.push(new SubstitutionTile(TileType.Chair,
        tile.rx+2*tile.size*Math.cos((tile.angle+1)*hPI),
        tile.ry+2*tile.size*Math.sin((tile.angle+1)*hPI),
        tile.angle+3,
      newSize));
      size = newSize;
      break;
    case TileType.FibSquare1:
      newSize = tile.size / GOLD;
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.FibSquare2, 
        tile.rx+sq2/GOLD*tile.size*Math.cos((tile.angle+0.5)*hPI),
        tile.ry+sq2/GOLD*tile.size*Math.sin((tile.angle+0.5)*hPI),
        tile.angle,
      newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+1/GOLD*tile.size*Math.cos((tile.angle)*hPI),
        tile.ry+1/GOLD*tile.size*Math.sin((tile.angle)*hPI),
        tile.angle,
      newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+sq2/GOLD*tile.size*Math.cos((tile.angle+0.5)*hPI),
        tile.ry+sq2/GOLD*tile.size*Math.sin((tile.angle+0.5)*hPI),
        tile.angle+1,
      newSize));
      size = newSize;
      break;
    case TileType.FibSquare2:
      newSize = tile.size / GOLD;
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      size = newSize;
      break;
    case TileType.FibRect:
      newSize = tile.size / GOLD;
      children.push(new SubstitutionTile(TileType.FibSquare1, tile.rx, tile.ry, tile.angle, newSize));
      children.push(new SubstitutionTile(TileType.FibRect, 
        tile.rx+sq2/GOLD*tile.size*Math.cos((tile.angle+0.5)*hPI),
        tile.ry+sq2/GOLD*tile.size*Math.sin((tile.angle+0.5)*hPI),
        tile.angle+1,
      newSize));
      size = newSize;
      break;
  }
  return children;
}

function addNeighborsTouch(cell) {
	for (let otherCell of spatialIndex.getNearElements(cell.x, cell.y)) {
		if (cell === otherCell) continue;
		let link = false;
		for (let p1 of cell.poli) {
			for (let i = 0; i < otherCell.poli.length; i++) {
				if (isOnSegment(otherCell.poli[i], otherCell.poli[(i+1)%otherCell.poli.length], p1)) {
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

// check if point c is on segment a-b
function isOnSegment(a, b, c) {
	return distance(a, c) + distance(c, b) < distance(a, b) + 0.1;
}

//distance between point a and point b
function distance(a, b) {
	return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
