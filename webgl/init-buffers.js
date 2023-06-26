/**
 * @description 初始化缓存
 * @param {WebGL2RenderingContext} gl 
 */
function initPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1, 1, 1, -1, -1, 1, -1, -1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer
    };
}

export { initPositionBuffer };