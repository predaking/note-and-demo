import { initProgram, initShaders } from "../util";
import Matrix from "../matrix";

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_Transition;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        v_Color = a_Color;
    }
`;

const FRAGMENT_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

/**
 * @description initBuffer
 * @param {WebGLRenderingContext} gl 
 */
function initBuffer(gl: WebGLRenderingContext, data: Float32Array) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
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
    const aPointSize = gl.getAttribLocation(program, 'a_PointSize');
    const aColor = gl.getAttribLocation(program, 'a_Color');
    const uTransition = gl.getUniformLocation(program, 'u_Transition');

    const data = new Float32Array([
        0, 0.5, 10.0, 1.0, 0.0, 0.0, 
        0.5, 0, 20.0, 0.0, 1.0, 0.0,
        0, 0, 30.0, 0.0, 0.0, 1.0
    ]);
    const FSIZE = data.BYTES_PER_ELEMENT;

    initBuffer(gl, data);
        
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(aPointSize);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(aColor);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    let timer = 0;
    let angle = 0;

    const animate = () => {
        if (angle === 360) {
            angle = 0;
        }

        const matrix = new Matrix();

        // gl.uniformMatrix4fv(uTransition, false, matrix.translate(translateX, 0, 0).elements);
        gl.uniformMatrix4fv(uTransition, false, matrix.rotate(angle, 0, 0, 1).elements);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        angle += 0.5;
        matrix.reset();

        timer = requestAnimationFrame(animate);
    }

    // timer = requestAnimationFrame(animate);
}

export default main;
