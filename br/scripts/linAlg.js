function arrayToMatrix(v) {
	let M = new Array(1);
	M[0] = v;
	return M;
  }

function dot(B, A) {
	if (A.length != B[0].length) return null;
	let C = Array.from(Array(A[0].length), () => new Array(B.length));
	for (i=0; i<A[0].length; i++) {
		for (j=0; j<B.length; j++) {
			let element = 0;
			for (k=0; k<A.length; k++) {
				element += A[k][i]*B[j][k];
			}
			C[i][j] = element;
		}
	}
	return C;
}

function rref(A) {
	var rows = A.length;
	var columns = A[0].length;
	
	var lead = 0;
	for (var k = 0; k < rows; k++) {
		if (columns <= lead) return;
		
		var i = k;
		while (A[i][lead] === 0) {
			i++;
			if (rows === i) {
				i = k;
				lead++;
				if (columns === lead) return;
			}
		}
		var irow = A[i], krow = A[k];
		A[i] = krow, A[k] = irow;
		
		var val = A[k][lead];
		for (var j = 0; j < columns; j++) {
			A[k][j] /= val;
		}
		
		for (var i = 0; i < rows; i++) {
			if (i === k) continue;
			val = A[i][lead];
			for (var j = 0; j < columns; j++) {
				A[i][j] -= val * A[k][j];
			}
		}
		lead++;
	}
	return A;
  }

// https://textbooks.math.gatech.edu/ila/least-squares.html
function solve(A, bt) {
	let At = transp(A);
	bt = arrayToMatrix(bt);
	let b = transp(bt);
	let Aug = dot(At,A);
	let Atb = dot(At,b);
	for (i=0;i<Aug.length;i++) {
		Aug[i][A[0].length] = Atb[0][i];
	}
	Aug = rref(Aug);
	res = [];
	for(let i=0; i<Aug.length; i++) {
		res[i] = Aug[i][Aug[0].length-1];
	}
	return res;
}

function transp(A) {
	return A[0].map((col, i) => A.map(row => row[i]));
}