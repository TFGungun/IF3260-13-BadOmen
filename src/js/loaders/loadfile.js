const loadFile = async (filename) => {
  // gl is a WebGL context, type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER, source is a string
  const rawFile = await fetchFile(filename);
  return rawFile;
};

async function fetchFile(filename) {
  // source is a string
  // fetches the actual shader source file, and return its contents as string
  const json = await fetch(filename).then((res) => res.text());
  console.log(json);
  return json;
}

async function initModelFile(gl, shaderProgram, filename, renderer) {

  const modelJson = await loadFile(filename);
  GlDataList = JSON.parse(modelJson);
  renderer.objectList = [];
  for (var i = 0; i < GlDataList.length; i++) {
    if(GlDataList[i].type == GLObjectType.LINE)
    {
      var glObject = new GLObjectLine(5, shaderProgram, gl)
    } else if(GlDataList[i].type == GLObjectType.RECTANGLE)
    {
      var glObject = new GLObjectRectangle(5, shaderProgram, gl)  
      console.log("Rectangle found");
    } else if(GlDataList[i].type == GLObjectType.POLYGON)
    {
      var glObject = new GLObjectPolygon(5, shaderProgram, gl)
      console.log("Polygon found");
    }

    console.log("Vertices: " + GlDataList[i].va);
    console.log("color: " + GlDataList[i].color);
    console.log("pos: " + GlDataList[i].pos);
    console.log("rot: " + GlDataList[i].rot);
    console.log("scale: " + GlDataList[i].scale);
    glObject.setVertexArray(GlDataList[i].va);
    glObject.setColor(GlDataList[i].color[0], GlDataList[i].color[1], GlDataList[i].color[2], GlDataList[i].color[3]);
    glObject.setPosition(0,0);
    glObject.setRotation(0);
    glObject.setScale(1,1);
    glObject.centerOriginsSetOffsetAndFixVertices();
    if(GlDataList[i].origin == null)
    {
      glObject.centerOriginsSetOffsetAndFixVertices();
    } else {
      glObject.origin = GlDataList[i].origin;
    }
    glObject.assignProjectionMatrix();
    renderer.addObject(glObject);
    console.log("Object added");
  }
}
