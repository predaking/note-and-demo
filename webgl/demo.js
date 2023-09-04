import { initPositionBuffer } from './init-buffers.js';
import { drawScene } from './draw-scene.js';
import util from './math.js';

const { isPowerOf2 } = util;

let copyVideo = false;

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
 * @description 加载纹理
 * @param {WebGL2RenderingContext} gl 
 * @param {string} url 
 */
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);

    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // const image = new Image();
    // image.crossOrigin = '';
    // image.onload = () => {
    //     console.log('load');
    //     gl.bindTexture(gl.TEXTURE_2D, texture);
    //     gl.texImage2D(
    //         gl.TEXTURE_2D,
    //         level,
    //         internalFormat,
    //         srcFormat,
    //         srcType,
    //         image
    //     );

    //     if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    //         gl.generateMipmap(gl.TEXTURE_2D);
    //     } else {
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //     }
    // }
    // image.src = url;

    return texture;
}

function updateTexture(gl, texture, video) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        video,
    );
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

function setupVideo(url) {
    const video = document.createElement('video');

    let playing = false;
    let timeupdate = false;

    video.playsInline = true; // 是都允许小窗内播放
    video.muted = true; // 是否应静音
    video.loop = true;

    video.addEventListener('playing', () => {
        playing = true;
        checkReady();
    }, true);

    video.addEventListener('timeupdate', () => {
        timeupdate = true;
        checkReady();
    }, true);

    function checkReady() {
        if (playing && timeupdate) {
            copyVideo = true;
        }
    }

    video.src = url;
    video.play();

    return video;
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
            normalPosition: gl.getAttribLocation(program, 'aNormalPosition'),
            textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
        },
        uniformLocations: {
            normalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
            modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            uSampler: gl.getUniformLocation(program, 'uSampler'),
        }
    };

    const buffers = initPositionBuffer(gl);
    // const texture = loadTexture(gl, 'assets/demo.jpg');
    const texture = loadTexture(gl);
    const video = setupVideo("assets/video/demo.mp4");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let cubeRotation = 0.0;
    let deltaTime = 0;
    let then = 0;

    function render(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        if (copyVideo) {
            updateTexture(gl, texture, video);
        }

        drawScene(gl, programInfo, buffers, texture, cubeRotation);

        cubeRotation += deltaTime;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();