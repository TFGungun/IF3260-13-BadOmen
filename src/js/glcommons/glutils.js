function getClickedGLObject() {
  const id = appState.selId;
  showObjId(id, "sel-id");
  return renderer.objectList.find((x) => x.id === id);
}
