"use strict";

/**
 * @description 创建着色器
 * @param {*} gl webgl上下文
 * @param {*} type 着色器类型（顶点or片段）
 * @param {*} source 数据源
 */
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // 成功编译完将着色器实例返回
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * @description 创建着色程序链接着色器
 * @param {*} gl 
 * @param {*} vertexShader 
 * @param {*} fragmentShader 
 */
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

function setGeometry(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        0, 300,
        400, 0,
        400, 0,
        0, 300,
        400, 300
    ]), gl.STATIC_DRAW);
}

function setColors(gl) {
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    //     Math.random(), Math.random(), Math.random(), 255,
    //     Math.random(), Math.random(), Math.random(), 255,
    //     Math.random(), Math.random(), Math.random(), 255,
    //     Math.random(), Math.random(), Math.random(), 255,
    //     Math.random(), Math.random(), Math.random(), 255,
    //     Math.random(), Math.random(), Math.random(), 255,
    // ]), gl.STATIC_DRAW);
    // 设置两个随机颜色
    var r1 = Math.random() * 256; // 0 到 255.99999 之间
    var b1 = Math.random() * 256; // 这些数据
    var g1 = Math.random() * 256; // 在存入缓冲时
    var r2 = Math.random() * 256; // 将被截取成
    var b2 = Math.random() * 256; // Uint8Array 类型
    var g2 = Math.random() * 256;

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array(   // Uint8Array
            [r1, b1, g1, 255,
                r1, b1, g1, 255,
                r1, b1, g1, 255,
                r2, b2, g2, 255,
                r2, b2, g2, 255,
                r2, b2, g2, 255]),
        gl.STATIC_DRAW);
}

function main(image) {
    /**
     * 初始化部分
     */
    var canvas = document.querySelector('#gl_canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        alert('不支持webgl');
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    var positionLocation = gl.getAttribLocation(program, "a_position");

    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texCoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texCoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function renderImage() {
    const image = new Image();
    image.src = '//192.168.1.12:8080/assets/yaodaoji.png';
    image.onload = function () {
        console.log('loaded');
        main(image);
    };
    image.onerror = function (err) {
        console.log('err: ', err);
    }
}

function drawScene() {
    var canvas = document.querySelector('#gl_canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        alert('不支持webgl');
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    var positionLocation = gl.getAttribLocation(program, "a_position");

    gl.enableVertexAttribArray(positionLocation);

    var positionBuffer = createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var translation = [0, 0];
    var width = 100;
    var height = 30;
    var color = [Math.random(), Math.random(), Math.random(), 1];

    setRectangle(gl, translation[0], translation[1], width, height);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0; 
    var offset = 0;

    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
}

// main();
renderImage();