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
