/**
 * @description 初始化缓存
 * @param {WebGL2RenderingContext} gl 
 */
function initPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer = initColorBuffer(gl);

    return {
        color: colorBuffer,
        position: positionBuffer
    };
}

/**
 * @description 初始化颜色
 * @param {WebGL2RenderingContext} gl 
 */
function initColorBuffer(gl) {
    const color = [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0];
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    return colorBuffer;
}

export { initPositionBuffer };