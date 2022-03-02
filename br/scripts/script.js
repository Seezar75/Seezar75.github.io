let canvas;
var A;
let bg = false;
let markers = [];
let selectedMarker = -1;

window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
	
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);

	init();
}

let imgtag = document.getElementById("myImg");
// Reset after new image is loaded
imgtag.onload = function() {
	if (imgtag.width > 10) {
		canvas.width = imgtag.width;
		canvas.height = imgtag.height;
	}
	init();
};

// Load new image
function onFileSelected(event) {
	var selectedFile = event.target.files[0];
	var reader = new FileReader();
  
	var imgtag = document.getElementById("myImg");
	imgtag.title = selectedFile.name;
  
	reader.onload = function(event) {
	  imgtag.src = event.target.result;
	  
	};
  
	reader.readAsDataURL(selectedFile);
  }

// Initialize markers
function init(){

	let img=document.getElementById("myImg");

	let color = "#33FF33";
	let size = parseInt(document.getElementById("markerSize").value);

	markers = [];
	selectedMarker = -1;
	markers.push(new Marker(10,10,size,color));
	markers.push(new Marker(canvas.width/2,10,size,color));
	markers.push(new Marker(canvas.width-10,10,size,color));

	markers.push(new Marker(10,canvas.height/2,size,color));
	
	markers.push(new Marker(canvas.width-10,canvas.height/2,size,color));

	markers.push(new Marker(10,canvas.height-10,size,color));
	markers.push(new Marker(canvas.width/2,canvas.height-10,size,color));
	markers.push(new Marker(canvas.width-10,canvas.height-10,size,color));

	markers.push(new Marker(canvas.width/2,canvas.height/2,size,color));

	draw();
}

function process() {
	// Get source image and draw it on canvas
	let img=document.getElementById("myImg");
	ctx.drawImage(img, 0, 0);

	// Create output image
	var can_out = document.createElement('canvas');
	can_out.width = canvas.width;
	can_out.height = canvas.height;
	let myImageDataOut = can_out.getContext("2d").getImageData(0, 0, can_out.width, can_out.height);
	let dataOut = myImageDataOut.data;

	// Get data of input image from canvas
	let myImageIn = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	let dataIn = myImageIn.data;

	// Initialize vectors
	let x = [];
	let y = [];
	let z_red = [];
	let z_green = [];
	let z_blue = [];

	// Fill input vectors
	for (let m of markers) {
		x.push(m.x);
		y.push(m.y);
		let redTemp = 0;
		let greenTemp = 0;
		let blueTemp = 0;
		// sampling image
		let offset = (m.size-1)/2;
		for (let i = -1*offset; i < offset+1; i++) {
			for (let j = -1*offset; j < offset+1; j++) {
				let indexR = ((m.x+i)*4)+((m.y+j)*can_out.width*4);
				redTemp += dataIn[indexR];
				greenTemp += dataIn[indexR+1];
				blueTemp += dataIn[indexR+2];
			}
		}
		let samples = m.size*m.size;
		redTemp = redTemp / samples;
		greenTemp = greenTemp / samples;
		blueTemp = blueTemp / samples;
		z_red.push(redTemp);
		z_green.push(greenTemp);
		z_blue.push(blueTemp);
	}

	// Fill matrix
	let I = new Array(x.length);
	let xx = new Array(x.length);
	let xy = new Array(x.length);
	let yy = new Array(x.length);
	for (let i = 0; i < I.length; i++) {
		I[i]= 1;
		xx[i]= x[i]*x[i];
		xy[i]= x[i]*y[i];
		yy[i]= y[i]*y[i];
	}
	A = [I, x, y, xy, xx, yy];

	// Transpose A
	A = transp(A);

	// Calculate linear Least squares solution for the three channels
	let coefs_red = leastSquaresSolve(A,z_red);
	let coefs_green = leastSquaresSolve(A,z_green);
	let coefs_blue = leastSquaresSolve(A,z_blue);

	let bgMax = 0;

	if (bg) {
		// Calculate estimated background image
		for (let i = 0; i < can_out.height; i++) {
			for (let j = 0; j < can_out.width; j++) {
				let indexR = (j*4)+(i*can_out.width*4);
				// Calculating background channels
				red = coefs_red[0] + coefs_red[1]*j + coefs_red[2]*i + coefs_red[3]*i*j + coefs_red[4]*j*j + coefs_red[5]*i*i;
				green = coefs_green[0] + coefs_green[1]*j + coefs_green[2]*i + coefs_green[3]*i*j + coefs_green[4]*j*j + coefs_green[5]*i*i;
				blue = coefs_blue[0] + coefs_blue[1]*j + coefs_blue[2]*i + coefs_blue[3]*i*j + coefs_blue[4]*j*j + coefs_blue[5]*i*i;
				dataOut[indexR] = red;
				dataOut[indexR+1] = green;
				dataOut[indexR+2] = blue;
				dataOut[indexR+3] = 255;				
			}
		}
	} else {
		// Calculate estimated background image
		for (let i = 0; i < can_out.height; i++) {
			for (let j = 0; j < can_out.width; j++) {
				let indexR = (j*4)+(i*can_out.width*4);
				// Calculating background channels
				red = coefs_red[0] + coefs_red[1]*j + coefs_red[2]*i + coefs_red[3]*i*j + coefs_red[4]*j*j + coefs_red[5]*i*i;
				green = coefs_green[0] + coefs_green[1]*j + coefs_green[2]*i + coefs_green[3]*i*j + coefs_green[4]*j*j + coefs_green[5]*i*i;
				blue = coefs_blue[0] + coefs_blue[1]*j + coefs_blue[2]*i + coefs_blue[3]*i*j + coefs_blue[4]*j*j + coefs_blue[5]*i*i;
				// Calculating max of background
				if (red > bgMax) bgMax = red;
				if (green > bgMax) bgMax = green;
				if (blue > bgMax) bgMax = blue;
				dataOut[indexR] = red;
				dataOut[indexR+1] = green;
				dataOut[indexR+2] = blue;
			}
		}

		// Compute amount of correction to apply
		let correctionAmount = document.getElementById("correctionAmount").value;
		bgMax = bgMax + ((255-bgMax)*correctionAmount/100)

		// Subtracting backgrount from image
		for (let i = 0; i < can_out.height; i++) {
			for (let j = 0; j < can_out.width; j++) {
				let indexR = (j*4)+(i*can_out.width*4);
				dataOut[indexR] = dataIn[indexR] + bgMax - dataOut[indexR];
				dataOut[indexR+1] = dataIn[indexR+1] + bgMax - dataOut[indexR+1];
				dataOut[indexR+2] = dataIn[indexR+2] + bgMax - dataOut[indexR+2];
				dataOut[indexR+3] = 255;
			}
		}
	}
	
	// Draw output image on canvas
	ctx.putImageData(myImageDataOut, 0, 0);
}



function test() {
	let myImageIn = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	let dataIn = myImageIn.data;
	let indexR = (markers[0].x*4)+(markers[0].y*canvas.width*4);
	console.log(`${dataIn[indexR]} - ${dataIn[indexR+1]}  - ${dataIn[indexR+2]}`);
}

// Save output image (corrected image or background)
function save() {
	process();
	const link = document.createElement('a');
	link.download = 'download.jpg';
	link.href = canvas.toDataURL("image/jpg");
	link.click();
	link.delete;
}

function outputTypeChange() {
	let out = document.getElementById("outputType").value;
	if (out == "bg") {
		bg = true;
	} else {
		bg = false;
	}
}

function draw() {
	let img=document.getElementById("myImg");
	ctx.fillStyle="white";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(img, 0, 0);
	for (let m of markers) {
		m.draw(ctx);
	}
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function mouseDownHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	getMarker(mousePos);
	draw();
}

function mouseUpHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	selectedMarker = -1;
	draw();
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if (selectedMarker != -1) {
		markers[selectedMarker].x = Math.round(mousePos.x);
		markers[selectedMarker].y = Math.round(mousePos.y);
		markers[selectedMarker].check(canvas);
	}
	draw();
}

function getMarker(pos) {
	let minDistance = 1000000

	for (let i = 0; i < markers.length; i++) {
		let dist = ((pos.x-markers[i].x)*(pos.x-markers[i].x)) + ((pos.y-markers[i].y)*(pos.y-markers[i].y))
		if (dist < 250 && dist < minDistance) {
			minDistance = dist;
			selectedMarker = i;
		}
	}
}

function addMarker() {
	let img=document.getElementById("myImg");
	let color = "#33FF33";
	let size = parseInt(document.getElementById("markerSize").value);
	markers.push(new Marker(img.width/2,img.height/2,size,color));
	draw();
}

function subtractMarker() {
	markers.pop();
	draw();
}

function amountChange(selectedObject) {
	document.getElementById("correctionAmountLab").innerHTML = selectedObject.value;
}

function markerSizeChange(selectedObject) {
	for (let m of markers) {
		m.size = parseInt(selectedObject.value);
		m.check(canvas);
	}
	draw();
}
