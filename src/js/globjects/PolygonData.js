class PolygonData {
  constructor() {
    this.type = GLObjectType.POLYGON;

    // these will be set later
    this.va = []; // Array of vertices (so... array of int or float)
    this.color = [0.0, 0.0, 0.0, 1.0]; // Tuple of RGBA // Defaults to fully opaque black
    this.pos; // [0, 0]; // The position, an "array" (well, it's really a tuple) of x and y (defaults to 0 and 0 (origin), please)
    this.rot; // 0; // Rotation (in int/float), defaults to 0, please
    this.scale; // [1, 1]; // The scale, an "array" (well, it's really a tuple) of x and y (defaults to 1 and 1, please)

    // for origin and offset
    this.origin; // the position of the origin, preferably somewhere near the center of the object
  }

  setVertexArray(va) {
    // Array of vertices (so... array of int or float)
    // this.va = [...va];
    this.va = va.slice();
  }

  SetColorByArray(RGBATuple) {
    this.color = RGBATuple;
  }

  setPosition(x, y) {
    // The position, an "array" (well, it's really a tuple) of x and y
    this.pos = [x, y];
  }

  setRotation(rot) {
    // Rotation (in int/float)
    this.rot = rot;
  }

  setScale(x, y) {
    // The scale, an "array" (well, it's really a tuple) of x and y (defaults to 1 and 1)
    this.scale = [x, y];
  }

  setOrigin(x, y) {
    // The origin
    this.origin = [x, y];
  }
}
