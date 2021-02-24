const renderer = new Renderer();
const draggerRenderer = new Renderer();

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
};

let shaderProgramGlobal;

const defClearColor = [0.8, 0.95, 1, 1];
