class Serpentello {
	
    constructor (startX, startY, startVel, startAngle, startSize) {
        this.x = startX;
		this.y = startY;
		this.vel = startVel;
		this.velVect = new Vector(Math.cos(startAngle),Math.sin(startAngle));
		this.size = startSize;
		this.tailLength = 70;
		this.tail=[];
		this.tail.push({x:this.x,y:this.y});
		this.color = getRandomColor();
		this.followRate = getRandomInt(4, 20);
		this.eye1 = new Vector(0.4,0.4);
		this.eye2 = new Vector(0.4,-0.4);
		this.detectionDist = 100;
		this.idealDist = 50;
		let intensity = 0.15;
		this.calcParams(intensity);
    }
	
    draw () {
		let angle = this.velVect.getAngle();
		var siz = 0;
		// tail
		for (let i=0; i<this.tail.length; i++) {
			ctx.beginPath();
			ctx.arc(this.tail[i].x, this.tail[i].y, siz, 0, Math.PI*2);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
			siz+= this.size/this.tail.length;
		}
		
		//new eyes
		let tempV = new Vector(this.eye1.x, this.eye1.y);
		tempV.multiply(this.velVect);
		ctx.beginPath();
		ctx.arc(this.x+(this.size*tempV.x), this.y+(this.size*tempV.y), (this.size/15*3), 0, Math.PI*2);
		ctx.fillStyle = "rgb(0, 0, 0)"; 
		ctx.fill();
		ctx.closePath();
		
		tempV = new Vector(this.velVect.x, this.velVect.y);
		tempV.multiply(this.eye2);
		ctx.beginPath();
		ctx.arc(this.x+(this.size*tempV.x), this.y+(this.size*tempV.y), (this.size/15*3), 0, Math.PI*2);
		ctx.fillStyle = "rgb(0, 0, 0)"; 
		ctx.fill();
		ctx.closePath();
		
    }
	
	follow(pos) {
		
		// Follow mouse
		if (follow == 1) {
			let followVect = new Vector(pos.x-this.x, pos.y-this.y);
			followVect.normalize();
			followVect.multiplyScalar(1/this.followRate);
			this.velVect.add(followVect);
		}
		
		// Randomize velocity vector slightly		
		let noiseVect = new Vector((0.5-Math.random())*noise, (0.5-Math.random())*noise);
		this.velVect.add(noiseVect);

		// Avoid obstacles
		if (avoidObstacles == 1) {
			let obstVect = new Vector(0,0);
			for (let o of obstacles) {
				let relative = new Vector(o.x-this.x, o.y-this.y);
				let dist = relative.getModule();
				if (dist < 200) {
					relative.normalize();
					relative.neg();
					relative.multiplyScalar(3500/(dist*dist*this.followRate));
					obstVect.add(relative);
				}
			}
			this.velVect.add(obstVect);
		}
		
		// Aligning and matching speeds
		if (aligning == 1) {
			let alignVect = new Vector(0,0);
			let otherVel = 0;
			for (let s of serpentelli) {
				if (this != s) {
					let otherVelVect = new Vector(s.velVect.x, s.velVect.y);
					let dist = this.getDist(s.x,s.y);
					if (dist < this.detectionDist) {
						otherVelVect.multiplyScalar(1/dist);
						otherVel += (s.vel-this.vel)/dist;
						alignVect.add(otherVelVect);
					}
				} else {
					// It's me
				}
			}
			this.velVect.add(alignVect);
			this.vel += otherVel/3;
		}
		
		if (grouping == 1) {
			let ootherDistVect = new Vector(0,0);
			for (let s of serpentelli) {
				if (this != s) {
					let relative = new Vector(s.x-this.x, s.y-this.y);
					let dist = relative.getModule();
					relative.normalize();
					if (dist>this.detectionDist) {
						relative.multiplyScalar(0);
					} else {
						relative.multiplyScalar(this.A*dist*dist+this.B*dist+this.C);
					}
					//relative.multiplyScalar(3500/(dist*dist));
					ootherDistVect.add(relative);
				} else {
					// It's me
				}
			}
			this.velVect.add(ootherDistVect);
		}
		
		// Grouping
		
		this.velVect.normalize();
	}
	
	move() {
		this.x+=this.vel*this.velVect.x;
		this.y+=this.vel*this.velVect.y;
		this.tail.push({x:this.x,y:this.y});
		if(this.tail.length > this.tailLength) {
			this.tail.shift();
		}
	}
	
	borderInteraction() {
		if (bounce == 0) {
			if (this.x > canvas.width+maxRad) {
				this.x = -maxRad;
			}
			if (this.x < -maxRad) {
				this.x = canvas.width+maxRad;
			}
			if (this.y > canvas.height+maxRad) {
				this.y = -maxRad;
			}
			if (this.y < -maxRad) {
				this.y = canvas.height+maxRad;
			}
		} else {
			if (this.x > canvas.width-this.size) {
				this.velVect.x = -this.velVect.x;
				this.x = canvas.width-this.size;
			}
			if (this.x < this.size) {
				this.velVect.x = -this.velVect.x;
				this.x = this.size;
			}
			if (this.y > canvas.height-this.size) {
				this.velVect.y = -this.velVect.y;
				this.y = canvas.height-this.size;
			}
			if (this.y < this.size) {
				this.velVect.y = -this.velVect.y;
				this.y = this.size;
			}
		}
	}

	getDist(x_, y_) {
		return Math.sqrt((y_ - this.y)*(y_ - this.y) + (x_ - this.x)*(x_ - this.x));
	}
	
	calcParams(intensity) {
		// Y = A*x^2+b*x+C
		// A = 4*H/(X1^1-2*X1*X2+x2^2)
		// B = (4*H*(X1+X2))/(X1^1-2*X1*X2+x2^2)
		// C = (4*H*X1*X2)/(X1^1-2*X1*X2+x2^2)
		// X1 = ideal distance
		// X2 = detection distance
		// H = maximum attraction
		let divider = (this.idealDist*this.idealDist-2*this.idealDist*this.detectionDist+this.detectionDist*this.detectionDist);
		this.A = -4*intensity/divider;
		this.B = (4*intensity*(this.idealDist+this.detectionDist))/divider;
		this.C = (-4*intensity*this.idealDist*this.detectionDist)/divider;
	}
}
