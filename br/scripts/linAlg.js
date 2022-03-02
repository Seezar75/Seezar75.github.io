/*
DISCLAIMER: the following algorithms are NOT properly tested, nor optimized, elegant nor efficient.
This is just my attempt to develop a simple linear algebra library to help me with some project and 
allow me to better understand linear algebra and improve my skills as a programmer
*/

// convert array to a one row matrix
function arrayToMatrix(v) {
	let M = new Array(1);
	M[0] = v;
	return M;
}

// calculate dot product
function dot(A, B) {
	if (A[0].length != B.length) return null; // columns of A has to be equal to rows of B
	let C = new Array(A.lrngth);
	for (i=0; i<A.length; i++) {
		let row = new Array(B[0].length);
		for (j=0; j<B[0].length; j++) {
			let element = 0;
			for (k=0; k<B.length; k++) {
				element += A[i][k]*B[k][j];
			}
			row[j] = element;
		}
		C[i] = row;
	}
	return C;
}

// costruct the augmented matrix (append B to the right of A)
function augment(A, B) {
	if (A.length != B.length) return undefined;
	let Aug = new Array(A.length);
	for  (let i = 0; i < A.length; i++) {
		let row = new Array(A[0].length);
		Aug[i] = row;
		for (let j = 0; j < A[0].length; j++) {
			Aug[i][j] = A[i][j];
		}
		for (let j = 0; j < B[0].length; j++) {
			Aug[i].push(B[i][j]);
		}
	}
	return Aug;
}

// Extract the last n columns of A into a matrix
function extractLastColumns(A, n) {
	let Ex = new Array(A.length);
	for  (let i = 0; i < A.length; i++) {
		let row = new Array(n);
		for (let j = A[0].length - n; j < A[0].length; j++) {
			row[n + j - A[0].length] = A[i][j];
		}
		Ex[i] = row;
	}
	return Ex;
}

// compute the inverse matrix of A (A^-1) https://en.wikipedia.org/wiki/Gaussian_elimination#Finding_the_inverse_of_a_matrix
function invert(A) {
	if (A.length != A[0].length) return undefined; // Not square
	let I = identity(A.length);
	// augment the matrix with the identity on the right
	let Aug = augment(A, I);
	// compute the row reduced echelon form of the augmented matrix
	Aug = rref(Aug);
	// check if the columns of the original matrix are linearly independent
	let diag = 1;
	for (let i = 0; i < A.length; i++) {
		diag = diag * Aug[i][i];
	}
	if (diag == 0) {
		console.log("Columns are not linearly independent, matrix in non invertible");
		return undefined;
	}
	// extract the square matrix on the right from the augmented matrix
	let Inv = extractLastColumns(Aug, A.length);
	return Inv
}

// returns the identity matrix of order n
function identity(n) {
	let I = new Array(n);
	for (let i = 0; i < n; i++) {
		let row = new Array(n)
		for (let j = 0; j < n; j++) {
			if (i == j) {
				row[j] = 1;
			} else {
				row[j] = 0;
			}
		}
		I[i] = row;
	}
	return I;
}

// Row echelon form of A (not reduced) https://en.wikipedia.org/wiki/Row_echelon_form
function ref(A) {
	let red = new Array(A.length);
	for (i=0; i<A.length;i++) {
		let row = new Array(A[0].length);
		red[i] = row;
		for (j=0; j<A[0].length;j++) {
			red[i][j] = A[i][j];
		}
	}
	let pRow = 0;
	let pCol = 0;
	while (pRow < A.length) {
		// console.log(`Managing row ${pRow}`);


		// manage case of red[pRow][pCol] = 0, swap with another row with non zero element at pCol and invert one row to preserve determinant
		if (red[pRow][pCol] == 0) {
			// console.log(`Swapping needed`);
			let swapped = false;
			for (let i=pRow+1; i<A.length;i++) {
				// console.log(`red[i][pCol] = ${red[i][pCol]}`);
				if (red[i][pCol] != 0) {
					// console.log(`Swapping!`);
					swapped = true;
					for (j=pCol;j<A[0].length;j++) {
						let temp = -red[pRow][j]; // inverting one row to preserve the determinant
						red[pRow][j] = red[i][j];
						red[i][j] = temp;
					}
					// console.log(red);
					break;
				}
			}
			if (swapped == false) {
				//all elements below pRow, pCol are already 0 so no row swap and shifting to the right and starting over
				pCol++
				continue;
			}
		}

		// combine each row below pRow with pRow to make each element under the pivot equal to zero (row replacement)
		for (i=pRow+1;i<A.length;i++) {
			if (red[pRow][pCol] == 0) {
				break;
			}
			let val = red[i][pCol]/red[pRow][pCol];
			// console.log(`reducing row ${i}, val = ${val}`);
			for(j=pCol;j<A[0].length;j++) {
				// console.log(`reducing column ${j}`);
				red[i][j] = red[i][j] - val*red[pRow][j];
				// console.log(red[i][j]);
			}
		}
		pRow++;
		pCol++;
		// console.table(red)
	}
	return red;
}

// Row echelon form with all pivots reduced to 1
function ref2(A) {
	// compute the ref of A
	let redu = ref(A);
	for (let i = 0; i < redu.length; i++) {
		// divide each row by the pivot
		let div = 1;
		let found = false;
		if (i < redu[0].length) {
			for (let j = i; j < redu[0].length; j++) {
				if (found == false && redu[i][j] != 0) {
					div = redu[i][j];
					found = true;
				}
				redu[i][j] = redu[i][j]/div;
			}
		}
	}
	return redu;
}

// Reduced row echelon form
function rref(A) {
	let redu = ref2(A);
	// find pivot starting from the bottom row
	for (let i = redu.length -1; i >= 0; i--) {
		// console.log(`Processing row ${i}`);
		let pCol = -1;
		for (let j = 0; j < redu[0].length; j++) {
			if (redu[i][j] == 1) {
				pCol = j;
				break;
			}
		}
		// if pivot is found
		if (pCol != -1) {
			// console.log(`Pivot of row ${i} in column ${pCol}`);
			// clear column of current pivot for rows above the current
			for (let k = i-1; k >= 0; k--) {
				let val = redu[k][pCol];
				// console.log(`Substituting in row ${k} with val = ${val}`);
				for (let l = pCol; l < redu[0].length; l++) {
					redu[k][l] = redu[k][l] - val * redu[i][l];
					// console.log(`redu[${k}][${l}] = ${redu[k][l]}`);
				}
			}
		}
	}
	return redu;
}

// calculate determinant
function det(A) {
	if(A.length != A[0].length) return undefined
	let redu = ref(A);
	let det = 1;
	for (let i = 0; i < A.length; i++) {
		det = det * redu[i][i];
	}
	return det;
}

// https://textbooks.math.gatech.edu/ila/least-squares.html
function leastSquaresSolve(A, bt) {
	// input should be column vector b, but for ease of use the input is an array, which is converted to matrix form and transposed into a column vector
	let At = transp(A);
	bt = arrayToMatrix(bt);
	let b = transp(bt);
	let Aug = dot(At,A);
	let Atb = dot(At,b);
	Aug = augment(Aug, Atb);
	Aug = rref(Aug);
	res = [];
	for(let i=0; i<Aug.length; i++) {
		res[i] = Aug[i][Aug[0].length-1];
	}
	return res;
}

// transpose matrix
function transp(A) {
	return A[0].map((col, i) => A.map(row => row[i]));
}
