import { initProgram, initShaders } from "../util";
import { Matrix } from "../matrix";
import math from "../math";

const { convertTo2DArray } = math;

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-3d-view');

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
    const aColor = gl.getAttribLocation(program, 'a_Color');

    const uModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const uViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    const uProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');

    const data = new Float32Array([
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, 
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);

    const FSIZE = data.BYTES_PER_ELEMENT;
    const COUNT = 9;

    initBuffer(gl, data);
        
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(aColor);

    const modelMatrix = new Matrix();
    const viewMatrix = new Matrix();
    const projMatrix = new Matrix();
    
    let g_near = 0.00, g_far = 0.50;

    const _modelMatrix = modelMatrix.setTranslate(0.75, 0, 0).elements;
    const _viewMatrix = viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0).elements;
    const _projMatrix = projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100).elements;
    
    const draw = () => {
        gl.uniformMatrix4fv(uModelMatrix, false, _modelMatrix);
        gl.uniformMatrix4fv(uViewMatrix, false, _viewMatrix);
        gl.uniformMatrix4fv(uProjMatrix, false, _projMatrix);

        console.table(convertTo2DArray(_modelMatrix));
        console.table(convertTo2DArray(_viewMatrix));
        console.table(convertTo2DArray(_projMatrix));

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, COUNT);
        gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.setTranslate(-0.75, 0, 0).elements);
        gl.drawArrays(gl.TRIANGLES, 0, COUNT);
    }

    draw();

    // document.addEventListener('keydown', (e) => {
    //     if (e.keyCode === 37) {
    //         g_near -= 0.01;
    //         draw();
    //     }

    //     if (e.keyCode === 39) {
    //         g_near += 0.01;
    //         draw();
    //     }

    //     if (e.keyCode === 38) {
    //         g_far += 0.01;
    //         draw();
    //     }

    //     if (e.keyCode === 40) {
    //         g_far -= 0.01;
    //         draw();
    //     }
    // });
}

export default main;
