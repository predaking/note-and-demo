// import math from './math.js';

// const { isPowerOf2 } = math;

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
    video.play().catch(err => console.log('video play err: ', err));

    return video;
}

export {
    copyVideo,
    loadShader,
    loadTexture,
    updateTexture,
    initProgram,
    setupVideo
}