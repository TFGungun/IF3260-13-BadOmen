class Renderer {
  constructor() {
    this.objectList = new Array(); // an array of GLObject s
    this.count = 0;
  }

  clearObjList() {
    this.objectList = new Array();
    this.count = 0;
  }

  addObject(obj) {
    // obj is a GLObject
    this.objectList.push(obj);
    this.count++;
  }

  removeObject(id) {
    // id is a number (int)
    const idx = this.objectList.findIndex((obj) => obj.id === id);
    this.objectList.splice(idx, 1);
    this.count--;
  }

  render() {
    for (const obj of this.objectList) {
      obj.bind();
      obj.draw();
      obj.unbind();
    }
    // console.log("RENDER.jS RENDER DONE");
  }

  renderTex(selectProgram) {
    // selectProgram is a WebGL shader program... with selection shaders
    for (const obj of this.objectList) {
      obj.bind();
      obj.drawSelect(selectProgram);
      obj.unbind();
    }
  }
}
