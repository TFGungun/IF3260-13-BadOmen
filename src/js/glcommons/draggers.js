const baseDraggerId = 1000000;

let draggedObjectInvProjMat = [];

function getClickedDragger() {
  const id = appState.selId;
  return draggerRenderer.objectList.find((x) => x.id === id);
}

function createDraggers(obj) {
  // draggers.clear();
  draggerRenderer.clearObjList();
  let tempUniqVertList = [];

  if (obj) {
    draggedObjectInvProjMat = getMatrixInverse(obj.projectionMat, 3);
    for (let index = 0; index < obj.va.length / 2; index++) {
      let prevDupVertId = -1;
      for (let i = 0; i < tempUniqVertList.length; i++) {
        if (
          tempUniqVertList[i][0] === obj.va[index * 2] &&
          tempUniqVertList[i][1] === obj.va[index * 2 + 1]
        ) {
          prevDupVertId = i;
        }
      }
      // if there were no duplicates, make a new dragger
      if (prevDupVertId === -1) {
        var neoDragger = new GLObjectDragger(
          baseDraggerId + tempUniqVertList.length,
          shaderProgramGlobal,
          gl
        );
        neoDragger.addVertexId(index);

        const up = obj.va[index * 2];
        const vp = obj.va[index * 2 + 1];
        const vertPosMat = [1, 0, 0, 0, 1, 0, up, vp, 1];

        // const neoPosMat = multiplyMatrix(obj.projectionMat, vertPosMat, 3);
        const neoPosMat = multiplyMatrix(vertPosMat, obj.projectionMat, 3);

        // neoDragger.setPosition(obj.va[index * 2], obj.va[index * 2 + 1]);
        neoDragger.setPosition(neoPosMat[6], neoPosMat[7]);
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
}

function moveObjVertex(draggerObj, obj) {
  let oldObjVertex = obj.va;
  const objProjMat = obj.projectionMat;

  for (let index = 0; index < draggerObj.vertId.length; index++) {
    const up = draggerObj.pos[0];
    const vp = draggerObj.pos[1];
    const neoPosMat = [1, 0, 0, 0, 1, 0, up, vp, 1];
    const neoVertMat = multiplyMatrix(neoPosMat, draggedObjectInvProjMat, 3);
    //
    oldObjVertex[draggerObj.vertId[index] * 2] = neoVertMat[6];
    oldObjVertex[draggerObj.vertId[index] * 2 + 1] = neoVertMat[7];
  }
  obj.setVertexArray(oldObjVertex);
}
