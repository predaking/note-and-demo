import { initProgram, initShaders } from "../util";

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

const FRAGMENT_SOURCE = `
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;

/**
 * @description initBuffer
 * @param {WebGLRenderingContext} gl 
 */
function initBuffer(gl: WebGLRenderingContext) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.5, 0.5, 0.0, 0.5, 0.5]), gl.STATIC_DRAW);
    return buffer;
}

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-shape');

    const gl = <WebGLRenderingContext>canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = <WebGLShader>initShaders(gl, VERTEX_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = <WebGLShader>initShaders(gl, FRAGMENT_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader, fragmentShader);

    const aPosition = gl.getAttribLocation(program, 'a_Position');

    initBuffer(gl);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

export default main;
