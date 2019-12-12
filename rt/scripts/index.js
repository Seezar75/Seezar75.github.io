/**
 * index.js
 */

window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	canvas.addEventListener("mousemove", mouseMoveHandler, false);
	canvas.addEventListener("mousedown", mouseDownHandler, false);
	canvas.addEventListener("mouseup", mouseUpHandler, false);
	setup();
	window.requestAnimationFrame(loop);
};

let ctx;
let canvas;
let points = [];
let s1;
let mousePressed = false;
let curPoint = null;
const step = 1 / 20;
let t = 0;
let poli1 = [];
let poli2 = [];
let intersArray = [];
let segments = [];
let gates = [];
let bgCol = "black";
let trackWidth = 30;
let car;
let drawSpline = true;
let mode = 0;
let driveMode = 0;
let prevTime;
let lapStart;
let lapTime = 0;
let lastPos;
let objStr;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

function setup() {
	ctx.font = "12px Comic Sans MS";

	s1 = new Spline(20);

	let nPoints = 20;
	for (let i = 0; i < nPoints; i++) {
		s1.points.push(
			new Point2D(
				canvas.width / 2 * (1 + 0.8 * Math.cos(2 * i * Math.PI / nPoints)),
				canvas.height / 2 * (1 + 0.8 * Math.sin(4 * i * Math.PI / nPoints))
			)
		);
	}

	approxTrack();
	car = new Car(s1.points[0], s1.getSplineGardient(0, true));
	lastPos = car.p;
	prevTime = new Date();
	startTime = prevTime;
}

function loop() {
	if (rightPressed) {
		car.steer(false);
	} else if (leftPressed) {
		car.steer(true);
	}
	if (upPressed) {
		car.accel();
	} else if (downPressed) {
		car.break();
	}

	ctx.fillStyle = bgCol;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (drawSpline) {
		//Draw points
		s1.drawPoints(ctx, "yellow");

		//Draw Spline
		s1.draw(ctx);

		//Draw car
		s1.drawCar(t, ctx);
	}

	t += 0.005;
	if (t > s1.points.length) t = 0;

	// Draw track points
	//for (let p of poli1) p.draw(ctx);
	//for (let p of poli2) p.draw(ctx);
	//for (let p of intersArray) p.draw(ctx, "White", 10);

	// Draw trach Outline
	//drawLines([poli1, poli2]);
	drawLines(segments, "White", true);

	// Manage car
	car.update();
	car.draw(ctx);
	car.inside();
	
	if (intersect2(gates[0][0], gates[0][1], lastPos, car.p)) {
		let dy = gates[0][1].y - gates[0][0].y;
		let dx = gates[0][1].x - gates[0][0].x
		let distLine = (dy * car.p.x - dx * car.p.y + gates[0][1].x * gates[0][0].y - gates[0][1].y * gates[0][0].x);
		if (distLine > 0) {
			resetLapTime();
		}
	}
	lastPos = new Point2D(car.p.x, car.p.y);

	// Draw finish line
	ctx.lineWidth = 5;
	drawLines(gates, "Red");
	ctx.lineWidth = 1;
	

	ctx.fillStyle = "grey";
	if (mode == 0) {
		ctx.fillText("Move nodes (M)", 10, 20);
	} else if (mode == 1) {
		ctx.fillText("Add nodes (M)", 10, 20);
	} else if (mode == 2) {
		ctx.fillText("Remove nodes (M)", 10, 20);
	}

	if (driveMode == 0) {
		ctx.fillText("Drive mode: easy (D)", 10, 40);
	} else if (driveMode == 1) {
		ctx.fillText("Drive mode: hard (D)", 10, 40);
	}

	let curTime = new Date();
	ctx.fillText("FPS: " + (1000 / (curTime - prevTime)).toFixed(0), 10, 60);
	ctx.fillText("Time: " + ((curTime - startTime)/1000).toFixed(2), 10, 80);
	ctx.fillText("Last lap: " + (lapTime/1000).toFixed(2), 10, 100);
	prevTime = curTime;

	//Next frame
	window.requestAnimationFrame(loop);
}

function drawLines(lines, col = "Yellow", loop = true) {
	for (let l of lines) {
		ctx.strokeStyle = col;
		ctx.beginPath();
		for (let i = 0; i < l.length; i++) {
			ctx.lineTo(l[i].x, l[i].y);
		}
		if (loop) ctx.lineTo(l[0].x, l[0].y);
		ctx.stroke();
	}
}

function resetLapTime() {
	let curTime = new Date();
	lapTime = curTime - startTime;
	startTime = new Date();
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (mode == 0) {
		if (curPoint) {
			curPoint.x = mousePos.x;
			curPoint.y = mousePos.y;
		}
	}
	//evt.preventDefault();
}

function mouseDownHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	mousePressed = true;
	if (mode == 0) {
		setPoint();
		if (curPoint) {
			curPoint.x = mousePos.x;
			curPoint.y = mousePos.y;
		}
	} else if (mode == 1) {
		addPoint();
	} else if (mode == 2) {
		setPoint();
		let ind = s1.points.findIndex(p => p === curPoint);
		if (ind >= 0) {
			if (s1.points.length > 3) {
				t = 0;
				s1.points.splice(ind, 1);
				approxTrack();
			}
		}
	}
	//evt.preventDefault();
}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	mousePressed = false;
	curPoint = null;
	if (mode == 0) {
		approxTrack();
	}
	//evt.preventDefault();
}

function addPoint() {
	let minDist = canvas.height + canvas.width;
	let minT = 0;
	let d = minDist;
	for (let t = 0.0; t < s1.points.length; t += s1.step) {
		let p = s1.getSplinePoint(t, true);
		d = p.dist(mousePos);
		if (d < minDist) {
			minDist = d;
			minT = t;
		}
	}
	if (minDist < 10) {
		let p = s1.getSplinePoint(minT, true);
		console.log("minT = " + p);
		s1.points.splice(Math.floor(minT + 1), 0, p);
		mode = 0;
		approxTrack();
	}
}

function setPoint() {
	let d = canvas.height + canvas.width;
	let dTemp = 0;
	for (let p of s1.points) {
		dTemp = p.dist(mousePos);
		if (dTemp < d) {
			d = dTemp;
			curPoint = p;
		}
	}

	if (d > 10) {
		curPoint = null;
	}
}

function updateSplines() {
	let w = 10;
	for (let i = 0; i < s1.points.length; i++) {
		let p = s1.points[i];
		let g = s1.getSplineGardient(i, true);
		g.normalize();

		sr.points[i].x = s1.points[i].x - w * g.y;
		sr.points[i].y = s1.points[i].y + w * g.x;

		sl.points[i].x = s1.points[i].x + w * g.y;
		sl.points[i].y = s1.points[i].y - w * g.x;
	}
}

function insideCount(p, vect) {
	let n = vect.length;
	let cn = 0; // the  crossing number counter

	// loop through all edges of the polygon
	for (let i = 0; i < n; i++) {
		let ii = i + 1;
		if (ii == n) ii = 0;

		if (
			(vect[i].y <= p.y && vect[ii].y > p.y) ||
			(vect[i].y > p.y && vect[ii].y <= p.y)
		) {
			let vt = (p.y - vect[i].y) / (vect[ii].y - vect[i].y);
			if (p.x < vect[i].x + vt * (vect[ii].x - vect[i].x)) ++cn;
		}
	}
	return cn;
}

function inside(p, vect) {
	return insideCount(p, vect) % 2;
}

function insideTrack(p) {
	let n = 0;
	for (let segm of segments) {
		n += insideCount(p, segm);
	}

	if (n % 2) {
		bgCol = "Black";
		return true;
	} else {
		bgCol = "DarkRed";
		return false;
	}
}

function insideTrackSlow(p) {
	for (let i = 0; i < poli1.length; i++) {
		// Prepare track segment poligon
		let ii = i + 1;
		if (ii == poli1.length) ii = 0;
		let po = [];
		po.push(poli1[i]);
		po.push(poli1[ii]);
		po.push(poli2[ii]);
		po.push(poli2[i]);

		if (samePoint(p, po[0])) {
			// Point on one vertex of the track element, do nothing
		} else if (samePoint(p, po[1])) {
			// Point on one vertex of the track element, do nothing
		} else if (samePoint(p, po[2])) {
			// Point on one vertex of the track element, do nothing
		} else if (samePoint(p, po[3])) {
			// Point on one vertex of the track element, do nothing
		} else if (pointOnSegment(po[0], po[1], p)) {
			// Point on one edge of the track element, do nothing
		} else if (pointOnSegment(po[3], po[2], p)) {
			// Point on one edge of the track element, do nothing
		} else if (inside(p, po)) {
			// Point inside of the track element, stop end return true
			return true;
		}
	}

	return false;
}
1
function approxTrack() {
	poli1 = [];
	poli2 = [];
	let increment = 0.02;
	let diff = 0.08;
	let w = trackWidth;
	let cursor = increment;
	let prevCursor = cursor;
	let prevGrad = s1.getSplineGardAng(0, true);
	let curGrad = prevGrad;
	let pBase = s1.getSplinePoint(0, true);
	let g = s1.getSplineGardient(0, true);
	g.normalize();
	let pr = new Point2D(pBase.x - w * g.y, pBase.y + w * g.x);
	let pl = new Point2D(pBase.x + w * g.y, pBase.y - w * g.x);
	poli1.push(pr);
	poli2.push(pl);
	while (cursor < s1.points.length) {
		curGrad = s1.getSplineGardAng(cursor, true);
		if (Math.abs(curGrad - prevGrad) > diff || cursor - prevCursor > 0.2) {
			g = s1.getSplineGardient(cursor, true);
			pBase = s1.getSplinePoint(cursor, true);
			g.normalize();
			pr = new Point2D(pBase.x - w * g.y, pBase.y + w * g.x);
			pl = new Point2D(pBase.x + w * g.y, pBase.y - w * g.x);

			poli1.push(pr);
			poli2.push(pl);

			prevCursor = cursor;
			prevGrad = curGrad;
		}
		cursor += increment;
	}
	computeOutline();
	setGates();
}

function setGates() {
	gates = [];
	let g = s1.getSplineGardient(0, true);
	let a = g.getAngle();
	gates.push(new Array());
	gates[0].push(
		new Point2D(
			s1.points[0].x - Math.cos(a + Math.PI / 2) * (trackWidth + 5),
			s1.points[0].y - Math.sin(a + Math.PI / 2) * (trackWidth + 5)
		)
	);

	gates[0].push(
		new Point2D(
			s1.points[0].x - Math.cos(a - Math.PI / 2) * (trackWidth + 5),
			s1.points[0].y - Math.sin(a - Math.PI / 2) * (trackWidth + 5)
		)
	);
}

function computeOutline() {
	//Find valid starting points for poli1 and poli2
	let offset1 = 0;
	let offset2 = 0;

	let curOffset = 0;
	while (true) {
		if (!insideTrackSlow(poli1[curOffset])) {
			offset1 = curOffset;
			break;
		}
		curOffset++;
	}
	curOffset = 0;
	while (true) {
		if (!insideTrackSlow(poli2[curOffset])) {
			offset2 = curOffset;
			break;
		}
		curOffset++;
	}

	intersArray = [];
	// find intersections and add them to final array
	for (let i = 0; i < poli1.length - 2; i++) {
		for (let j = i + 2; j < poli1.length - 1; j++) {
			let inters = intersect2(poli1[i], poli1[i + 1], poli1[j], poli1[j + 1]);
			if (inters) {
				let aaa = new Intersection(inters.x, inters.y, poli1, i);
				let bbb = new Intersection(inters.x, inters.y, poli1, j);
				intersArray.push(aaa);
				intersArray.push(bbb);
			}
		}
	}
	for (let i = 0; i < poli1.length - 1; i++) {
		for (let j = 0; j < poli2.length - 1; j++) {
			let inters = intersect2(poli1[i], poli1[i + 1], poli2[j], poli2[j + 1]);
			if (inters) {
				let aaa = new Intersection(inters.x, inters.y, poli1, i);
				let bbb = new Intersection(inters.x, inters.y, poli2, j);
				intersArray.push(aaa);
				intersArray.push(bbb);
			}
		}
	}
	for (let i = 0; i < poli2.length - 2; i++) {
		for (let j = i + 2; j < poli2.length - 1; j++) {
			let inters = intersect2(poli2[i], poli2[i + 1], poli2[j], poli2[j + 1]);
			if (inters) {
				let aaa = new Intersection(inters.x, inters.y, poli2, i);
				let bbb = new Intersection(inters.x, inters.y, poli2, j);
				intersArray.push(aaa);
				intersArray.push(bbb);
			}
		}
	}

	// Delete intersections inside the track
	for (let i = intersArray.length - 1; i >= 0; i--) {
		if (insideTrackSlow(intersArray[i])) {
			intersArray.splice(i, 1);
		}
	}

	segments = [];
	for (let polig of [poli1, poli2]) {
		let offset = 0;
		if (polig === poli1) offset = offset1;
		if (polig === poli2) offset = offset2;
		let skip = false;
		segments.push(new Array());
		for (let i = 0; i < polig.length; i++) {
			if (!skip) {
				//Add point to last segment in list
				segments[segments.length - 1].push(polig[(i + offset) % polig.length]);
			}
			//Get intersection points in next segment
			let cut = intersArray.filter(
				p => p.line === polig && p.prevIndex == (i + offset) % polig.length
			);
			if (cut.length > 1) {
				// if more than one intersection in segment sort them
				cut.sort(
					(a, b) =>
						a.dist(polig[(i + offset) % polig.length]) -
						b.dist(polig[(i + offset) % polig.length])
				);
			}
			for (let c of cut) {
				if (!skip) {
					// Add intersection as last point of the segment
					segments[segments.length - 1].push(c);
					// Next points are to be skipped because they are between two intersections inside the track
					skip = true;
				} else {
					// Start a new segment
					segments.push(new Array());
					// Add intersection as first point of new segment
					segments[segments.length - 1].push(c);
					skip = false;
				}
			}
		}
		segments[segments.length - 1].push(polig[offset]);
	}

	// Join segments
	let conti = true;
	while (conti) {
		conti = false;
		for (let i = 0; i < segments.length; i++) {
			for (let j = 0; j < segments.length; j++) {
				if (
					i != j &&
					samePoint(segments[i][segments[i].length - 1], segments[j][0])
				) {
					segments[i].pop();
					segments[i] = segments[i].concat(segments[j]);
					segments.splice(j, 1);
					conti = true;
					i = segments.length;
					j = segments.length;
				} else if (i != j && samePoint(segments[i][0], segments[j][0])) {
					segments[i].reverse();
					segments[i].pop();
					segments[i] = segments[i].concat(segments[j]);
					segments.splice(j, 1);
					conti = true;
					i = segments.length;
					j = segments.length;
				}
			}
		}
	}

	// Close segments (loop)
	for (let segm of segments) {
		if (samePoint(segm[0], segm[segm.length - 1])) {
			segm.pop();
		}
	}
}

function samePoint(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
}

function keyUpHandler(evt) {
	if (evt.keyCode == 39) {
		// right
		rightPressed = false;
	} else if (evt.keyCode == 37) {
		// left
		leftPressed = false;
	} else if (evt.keyCode == 38) {
		// up
		upPressed = false;
	} else if (evt.keyCode == 40) {
		// down
		downPressed = false;
	} else if (evt.keyCode == 49) {
		// 1
		trackWidth += 2;
		approxTrack();
	} else if (evt.keyCode == 50) {
		// 2
		trackWidth -= 2;
		if (trackWidth < 10) trackWidth = 10;
		approxTrack();
	} else if (evt.keyCode == 68) {
		// D
		driveMode++;
		if (driveMode > 1) driveMode = 0;
		if (driveMode == 0) {
			car = new Car(s1.points[0], s1.getSplineGardient(0, true));
		} else {
			car = new Car2(s1.points[0], s1.getSplineGardient(0, true));
		}
		startTime = new Date();
		lapTime = 0;
	} else if (evt.keyCode == 75) {
		// K
		save();
	} else if (evt.keyCode == 76) {
		// L
		load(objStr);
	} else if (evt.keyCode == 77) {s
		// M
		mode++;
		if (mode > 2) mode = 0;
	} else if (evt.keyCode == 83) {
		// S
		drawSpline = !drawSpline;
	}
}

function keyDownHandler(evt) {
	if (evt.keyCode == 39) {
		// right
		rightPressed = true;
	} else if (evt.keyCode == 37) {
		// left
		leftPressed = true;
	} else if (evt.keyCode == 38) {
		// up
		upPressed = true;
	} else if (evt.keyCode == 40) {
		// down
		downPressed = true;
	}
}

function load(jsonString) {
	let obj = JSON.parse(jsonString);
	s1 = new Spline(1/obj.track.step, obj.track.col);
	for (let p of obj.track.points) {
		s1.points.push(new Point2D(p.x, p.y));
	}
	approxTrack();
}

function save() {
	objStr = JSON.stringify({track: s1});
	console.log(objStr);
}

function sameSign(a, b) {
	return Math.sign(a) == Math.sign(b);
}

function intersect2(p0, p1, p2, p3) {
	let s02_x, s02_y, s10_x, s10_y, s32_x, s32_y, s_numer, t_numer, denom, t;
	s10_x = p1.x - p0.x;
	s10_y = p1.y - p0.y;
	s32_x = p3.x - p2.x;
	s32_y = p3.y - p2.y;

	denom = s10_x * s32_y - s32_x * s10_y;
	if (denom == 0) return null;
	let denomPositive = denom > 0;

	s02_x = p0.x - p2.x;
	s02_y = p0.y - p2.y;
	s_numer = s10_x * s02_y - s10_y * s02_x;
	if (s_numer < 0 == denomPositive) return null; // No collision

	t_numer = s32_x * s02_y - s32_y * s02_x;
	if (t_numer < 0 == denomPositive) return null; // No collision

	if (s_numer > denom == denomPositive || t_numer > denom == denomPositive)
		return null; // No collision
	// Collision detected
	t = t_numer / denom;
	let i_x = p0.x + t * s10_x;
	let i_y = p0.y + t * s10_y;

	return new Point2D(i_x, i_y);
}

function pointOnSegment(start, end, test) {
	return start.dist(test) + test.dist(end) - start.dist(end) < 1e-6;
}
