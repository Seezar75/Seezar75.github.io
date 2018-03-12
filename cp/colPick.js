class colPick {
	constructor(div, callback) {
		this.mainDiv = div;

		this.rgb = {
			r: 255,
			g: 0,
			b: 0
		}

		this.l = 0.5;
		this.mousePressed = false;
		this.callback = callback;

		this.mainCanvas = document.createElement('canvas');
		this.mainCtx = this.mainCanvas.getContext("2d");
		this.mainCanvas.setAttribute('width', '255');
		this.mainCanvas.setAttribute('height', '255');
		this.mainCanvas.style.display = "block";
		this.mainCanvas.style.position = "absolute";
		this.mainCanvas.style.top = "10px";
		this.mainCanvas.style.left = "10px";
		this.mainDiv.appendChild(this.mainCanvas);
		this.mainCtx.fillStyle = "black";
		this.mainCtx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		this.mainCanvas.addEventListener('mousedown', this.downMain, false);
		this.mainCanvas.addEventListener('mouseup', this.upMain, false);
		this.mainCanvas.addEventListener('mousemove', this.moveMain, false);
		this.mainCanvas.addEventListener('mouseout', this.outMain, false);
		this.mainCanvas.addEventListener('touchstart', this.touchMain, false);
		this.mainCanvas.parent = this;
		this.fillMain(this.mainCanvas);
		this.mainCanvas.mp = {
			x: 0,
			y: 0
		}

		this.lightCanvas = document.createElement('canvas');
		this.lightCtx = this.lightCanvas.getContext("2d");
		this.lightCanvas.setAttribute('width', '20');
		this.lightCanvas.setAttribute('height', '255');
		this.lightCanvas.style.display = "block";
		this.lightCanvas.style.position = "absolute";
		this.lightCanvas.style.top = "10px";
		this.lightCanvas.style.left = "270px";
		this.mainDiv.appendChild(this.lightCanvas);
		this.lightCtx.fillStyle = "black";
		this.lightCtx.fillRect(0, 0, this.lightCanvas.width, this.lightCanvas.height);
		this.lightCanvas.addEventListener('mousedown', this.downLight, false);
		this.lightCanvas.addEventListener('mouseup', this.upLight, false);
		this.lightCanvas.addEventListener('mousemove', this.moveLight, false);
		this.lightCanvas.addEventListener('mouseout', this.outLight, false);
		this.mainCanvas.addEventListener('touchstart', this.touchLight, false);
		this.lightCanvas.parent = this;
		this.fillLight(this.lightCanvas);

		this.showcol = document.createElement('div');
		this.showcol.style.display = "block";
		this.showcol.style.position = "absolute";
		this.showcol.style.top = "10px";
		this.showcol.style.left = "300px";
		this.showcol.style.width = "30px";
		this.showcol.style.height = "30px";
		this.mainDiv.appendChild(this.showcol);

		this.okB = document.createElement('button');
		this.okB.style.display = "block";
		this.okB.style.position = "absolute";
		this.okB.style.top = "270px";
		this.okB.style.left = "10px";
		this.okB.innerHTML = "OK";
		this.okB.addEventListener("click", () => {
			this.callback(this.hexValue());
			this.mainDiv.style.display = "none";
		});
		this.mainDiv.appendChild(this.okB);

		this.cancelB = document.createElement('button');
		this.cancelB.style.display = "block";
		this.cancelB.style.position = "absolute";
		this.cancelB.style.top = "270px";
		this.cancelB.style.left = "60px";
		this.cancelB.innerHTML = "Cancel";
		this.cancelB.addEventListener("click", () => {
			this.mainDiv.style.display = "none";
		});
		this.mainDiv.appendChild(this.cancelB);


		this.showcol.style.backgroundColor = "rgb(" + Math.floor(this.rgb.r) + ", " + Math.floor(this.rgb.g) + ", " + Math.floor(this.rgb.b) + ")";
	}

	getMousePos(canvas, evt) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	downMain(evt) {
		// "this" is the Canvas
		if (evt.button == 0) {
			this.mousePressed = true;
		}
		let mp = this.parent.getMousePos(this, evt);
		this.mp = mp;
		let rgb = colPick.hslToRgb(mp.x / this.width, 1 - (mp.y / this.height), this.parent.l);
		this.parent.rgb = rgb;
		this.parent.fillLight(this.parent.lightCanvas);
		this.parent.showcol.style.backgroundColor = this.parent.hexValue();
	}

	moveMain(evt) {
		if (this.mousePressed) {
			let mp = this.parent.getMousePos(this, evt);
			this.mp = mp;
			let rgb = colPick.hslToRgb(mp.x / this.width, 1 - (mp.y / this.height), this.parent.l);
			this.parent.rgb = rgb;
			this.parent.fillLight(this.parent.lightCanvas);
			this.parent.showcol.style.backgroundColor = this.parent.hexValue();
		}
	}

	upMain(evt) {
		if (evt.button == 0) {
			this.mousePressed = false;
		}
	}

	outMain(evt) {
		this.mousePressed = false;
	}

	downLight(evt) {
		// "this" is the Canvas
		if (evt.button == 0) {
			this.mousePressed = true;
		}
		let mp = this.parent.getMousePos(this, evt);
		let mpMain = this.parent.mainCanvas.mp;
		let l = mp.y / this.height;
		this.parent.l = l;
		let rgb = colPick.hslToRgb(mpMain.x / this.parent.mainCanvas.width, 1 - (mpMain.y / this.parent.mainCanvas.height), l);
		this.parent.rgb = rgb;
		this.parent.showcol.style.backgroundColor = this.parent.hexValue();
	}

	moveLight(evt) {
		if (this.mousePressed) {
			let mp = this.parent.getMousePos(this, evt);
			let mpMain = this.parent.mainCanvas.mp;
			let l = mp.y / this.height;
			this.parent.l = l;
			console.log(l);
			let rgb = colPick.hslToRgb(mpMain.x / this.parent.mainCanvas.width, 1 - (mpMain.y / this.parent.mainCanvas.height), l);
			this.parent.rgb = rgb;
			this.parent.showcol.style.backgroundColor = this.parent.hexValue();
		}
	}

	upLight(evt) {
		if (evt.button == 0) {
			this.mousePressed = false;
		}
	}

	outLight(evt) {
		this.mousePressed = false;
	}

	touchMain(evt) {
		// "this" is the Canvas
		let mp = {
			x: 0,
			y: 0
		};
		mp.x = Math.floor(evt.targetTouches[0].clientX);
		mp.y = Math.floor(evt.targetTouches[0].clientY);
		this.mp = mp;
		// console.log("Mouse Pressed at " + mp.x + ", " + mp.y);
		let rgb = colPick.hslToRgb(mp.x / this.width, 1 - (mp.y / this.height), this.parent.l);
		this.parent.rgb = rgb;
		this.parent.fillLight(this.parent.lightCanvas);
		this.parent.showcol.style.backgroundColor = this.parent.hexValue();
		evt.preventDefault();
	}

	touchLight(evt) {
		// "this" is the Canvas
		let mp = {
			x: 0,
			y: 0
		};
		mp.x = Math.floor(evt.targetTouches[0].clientX);
		mp.y = Math.floor(evt.targetTouches[0].clientY);
		let mpMain = this.parent.mainCanvas.mp;
		let l = mp.y / this.height;
		this.parent.l = l;
		let rgb = colPick.hslToRgb(mpMain.x / this.parent.mainCanvas.width, 1 - (mpMain.y / this.parent.mainCanvas.height), l);
		this.parent.rgb = rgb;
		this.parent.showcol.style.backgroundColor = this.parent.hexValue();
		evt.preventDefault();
	}

	fillMain(canvas) {
		let ctx = canvas.getContext("2d");
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			let x = (i / 4) % canvas.width / canvas.width;
			let y = Math.floor(i / 4 / canvas.width) / canvas.height;
			let rgb = colPick.hslToRgb(x, 1 - y, 0.5);
			data[i] = rgb.r;
			data[i + 1] = rgb.g;
			data[i + 2] = rgb.b;

		}
		ctx.putImageData(imageData, 0, 0);
	}

	fillLight(canvas) {
		let ctx = canvas.getContext("2d");
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			let y = Math.floor(i / 4 / canvas.width) / canvas.height;
			let hsl = colPick.rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b);
			let rgb = colPick.hslToRgb(hsl.h, hsl.s, y);
			data[i] = rgb.r;
			data[i + 1] = rgb.g;
			data[i + 2] = rgb.b;

		}
		ctx.putImageData(imageData, 0, 0);
	}

	setColorRGB(r, g, b) {
		this.rgb.r = r;
		this.rgb.g = g;
		this.rgb.b = b;
		let hsl = colPick.rgbToHsl(r, g, b);
		this.l = hsl.l;
		this.mainCanvas.mp.x = hsl.h * this.mainCanvas.width;
		this.mainCanvas.mp.y = (1 - hsl.s) * this.mainCanvas.height;
		this.fillLight(this.lightCanvas);
		this.showcol.style.backgroundColor = "rgb(" + Math.floor(this.rgb.r) + ", " + Math.floor(this.rgb.g) + ", " + Math.floor(this.rgb.b) + ")";
	}

	setColorHex(hexColor) {
		let r = parseInt(hexColor.substring(1, 3), 16);
		let g = parseInt(hexColor.substring(3, 5), 16);
		let b = parseInt(hexColor.substring(5, 7), 16);
		this.setColorRGB(r, g, b);
	}

	hexValue() {
		let red = this.rgb.r.toString(16).toUpperCase();
		if (red.length == 1) red = "0" + red;
		let green = this.rgb.g.toString(16).toUpperCase();
		if (green.length == 1) green = "0" + green;
		let blue = this.rgb.b.toString(16).toUpperCase();
		if (blue.length == 1) blue = "0" + blue;
		return "#" + red + green + blue;
	}

	show() {
		this.mainDiv.style.display = "block";
	}

	// https://en.wikipedia.org/wiki/HSL_and_HSV
	static rgbToHsl(r, g, b) {
		r = r / 255;
		g = g / 255;
		b = b / 255;

		let s, h, l;

		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);

		if (max == min) {
			l = r;
			h = 0;
			s = 0;
		} else {
			let chroma = max - min;
			l = (max + min) / 2;
			if (l > 0.5) {
				s = chroma / (2 - max - min);
			} else {
				s = chroma / (max + min);
			}

			if (max == r) {
				h = (g - b) / chroma + (g < b ? 6 : 0);
			} else if (max == g) {
				h = (b - r) / chroma + 2;
			} else if (max == b) {
				h = (r - g) / chroma + 4;
			}

			h = h / 6;
		}

		return {
			h: h,
			s: s,
			l: l
		};
	}

	// https://en.wikipedia.org/wiki/HSL_and_HSV
	static hslToRgb(h, s, l) {
		h = h * 360;
		let chroma = s * (1 - Math.abs((2 * l) - 1));
		let h1 = h / 60;
		let x = chroma * (1 - Math.abs(h1 % 2 - 1));
		let r, g, b;
		if (0 <= h1 && h1 <= 1) {
			r = chroma;
			g = x;
			b = 0;
		} else if (1 <= h1 && h1 <= 2) {
			r = x;
			g = chroma;
			b = 0;
		} else if (2 <= h1 && h1 <= 3) {
			r = 0;
			g = chroma;
			b = x;
		} else if (3 <= h1 && h1 <= 4) {
			r = 0;
			g = x;
			b = chroma;
		} else if (4 <= h1 && h1 <= 5) {
			r = x;
			g = 0;
			b = chroma;
		} else if (5 <= h1 && h1 <= 6) {
			r = chroma;
			g = 0;
			b = x;
		}
		let m = l - (chroma / 2);
		return {
			r: Math.floor((r + m) * 255),
			g: Math.floor((g + m) * 255),
			b: Math.floor((b + m) * 255)
		};
	}

}