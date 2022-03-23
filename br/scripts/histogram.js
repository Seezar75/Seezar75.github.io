class Histogram {
	constructor(_hisCanvas) {
		this.hisCanvas = _hisCanvas;
		this.hisCtx = hisCanvas.getContext("2d");
		this.hisData = new Array(256).fill(0);
		this.hisCanvas.control = this;

		this.enabled = true;

		this.markers = new Array(3);

		this.resetMarkers();

		this.selectedMarker = -1;

		this.gamma = 1;

		this.callback = function test() {console.log("Default istogram callback")};

		hisCanvas.addEventListener('mousemove', this.mouseMoveHandler, false);
		hisCanvas.addEventListener('mousedown', this.mouseDownHandler, false);
		hisCanvas.addEventListener('mouseup', this.mouseUpHandler, false);
		hisCanvas.addEventListener('mouseout', this.mouseOutHandler, false);

		this.draw();
	}

	disable() {
		if (!this.enabled) return;
		this.enabled = false;
		this.hisCanvas.removeEventListener('mousemove', this.mouseMoveHandler, false);
		this.hisCanvas.removeEventListener('mousedown', this.mouseDownHandler, false);
		this.hisCanvas.removeEventListener('mouseup', this.mouseUpHandler, false);
		this.hisCanvas.removeEventListener('mouseout', this.mouseOutHandler, false);
		this.draw();
	}

	enable() {
		if (this.enabled) return;
		this.enabled = true;
		this.hisCanvas.addEventListener('mousemove', this.mouseMoveHandler, false);
		this.hisCanvas.addEventListener('mousedown', this.mouseDownHandler, false);
		this.hisCanvas.addEventListener('mouseup', this.mouseUpHandler, false);
		this.hisCanvas.addEventListener('mouseout', this.mouseOutHandler, false);
		this.draw();
	}

	setCallback(_callback) {
		this.callback = _callback;
	}

	resetMarkers() {
		this.markers[0] = 0;
		this.markers[1] = 127;
		this.markers[2] = 255;
	}

	draw() {
		let height = this.hisCanvas.height-20;
		let heightGraph = this.hisCanvas.height-30;

		if (this.enabled) {
			this.hisCtx.fillStyle="white";
		} else {
			this.hisCtx.fillStyle="#AAAAAA";
		}
		this.hisCtx.fillRect(0,0,this.hisCanvas.width,this.hisCanvas.height);

		if (this.enabled) {
			this.hisCtx.fillStyle="black";
			this.hisCtx.strokeStyle="black";
		} else {
			this.hisCtx.fillStyle="#999999";
			this.hisCtx.strokeStyle="grey";
		}
		
		this.hisCtx.beginPath();
		this.hisCtx.moveTo(0, heightGraph);
	
		for (let i = 0; i < 256; i++) {
			let x = i/255*this.hisCanvas.width
			this.hisCtx.lineTo(x, heightGraph - this.hisData[i]);
		}
		this.hisCtx.lineTo(this.hisCanvas.width, heightGraph);
		this.hisCtx.fill();
		this.hisCtx.stroke();

		this.hisCtx.strokeStyle="grey";
		this.hisCtx.beginPath();
		this.hisCtx.moveTo(0, heightGraph);
		this.hisCtx.lineTo(this.hisCanvas.width, heightGraph);
		this.hisCtx.stroke();

		let x = this.markers[0]/255*this.hisCanvas.width;
		this.hisCtx.fillStyle="black";
		this.hisCtx.strokeStyle="grey";
		this.hisCtx.beginPath();
		this.hisCtx.moveTo(x, 0);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.lineTo(x-5, height);
		this.hisCtx.lineTo(x+5, height);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.fill();
		this.hisCtx.stroke();

		x = this.markers[1]/255*this.hisCanvas.width;
		this.hisCtx.fillStyle="grey";
		this.hisCtx.beginPath();
		this.hisCtx.moveTo(x, 0);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.lineTo(x-5, height);
		this.hisCtx.lineTo(x+5, height);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.fill();
		this.hisCtx.stroke();

		x = this.markers[2]/255*this.hisCanvas.width;
		this.hisCtx.fillStyle="white";
		this.hisCtx.beginPath();
		this.hisCtx.moveTo(x, 0);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.lineTo(x-5, height);
		this.hisCtx.lineTo(x+5, height);
		this.hisCtx.lineTo(x, heightGraph);
		this.hisCtx.fill();
		this.hisCtx.stroke();

		this.hisCtx.fillStyle="black";
		this.hisCtx.font = "18px Arial";
		this.hisCtx.textAlign = "left";
		this.hisCtx.fillText(this.markers[0], 1, this.hisCanvas.height-2);

		this.hisCtx.textAlign = "center";
		this.hisCtx.fillText(this.gamma.toFixed(2), this.hisCanvas.width/2, this.hisCanvas.height-2);

		this.hisCtx.fillStyle="black";
		this.hisCtx.font = "18px Arial";
		this.hisCtx.textAlign = "right";
		this.hisCtx.fillText(this.markers[2], this.hisCanvas.width-1, this.hisCanvas.height-2);

	}

	updateData(inCanvas) {

		let inContext = inCanvas.getContext("2d");

		let heightGraph = this.hisCanvas.height-30;
		let max = 0;
	
		let fullImageIn = inContext.getImageData(0, 0, inCanvas.width, inCanvas.height);
		let fullDataIn = fullImageIn.data;
	
		for (let i = 0; i < fullDataIn.length; i = i + 4) {
			let point = fullDataIn[i] + fullDataIn[i+1] + fullDataIn[i+2];
			point = Math.floor(point / 3);
			this.hisData[point] = this.hisData[point] + 1;
			if (this.hisData[point] > max) max = this.hisData[point];
		}
		this.hisData = this.hisData.map(x => (x * heightGraph) / max)
	}

	process(inputCanvas, outputCanvas) {
		// Create output image
		var can_out = document.createElement('canvas');
		can_out.width = inputCanvas.width;
		can_out.height = inputCanvas.height;
		let myImageDataOut = can_out.getContext("2d").getImageData(0, 0, inputCanvas.width, inputCanvas.height);
		let dataOut = myImageDataOut.data;

		// Get data of input image from canvas
		let inCxt = inputCanvas.getContext("2d");
		let myImageIn = inCxt.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
		let dataIn = myImageIn.data;

		let oneOverGamma = 1/this.gamma;

		console.log(`Black = ${this.markers[0]}, gamma = ${this.gamma}, white = ${this.markers[2]}`)

		for (let i = 0; i < can_out.height; i++) {
			for (let j = 0; j < can_out.width; j++) {
				let indexR = (j*4)+(i*can_out.width*4);

				dataOut[indexR] = this.map(dataIn[indexR], this.markers[0], this.markers[2]);
				dataOut[indexR+1] = this.map(dataIn[indexR+1], this.markers[0], this.markers[2]);
				dataOut[indexR+2] = this.map(dataIn[indexR+2], this.markers[0], this.markers[2]);

				dataOut[indexR] = 255 * (dataOut[indexR] / 255)**(oneOverGamma);
				dataOut[indexR+1] = 255 * (dataOut[indexR+1] / 255)**(oneOverGamma);
				dataOut[indexR+2] = 255 * (dataOut[indexR+2] / 255)**(oneOverGamma);

				dataOut[indexR+3] = 255;
			}
		}

		// Draw output image on output canvas
		let outCtx = outputCanvas.getContext("2d");
		outCtx.putImageData(myImageDataOut, 0, 0);

	}

	map(x, inMin, inMax) {
		let out = (x - inMin) * 244 / (inMax - inMin);
		if (out < 0) out = 0;
		if (out > 255) out = 255;
		return out;
	}

	getGamma(black, grey, white) {
		let gamma = 10**(2*(black-grey)/(white-black)+1);
		return gamma;
	}

	getGrey(black, gamma, white) {
		return Math.round(black + 0.5*(black-white)*(Math.log10(gamma) - 1));
	}

	getMousePos(evt) {
		let rect = this.hisCanvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	mouseMoveHandler(evt) {
		let mousePos = this.control.getMousePos(evt);
		let newPos = Math.floor(mousePos.x*256/this.control.hisCanvas.width);
		if (this.control.selectedMarker == 0) {
			if (newPos >= this.control.markers[2] - 1) return;
			this.control.markers[0] = newPos;
			this.control.markers[1] = this.control.getGrey(newPos, this.control.gamma, this.control.markers[2]);
			this.control.draw();
			return;
		}
		if (this.control.selectedMarker == 1) {
			if (newPos <= this.control.markers[0]) return;
			if (newPos >= this.control.markers[2]) return;
			this.control.markers[1] = newPos;
			this.control.gamma = this.control.getGamma(this.control.markers[0], this.control.markers[1], this.control.markers[2]);
			this.control.draw();
			return;
		}
		if (this.control.selectedMarker == 2) {
			if (newPos <= this.control.markers[0] + 1) return;
			this.control.markers[2] = newPos;
			this.control.markers[1] = this.control.getGrey(this.control.markers[0], this.control.gamma, newPos);
			this.control.draw();
			return;
		}
		
	}

	mouseDownHandler(evt) {
		let mousePos = this.control.getMousePos(evt);
		let minDist = this.control.hisCanvas.width + 1;
		for (let i = 0; i < this.control.markers.length; i++) {
			let dist = Math.abs(mousePos.x-this.control.markers[i]/256*this.control.hisCanvas.width);
			if (dist < 10 && dist < minDist) {
				minDist = dist;
				this.control.selectedMarker = i;
			}
		}
	}

	mouseUpHandler(evt) {
		this.control.selectedMarker = -1;
		this.control.callback();
	}

	mouseOutHandler(evt) {
		this.control.selectedMarker = -1;
	}

}