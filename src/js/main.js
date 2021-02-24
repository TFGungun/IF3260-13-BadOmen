var canvas = document.getElementById("webgl-app");
canvas.width = 800;
canvas.height = 600;
var gl = canvas.getContext("webgl2");

var btnUpdateLineLength = document.getElementById("line-length-btn");
var btnUpdateSquareSideLength = document.getElementById(
  "square-side-length-btn"
);
var btnUpdateColor = document.getElementById("color-update");
// TODO : UBAH ROTATION DAN SCALING KE LOCAL
// TODO : JANGAN CUMAN SELECT DOANG TAPI BISA TARIK VERTEX

let appState = {
  mousePos: {
    x: 0,
    y: 0,
  },
  oldPickColor: [],
  oldPick: -1,
  selId: -1,
  selectedObject: null,
  draggedHandle: null,
  dragStart: {
    x: -1,
    y: -1,
  },
  dragEnd: {
    x: -1,
    y: -1,
  },
};

let GLobjectList = [];
let draggers = [];

function updateLineLength() {
  var newLength;
  newLength = document.getElementById("line-length").value;

  if (appState.selectedObject instanceof GLObjectLine && newLength != "") {
    var pivotX = appState.selectedObject.va[0];
    var pivotY = appState.selectedObject.va[1];
    var xDiff = appState.selectedObject.va[2] - pivotX;
    var yDiff = appState.selectedObject.va[3] - pivotY;
    var rad = Math.atan(yDiff / xDiff);
    var sin = Math.sin(rad);
    var cos = Math.cos(rad);
    console.log("xDiff :" + xDiff);
    console.log("yDiff :" + yDiff);
    console.log("RAD :" + rad);
    console.log("SIN :" + sin);
    console.log("COS :" + cos);
    console.log("New x :" + parseInt(newLength));

    // Set New Length
    appState.selectedObject.va[2] = pivotX + parseInt(newLength) * cos;
    appState.selectedObject.va[3] = pivotY + parseInt(newLength) * sin;
  } else if (newLength == "") {
    alert("Input new line length");
  } else {
    alert("Object selected is not a line");
  }
}

function updateRectSideLength() {
  // console.log(appState.selectedObject.typeof);
  var newLength = document.getElementById("square-side-length");
  if (appState.selectedObject instanceof GLObjectRectangle) {
    var vertices = appState.selectedObject.va;
    var pivotX = vertices[0];
    var pivotY = vertices[1];
    var currLength = vertices[2] - vertices[0];
    var newLength;
    if (document.getElementById("square-side-length").value != "") {
      newLength = document.getElementById("square-side-length").value;

      // Move the Vertices based on size changes

      // Bottom-Right Points
      appState.selectedObject.va[2] = parseInt(pivotX) + parseInt(newLength);
      appState.selectedObject.va[3] = parseInt(pivotY);

      appState.selectedObject.va[8] = parseInt(pivotX) + parseInt(newLength);
      appState.selectedObject.va[9] = parseInt(pivotY);

      // Top-Left Points
      appState.selectedObject.va[4] = parseInt(pivotX);
      appState.selectedObject.va[5] = parseInt(pivotY) + parseInt(newLength);

      appState.selectedObject.va[6] = parseInt(pivotX);
      appState.selectedObject.va[7] = parseInt(pivotY) + parseInt(newLength);

      // Top-Right Points
      appState.selectedObject.va[10] = parseInt(pivotX) + parseInt(newLength);
      appState.selectedObject.va[11] = parseInt(pivotY) + parseInt(newLength);
    } else {
      alert("Masukkan Panjang Sisi");
    }
  } else {
    alert("Object Selected is not a rectangle");
  }
}

function showObjId(id, htmlid) {
  let idString = "None";
  if (id > 0) {
    idString = String(id);
  }
  document.getElementById(htmlid).innerHTML = idString;
}

function getClickedGLObject() {
  const id = appState.selId;
  showObjId(id, "sel-id");
  return GLobjectList.find((x) => x.id === id);
}

function recolorSelectedObject(id) {
  // console.log(appState);
  // Recolors the selected object
  if (id >= 0) {
    var selObj = GLobjectList.find((x) => x.id === id);

    if (selObj) {
      // Resets the old object color
      if (id != appState.oldPick.id) {
        resetSelObjColor();
      }
      appState.oldPickColor = selObj.color;
      appState.oldPick = selObj.id;
      // selObj.SetColorByArray([0.9, 0.1, 0.1, 1.0]);
    }
  } else {
    if (appState.oldPick != -1) {
      resetSelObjColor();
    }
    appState.oldPick = -1;
  }

  function resetSelObjColor() {
    if (appState.oldPick != -1) {
      var oldSelObj = GLobjectList.find((x) => x.id === appState.oldPick);
      oldSelObj.SetColorByArray(appState.oldPickColor);
    }
  }
}

const baseDraggerId = 1000000;

let shaderProgramGlobal;

const draggerRenderer = new Renderer();
// draggers = draggerRenderer.objectList;
// draggerRenderer.objectList = draggers;
function getClickedDragger() {
  const id = appState.selId;
  return draggerRenderer.objectList.find((x) => x.id === id);
}

function createDraggers(obj) {
  // draggers.clear();
  draggerRenderer.objectList = [];

  let tempUniqVertList = [];

  if (obj) {
    for (let index = 0; index < obj.va.length / 2; index++) {
      // const element = array[index];
      console.log(
        "Checking " + obj.va[index * 2] + " , " + obj.va[index * 2 + 1]
      );

      // check if there has been a duplicate vertex
      let prevDupVertId = -1;
      for (let i = 0; i < tempUniqVertList.length; i++) {
        if (
          tempUniqVertList[i][0] === obj.va[index * 2] &&
          tempUniqVertList[i][1] === obj.va[index * 2 + 1]
        ) {
          prevDupVertId = i;
        }
      }

      console.log("Found prev dup at " + prevDupVertId);

      // if there were no duplicates, make a new dragger
      if (prevDupVertId === -1) {
        console.log("REEEE");
        var neoDragger = new GLObjectDragger(
          baseDraggerId + tempUniqVertList.length,
          shaderProgramGlobal,
          gl
        );
        neoDragger.addVertexId(index);
        neoDragger.setPosition(obj.va[index * 2], obj.va[index * 2 + 1]);
        neoDragger.centerOriginsSetOffsetAndFixVertices();
        neoDragger.assignProjectionMatrix();

        draggerRenderer.addObject(neoDragger);

        tempUniqVertList.push([obj.va[index * 2], obj.va[index * 2 + 1]]);
      } else {
        // else add this vertex to the correct dragger
        let idToFind = baseDraggerId + prevDupVertId;
        let prevDupDragger = draggerRenderer.objectList.find(
          (x) => x.id === idToFind
        );
        prevDupDragger.addVertexId(index);
      }
    }
  }

  console.log(draggerRenderer.objectList);
}

function moveObjVertex(draggerObj, obj) {
  let oldObjVertex = obj.va;
  for (let index = 0; index < draggerObj.vertId.length; index++) {
    oldObjVertex[draggerObj.vertId[index] * 2] = draggerObj.pos[0];
    oldObjVertex[draggerObj.vertId[index] * 2 + 1] = draggerObj.pos[1];
    // let deltaX = appState.mousePos.x - appState.dragStart.x;
    // let deltaY = appState.mousePos.y - appState.dragStart.y;
    // oldObjVertex[draggerObj.vertId * 2] += deltaX;
    // oldObjVertex[draggerObj.vertId * 2 + 1] += deltaY;
  }
  obj.setVertexArray(oldObjVertex);
}

async function main() {
  // Checks if browser supports WebGL
  if (!gl) {
    alert("Your browser does not support WebGL");
    return;
  }
  // if so, continue on
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Adds an evvent listener to the canvas to get the current mouse position
  canvas.addEventListener(
    "mousemove",
    (event) => {
      const bound = canvas.getBoundingClientRect();
      const res = {
        x: event.clientX - bound.left,
        y: event.clientY - bound.top,
      };
      appState.mousePos = res;

      // dragger thingies
      if (appState.draggedHandle && appState.selectedObject) {
        appState.draggedHandle.setPosition(res.x, gl.canvas.height - res.y);
        appState.draggedHandle.assignProjectionMatrix();
        // console.log("reee");
        moveObjVertex(appState.draggedHandle, appState.selectedObject);
      }
    },
    false
  );
  canvas.addEventListener(
    "mouseleave",
    (event) => {
      appState.mousePos = {
        x: 0,
        y: 0,
      };
    },
    false
  );
  canvas.addEventListener(
    "click",
    function () {
      if (appState.selId < baseDraggerId) {
        let clickedGLObject = getClickedGLObject();
        // recolorSelectedObject(appState.selId);
        if (clickedGLObject && clickedGLObject.id < baseDraggerId) {
          // console.log(appState.selectedObject);
          appState.selectedObject = clickedGLObject;
          createDraggers(clickedGLObject);
          // appState.selectedObject.setColor(0, 0, 0, 1);
        } else {
          appState.selectedObject = null;
          createDraggers(clickedGLObject);
          // console.log(appState.selectedObject);
        }
      }
    },
    false
  );

  canvas.addEventListener(
    "mousedown",
    function (event) {
      // store a ref. on the dragged elem
      let clickedGLObject = getClickedDragger();
      console.log(clickedGLObject);
      if (clickedGLObject && clickedGLObject.id >= baseDraggerId) {
        appState.draggedHandle = clickedGLObject;
      } else {
        appState.draggedHandle = null;
        // console.log(appState.selectedObject);
      }
      console.log("D");
      if (appState.draggedHandle) {
        console.log("rs");
        // appState.dragStart = (appState.mousePos.x, appState.mousePos.y);
        console.log("appState.mousePos : ");
        console.log(appState.mousePos);
        const res = {
          x: appState.mousePos.x,
          y: appState.mousePos.y,
        };
        appState.dragStart = res;
      }
      // make it half transparent
      // event.target.style.opacity = 0.5;
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (event) {
      if (appState.draggedHandle) {
        console.log("re");
        console.log(appState.draggedHandle);
        // appState.dragEnd = (appState.mousePos.x, appState.mousePos.y);
        appState.draggedHandle.setPosition(
          appState.mousePos.x,
          gl.canvas.height - appState.mousePos.y
        );
        appState.draggedHandle.assignProjectionMatrix();
        console.log(appState.draggedHandle);
        console.log("appState.mousePos : ");
        console.log(appState.mousePos);
        moveObjVertex(appState.draggedHandle, appState.selectedObject);
      }
      appState.draggedHandle = null;
      console.log("ag");
    },
    false
  );

  // Event Listeners for user input
  // Change Polygon Color
  btnUpdateColor.addEventListener("click", () => {
    var R = 0;
    var B = 0;
    var G = 0;
    R = document.getElementById("red").value / 255;
    B = document.getElementById("blue").value / 255;
    G = document.getElementById("green").value / 255;
    appState.selectedObject.setColor(R, G, B, 1);
  });

  // Change Rectangle Side Length
  btnUpdateSquareSideLength.addEventListener("click", updateRectSideLength);

  // Change Line Length
  btnUpdateLineLength.addEventListener("click", updateLineLength);

  // const triangleData = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0]; // in clip space
  const triangleData = [400, 400.0, 400.0, 200.0, 200.0, 400.0]; // in pixel space
  // const triangleData = [0, 0, 200, 0, 0, 200]; // in pixel space
  // const triangleData = [-100, -100, 0, 100, 100, -100]; // in pixel space
  const triangleDataCentered = [-100, -100, 0, 100, 100, -100]; // in pixel space
  const draggerDataCentered = [-10, -10, 0, 10, 10, -10]; // in pixel space
  const triangleDataFromZero = [0, 0, 100, 200, 200, 0]; // in pixel space
  // const triangleData = [100, 100, 200, 300, 300, 100]; // in pixel space

  const lineData = [200.0, 200.0, 500.0, 500.0];
  const rectangleData = [
    100.0,
    100.0,
    500.0,
    100.0,
    100.0,
    500.0,
    100.0,
    500.0,
    500.0,
    100.0,
    500.0,
    500.0,
  ];
  const polygonData = [100.0, 200.0, 200.0, 200.0, 100.0, 100.0, 500.0, 100.0];

  const selectedColor = [0.9, 0.1, 0.1, 1.0];

  const shaderProgram = await initShaderFiles(
    gl,
    "draw-vert.glsl",
    "draw-frag.glsl"
  );

  shaderProgramGlobal = shaderProgram;

  // Converts gl program from using clip space (so... 1.0 is the rightmost placement of the canvas) into the pixel space
  gl.useProgram(shaderProgram);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const u_resolution = gl.getUniformLocation(shaderProgram, "u_resolution");
  gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);

  // Selection Shader Program
  const selectProgram = await initShaderFiles(
    gl,
    "select-vert.glsl",
    "select-frag.glsl"
  );

  // Some... texture stuffs
  // defining texture buffer
  const texBuf = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texBuf);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // defining depth buffer
  const depBuf = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
  function setFrameBufferAttatchmentSizes(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );
  }
  setFrameBufferAttatchmentSizes(gl.canvas.width, gl.canvas.height);

  // defining frame buffer
  const frameBuf = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const lvl = 0;

  // using the texture and depth buffer with frame buffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    texBuf,
    lvl
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depBuf
  );

  // GL object instantiation

  // These should probably be instantly put into an array
  // const glObject = new GLObjectRectangle(1, shaderProgram, gl);
  // glObject.setVertexArray(rectangleData);
  // // glObject.setVertexArray(triangleData);
  // glObject.SetColorByArray([1, 0, 0, 1.0]);
  // glObject.setPosition(0, 0);
  // glObject.setRotation(0);
  // glObject.setScale(1, 1);
  // glObject.centerOriginsSetOffsetAndFixVertices();
  // glObject.assignProjectionMatrix();

  // glObject.bind();
  // glObject.draw();

  const glObject = new GLObjectRectangle(1, shaderProgram, gl);
  // glObject.setVertexArray([100, 100, 200, 200]);
  glObject.setVertexArray(rectangleData);
  glObject.SetColorByArray([1, 0, 0, 0.2]);
  glObject.setPosition(0, 0);
  glObject.setRotation(0);
  glObject.setScale(0.1, 0.1);
  glObject.centerOriginsSetOffsetAndFixVertices();
  glObject.assignProjectionMatrix();

  const glObject2 = new GLObject(4, shaderProgram, gl);
  glObject2.setVertexArray(triangleData);
  // glObject2.setVertexArray(triangleData);
  glObject2.setColor(0.8, 0.1, 0.86, 1.0);
  glObject2.setPosition(0, 0);
  glObject2.setRotation(0);
  glObject2.setScale(1, 1);
  glObject2.centerOriginsSetOffsetAndFixVertices();
  glObject2.assignProjectionMatrix();
  // glObject2.bind();
  // glObject2.draw();
  /*
  const glObject3 = new GLObject(8, shaderProgram, gl);
  glObject3.setVertexArray(triangleDataFromZero);
  // glObject3.setVertexArray(triangleData);
  glObject3.setColor(0.2, 0.3, 0.86, 1.0);
  glObject3.setPosition(0, 0);
  glObject3.setRotation(0);
  glObject3.setScale(1, 1);
  glObject3.centerOriginsSetOffsetAndFixVertices();
  glObject3.assignProjectionMatrix();
  // glObject3.bind();
  */
  // glObject2.bind();

  // var objToBind = 0;
  // var timer = 0;

  // Creates a renderer and renders the previous objects
  const renderer = new Renderer();
  GLobjectList = renderer.objectList;
  console.log("GLobjectList : " + GLobjectList);
  renderer.addObject(glObject);
  // renderer.addObject(glObject2);
  //renderer.addObject(glObject3);
  console.log("GLobjectList : " + GLobjectList);
  renderer.render();

  function render(now) {
    // if (timer > 25) {
    //   // renderer.objectList[objToBind].bind();
    //   // renderer.objectList[objToBind].SetColorByArray([
    //   //   renderer.objectList[objToBind].color[0] + 0.1,
    //   //   renderer.objectList[objToBind].color[1] + 0.1,
    //   //   renderer.objectList[objToBind].color[2] + 0.1,
    //   //   1,
    //   // ]);
    //   objToBind++;
    //   if (objToBind >= renderer.objectList.length) {
    //     objToBind = 0;
    //   }
    //   timer = 0;
    // } else {
    //   timer++;
    // }

    // rotateAllObjects();

    // actual render function here
    // renderer.objectList[0].va[0] += 1;
    // renderer.objectList[0].bind();
    gl.clearColor(0.9, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // drawing texture
    const frameBuffer = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(selectProgram);
    const resolutionPos = gl.getUniformLocation(selectProgram, "u_resolution");
    gl.uniform2f(resolutionPos, gl.canvas.width, gl.canvas.height);
    renderer.renderTex(selectProgram);
    draggerRenderer.renderTex(selectProgram);
    // getting the pixel value
    const pixelX = (appState.mousePos.x * gl.canvas.width) / canvas.clientWidth;
    const pixelY =
      gl.canvas.height -
      (appState.mousePos.y * gl.canvas.height) / canvas.clientHeight -
      1;
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    appState.selId = id;
    showObjId(id, "hov-id");
    // console.log("Id : " + id);
    // recolorSelectedObject(id);

    // console.log(id);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // draw the actual objects
    gl.useProgram(shaderProgram);
    renderer.render();
    draggerRenderer.render();
    requestAnimationFrame(render);
  }

  // rotate the objects
  function rotateAllObjects() {
    renderer.objectList.forEach((element) => {
      element.setRotation(element.rot + 1);
      element.assignProjectionMatrix();
    });
  }

  requestAnimationFrame(render);

  // End of main
}

main();
