// TODO: 
// grid creation from text (JSON)
// review checkbounds
// Time!
// do not regenerate field structure if settings are not changed
// try to force integer coordinates to speed up rendering
// pre-render background?
// quad-tree or spacial parsing
// display bombs and errors on explosion
// restyle settings
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
				//let msgBox = document.getElementById("msgBox");
				//msgBox.style.display = "block";
				//msgBox.style.visibility = "visible";
				showPopup();
			}
			this.visible = true;
		}
	}

	isInside(p) {
		return (Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y)) <= this.props.scale * size / 2);
	}

	isSameCell(p) {
		/*
		let d = (p.x-this.x)*(p.x-this.x)+(p.y-this.y)*(p.y-this.y);
		if (d <= size*size/4) {
			if (d > dMax) dMax = d;
			return true;
		} else {
			return false;
		}
		*/
		//return ((p.x-this.x)*(p.x-this.x)+(p.y-this.y)*(p.y-this.y) <= size*size/4);
		return ((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) <= 1);
	}

	isInCanvas() {
		//return this.x>size && this.y>size && this.x<canvas.width-size && this.y<canvas.height-size;
		let t = insidePoli(poliBorder, {
			x: this.x,
			y: this.y
		});
		return t;
	}

	markNeigh() {
		//let n = 0;
		for (let r of this.relations) {
			if (!(r.ref === null) && !r.ref.visible && !r.ref.flagged) {
				r.ref.isClicked = true;
				//n++;
			}
		}
		//console.log(n + " neighbors");
	}

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

	clearNumber() {
		if (this.visible) {
			let n = 0;
			let neigh = 0;
			for (let r of this.relations) {
				if (!(r.ref === null) && r.ref.flagged) n++;
				if (!(r.ref === null)) neigh++;
			}
			//console.log("Number = " + this.nearMines + " n = " + n + " neigh = " + neigh);
			if (this.nearMines == n) {
				for (let r of this.relations) {
					if (!(r.ref === null) && !r.ref.visible) r.ref.click();
				}
			}
		}
	}
	createNeighbors() {
		for (let i = 0; i < templateRels[this.type].length; i++) {
			let fi = findCell(templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y);
			if (fi === null) {
				let c = createCell(templateRels[this.type][i].t, templateRels[this.type][i].dx * size + this.x, templateRels[this.type][i].dy * size + this.y, templateRels[this.type][i].shape, templateRels[this.type][i].props);
				if (c.isInCanvas()) {
					this.relations[i].ref = c;
					cells.push(c);
					c.createNeighbors();
				}
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
		let si = size * this.props.scale / 2;
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


let cells = [];
let size = 30;
let gridWidth = 800;
let fontSize = 15;
let templateRels = [];
let density = 0.1;
const textColor = ["#5555FF", "#007700", "#D50000", "#000066", "#550000", "#858585",
	"#AAAA00", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"
];
const highlightCol = "#999999";
const invisibleCol = "#000000";
const visibleCol = "#CCCCCC";
const borderCol = "#555555";
let numMines;
let exploded;
let bgColor = "#FFFFFF";
let poliBorder = [];
let globalScale = 1;
let globalTranslateX = 0;
let globalTranslateY = 0;
let doubleMouse = false;
let shiftPressed = false;
let mousePos;
let menuVisible = false;
let fingerMoved = false;
let posCenterPinch = {
	x: -200,
	y: -200
};
let startTouch = {
	x: -200,
	y: -200
};
let lastTouchPos = null;
let distPinch = 1;
const movementThreshold = 5;
let lastTap = 0;
let offsX = 0;
let offsY = 0;

let dMax = 0;


window.onload = function () {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	//ctx.textBaseline = "middle";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//console.log("Pixel ratio = " + window.devicePixelRatio);

	//let ratio = window.screen.width/canvas.width;
	//let vp = document.getElementById("Viewport");
	//vp.content = "initial-scale=" + ratio + ", maximum-scale=" + ratio + ", minimum-scale=" + ratio + ", user-scalable=yes";
	ctx.textAlign = "center";
	canvas.addEventListener("mousedown", mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener("touchstart", touchStartHandler, false);
	canvas.addEventListener('touchend', touchEndHandler, false);
	canvas.addEventListener('touchmove', touchMoveHandler, false);
	canvas.addEventListener('contextmenu', contextMenuHandler, false);
	canvas.addEventListener('wheel', wheelHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("keydown", keyDownHandler, false);

	window.addEventListener("resize", onResize);
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	startMousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	setup();
}

function onResize() {

	setVizualization();
	translateField();
}

function translateField() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	fontSize = Math.floor(size / 2);
	ctx.font = "bold " + fontSize + "px Arial";
	ctx.textAlign = "center";


	let deltaX = (canvas.width / 2 - cells[0].x);
	let deltaY = (canvas.height / 2 - cells[0].y);
	console.log(deltaX);

	for (let ce of cells) {
		ce.move(deltaX, deltaY);
	}

	resetZoom();
}

function resetZoom() {
	globalScale = 1;
	globalTranslateX = 0;
	globalTranslateY = 0;
	redraw();
}

function setVizualization() {
	let vp = document.getElementById("Viewport");
	let pop = document.getElementById("pop1");
	let infoBar = document.getElementById('infoBar');
	if (window.innerHeight < window.innerWidth) {
		infoBar.className = 'vertical-menu';
		let newWidth = 800 / window.innerHeight * window.innerWidth;
		vp.content = "user-scalable=no, width=" + newWidth;
		pop.style.width = "30%"
	} else {
		infoBar.className = 'scrollmenu';
		vp.content = "user-scalable=no, width=800";
		pop.style.width = "45%"
	}
	if (window.devicePixelRatio > 2) {
		pop.style.transform = "scale(1.8,1.8)";
		settingsPop.style.transform = "scale(1.8,1.8)";
		if (window.innerHeight < window.innerWidth) {
			infoBar.classList.add("big-vert");
		} else {
			infoBar.classList.add("big-horiz");
		}
	}
}

function chooseRandomElement(arr) {
	let ind = Math.floor(Math.random() * arr.length);
	return arr[ind];
}

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

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

function setup() {
	//console.time('StartCreation');
	setVizualization();
	//moveMenu();
	setField();
	//console.timeEnd('StartCreation');
}

function setSquare() {
	templateRels.push([]);
	templateRels[0].push({dx:1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:1,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:0,shape:1,ref:null});
}

function setBiSquare() {
	templateRels.push([]);
	templateRels.push([]);
	let props0 = {scale:2,sides:4,rot:Math.PI/4};
	let props1 = {scale:1,sides:4,rot:Math.PI/4};
	
	let sq2 = Math.sqrt(2);
	
	templateRels[0].push({dx:1.5/sq2,dy:0.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1/sq2,dy:2/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-0.5/sq2,dy:1.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-2/sq2,dy:1/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1.5/sq2,dy:-0.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1/sq2,dy:-2/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0.5/sq2,dy:-1.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:2/sq2,dy:-1/sq2,t:0,shape:3,props:props0,ref:null});
	
	templateRels[1].push({dx:1.5/sq2,dy:0.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5/sq2,dy:1.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1.5/sq2,dy:-0.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.5/sq2,dy:-1.5/sq2,t:0,shape:3,props:props0,ref:null});
	
	templateTarnsform(0.9034, 0);
}

function setCubes() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	let pts = [];
	let c30 = Math.cos(Math.PI/6);
	let c3030 = c30*c30;
	pts.push({x:c30,y:0});
	pts.push({x:0,y:0.5});
	pts.push({x:-1*c30,y:0});
	pts.push({x:0,y:-0.5});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI/3,points:pts};
	let props2 = {scale:1,rot:-Math.PI/3,points:pts};
	templateRels[0].push({dx:2*c30,dy:0,t:0,shape:5,props:props0,ref:null});	
	templateRels[0].push({dx:1.5*c30,dy:c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0.5*c30,dy:c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-0.5*c30,dy:c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-1.5*c30,dy:c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-2*c30,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-1.5*c30,dy:-1*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-0.5*c30,dy:-1*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:0.5*c30,dy:-1*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:1.5*c30,dy:-1*c3030,t:2,shape:5,props:props2,ref:null});
	
	templateRels[1].push({dx:c30,dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:1.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:c30,dy:2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:-0.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1*c30,dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:-1.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1*c30,dy:-2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:-2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:0.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	
	templateRels[2].push({dx:-1*c30,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-1.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:-1*c30,dy:2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[2].push({dx:0,dy:2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:0.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:c30,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:1.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:c30,dy:-2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[2].push({dx:0,dy:-2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-0.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(1.06796, 0);

}

function setArrow() {
	offsX = 0.375;
	offsY = 0.375;
	templateRels.push([]);
	templateRels.push([]);
	let pts = [];
	pts.push({x:0.75,y:0});
	pts.push({x:0,y:0.75});
	pts.push({x:0,y:0.375});
	pts.push({x:-0.75,y:0.375});
	pts.push({x:-0.75,y:-0.375});
	pts.push({x:0,y:-0.375});
	pts.push({x:0,y:-0.75});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI,points:pts};
	templateRels[0].push({dx:1.5,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:0.75,dy:0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:1.5,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-0.75,dy:0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-1.5,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-0.75,dy:-0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-1.5,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:0.75,dy:-0.75,t:1,shape:5,props:props1,ref:null});
	
	templateRels[1].push({dx:1.5,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0.75,dy:0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:1.5,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:-0.75,dy:0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1.5,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:-0.75,dy:-0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-1.5,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0.75,dy:-0.75,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(0.92415, 0);
}

function setTriHex() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:2,sides:6,rot:0};
	let props1 = {scale:1.15,sides:3,rot:-Math.PI/6};
	let props2 = {scale:1.15,sides:3,rot:Math.PI/6};

	let d2 = 1/(2*Math.cos(Math.PI/6));

	templateRels[0].push({dx:2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:2*d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:-3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:-2*d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:-d2,t:1,shape:3,props:props1,ref:null});

	templateRels[1].push({dx:1,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:2*d2,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-1,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1,dy:-d2,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:0,dy:-2*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1,dy:-d2,t:2,shape:3,props:props2,ref:null});

	templateRels[2].push({dx:1,dy:-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:-2*d2,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1,dy:-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-1,dy:d2,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:0,dy:2*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:1,dy:d2,t:1,shape:3,props:props1,ref:null});

	templateTarnsform(0.93288277413, 0);
}

function set3464() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:2,sides:6,rot:0};
	let props1 = {scale:Math.sqrt(2),sides:4,rot:-Math.PI/12};
	let props2 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/4};
	let props3 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/12};
	let props4 = {scale:1.15,sides:3,rot:0};
	let props5 = {scale:1.15,sides:3,rot:-Math.PI/3};

	let d2 = 1/(2*Math.cos(Math.PI/6));
	let d1 = d2/2;

	templateRels[0].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:0,dy:0.5+d1+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0,dy:-0.5-d1-d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1+d2,dy:0,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:-1-d2,dy:0,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:0.5+d1,dy:0.5+d1+d2,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-0.5-d1,dy:0.5+d1+d2,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:0.5+d1,dy:-0.5-d1-d2,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-0.5-d1,dy:-0.5-d1-d2,t:5,shape:3,props:props5,ref:null});

	templateRels[1].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:2*Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:0,dy:-2*Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:4,shape:3,props:props4,ref:null});
	templateRels[1].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:5,shape:3,props:props5,ref:null});

	templateRels[2].push({dx:0,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0.5+d1,dy:0,t:4,shape:3,props:props4,ref:null});
	templateRels[2].push({dx:-0.5-d1,dy:0,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[2].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});


	templateRels[3].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:0,dy:2*Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:0,dy:-2*Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:4,shape:3,props:props4,ref:null});
	templateRels[3].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:5,shape:3,props:props5,ref:null});

	templateRels[4].push({dx:1+d2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[4].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});

	templateRels[5].push({dx:-1-d2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[5].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});

	templateTarnsform(0.9698146939, 0);
}

function setTriQuad() {
	templateRels.push([]);
	templateRels.push([]);
	
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	//Squares
	let props0 = {scale:2,sides:4,rot:Math.PI/12};
	let props1 = {scale:2,sides:4,rot:-Math.PI/12};
	//Triangles
	let triScale = 1.62;
	let props2 = {scale:triScale,sides:3,rot:0};
	let props3 = {scale:triScale,sides:3,rot:Math.PI};
	let props4 = {scale:triScale,sides:3,rot:Math.PI/2};
	let props5 = {scale:triScale,sides:3,rot:-Math.PI/2};
	
	let d1 = Math.cos(Math.PI/12)*2;
	let d2 = (1/Math.sqrt(2)*(1+Math.tan(Math.PI/6)))/2;
	let d3 = (1/Math.sqrt(2)*(1+Math.tan(Math.PI/6)))*Math.sin(Math.PI/3);
	let d5 = (Math.sqrt(2)*Math.tan(Math.PI/6))
	let d4 = d2+d5;
	
	
	templateRels[0].push({dx:d1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-d1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:d4,dy:d3,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:d2,dy:d3,t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-d3,dy:d4,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-d3,dy:d2,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:-d4,dy:-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-d2,dy:-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:d3,dy:-d4,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:d3,dy:-d2,t:4,shape:3,props:props4,ref:null});
	
	templateRels[1].push({dx:d1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-d1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-d4,dy:d3,t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-d2,dy:d3,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:d3,dy:d4,t:4,shape:3,props:props4,ref:null});
	templateRels[1].push({dx:d3,dy:d2,t:5,shape:3,props:props5,ref:null});
	templateRels[1].push({dx:d4,dy:-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:d2,dy:-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-d3,dy:-d4,t:5,shape:3,props:props5,ref:null});
	templateRels[1].push({dx:-d3,dy:-d2,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[2].push({dx:d2,dy:d3,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-d4,dy:d3,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-d4,dy:-d3,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:d2,dy:-d3,t:1,shape:3,props:props1,ref:null});
	
	templateRels[2].push({dx:d2+d3,dy:d5/2,t:4,shape:3,props:props4,ref:null});
	templateRels[2].push({dx:d2+d3,dy:-d5/2,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:-d5,dy:0,t:3,shape:3,props:props3,ref:null});
	templateRels[2].push({dx:-d5/2,dy:d2+d3,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:-d5/2,dy:-d2-d3,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[3].push({dx:-d2,dy:d3,t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:d4,dy:d3,t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:d4,dy:-d3,t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:-d2,dy:-d3,t:0,shape:3,props:props0,ref:null});
	
	templateRels[3].push({dx:-d2-d3,dy:d5/2,t:4,shape:3,props:props4,ref:null});
	templateRels[3].push({dx:-d2-d3,dy:-d5/2,t:5,shape:3,props:props5,ref:null});
	templateRels[3].push({dx:d5,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:d5/2,dy:d2+d3,t:5,shape:3,props:props5,ref:null});
	templateRels[3].push({dx:d5/2,dy:-d2-d3,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[4].push({dx:-d3,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-d3,dy:-d4,t:1,shape:3,props:props1,ref:null});
	templateRels[4].push({dx:d3,dy:-d4,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:d3,dy:d2,t:1,shape:3,props:props1,ref:null});
	
	templateRels[4].push({dx:-d5/2,dy:d2+d3,t:3,shape:3,props:props3,ref:null});
	templateRels[4].push({dx:d5/2,dy:d2+d3,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:0,dy:-d5,t:5,shape:3,props:props5,ref:null});
	templateRels[4].push({dx:-d2-d3,dy:-d5/2,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:d2+d3,dy:-d5/2,t:3,shape:3,props:props3,ref:null});
	
	
	templateRels[5].push({dx:-d3,dy:-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[5].push({dx:-d3,dy:d4,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:d3,dy:d4,t:1,shape:3,props:props1,ref:null});
	templateRels[5].push({dx:d3,dy:-d2,t:0,shape:3,props:props0,ref:null});
	
	templateRels[5].push({dx:-d5/2,dy:-d2-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[5].push({dx:d5/2,dy:-d2-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:0,dy:d5,t:4,shape:3,props:props4,ref:null});
	templateRels[5].push({dx:-d2-d3,dy:d5/2,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:d2+d3,dy:d5/2,t:3,shape:3,props:props3,ref:null});
	
	templateTarnsform(0.897, 0);
	
}

function set33344() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/4};
	let props1 = {scale:1.15,sides:3,rot:-Math.PI/6};
	let props2 = {scale:1.15,sides:3,rot:Math.PI/6};

	let d2 = 1/(2*Math.cos(Math.PI/6));
	let d1 = d2/2;

	templateRels[0].push({dx:1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.5,dy:0.5+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.5,dy:0.5+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-0.5,dy:-0.5-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0.5,dy:-0.5-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});

	templateRels[1].push({dx:1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0.5,dy:d1,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:0.5,dy:0.5+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5,dy:0.5+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5,dy:d1,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});

	templateRels[2].push({dx:1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[2].push({dx:0.5,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:0.5,dy:-0.5-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-0.5,dy:-0.5-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-0.5,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[2].push({dx:-1,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:1,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});

	templateTarnsform(1.2923893648, 0);
	
}

function setTri() {
	offsX = 0.8660254037844;
	offsY = -0.5;
	templateRels.push([]);
	templateRels.push([]);
	let props0 = {scale:1.99,sides:3,rot:-Math.PI/6};
	let props1 = {scale:1.99,sides:3,rot:Math.PI/6};
	templateRels[0].push({dx:0.8660254037844,dy:0.5,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.8660254037844,dy:1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:0.5,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1.7320508075688,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1.7320508075688,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:-1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.8660254037844,dy:-1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1.7320508075688,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1.7320508075688,dy:0,t:0,shape:3,props:props0,ref:null});
	
	templateRels[1].push({dx:0.8660254037844,dy:-0.5,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.8660254037844,dy:-1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:-2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:-1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:-0.5,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1.7320508075688,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1.7320508075688,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.8660254037844,dy:1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:1.7320508075688,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1.7320508075688,dy:0,t:1,shape:3,props:props1,ref:null});
	
	templateTarnsform(0.876, 0);
}

function setFloor1() {
	templateRels.push([]);
	templateRels.push([]);
	let props1 = {scale:2.15,sides:8,rot:Math.PI/8};
	let props2 = {scale:1.15,sides:4,rot:0};
	templateRels[0].push({dx:2,dy:0,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:2,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-2,dy:0,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-2,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1,dy:1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:-1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:1,shape:3,props:props2,ref:null});
	
	
	templateRels[1].push({dx:1,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:1,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateTarnsform(1/Math.sqrt(2), 0);
}

function setFishbone() {
	templateRels.push([]);
	templateRels.push([]);
	let props1 = {scale:2.2,rot:Math.PI/2,sides:4,ratio:0.29516724};
	let props2 = {scale:2.2,rot:0,sides:4,ratio:0.29516724};
	templateRels[0].push({dx:1.5,dy:0.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:0.5,dy:1.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:0,shape:4,props:props1,ref:null});
	templateRels[0].push({dx:-1.5,dy:-0.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:-0.5,dy:-1.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:0,shape:4,props:props1,ref:null});
	
	templateRels[1].push({dx:1.5,dy:0.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:0.5,dy:1.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:1,t:1,shape:4,props:props2,ref:null});
	templateRels[1].push({dx:-1.5,dy:-0.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:-0.5,dy:-1.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:1,dy:-1,t:1,shape:4,props:props2,ref:null});
	templateTarnsform(1/Math.sqrt(2), Math.PI/4);
}

function setHex() {
	templateRels.push([]);
	let props1 = {scale:1.15,sides:6,rot:0};
	templateRels[0].push({dx:0,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.86602540378,dy:0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.86602540378,dy:0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.86602540378,dy:-0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.86602540378,dy:-0.5,t:0,shape:3,props:props1,ref:null});
	templateTarnsform(1.07, 0);
}

function setWall() {
	templateRels.push([]);
	templateRels[0].push({dx:1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0.5,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-0.5,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0.5,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-0.5,dy:-1,t:0,shape:1,ref:null});
}

function setCairo() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	
	let d1 = Math.sin(Math.PI/8);
	let d2 = Math.cos(Math.PI/8);
	
	offsX = 0;
	offsY = d1-d2;
	
	let pts = [];
	pts.push({x:0,y:2*d1});
	pts.push({x:-d2,y:d1});
	pts.push({x:d1-d2,y:d1-d2});
	pts.push({x:d2-d1,y:d1-d2});
	pts.push({x:d2,y:d1});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI,points:pts};
	let props2 = {scale:1,rot:Math.PI/2,points:pts};
	let props3 = {scale:1,rot:-Math.PI/2,points:pts};
	
	templateRels[0].push({dx:2*d2,dy:2*d1,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:d2-d1,dy:d1+d2,t:3,shape:5,props:props3,ref:null});
	templateRels[0].push({dx:d1-d2,dy:d1+d2,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-2*d2,dy:2*d1,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-d2-d1,dy:d1-d2,t:3,shape:5,props:props3,ref:null});
	templateRels[0].push({dx:0,dy:2*(d1-d2),t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:d2+d1,dy:d1-d2,t:2,shape:5,props:props2,ref:null});
	
	templateRels[1].push({dx:-2*d2,dy:-2*d1,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:d1-d2,dy:-d1-d2,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:d2-d1,dy:-d1-d2,t:3,shape:5,props:props3,ref:null});
	templateRels[1].push({dx:2*d2,dy:-2*d1,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:d1+d2,dy:d2-d1,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:0,dy:2*(d2-d1),t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-d1-d2,dy:d2-d1,t:3,shape:5,props:props3,ref:null});
	
	templateRels[2].push({dx:-2*d1,dy:2*d2,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:-d1-d2,dy:d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:-d1-d2,dy:d1-d2,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-2*d1,dy:-2*d2,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:d2-d1,dy:-d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:2*(d2-d1),dy:0,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:d2-d1,dy:d2+d1,t:1,shape:5,props:props1,ref:null});
	
	templateRels[3].push({dx:2*d1,dy:-2*d2,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1+d2,dy:d1-d2,t:1,shape:5,props:props1,ref:null});
	templateRels[3].push({dx:d1+d2,dy:d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[3].push({dx:2*d1,dy:2*d2,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1-d2,dy:d2+d1,t:1,shape:5,props:props1,ref:null});
	templateRels[3].push({dx:-2*(d2-d1),dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1-d2,dy:-d2-d1,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(0.75337, Math.PI/4);
}

function setTestShape() {
	templateRels.push([]);
	let d1 = Math.sin(Math.PI/8);
	let d2 = Math.cos(Math.PI/8);
	let pts = [];
	pts.push({x:0,y:2*d1});
	pts.push({x:-d2,y:d1});
	pts.push({x:d1-1,y:d1-d2});
	pts.push({x:1-d1,y:d1-d2});
	pts.push({x:d2,y:d1});
	let props1 = {scale:1,rot:0,points:pts};
	templateRels[0].push({dx:3,dy:0,t:0,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:0,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:3,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:3,dy:-3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:-3,t:0,shape:0,props:props1,ref:null});
	console.log(JSON.stringify(templateRels));
}

function JSONShape() {
	let str = `
[[
	{
		"dx":3, "dy":0, "t":0, "shape":5, "ref":null,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		}
	},
	{
		"dx":0, "dy":3, "t":0, "shape":0, "ref":null,
		"props":{
			"scale":2,
			"rot":0
		}
	},
	{
		"dx":-3, "dy":0, "t":0, "shape":0, "ref":null,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		}
	},
	{
		"dx":0, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":3, "dy":3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":3, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":-3, "dy":3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":-3, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	}
]]
	`
	templateRels = JSON.parse(str);
}

function redraw() {
	//console.log(globalTranslateX);
	ctx.scale(globalScale, globalScale);
	ctx.translate(globalTranslateX, globalTranslateY);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//let i = 0;
	for (let c of cells) {
		c.draw();
		//ctx.fillStyle = "white";
		//ctx.fillText(i, c.x, c.y);
		//i++;
	}
	ctx.resetTransform();
	//ctx.fillStyle = "#00FF00";
	//ctx.beginPath();
	//ctx.arc(400, 400, 3, 0, 2 * Math.PI);
	//ctx.fill();
	//ctx.fillStyle = "#FF0000";
	//ctx.beginPath();
	//ctx.arc(posCenterPinch.x, posCenterPinch.y, 20, 0, 2 * Math.PI);
	//ctx.fill();
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left) / globalScale - globalTranslateX,
		y: (evt.clientY - rect.top) / globalScale - globalTranslateY
	};

}

function mouseDownHandler(evt) {
	//console.log("down = " + evt.button + " " + evt.buttons);
	mousePos = getMousePos(canvas, evt);
	if (evt.buttons == 3) {
		doubleMouse = true;
		for (let ce of cells) {
			if (ce.isInside(mousePos)) {
				if (!ce.flagged) {
					ce.markNeigh();
					ce.clearNumber();
					//console.log("Near mines = " + ce.nearMines);
				}
				break;
			}
		}
	} else if (evt.button == 0) {
		if (shiftPressed) {

		} else {
			for (let ce of cells) {
				if (ce.isInside(mousePos)) {
					ce.click();
					break;
				}
			}
		}

	} else if (evt.button == 2) {
		for (let ce of cells) {
			if (ce.isInside(mousePos)) {
				if (!ce.visible) ce.flagged = !ce.flagged;
				break;
			}
		}
	}
	evt.preventDefault();
	evt.stopPropagation();
	redraw();
	calc();
}

function mouseUpHandler(evt) {
	//console.log("up = " + evt.button + " " + evt.buttons);
	if (doubleMouse) {
		doubleMouse = false;
	}
	for (let ce of cells) {
		ce.isClicked = false;
	}
	redraw();
	calc();
	evt.preventDefault();
	evt.stopPropagation();
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (evt.buttons == 1) {
		globalTranslateX += evt.movementX / globalScale;
		globalTranslateY += evt.movementY / globalScale;
		checkPanZoonBounds();
		redraw();
	}
}

function contextMenuHandler(evt) {
	evt.preventDefault();
	evt.stopPropagation();
}

function wheelHandler(evt) {
	let mp = getMousePos(canvas, evt);
	if (evt.deltaY < 0) {
		if (globalScale < 10) {
			globalScale = globalScale * 1.2;
			globalTranslateX -= mp.x / globalScale * 0.2;
			globalTranslateY -= mp.y / globalScale * 0.2;
		}

	} else {
		globalTranslateX += mp.x / globalScale * 0.2;
		globalTranslateY += mp.y / globalScale * 0.2;
		globalScale = globalScale / 1.2;
	}

	checkPanZoonBounds();
	redraw();
	evt.preventDefault();
	evt.stopPropagation();
}

function keyDownHandler(evt) {
	if (evt.keyCode == 16) {
		// SHIFT
		shiftPressed = true;
		//console.log("SP");
	}
	evt.preventDefault();
	evt.stopPropagation();
}

function keyUpHandler(evt) {

	if (evt.keyCode == 39) {
		// right
		globalTranslateX += 20 / globalScale;
	} else if (evt.keyCode == 37) {
		// left
		globalTranslateX -= 20 / globalScale;
	} else if (evt.keyCode == 38) {
		// up
		globalTranslateY += 20 / globalScale;
	} else if (evt.keyCode == 40) {
		// down
		globalTranslateY -= 20 / globalScale;
	} else if (evt.keyCode == 16) {
		// SHIFT
		shiftPressed = false;
	}
	evt.preventDefault();
	evt.stopPropagation();
	checkPanZoonBounds();
	redraw();
}

function checkPanZoonBounds() {
	//console.log(globalScale);
	if (globalScale < 1) {
		globalScale = 1;
	}
	if (globalScale > 10) {
		globalScale = 10;
	}
	if (globalTranslateX > 0) {
		globalTranslateX = 0;
	}
	if (globalTranslateX < canvas.width * (1 / globalScale - 1)) {
		globalTranslateX = canvas.width * (1 / globalScale - 1);
	}
	if (globalTranslateY > 0) {
		globalTranslateY = 0;
	}
	if (globalTranslateY < canvas.height * (1 / globalScale - 1)) {
		globalTranslateY = canvas.height * (1 / globalScale - 1);
	}
}

function setField() {

	let msgBox = document.getElementById("msgBox");
	//msgBox.style.display = "none";
	msgBox.style.visibility = "hidden";

	globalScale = 1;
	globalTranslateX = 0;
	globalTranslateY = 0;
	exploded = false;
	bgColor = "#FFFFFF";
	let i = document.getElementById("gridType").value;
	size = parseInt(document.getElementById("scaleSlider").value);
	size = gridWidth / size;
	fontSize = Math.floor(size / 2);
	ctx.font = "bold " + fontSize + "px Arial";
	offsX = 0;
	offsY = 0;
	cells = null;
	templateRels = null;
	cells = [];
	templateRels = [];
	if (i == 0) {
		setSquare();
	} else if (i == 1) {
		setHex();
	} else if (i == 2) {
		setWall();
	} else if (i == 3) {
		setFloor1();
	} else if (i == 4) {
		setFishbone();
	} else if (i == 5) {
		setTri();
	} else if (i == 6) {
		setArrow();
	} else if (i == 7) {
		setCubes();
	} else if (i == 8) {
		setTriQuad();
	} else if (i == 9) {
		setCairo();
	} else if (i == 10) {
		setBiSquare();
	} else if (i == 11) {
		set33344();
	} else if (i == 12) {
		setTriHex();
	}else if (i == 13) {
		set3464()
	}else if (i == 14) {
		JSONShape();
		//setTestShape();
	}
	//
	setFieldShape();

	cells.push(createCell(templateRels[0][0].t, canvas.width / 2 + (offsX * size), canvas.height / 2 + (offsY * size), templateRels[0][0].shape, templateRels[0][0].props));
	cells[0].createNeighbors();

	numMines = Math.floor((cells.length + 1) * density);
	for (let i = 0; i < numMines; i++) {
		let c = chooseRandomElement(cells);
		if (c.hasMine) {
			i--;
		} else {
			c.hasMine = true;
		}
	}
	for (let ce of cells) {
		ce.countNearMines();
	}
	redraw();
	calc();
	//console.log("Max distance = " + dMax);
}

function setFieldShape() {
	let i = document.getElementById("gridShape").value;
	poliBorder = null;
	poliBorder = [];
	if (i == 0) {
		//Square
		poliBorder.push({
			x: (canvas.width - gridWidth) / 2 + size - 2,
			y: (canvas.height - gridWidth) / 2 + size - 2
		});
		poliBorder.push({
			x: (canvas.width / 2 + gridWidth / 2) - size + 2,
			y: (canvas.height - gridWidth) / 2 + size - 2
		});
		poliBorder.push({
			x: (canvas.width / 2 + gridWidth / 2) - size + 2,
			y: (canvas.height / 2 + gridWidth / 2) - size + 2
		});
		poliBorder.push({
			x: (canvas.width - gridWidth) / 2 + size - 2,
			y: (canvas.height / 2 + gridWidth / 2) - size + 2
		});
	} else if (i == 1) {
		//Hexagonal

		for (let i = 0; i < 6; i++) {
			poliBorder.push({
				x: (gridWidth / 2 - size - 1) * Math.cos(2 * Math.PI * i / 6) + canvas.width / 2,
				y: (gridWidth / 2 - size - 1) * Math.sin(2 * Math.PI * i / 6) + canvas.height / 2
			});
		}
	}
}

function changeSize() {
	size = parseInt(document.getElementById("scaleSlider").value);
	size = canvas.width / size;
	document.getElementById("densityValue").innerHTML = size;
}

function setDensity() {
	let d = parseInt(document.getElementById("densitySlider").value);
	density = d / 100;
	setField();
}

function showAll() {
	for (let ce of cells) {
		ce.visible = true;
	}
	redraw();
}

function calc() {
	let flags = 0;
	let hidden = 0;
	for (let ce of cells) {
		if (!ce.visible) hidden++;
		if (ce.flagged) flags++;
	}
	let left = numMines - flags;
	//document.getElementById("minesLeft").innerHTML = " " + left;
	document.getElementById("minesLeft2").innerHTML = " " + left;
	if (hidden == numMines && !exploded) {
		console.log("Vittoria!!!!!!!");
		bgColor = "#00FF00";
	}
}

function insidePoli(poly, p) {
	// Even–odd rule https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
	let c = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		let int = ((poly[i].y > p.y) != (poly[j].y > p.y)) && (p.x < (poly[j].x - poly[i].x) * (p.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x);
		if (int) c = !c;
	}
	return c;
}

function moveMenu() {
	let menu = document.getElementById("mainMenu");
	if (menuVisible) {
		menu.style.transform = "translateY(80px) scale(1.8)";
	} else {
		menu.style.transform = "scale(1) translateY(-168px)";
	}
	menuVisible = !menuVisible;
}

function touchStartHandler(evt) {
	evt.preventDefault();
	if (evt.touches.length == 1 && evt.changedTouches.length == 1) {
		startTouch.x = evt.changedTouches[0].pageX;
		startTouch.y = evt.changedTouches[0].pageY;
		if (!fingerMoved) {
			let rect = canvas.getBoundingClientRect();
			pos = {
				x: (evt.changedTouches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.changedTouches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			console.log(pos);
			for (let ce of cells) {
				if (ce.isInside(pos)) {
					// Set timeout for long press = set flag
					setTimeout(checkFlag, 400);
					highlightedCell = ce;
					ce.isClicked = true;
					if (!ce.flagged) {
						// Double tap = clear neighbour cells
						let now = new Date().getTime();
						if ((now - lastTap) < 500 && ce === highlightedCell) {
							highlightedCell.clearNumber();
							highlightedCell.markNeigh();
							setTimeout(clearMarked, 300);
						}
						lastTap = now;
					}
					break;
				}
			}
		}
		fingerMoved = false;
	} else if (evt.touches.length == 2) {
		fingerMoved = true;
		if (evt.touches.length > 1) {
			let rect = canvas.getBoundingClientRect();
			let pos1 = {
				x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			let pos2 = {
				x: (evt.touches[1].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.touches[1].pageY - rect.top) / globalScale - globalTranslateY
			};
			posCenterPinch.x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
			posCenterPinch.y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;
			distPinch = Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));
			//invisibleCol = "#FFFFFF";
		}
	} else {
		fingerMoved = true;
	}
	redraw();
	calc();
}

function clearMarked() {
	for (let ce of cells) {
		ce.isClicked = false;
	}
}

function touchEndHandler(evt) {
	evt.preventDefault();
	highlightedCell.isClicked = false;

	if (evt.touches.length == 0 && evt.changedTouches.length == 1) {
		if (!fingerMoved) {
			let rect = canvas.getBoundingClientRect();
			pos = {
				x: (evt.changedTouches[0].pageX - rect.left) / globalScale - globalTranslateX,
				y: (evt.changedTouches[0].pageY - rect.top) / globalScale - globalTranslateY
			};
			console.log(pos);
			for (let ce of cells) {
				if (ce.isInside(pos)) {
					ce.click();
					break;
				}
			}
		}
		fingerMoved = false;
	}
	redraw();
	calc();
}

function touchMoveHandler(evt) {
	evt.preventDefault();

	if (evt.touches.length > 1) {
		// at least two fingers: Pinch zoom and pan
		highlightedCell.isClicked = false;
		fingerMoved = true;
		let rect = canvas.getBoundingClientRect();
		let pos1 = {
			x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
		};
		let pos2 = {
			x: (evt.touches[1].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[1].pageY - rect.top) / globalScale - globalTranslateY
		};
		let distTemp = Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));

		let pinchTempX = (pos1.x + pos2.x) / 2;
		let pinchTempY = (pos1.y + pos2.y) / 2;

		//posCenterPinch.x = (pos1.x+pos2.x)/2;
		//posCenterPinch.y = (pos1.y+pos2.y)/2;

		globalScale *= distTemp / distPinch;
		if (globalScale < 10 && globalScale > 1) {
			globalTranslateX += pinchTempX / globalScale * (1 - distTemp / distPinch);
			globalTranslateY += pinchTempY / globalScale * (1 - distTemp / distPinch);
		}

		globalTranslateX += (((evt.touches[0].pageX + evt.touches[1].pageX) / 2) - posCenterPinch.x) / globalScale;
		globalTranslateY += (((evt.touches[0].pageY + evt.touches[1].pageY) / 2) - posCenterPinch.y) / globalScale;

		posCenterPinch.x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
		posCenterPinch.y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;

		checkPanZoonBounds();


	} else if (evt.touches.length == 1) {
		let rect = canvas.getBoundingClientRect();
		let pos1 = {
			x: (evt.touches[0].pageX - rect.left) / globalScale - globalTranslateX,
			y: (evt.touches[0].pageY - rect.top) / globalScale - globalTranslateY
		};
		if (!highlightedCell.isInside(pos1)) {
			// finger has moved outside the cell
			highlightedCell.isClicked = false;
			fingerMoved = true;

			//move with one finger
			globalTranslateX += (evt.changedTouches[0].pageX - startTouch.x) / globalScale;
			globalTranslateY += (evt.changedTouches[0].pageY - startTouch.y) / globalScale;

			startTouch.x = evt.changedTouches[0].pageX;
			startTouch.y = evt.changedTouches[0].pageY;

			checkPanZoonBounds();
		}
	}
	redraw();
}

function checkFlag() {
	if (highlightedCell.isClicked && !highlightedCell.visible) {
		highlightedCell.flagged = !highlightedCell.flagged
		highlightedCell.isClicked = false;
		fingerMoved = true;
		navigator.vibrate([100]);
	}
	for (let ce of cells) {
		ce.isClicked = false;
	}
	redraw();
	calc();
}

function templateTarnsform(scale, rot) {
	templateRels = jsonCopy(templateRels);
	for (let t of templateRels) {
		for (let e of t) {
			let xTemp = e.dx;
			e.dx = scale * (Math.cos(rot) * e.dx - Math.sin(rot) * e.dy);
			e.dy = scale * (Math.sin(rot) * xTemp + Math.cos(rot) * e.dy);
			if (e.props) {
				e.props.rot += rot;
				if (e.props.scale) e.props.scale *= scale;
			}
		}
	}
	xTemp = offsX;
	offsX = scale * (Math.cos(rot) * offsX - Math.sin(rot) * offsY);
	offsY = scale * (Math.sin(rot) * xTemp + Math.cos(rot) * offsY);
}

function showPopup() {
	let msgBox = document.getElementById("msgBox2");
	if (msgBox.style.opacity == "0") {
		msgBox.style.opacity = "1";
		msgBox.style.visibility = "visible";
	} else if (msgBox.style.opacity == "1") {
		msgBox.style.opacity = "0";
		msgBox.style.visibility = "hidden";
	} else {
		msgBox.style.opacity = "1";
		msgBox.style.visibility = "visible";
	}
}

function showSettings() {
	let settings = document.getElementById("settings");
	if (settings.style.opacity == "0") {
		settings.style.opacity = "1";
		settings.style.visibility = "visible";
	} else if (settings.style.opacity == "1") {
		settings.style.opacity = "0";
		settings.style.visibility = "hidden";
	} else {
		settings.style.opacity = "1";
		settings.style.visibility = "visible";
	}
}