import { initProgram, initShaders } from "../util";
import { Matrix } from "../matrix";

const VERTEX_SOURCE = `
    varying vec3 v_Position;
    varying vec3 v_Normal;
    varying vec4 v_Color;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    attribute vec4 a_Position;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ModelMatrix;
    
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        v_Position = vec3(u_ModelMatrix * a_Position);
        v_Color = a_Color;
    }
`;

const FRAGMENT_SOURCE = `
    precision mediump float;
    varying vec3 v_Position;
    varying vec3 v_Normal;
    varying vec4 v_Color;
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;

    void main() {
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_Position);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
        vec3 ambient = u_AmbientLight * v_Color.rgb;
        gl_FragColor = vec4(diffuse + ambient, v_Color.a);
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

let ANGLE_STEP = 3.0;
let g_arm1Angle = 90.0;
let g_joint1Angle = 0.0;

let g_modelMatrix = new Matrix();
let g_mvpMatrix = new Matrix();

let g_normalMatrix = new Matrix();

function drawBox(gl: WebGLRenderingContext, n: number, viewProMatrix: Matrix, uMvpMatrix: Matrix, uNormalMatrix: Matrix) {
    g_mvpMatrix.set(viewProMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(uMvpMatrix, false, g_modelMatrix.elements);

    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(uNormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function draw(gl: WebGLRenderingContext, n: number, viewProMatrix: Matrix, uMvpMatrix: Matrix, uNormalMatrix: Matrix) {
    let arm1Length = 10.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, viewProMatrix, uMvpMatrix, uNormalMatrix);

    g_modelMatrix.translate(0.0, arm1Length, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    g_modelMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, viewProMatrix, uMvpMatrix, uNormalMatrix);
}

function keydown(e: KeyboardEvent, gl: WebGLRenderingContext, n: number, viewProMatrix: Matrix, uMvpMatrix: Matrix, uNormalMatrix: Matrix) {
    switch (e.keyCode) {
        case 38: 
            if (g_joint1Angle < 135) {
                g_joint1Angle += ANGLE_STEP;
            }
            break;
        case 40:
            if (g_joint1Angle > -135) {
                g_joint1Angle -= ANGLE_STEP;
            }
            break;
        case 39:
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 37:
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        default: return;
    }

    draw(gl, n, viewProMatrix, uMvpMatrix, uNormalMatrix);
}

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-3d-layer-model');

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
    const aNormal = gl.getAttribLocation(program, 'a_Normal');

    const uNormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    const uModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const uLightColor = gl.getUniformLocation(program, 'u_LightColor');
    const uLightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    const uAmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    const uMvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');

    const data = new Float32Array([
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
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    const normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 
    ])

    const FSIZE = data.BYTES_PER_ELEMENT;
    const COUNT = indices.length;

    initBuffer(gl, normals);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);

    initBuffer(gl, data);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    initBuffer(gl, colors);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const modelMatrix = new Matrix();
    const mvpMatrix = new Matrix();
    const normalMatrix = new Matrix();
    const _mvpMatrix = new Matrix();
    
    modelMatrix.setRotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements);

    let angle = 360;

    const viewProjMatrix = new Matrix();
    viewProjMatrix.setPerspective(50, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(20, 10, 30, 0, 0, 0, 0, 1, 0);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.elements);
    
    // const draw = () => {
    //     gl.uniform3f(uLightColor, 1.0, 1.0, 1.0);
    //     gl.uniform3f(uLightPosition, -4.0, 0.0, 5.0);
    //     gl.uniform3f(uAmbientLight, 0.2, 0.2, 0.2);

    //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //     gl.drawElements(gl.TRIANGLES, COUNT, gl.UNSIGNED_BYTE, 0);

    //     if (angle < 0) {
    //         angle = 360;
    //     }

    //     modelMatrix.setRotate(angle--, 0, 1, 0);
    //     _mvpMatrix.set(mvpMatrix)?.multiply(modelMatrix);
    //     gl.uniformMatrix4fv(uMvpMatrix, false, _mvpMatrix.elements);
    //     gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements);

    //     normalMatrix.setInverseOf(modelMatrix);
    //     normalMatrix.transpose();
    //     gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.elements);

    //     requestAnimationFrame(draw);
    // }

    document.onkeydown = function (e: KeyboardEvent) {
        keydown(e, gl, COUNT, viewProjMatrix, uMvpMatrix, uNormalMatrix);
    }

    draw(gl, COUNT, viewProjMatrix, uMvpMatrix, uNormalMatrix);
}

export default main;

