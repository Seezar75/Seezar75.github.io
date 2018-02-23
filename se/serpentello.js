class Serpentello {

	constructor(startX, startY, startVel, startAngle, startSize) {
		this.x = startX;
		this.y = startY;
		this.vel = startVel;
		this.velVect = new Vector(Math.cos(startAngle), Math.sin(startAngle));
		this.size = startSize;
		this.tailLength = 70;
		this.tail = [];
		this.tail.push({
			x: this.x,
			y: this.y
		});
		this.color = getRandomColor();
		this.followRate = getRandomInt(4, 20);
		this.eye1 = new Vector(0.4, 0.4);
		this.eye2 = new Vector(0.4, -0.4);
		this.detectionDist = 140;
		this.idealDist = 70;
		this.intensity = 0.05;
		this.calcParams(this.intensity);
		this.passIndexes = [];
	}

	draw() {
		let angle = this.velVect.getAngle();

		//body
		if (this.passIndexes.length <= 0) {
			this.drawBodySegment(0, this.tail.length, this.tail.length);
		} else {
			this.drawBodySegment(0, this.tail.length - this.passIndexes[0], this.tail.length);
			for (let i = 0; i < this.passIndexes.length - 1; i++) {
				if (this.passIndexes[i] > 0) {
					this.drawBodySegment(this.tail.length - this.passIndexes[i], this.tail.length - this.passIndexes[i + 1], this.tail.length);
				}
			}
			if (this.passIndexes[this.passIndexes.length - 1] > 0) {
				this.drawBodySegment(this.tail.length - this.passIndexes[this.passIndexes.length - 1], this.tail.length, this.tail.length);
			}
		}

		//head
		ctx.beginPath();
		ctx.arc(this.tail[this.tail.length - 1].x, this.tail[this.tail.length - 1].y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();

		//new eyes
		let tempV = new Vector(this.eye1.x, this.eye1.y);
		tempV.multiply(this.velVect);
		ctx.beginPath();
		ctx.arc(this.x + (this.size * tempV.x), this.y + (this.size * tempV.y), (this.size / 15 * 3), 0, Math.PI * 2);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fill();
		ctx.closePath();

		tempV = new Vector(this.velVect.x, this.velVect.y);
		tempV.multiply(this.eye2);
		ctx.beginPath();
		ctx.arc(this.x + (this.size * tempV.x), this.y + (this.size * tempV.y), (this.size / 15 * 3), 0, Math.PI * 2);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fill();
		ctx.closePath();

	}

	drawBodySegment(startIndex, endIndex, totalLength) {
		let v1;
		let siz = this.size * startIndex / totalLength;
		let Vr = new Vector(0, -1);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.moveTo(this.tail[startIndex].x, this.tail[startIndex].y);
		for (let i = 0; i < (endIndex - startIndex) - 1; i++) {
			v1 = new Vector((this.tail[startIndex + i + 1].x - this.tail[startIndex + i].x), (this.tail[startIndex + i + 1].y - this.tail[startIndex + i].y));
			v1.normalize();
			v1.multiply(Vr);
			v1.multiplyScalar(siz);
			ctx.lineTo(this.tail[startIndex + i + 1].x + v1.x, this.tail[startIndex + i + 1].y + v1.y);
			siz += this.size / totalLength;
		}
		for (let i = 1; i < (endIndex - startIndex); i++) {
			v1 = new Vector((this.tail[endIndex - i - 1].x - this.tail[endIndex - i].x), (this.tail[endIndex - i - 1].y - this.tail[endIndex - i].y));
			v1.normalize();
			v1.multiply(Vr);
			v1.multiplyScalar(siz);
			ctx.lineTo(this.tail[endIndex - i].x + v1.x, this.tail[endIndex - i].y + v1.y);
			siz -= this.size / totalLength;
		}
		ctx.fill();
	}

	update(pos) {

		// Follow mouse
		if (follow == 1) {
			let followVect = new Vector(pos.x - this.x, pos.y - this.y);
			followVect.normalize();
			followVect.multiplyScalar(1 / this.followRate);
			this.velVect.add(followVect);
		}

		// Randomize velocity vector slightly
		let noiseVect = new Vector((0.5 - Math.random()) * noise, (0.5 - Math.random()) * noise);
		this.velVect.add(noiseVect);

		// Avoid obstacles
		if (avoidObstacles == 1) {
			let obstVect = new Vector(0, 0);
			for (let o of obstacles) {
				let relative = new Vector(o.x - this.x, o.y - this.y);
				let dist = relative.getModule();
				if (dist < 200) {
					relative.normalize();
					relative.neg();
					relative.multiplyScalar(3500 / (dist * dist * this.followRate));
					obstVect.add(relative);
				}
			}
			this.velVect.add(obstVect);
		}

		// Avoid others
		if (bounceOthers == 1) {
			let otherVect = new Vector(0, 0);
			for (let s of serpentelli) {
				if (this != s) {
					let relative = new Vector(s.x - this.x, s.y - this.y);
					let dist = relative.getModule();
					if (dist < this.size + s.size) {
						relative.normalize();
						relative.neg();
						relative.multiplyScalar(3500 * s.size / ((dist * dist * this.followRate) * (this.size + s.size)));
						otherVect.add(relative);
					}
				} else {
					//it's me
				}
			}
			this.velVect.add(otherVect);
		}

		// Aligning and matching speeds
		if (aligning == 1) {
			let alignVect = new Vector(0, 0);
			let otherVel = 0;
			for (let s of serpentelli) {
				if (this != s) {
					let otherVelVect = new Vector(s.velVect.x, s.velVect.y);
					let dist = this.getDist(s.x, s.y);
					if (dist < this.detectionDist) {
						otherVelVect.multiplyScalar(0.5 / dist);
						otherVel += (s.vel - this.vel) / (dist * 2);
						alignVect.add(otherVelVect);
					}
				} else {
					// It's me
				}
			}
			this.velVect.add(alignVect);
			this.vel += otherVel / 3;
		}

		// Grouping
		if (grouping == 1) {
			let count = 1;
			let ootherDistVect = new Vector(0, 0);
			for (let s of serpentelli) {
				if (this != s) {
					let relative = new Vector(s.x - this.x, s.y - this.y);
					let dist = relative.getModule() - (this.size / 2);
					relative.normalize();
					if (dist > this.detectionDist) {
						relative.multiplyScalar(0);
					} else {
						relative.multiplyScalar(this.A * dist * dist + this.B * dist + this.C);
						if (dist < this.detectionDist) relative.multiplyScalar(2);
						count++;
					}
					ootherDistVect.add(relative);
				} else {
					// It's me
				}
			}
			ootherDistVect.multiplyScalar(1 / count);
			this.velVect.add(ootherDistVect);
		}

		//border bouncing or crossing
		if (bounce == 0) {
			if (this.x > canvas.width + maxRad) {
				this.x = -maxRad;
				this.passIndexes.push(0);
			}
			if (this.x < -maxRad) {
				this.x = canvas.width + maxRad;
				this.passIndexes.push(0);
			}
			if (this.y > canvas.height + maxRad) {
				this.y = -maxRad;
				this.passIndexes.push(0);
			}
			if (this.y < -maxRad) {
				this.y = canvas.height + maxRad;
				this.passIndexes.push(0);
			}
		} else {
			if (this.x > canvas.width - this.size) {
				this.velVect.x = -this.velVect.x;
				this.x = canvas.width - this.size;
			}
			if (this.x < this.size) {
				this.velVect.x = -this.velVect.x;
				this.x = this.size;
			}
			if (this.y > canvas.height - this.size) {
				this.velVect.y = -this.velVect.y;
				this.y = canvas.height - this.size;
			}
			if (this.y < this.size) {
				this.velVect.y = -this.velVect.y;
				this.y = this.size;
			}
		}

		this.velVect.normalize();

	}

	move() {
		this.x += this.vel * this.velVect.x;
		this.y += this.vel * this.velVect.y;
		this.tail.push({
			x: this.x,
			y: this.y
		});
		if (this.tail.length > this.tailLength) {
			this.tail.shift();
		}
		for (let i = 0; i < this.passIndexes.length; i++) {
			this.passIndexes[i]++;
		}
		for (let i = 0; i < this.passIndexes.length; i++) {
			if (this.passIndexes[i] > this.tail.length) {
				this.passIndexes.splice(i, 1);
				break;
			}
		}
	}

	getDist(x_, y_) {
		return Math.sqrt((y_ - this.y) * (y_ - this.y) + (x_ - this.x) * (x_ - this.x));
	}

	calcParams(intensity) {
		// Y = A*x^2+b*x+C
		// A = 4*H/(X1^1-2*X1*X2+x2^2)
		// B = (4*H*(X1+X2))/(X1^1-2*X1*X2+x2^2)
		// C = (4*H*X1*X2)/(X1^1-2*X1*X2+x2^2)
		// X1 = ideal distance
		// X2 = detection distance
		// H = maximum attraction
		let divider = (this.idealDist * this.idealDist - 2 * this.idealDist * this.detectionDist + this.detectionDist * this.detectionDist);
		this.A = -4 * intensity / divider;
		this.B = (4 * intensity * (this.idealDist + this.detectionDist)) / divider;
		this.C = (-4 * intensity * this.idealDist * this.detectionDist) / divider;
	}
}
