/**
 * @description initShader
 * @param {WebGLRenderingContext} gl
 */
function initShaders(gl: WebGLRenderingContext, source: string, type: number) {
    const shader = <WebGLShader>gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('compile shader failed: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }

    return shader;
}

/**
 * @description initProgram
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vShader 
 * @param {WebGLShader} fShader 
 */
function initProgram(gl: WebGLRenderingContext, vShader: WebGLShader, fShader: WebGLShader) {
    const program = <WebGLProgram>gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('link program failed: ' + gl.getProgramInfoLog(program));
        return;
    }

    return program;
}

export {
    initShaders,
    initProgram
}