import { initPositionBuffer } from './init-buffers.js';
import { drawScene } from './draw-scene.js';

/**
 * @description 创建&加载&编译 shader
 * @param { WebGLRenderingContext } gl 
 * @param {*} type 
 * @param {*} source 
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('compile error: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }

    return shader;
}

/**
 * @description 创建着色器程序
 * @param { WebGLRenderingContext } gl 
 * @param {*} vSource 
 * @param {*} fSource 
 */
function initProgram(gl, vSource, fSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('link error: ' + gl.getProgramInfoLog(shaderProgram));
        gl.deleteProgram(shaderProgram);
        return;
    }

    return shaderProgram;
}

function main() {
    /** @type { HTMLCanvasElement } */
    const canvas = document.querySelector('#gl_canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('不支持webgl');
        return;
    }

    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = document.getElementById('vertex-shader').text;
    const fragmentShaderSource = document.getElementById('fragment-shader').text;

    const program = initProgram(gl, vertexShaderSource, fragmentShaderSource);

    const programInfo = {
        program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(program, 'aVertexColor')
        },
        uniformLocations: {
            modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix')
        }
    };

    const buffers = initPositionBuffer(gl);
    let squareRotation = 0.0;
    let deltaTime = 0;
    let then = 0;

    function render(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, squareRotation);

        squareRotation += deltaTime;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();