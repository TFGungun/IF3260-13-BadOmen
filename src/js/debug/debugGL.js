const selectedColor = [0.9, 0.1, 0.1, 1.0];

function recolorSelectedObject(id) {
  // console.log(appState);
  // Recolors the selected object
  if (id >= 0) {
    var selObj = renderer.objectList.find((x) => x.id === id);

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
      var oldSelObj = renderer.objectList.find(
        (x) => x.id === appState.oldPick
      );
      oldSelObj.SetColorByArray(appState.oldPickColor);
    }
  }
}

// rotate the objects
function rotateAllObjects() {
  renderer.objectList.forEach((element) => {
    element.setRotation(element.rot + 1);
    element.assignProjectionMatrix();
  });
}
