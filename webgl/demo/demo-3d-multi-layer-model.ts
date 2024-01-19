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
        vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7) - v_Position);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = vec3(1.0, 1.0, 1.0) * vec3(v_Color) * nDotL;
        vec3 ambient = vec3(0.2, 0.2, 0.2) * v_Color.rgb;
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

let g_matrixStack: Matrix[] = [];
function pushMatrix (mt: Matrix) {
    const _mt = new Matrix(mt);
    g_matrixStack.push(_mt);
}

function popMatrix (): Matrix {
    return g_matrixStack.pop() as Matrix;
}

let ANGLE_STEP = 3.0;
let g_arm1Angle = 90.0;
let g_joint1Angle = 45.0;
let g_joint2Angle = 0.0;
let g_joint3Angle = 0.0;

let g_modelMatrix = new Matrix();
let g_mvpMatrix = new Matrix();

let g_normalMatrix = new Matrix();

function drawBox(
    gl: WebGLRenderingContext, 
    n: number, 
    width: number,
    height: number,
    depth: number,
    viewProMatrix: Matrix, 
    uMvpMatrix: Matrix, 
    uNormalMatrix: Matrix
) {
    pushMatrix(g_modelMatrix);
    const base = Math.sqrt(width * width + height * height + depth * depth);
    g_modelMatrix.scale(width / base, height / base, depth / base);
    g_mvpMatrix.set(viewProMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(uMvpMatrix, false, g_mvpMatrix.elements);

    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(uNormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix();
}

function draw(gl: WebGLRenderingContext, n: number, viewProMatrix: Matrix, uMvpMatrix: Matrix, uNormalMatrix: Matrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    // g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProMatrix, uMvpMatrix, uNormalMatrix);
    
    let arm1Length = 10.0;
    g_modelMatrix.translate(0.0, baseHeight, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    // g_modelMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProMatrix, uMvpMatrix, uNormalMatrix);

    let arm2Length = 10.0;
    g_modelMatrix.translate(0.0, arm1Length, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    // g_modelMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProMatrix, uMvpMatrix, uNormalMatrix);

    let palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0);
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProMatrix, uMvpMatrix, uNormalMatrix);

    g_modelMatrix.translate(0.0, palmLength, 0.0);

    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProMatrix, uMvpMatrix, uNormalMatrix);
    g_modelMatrix = popMatrix();

    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProMatrix, uMvpMatrix, uNormalMatrix);
}

function keydown(e: KeyboardEvent, gl: WebGLRenderingContext, n: number, viewProMatrix: Matrix, uMvpMatrix: Matrix, uNormalMatrix: Matrix) {
    switch (e.keyCode) {
        case 40: 
            if (g_joint1Angle < 135) {
                g_joint1Angle += ANGLE_STEP;
            }
            break;
        case 38:
            if (g_joint1Angle > -135) {
                g_joint1Angle -= ANGLE_STEP;
            }
            break;
        case 90:
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case 88:
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case 86:
            if (g_joint3Angle < 60) {
                g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
            }
            break;
        case 67:
            if (g_joint3Angle > -60) {
                g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
            }
            break;
        case 37:
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 39:
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        default: return;
    }

    draw(gl, n, viewProMatrix, uMvpMatrix, uNormalMatrix);
}

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-3d-multi-layer-model');

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

    // const data = new Float32Array([
    //     1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    //     1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
    //     1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    //     -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
    //     -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
    //     1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
    // ]);

    const data = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
       -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
       -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
    ])

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

    const viewProjMatrix = new Matrix();
    viewProjMatrix.setPerspective(50, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(20, 10, 30, 0, 0, 0, 0, 1, 0);

    document.onkeydown = function (e: KeyboardEvent) {
        keydown(e, gl, COUNT, viewProjMatrix, uMvpMatrix as Matrix, uNormalMatrix as Matrix);
    }

    draw(gl, COUNT, viewProjMatrix, uMvpMatrix as Matrix, uNormalMatrix as Matrix);
}

export default main;



