/**
 * @description 绘制场景
 * @param {WebGL2RenderingContext} gl 
 * @param {*} programInfo 
 * @param {*} buffers 
 * @param {*} squareRotation
 */
function drawScene(gl, programInfo, buffers, squareRotation) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

    mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [1, 1, 1])

    const count = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        count,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    setColorAttribute(gl, buffers, programInfo);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * @description 
 * @param {WebGL2RenderingContext} gl 
 * @param {*} buffers 
 * @param {*} programInfo 
 */
function setColorAttribute(gl, buffers, programInfo) {
    const count = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        count,
        type,
        normalize,
        stride,
        offset
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };