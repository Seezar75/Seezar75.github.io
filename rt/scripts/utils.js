function intersect(p1, p2, p3, p4) {
	var a1, a2, b1, b2, c1, c2;
	var r1, r2, r3, r4;
	var denom;

	// Compute a1, b1, c1, where line joining points 1 and 2
	// is "a1 x + b1 y + c1 = 0".
	a1 = p2.y - p1.y;
	b1 = p1.x - p2.x;
	c1 = p2.x * p1.y - p1.x * p2.y;

	// Compute r3 and r4.
	r3 = a1 * p3.x + b1 * p3.y + c1;
	r4 = a1 * p4.x + b1 * p4.y + c1;

	// Check signs of r3 and r4. If both point 3 and point 4 lie on
	// same side of line 1, the line segments do not intersect.
	if (r3 !== 0 && r4 !== 0 && sameSign(r3, r4)) {
		return 0; //return that they do not intersect
	}

	// Compute a2, b2, c2
	a2 = p4.y - p3.y;
	b2 = p3.x - p4.x;
	c2 = p4.x * p3.y - p3.x * p4.y;

	// Compute r1 and r2
	r1 = a2 * p1.x + b2 * p1.y + c2;
	r2 = a2 * p2.x + b2 * p2.y + c2;

	// Check signs of r1 and r2. If both point 1 and point 2 lie
	// on same side of second line segment, the line segments do
	// not intersect.
	if (r1 !== 0 && r2 !== 0 && sameSign(r1, r2)) {
		return 0; //return that they do not intersect
	}

	//Line segments intersect: compute intersection point.
	denom = a1 * b2 - a2 * b1;

	if (denom === 0) {
		return 1; //collinear
	}

	// lines_intersect
	return 1; //lines intersect, return true
}

function sameSign(a, b) {
	return Math.sign(a) == Math.sign(b);
}
