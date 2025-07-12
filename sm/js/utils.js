class SpatialIndex {
	constructor(minX, maxX, minY, maxY, size) {
		this.size = size;
		this.minX = minX;
		this.minY = minY;
		this.lenX = Math.ceil((maxX-minX)/size);
		this.lenY = Math.ceil((maxY-minY)/size);
		this.matrix = [];
		for (let i = 0; i < this.lenX; i++) {
			this.matrix.push([]);
			for (let j = 0; j < this.lenY; j++) {
				this.matrix[i].push([]);
			}
		}
	}
	
	addElement(elem) {
		let indX = Math.floor((elem.x-this.minX)/this.size);
		let indY = Math.floor((elem.y-this.minY)/this.size);
		this.matrix[indX][indY].push(elem);
	}
	
	getNearElements (x, y, distance = 1) {
		let indX = Math.floor((x-this.minX)/this.size);
		let indY = Math.floor((y-this.minY)/this.size);
		if (indX < 0 || indY < 0 || indX > this.matrix.length - 1 || indY > this.matrix[0].length - 1) {
			return [];
		}
		//console.log(indX + ", " + indY);
		let minIndX = Math.max(0, indX - distance);
		let minIndY = Math.max(0, indY - distance);
		let maxIndX = Math.min(this.matrix.length - 1, indX + distance);
		let maxIndY = Math.min(this.matrix[0].length - 1, indY + distance);
		//console.log(minIndX + ", " + maxIndX + ", " + minIndY + ", " + maxIndY);
		
		let outArray = [];
		for (let i = minIndX; i <= maxIndX; i++) {
			for (let j = minIndY; j <= maxIndY; j++) {
				outArray.push(...this.matrix[i][j]);
			}
		}
		return outArray;
	}
}

function doNothing() {
}

function runFunction(name, arguments = null) {
  var fn = window[name];
  if(typeof fn !== 'function') {
    console.log("unknown function " + name);
    return;
  }
  fn.apply(window, arguments);
}

function poliArea(inPoli) {
	let area = 0;
	let j = inPoli.length - 1;
	for (let i = 0; i < inPoli.length; i++) {
		area += (inPoli[i].x + inPoli[j].x) * (inPoli[i].y - inPoli[j].y)
		j = i;
	}
	return area / 2;
}

function maxLength(inPoli) {
	let maxLengthSquared = 0;
	for (let i = 0; i < inPoli.length; i++) {
		for (let j = i; j < inPoli.length; j++) {
			let temp = Math.pow(inPoli[i].x - inPoli[j].x, 2) + Math.pow(inPoli[i].y - inPoli[j].y, 2)
			if (temp > maxLengthSquared) maxLengthSquared = temp;
		}
	}
	return Math.sqrt(maxLengthSquared);
}
