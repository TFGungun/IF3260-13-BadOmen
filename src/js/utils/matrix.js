function multiplyMatrix(a, b, colsize) {
  var m = new Array(a.length).fill(0);

  for (var r = 0; r < colsize; ++r) {
    for (var c = 0; c < colsize; ++c) {
      var temp = 0;
      for (var i = 0; i < colsize; ++i) {
        temp += a[r * colsize + i] * b[colsize * i + c];
      }
      m[r * colsize + c] = temp;
    }
  }
  return m;
}

function getMatrixDeternminant(array2dmatrix) {
  return;
}

function transposeMatrix(array, colsize) {
  let tempMatrix = [];
  for (let index = 0; index < colsize; index++) {
    for (let i = 0; i < colsize; i++) {
      tempMatrix.push(array[i * colsize + index]);
    }
  }
  return tempMatrix;
}

function getMatrixMinor(array, colsize, row, col) {
  // row and col start from 1
  const zeroedRow = row - 1;
  const zeroedCol = col - 1;
  let tempMatrix = [];
  for (let rowi = 0; rowi < colsize; rowi++) {
    for (let colj = 0; colj < colsize; colj++) {
      const index = rowi * colsize + colj;
      if (rowi !== row && colj !== col) {
        tempMatrix.push(array[index]);
      }
    }
  }
  return tempMatrix;
}

let testMatrix = [0, 1, 2, 3, 4, 5, 6, 7, 8];
console.log("testMatrix : ");
console.log(testMatrix);
console.log("Transposed matrix : ");
console.log(transposeMatrix(testMatrix, 3));

// checks for minors
for (let rowi = 0; rowi < 3; rowi++) {
  for (let colj = 0; colj < 3; colj++) {
    // const index = rowi * 3 + colj;
    console.log("checking minor for row " + rowi + " and col " + colj);
    console.log(getMatrixMinor(testMatrix, 3, rowi, colj));
  }
}

// def transposeMatrix(m):
//     return map(list,zip(*m))

// def getMatrixMinor(m,i,j):
//     return [row[:j] + row[j+1:] for row in (m[:i]+m[i+1:])]

// def getMatrixDeternminant(m):
//     #base case for 2x2 matrix
//     if len(m) == 2:
//         return m[0][0]*m[1][1]-m[0][1]*m[1][0]

//     determinant = 0
//     for c in range(len(m)):
//         determinant += ((-1)**c)*m[0][c]*getMatrixDeternminant(getMatrixMinor(m,0,c))
//     return determinant

// def getMatrixInverse(m):
//     determinant = getMatrixDeternminant(m)
//     #special case for 2x2 matrix:
//     if len(m) == 2:
//         return [[m[1][1]/determinant, -1*m[0][1]/determinant],
//                 [-1*m[1][0]/determinant, m[0][0]/determinant]]

//     #find matrix of cofactors
//     cofactors = []
//     for r in range(len(m)):
//         cofactorRow = []
//         for c in range(len(m)):
//             minor = getMatrixMinor(m,r,c)
//             cofactorRow.append(((-1)**(r+c)) * getMatrixDeternminant(minor))
//         cofactors.append(cofactorRow)
//     cofactors = transposeMatrix(cofactors)
//     for r in range(len(cofactors)):
//         for c in range(len(cofactors)):
//             cofactors[r][c] = cofactors[r][c]/determinant
//     return cofactors
