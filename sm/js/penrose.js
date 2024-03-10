const A = Math.PI / 5;
const GOLD = (1 + Math.sqrt(5)) / 2;
const LF = 2 * GOLD * Math.cos(A);
const LT = 2 * GOLD * Math.cos(2 * A);

const PenroseType = {
  P2: 0,
  P3: 1
};

let penroseType = PenroseType.P2;

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

    // limit angle between 0 and 2*PI
    if (this.angle < 0) this.angle += 2*Math.PI;
    if (this.angle > 2*Math.PI) this.angle -= 2*Math.PI;

    // set centroids and polygon points distances from rotation center
    let dististance = null;
    let angleIncrement = 0;
    switch (this.type) {
      case PenroseTileType.Kite:
        this.x = this.rx + this.size*GOLD/1.7*Math.cos(this.angle);
        this.y = this.ry - this.size*GOLD/1.7*Math.sin(this.angle)
        dististance = [GOLD, GOLD, GOLD];
        angleIncrement = A;
        break;
      case PenroseTileType.Dart:
        this.x = this.rx - this.size/1.5*Math.cos(this.angle);
        this.y = this.ry + this.size/1.5*Math.sin(this.angle)
        dististance = [-GOLD, -1, -GOLD];
        angleIncrement = A;
        break;
      case PenroseTileType.Thin:
        this.x = this.rx - this.size*LT/2*Math.cos(this.angle);
        this.y = this.ry + this.size*LT/2*Math.sin(this.angle)
        dististance = [-GOLD, -LT, -GOLD];
        angleIncrement = 2 * A;
        break;
      case PenroseTileType.Fat:
        this.x = this.rx + this.size*LF/2*Math.cos(this.angle);
        this.y = this.ry - this.size*LF/2*Math.sin(this.angle)
        dististance = [GOLD, LF, GOLD];
        angleIncrement = A;
        break;
      default:
        console.log("ERROR: unrecognized tile type");
    }
    // construct tile polygon (4 vertices, starting from retation center)
    let angle = this.angle - angleIncrement;
    this.poli = [];
    this.poli.push({x: this.rx, y: this.ry});
    for (let i = 0; i < 3; i++) {
      let x = this.rx + dististance[i] * this.size * Math.cos(angle);
      let y = this.ry - dististance[i] * this.size * Math.sin(angle);
      this.poli.push({x: x, y: y});
      angle += angleIncrement;
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

  // checks weather a point is inside of the tile polygon
  isInside(p) {
    return insidePoli(this.poli, p);
  }
}

// set the Penrose tiling type to P2
function setPenroseP2() {
  penroseType = PenroseType.P2;
}

// set the Penrose tiling type to P3
function setPenroseP3() {
  penroseType = PenroseType.P3;
}

// construct initial tiles
function setupInitialTiles(width, height, size) {
  let initialTiles = [];

  if (penroseType == PenroseType.P2) {
    // 5 kytes for penrose P2, centered
    for (let i = 0; i < 5; i++) {
      initialTiles.push(new PenroseTile(PenroseTileType.Kite, width / 2, height / 2, Math.PI / 2 + (2 * i + 1) * A, size));
    }
  } else {
    // 5 Fat tiles for penrose P3, centered
    for (let i = 0; i < 5; i++) {
      initialTiles.push(new PenroseTile(PenroseTileType.Fat, width / 2, height / 2,  Math.PI / 2 + (2 * i + 1) * A, size));
    }
  }
  return initialTiles;
}

// subdivide the imput tiles for each generation and remove duplicates
// https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/aperiodic-tilings/
// https://preshing.com/20110831/penrose-tiling-explained/
function subdividePenroseTiles(inputTiles, generations) {

  for (let i = 0; i < generations; i++) {
    let nextGen = [];

    for (let tile of inputTiles) {
      let x = tile.rx
      let y = tile.ry
      let angle = tile.angle
      let newx;
      let newy;
      let newSize = tile.size / GOLD;
      size = newSize;
      let sign = 1;

      switch (tile.type) {
        case PenroseTileType.Kite:
          for (let i = 0; i < 2; i++) {
            nextGen.push(new PenroseTile(PenroseTileType.Dart, x, y, angle - 4*A*sign, newSize));

            newx = x + Math.cos(angle - A*sign) * GOLD * tile.size;
            newy = y - Math.sin(angle - A*sign) * GOLD * tile.size;
            nextGen.push(new PenroseTile(PenroseTileType.Kite, newx, newy, angle + 3*A*sign, newSize));
            sign *= -1;
          }
          break;
        case PenroseTileType.Dart:
          nextGen.push(new PenroseTile(PenroseTileType.Kite, x, y, angle + 5*A, newSize));
          for (let i = 0; i < 2; i++) {
            newx = x + Math.cos(angle - 4*A*sign) * GOLD * tile.size;
            newy = y - Math.sin(angle - 4*A*sign) * GOLD * tile.size;
            nextGen.push(new PenroseTile(PenroseTileType.Dart, newx, newy, angle - 4*A*sign, newSize));
            sign *= -1;
          }
          break;
        case PenroseTileType.Thin:
          newx = x - Math.cos(angle) * LT * tile.size;
          newy = y + Math.sin(angle) * LT * tile.size;
          nextGen.push(new PenroseTile(PenroseTileType.Thin, newx, newy, angle + 3*A, newSize));
          nextGen.push(new PenroseTile(PenroseTileType.Thin, newx, newy, angle - 3*A, newSize));

          for (let i = 0; i < 2; i++) {
            newx = x + Math.cos(angle - 3*A*sign) * GOLD * tile.size;
            newy = y - Math.sin(angle - 3*A*sign) * GOLD * tile.size;
            nextGen.push(new PenroseTile(PenroseTileType.Fat, newx, newy, angle + 2*A*sign, newSize));
            sign *= -1;
          }
          break;
        case PenroseTileType.Fat:
          newx = x + Math.cos(angle) * LF * tile.size;
          newy = y - Math.sin(angle) * LF * tile.size;
          nextGen.push(new PenroseTile(PenroseTileType.Fat, newx, newy, angle + Math.PI, newSize));

          for (let i = 0; i < 2; i++) {
            newx = x + Math.cos(angle - A*sign) * GOLD * tile.size;
            newy = y - Math.sin(angle - A*sign) * GOLD * tile.size;
            nextGen.push(new PenroseTile(PenroseTileType.Fat, newx, newy, angle + 4*A*sign, newSize));
            nextGen.push(new PenroseTile(PenroseTileType.Thin, newx, newy, angle - 4*A*sign, newSize));
            sign *= -1;
          }
          break;
        default:
          console.log("ERROR: unrecognized tile type");
      }
    }
    // remove duplicate tiles
    inputTiles = removeDuplicates(nextGen);
  }

  return inputTiles;
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

  // find min and mas for X and Y of the field shape
  for (let p of poliBorder) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  // add a margin
  minX -= size*GOLD;
  maxX += size*GOLD;
  minY -= size*GOLD;
  maxY += size*GOLD;

  // the spatial index size is set to one more of the maximum distance between cell centers
  spatialIndex = new SpatialIndex(minX, maxX, minY, maxY, 1 + 2*GOLD*Math.cos(A/2)*size);
  for (let c of cells) {
    spatialIndex.addElement(c);
  }
  console.timeEnd('Spatial Index');
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
        cell.relations.push({ref: otherCell});
        break;
      }
    }
  }
}
