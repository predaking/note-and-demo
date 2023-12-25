import { initProgram, initShaders } from "../util";
import Matrix from "../matrix";
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
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-3d-cube');

    const gl = <WebGLRenderingContext>canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
    }

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = <WebGLShader>initShaders(gl, VERTEX_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = <WebGLShader>initShaders(gl, FRAGMENT_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader, fragmentShader);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    const aColor = gl.getAttribLocation(program, 'a_Color');

    const uModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const uViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    const uProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');

    const data = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 
    ]);

    const data2 = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
    ]);

    const colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,
    ]);

    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5
    ]);

    const indices2 = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    const FSIZE = data.BYTES_PER_ELEMENT;
    const COUNT = indices.length;

    const FSIZE2 = data2.BYTES_PER_ELEMENT;
    const COUNT2 = indices2.length;

    initBuffer(gl, data2);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    initBuffer(gl, colors);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // const indexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const indexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices2, gl.STATIC_DRAW);

    const modelMatrix = new Matrix();
    const viewMatrix = new Matrix();
    const projMatrix = new Matrix();
    
    let _modelMatrix = modelMatrix.setTranslate(0.75, 0, 0).elements;
    let angle = 360;
    const _viewMatrix = viewMatrix.setLookAt(3, 5, 7, 0, 0, 0, 0, 1, 0).elements;
    const _projMatrix = projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100).elements;
    
    const draw = () => {
        requestAnimationFrame(draw);
        if (angle < 0) {
            angle = 360;
        }
        _modelMatrix = modelMatrix.rotate(angle--, 0, 1, 0).elements;
        
        gl.uniformMatrix4fv(uModelMatrix, false, _modelMatrix);
        gl.uniformMatrix4fv(uViewMatrix, false, _viewMatrix);
        gl.uniformMatrix4fv(uProjMatrix, false, _projMatrix);

        // console.table(convertTo2DArray(_modelMatrix));
        // console.table(convertTo2DArray(_viewMatrix));
        // console.table(convertTo2DArray(_projMatrix));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, COUNT2, gl.UNSIGNED_BYTE, 0);
    }

    draw();
}

export default main;
