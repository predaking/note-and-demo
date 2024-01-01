import { initProgram, initShaders } from "../util";
import { Matrix, Vector3 } from "../matrix";
import math from "../math";

const { convertTo2DArray } = math;

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform vec4 u_NormalMatrix;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    uniform vec3 u_LightDirection;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        vec4 vertexPosition = u_ModelMatrix * a_Position;
        vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
        float nDotL = max(dot(u_LightDirection, normal), 0.0);
        vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
        vec3 ambient = u_AmbientLight * a_Color.rgb;
        v_Color = vec4(diffuse + ambient, a_Color.a);
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
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-3d-light');

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
    const uViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    const uProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const uLightColor = gl.getUniformLocation(program, 'u_LightColor');
    const uLightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    const uAmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    const uLightDirection = gl.getUniformLocation(program, 'u_LightDirection');

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
    const viewMatrix = new Matrix();
    const projMatrix = new Matrix();
    const normalMatrix = new Matrix();
    
    // modelMatrix.setTranslate(0, 1, 0);
    modelMatrix.setRotate(90, 0, 1, 0);
    // modelMatrix.rotate(0, 0, 0, 1);
    let angle = 360;
    viewMatrix.setLookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    
    const draw = () => {
        requestAnimationFrame(draw);
        if (angle < 0) {
            angle = 360;
        }
        modelMatrix.rotate(angle--, 0, 1, 0);
        
        gl.uniform3f(uLightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(uLightPosition, 2.3, 4.0, 3.5);
        gl.uniform3f(uAmbientLight, 0.2, 0.2, 0.2);
        const lightDirection = new Vector3([0.5, 3.0, 4.0]);
        lightDirection.normalize();
        gl.uniform3fv(uLightDirection, lightDirection.elements);
        gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(uProjMatrix, false, projMatrix.elements);
        gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.elements);

        // console.table(convertTo2DArray(_modelMatrix));
        // console.table(convertTo2DArray(_viewMatrix));
        // console.table(convertTo2DArray(_projMatrix));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, COUNT, gl.UNSIGNED_BYTE, 0);
    }

    draw();
}

export default main;

