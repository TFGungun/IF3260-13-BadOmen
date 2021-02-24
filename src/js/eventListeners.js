// Adds an event listener to the canvas to get the current mouse position
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
      if (clickedGLObject && clickedGLObject.id < baseDraggerId) {
        appState.selectedObject = clickedGLObject;
        createDraggers(clickedGLObject);
      } else {
        appState.selectedObject = null;
        createDraggers(clickedGLObject);
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
    if (clickedGLObject && clickedGLObject.id >= baseDraggerId) {
      appState.draggedHandle = clickedGLObject;
    } else {
      appState.draggedHandle = null;
    }
  },
  false
);

canvas.addEventListener(
  "mouseup",
  function (event) {
    if (appState.draggedHandle) {
      appState.draggedHandle.setPosition(
        appState.mousePos.x,
        gl.canvas.height - appState.mousePos.y
      );
      appState.draggedHandle.assignProjectionMatrix();
      moveObjVertex(appState.draggedHandle, appState.selectedObject);
    }
    appState.draggedHandle = null;
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

// Export & Import Model
btnExportModel.addEventListener("click", exportModel);
btnImportModel.addEventListener("click", importModel);
