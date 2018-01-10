class Chain {
	
    constructor (startPoint, startSize, segmentDistance) {		
		this.segments=[];
		this.segments.push(new Segment(segmentDistance, startPoint));
		this.segments[0].thickness = 40;
		let start = this.segments[0].end;
		for (let i = 0; i < startSize-1; i++) {
			let end = {x:mousePos.x + Math.random() * 50, y: mousePos.y +Math.random() * 50};
			let thick = 40*(startSize-i-1)/startSize;
			this.segments.push(new Segment(segmentDistance, start, end, thick));
			start = end;
		}
    }
	
    draw () {
		for (let s of this.segments) {
			s.draw();
		}
    }
	
	update(point) {
		let target = point;
		for (let s of this.segments) {
			s.update(target);
			target = s.end;
		}
	}

}
