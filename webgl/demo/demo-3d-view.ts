import { initProgram, initShaders } from "../util";
import Matrix from "../matrix";

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ViewModelMatrix;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ViewModelMatrix * a_Position;
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
    const uViewModelMatrix = gl.getUniformLocation(program, 'u_ViewModelMatrix');

    const data = new Float32Array([
        0, 0.5, -0.4, 0.4, 1.0, 0.4, 
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);

    const FSIZE = data.BYTES_PER_ELEMENT;
    const COUNT = 9;

    initBuffer(gl, data);
        
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(aColor);

    const modelMatrix = new Matrix();
    
    let eyeX = 0.20, eyeY = 0.25, eyeZ = 0.25;
    
    const draw = () => {
        modelMatrix.reset();
        gl.uniformMatrix4fv(uViewModelMatrix, false, modelMatrix.rotate(-10.0, 0, 0, 1).lookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0).elements);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, COUNT);
    }

    draw();

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 37) {
            eyeX += 0.01;
            draw();
        }

        if (e.keyCode === 39) {
            eyeX -= 0.01;
            draw();
        }
    });
}

export default main;
