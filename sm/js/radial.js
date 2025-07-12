// A Family of Non-Periodic Tilings, Describable Using Elementary Tools and Exhibiting a New Kind of Structural Regularity
// Miki Imura
// https://arxiv.org/abs/2506.07638v1
function gcd(a, b) {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
}

class RadialCell extends Cell{
	constructor(_rx, _ry, _basePoly, _color = "#FFFFFF") {
		super(_rx, _ry, 0, null);
		this.rx = _rx;
		this.ry = _ry;
		this.poli = [];
		this.color = _color;
		for (let p of _basePoly) {
			this.poli.push({x: p.x + _rx, y : p.y + _ry});
		}
		if (this.poli.length % 4 == 0) {
			this.x = this.poli[this.poli.length / 4 - 1].x / 6
				+ this.poli[this.poli.length / 4].x / 6
				+ this.poli[this.poli.length / 4 + 1].x / 6
				+ this.poli[this.poli.length / 4 * 3].x / 2;
			this.y = this.poli[this.poli.length / 4 - 1].y / 6
				+ this.poli[this.poli.length / 4].y / 6
				+ this.poli[this.poli.length / 4 + 1].y / 6
				+ this.poli[this.poli.length / 4 * 3].y / 2;
		} else {
			this.x = (this.poli[Math.floor(this.poli.length / 4)].x 
				+ this.poli[Math.floor(this.poli.length / 4 * 3)].x) / 2;
			this.y = (this.poli[Math.floor(this.poli.length / 4)].y 
				+ this.poli[Math.floor(this.poli.length / 4 * 3)].y) / 2;
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
function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function setupRadial1_2_2() { setupRadial(1,2,2,false); }
function setupRadial1_3_2() { setupRadial(1,3,2,false); }
function setupRadial1_4_2() { setupRadial(1,4,2,false); }
function setupRadial2_5_2() { setupRadial(2,5,2,false); }
function setupRadial2_5_3() { setupRadial(2,5,3,false); }

function setupRadial(m, k, t, offset) {
	templateRels.push([]);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	cells = [];
	let center = {x : canvas.width / 2, y : canvas.height / 2};
	console.log("m = " + m + " k = " + k + " t = " + t);
	let g = gcd(m, k);
	if (g != 1) {
		m = m / g;
		k = k / g;
	}
	let level = 12;
	let n = offset ? 2*((t*k)-m) : t*k;
	console.log("n = " + n);
	let uVecs = [];
	for (let i = 0; i < n; i++) {
		uVecs.push({x : Math.cos(2 * Math.PI * i / n), y : Math.sin(2 * Math.PI * i / n)});
	}
	let s = [];
	for (let j = 0; j < k; j++) {
		s.push((j*m)%k);
	}
	s.push(k);

	let points = [];
	points.push({x : 0, y : 0});

	for (let j of s) {
		let p = points[points.length -1];
		points.push({x : p.x + (uVecs[j].x), y : p.y + (uVecs[j].y)});
	}

	let io1 = points.length - 2;
	let io2 = points.length;

	s2 = [...s]
	s2 = s2.reverse();
	s2[0] = s2[s2.length - 1];
	s2.pop();

	for (let j of s2) {
		let p = points[points.length -1];
		points.push({x : p.x - (uVecs[j].x), y : p.y - (uVecs[j].y)});
	}

	console.log("Base cell area = " + poliArea(points));

	let L = 20;
	if (offset) center.x -= L/2;
	for (let p of points) {
		p.x = p.x * L;
		p.y = p.y * L;
	}
	let maxLen = maxLength(points);
	console.log("Max length = " + maxLen);

	let o1 = points[io1];
	let o2 = points[io2];


	generateSlice(cells, center.x , center.y, uVecs[0], points, o1, o2, level);

	let bounduaryPoints = [...points];
	let bounduaryS = [...s];
	bounduaryPoints.reverse();
	let index = 0;
	let sliceStartingPoints = [{x : 0, y : 0}];

	// console.log(s);
	// how many slices I have to generate for each sectpr
	let limit = offset ? n/2 : k;

	for (let i = 1; i < limit; i++) {

		// console.log("Before");
		// console.log(bounduaryS);
		// console.log(bounduaryPoints);
		// console.log("i = " + i);
		index = bounduaryS.findIndex((e) => e == i%k || e == i);
		// console.log("index = " + index);
		let sliceStartingPoint;
		if (index == 0) {
			sliceStartingPoint = {x : 0, y : 0};
		} else {
			sliceStartingPoint = {x : bounduaryPoints[index - 1].x, y : bounduaryPoints[index - 1].y};
		}
		sliceStartingPoints.push(sliceStartingPoint);
		let rotatedPoints = generateSlice(cells, center.x + sliceStartingPoint.x, center.y + sliceStartingPoint.y, uVecs[i], points, o1, o2, level);
		rotatedPoints.reverse();
		bounduaryS = bounduaryS.slice(0, index);
		bounduaryPoints = bounduaryPoints.slice(0, index);
		for (let n of s) {
			bounduaryS.push((n + i)%k);
		}
		for (let p of rotatedPoints) {
			bounduaryPoints.push({x : p.x + sliceStartingPoint.x, y : p.y + sliceStartingPoint.y});
		}

		// console.log("after");
		// console.log(bounduaryS);
		// console.log(bounduaryPoints);
	}
	// console.log(sliceStartingPoints);
	// console.log("n = " + n);
	if (offset) center.x += L;
	let sectorCount = offset ? 2 : t;
	for (let i = 0; i < sectorCount - 1; i++) {
		let sectorRotationVector = uVecs[(i + 1) * limit];
		for (let j = 0; j < limit; j++) {
			let sliceRotationVector = uVecs[(i + 1) * limit + j];
			let sliceStartingPoint = rotatePoint(sliceStartingPoints[j], sectorRotationVector);
			// console.log(sliceRotationVector);
			// console.log(sliceStartingPoint);
			generateSlice(cells, center.x + sliceStartingPoint.x, center.y + sliceStartingPoint.y, sliceRotationVector, points, o1, o2, level);
			// console.log((i + 1) * k + j);
		}
	}
	setFieldShape();
	// cells = cells.filter(cell => gridWidth / 2 > distance({x: canvas.width / 2, y : canvas.height / 2}, cell));
	setSpatialIndexRadial(maxLen);
	for (let c of cells) {
		addNeighborsFast(c);
		c.draw();
	}
}

function generateSlice(cells, _rx, _ry, _rotVec, _points, _o1, _o2, level) {
	// let currColor = document.getElementById("myColor").checked ? getRandomColor() : "white";
	let currColor = "white";
	let currentGeneration = [];
	let nextGeneration = [];

	let o1 = rotatePoint(_o1, _rotVec);
	let o2 = rotatePoint(_o2, _rotVec);
	let rotatedPoints = [];
	for (let p of _points) {
		rotatedPoints.push(rotatePoint(p, _rotVec));
	}

	let c1 = new RadialCell(_rx, _ry, rotatedPoints, currColor)
	cells.push(c1);
	currentGeneration.push(c1);

	for (let gen = 0; gen < level; gen++) {
		let co1 = new RadialCell(currentGeneration[0].rx + o1.x, currentGeneration[0].ry + o1.y, rotatedPoints, currColor);
		cells.push(co1);
		nextGeneration.push(co1);
		for (let cgc of currentGeneration) {
			let co2 = new RadialCell(cgc.rx + o2.x, cgc.ry + o2.y, rotatedPoints, currColor);
			cells.push(co2);
			nextGeneration.push(co2);
		}
		currentGeneration = nextGeneration;
		nextGeneration = [];
	}

	return rotatedPoints;
}

function rotatePoint(_p, _rotVec) {
	return {x : (_p.x * _rotVec.x) - (_p.y * _rotVec.y), y : (_p.x * _rotVec.y) + (_p.y * _rotVec.x)};
}

function setSpatialIndexRadial(maxLength) {
	let minX = cells[0].x;
	let minY = cells[0].y;
	let maxX = cells[0].x;
	let maxY = cells[0].y;
	for (let c of cells) {
		if (c.x < minX) minX = c.x;
		if (c.y < minY) minY = c.y;
		if (c.x > maxX) maxX = c.x;
		if (c.y > maxY) maxY = c.y;
	}
	let maxDistance = 9+maxLength*1.1;
	console.log("minX = " + minX + ", minY = " + minY + ", maxX = " + maxX + ", maxY = " + maxY, ", maxDistance = " + maxDistance);
	spatialIndex = new SpatialIndex(minX, maxX, minY, maxY, maxDistance);
	for (let c of cells) {
		spatialIndex.addElement(c);
	}

}
