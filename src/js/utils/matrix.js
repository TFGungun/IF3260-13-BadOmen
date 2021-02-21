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
