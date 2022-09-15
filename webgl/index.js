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
        0, 150,
        150, 0,
        0, 0
    ]), gl.STATIC_DRAW);
}

function main() {
    /**
     * 初始化部分
     */
    var canvas = document.querySelector('#gl_canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        alert('不支持webgl');
    }
    
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    var matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
    
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setGeometry(gl);
            
    var translation = [0, 0];
    var angleInRadians = 0;
    var scale = [1, 1];

    drawScene();

    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
          translation[index] = ui.value;
          drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        /**
         * 渲染部分
         */
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
        // 从缓冲中读取数据
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);
    
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}

main();

