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

function get2DMatrixDeternminant(array2dmatrix) {
  return (
    array2dmatrix[0] * array2dmatrix[3] - array2dmatrix[1] * array2dmatrix[2]
  );
}

function get3DMatrixDeternminant(array) {
  let det = 0;
  for (let index = 0; index < 3; index++) {
    const element = array[index];
    const matrixMinor = getMatrixMinor(array, 3, index, index);
    const minorDet = get2DMatrixDeternminant(matrixMinor);
    if (index % 2 === 0) {
      // kalau genap (dari 0) positif
      det += element * minorDet;
    } else {
      // kalau ganjil (dari 0), negatif
      det += element * (-1 * minorDet);
    }
  }

  return det;
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
  // row and col start from 0
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

function getCofactor(array, colsize, row, col) {
  // row and col start from 0
  let multiplier = 1;
  if ((row + 1 + (col + 1)) % 2 !== 0) {
    multiplier = -1;
  }
  return multiplier;
}

function getMatrixOfMinors(array, colsize) {
  let tempMatrix = [];
  for (let rowi = 0; rowi < colsize; rowi++) {
    for (let colj = 0; colj < colsize; colj++) {
      const minorMatrix = getMatrixMinor(array, 3, rowi, colj);
      console.log("Matrix minor for : (" + rowi + "," + colj + ") : ");
      console.log(minorMatrix);
      tempMatrix.push(get2DMatrixDeternminant(minorMatrix));
    }
  }
  return tempMatrix;
}

function getCofactoredMatrix(array, colsize) {
  let tempMatrix = [];
  for (let rowi = 0; rowi < colsize; rowi++) {
    for (let colj = 0; colj < colsize; colj++) {
      const index = rowi * colsize + colj;
      let multiplier = 1;
      if ((rowi + 1 + (colj + 1)) % 2 !== 0) {
        multiplier = -1;
      }
      tempMatrix.push(multiplier * array[index]);
    }
  }
  return tempMatrix;
}

function getMatrixInverse(array, colsize) {
  const matrixOfMinors = getMatrixOfMinors(array, colsize);
  console.log("matrixOfMinors : ");
  console.log(matrixOfMinors);
  const matrixOfCofactors = getCofactoredMatrix(matrixOfMinors, colsize);

  const transPosedMatrixOfCofactors = transposeMatrix(matrixOfCofactors, 3);
  console.log("transPosedMatrixOfCofactors : ");
  console.log(transPosedMatrixOfCofactors);
  const determinant = get3DMatrixDeternminant(array);
  console.log("DETERMINANT : " + determinant);

  let tempMat = [];
  for (let index = 0; index < transPosedMatrixOfCofactors.length; index++) {
    tempMat.push(transPosedMatrixOfCofactors[index] / determinant);
  }

  return tempMat;
}

let tryMatrix = [0.1, 0, 0, 0, 0.1, 0, 270, 270, 1];
const invMatrix = getMatrixInverse(tryMatrix, 3);
console.log("TryMarix : ");
console.log(tryMatrix);
console.log("Inv matrix : ");
console.log(invMatrix);
