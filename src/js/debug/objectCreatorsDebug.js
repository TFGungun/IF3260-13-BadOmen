function drawDebugObjects(shaderProgram) {
  const glObject = new GLObjectRectangle(1, shaderProgram, gl);
  glObject.setVertexArray(rectangleData);
  glObject.SetColorByArray([0.96, 0.87, 0.2, 1]);
  glObject.setPosition(50, 100);
  glObject.setRotation(45);
  glObject.setScale(0.7, 0.7);
  glObject.centerOriginsSetOffsetAndFixVertices();
  glObject.assignProjectionMatrix();

  const glObject2 = new GLObjectPolygon(2, shaderProgram, gl);
  glObject2.setVertexArray(triangleData);
  glObject2.setColor(0.8, 0.1, 0.86, 1.0);
  glObject2.setPosition(300, 0);
  glObject2.setRotation(60);
  glObject2.setScale(1.1, 1.1);
  glObject2.centerOriginsSetOffsetAndFixVertices();
  glObject2.assignProjectionMatrix();

  const glObject3 = new GLObjectLine(3, shaderProgram, gl);
  glObject3.setVertexArray([-100, -100, 100, 100]);
  glObject3.SetColorByArray([1, 0, 0, 1]);
  glObject3.setPosition(350, 50);
  glObject3.setRotation(30);
  glObject3.setScale(1, 1);
  glObject3.centerOriginsSetOffsetAndFixVertices();
  glObject3.assignProjectionMatrix();

  const glObject4 = new GLObjectPolygon(4, shaderProgram, gl);
  glObject4.setVertexArray(polygonData);
  glObject4.setColor(0.2, 0.1, 0.86, 1.0);
  glObject4.setPosition(0, 0);
  glObject4.setRotation(0);
  glObject4.setScale(1, 1);
  glObject4.centerOriginsSetOffsetAndFixVertices();
  glObject4.assignProjectionMatrix();

  renderer.addObject(glObject);
  renderer.addObject(glObject2);
  renderer.addObject(glObject3);
  renderer.addObject(glObject4);
}
