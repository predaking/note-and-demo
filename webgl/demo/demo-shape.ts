import { initProgram, initShaders } from "../util";

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`

const FRAGMENT_SOURCE = `
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`

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
    gl.vertexAttrib3f(aPosition, 0, 0, 0);

    gl.drawArrays(gl.POINTS, 0, 1);
}

export default main;
