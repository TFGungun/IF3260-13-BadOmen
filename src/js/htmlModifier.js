var btnUpdateLineLength = document.getElementById("line-length-btn");
var btnUpdateSquareSideLength = document.getElementById(
  "square-side-length-btn"
);
var btnUpdateColor = document.getElementById("color-update");
var btnExportModel = document.getElementById("export-model-btn");
var btnImportModel = document.getElementById("import-model-btn");

function convertObjectToData(glObject) {
  var data;
  if (glObject instanceof GLObjectLine) {
    data = new LineData();
  } else if (glObject instanceof GLObjectRectangle) {
    data = new RectangleData();
  } else if (glObject instanceof GLObjectPolygon) {
    data = new PolygonData();
  }

  data.setVertexArray(glObject.va);
  data.SetColorByArray(glObject.color);
  data.setPosition(glObject.pos);
  data.setRotation(glObject.rot);
  data.setScale(glObject.scale);
  data.setOrigin(glObject.origin);

  return data;
}
function exportModel() {
  var objectsData = [];

  for (var i = 0; i < renderer.objectList.length; i++) {
    objectsData[i] = convertObjectToData(renderer.objectList[i]);
  }

  var json = JSON.stringify(objectsData);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(json);

  let exportFileDefaultName = "data.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
  //   console.log(json);
}

async function importModel() {
  //testState = true;

  initModelFile(gl, shaderProgramGlobal, "data.json", renderer);
  //   console.log("import succeed");
}

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
    // console.log("xDiff :" + xDiff);
    // console.log("yDiff :" + yDiff);
    // console.log("RAD :" + rad);
    // console.log("SIN :" + sin);
    // console.log("COS :" + cos);
    // console.log("New x :" + parseInt(newLength));

    // Set New Length
    appState.selectedObject.va[2] = pivotX + parseInt(newLength) * cos;
    appState.selectedObject.va[3] = pivotY + parseInt(newLength) * sin;

    // updates draggers
    createDraggers(appState.selectedObject);
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

      // updates draggers
      createDraggers(appState.selectedObject);
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
