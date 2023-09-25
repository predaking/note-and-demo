function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-dot');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
        return;
    }

    const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute float g_PointSize;
        void main() {
            gl_Position = a_Position;
            gl_PointSize = g_PointSize;
        }
    `;

    const FSHADER_SOURCE = `
        precision mediump float;
        uniform vec4 u_FragColor;
        void main() {
            gl_FragColor = u_FragColor;
        }
    `;

    const vertexShader = initShaders(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = initShaders(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader!, fragmentShader!);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    const gPointSize = gl.getAttribLocation(program, 'g_PointSize');

    const uFragColor = <WebGLUniformLocation>gl.getUniformLocation(program, 'u_FragColor');

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib3f(aPosition, 0, 0, 0);
    gl.vertexAttrib1f(gPointSize, 3.0);
    gl.uniform3f(uFragColor, 1, 0, 0);

    const points:Array<number> = [];
    let isMoving = false;

    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const handleMove = (e: TouchEvent, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, aPosition: number, uFragColor: WebGLUniformLocation) => {
        if (!isMoving) {
            return;
        }

        const { left, top } = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ((e.touches[0].clientX - left) - (canvas.width / 2)) / (canvas.width / 2);
        const y = ((canvas.height / 2) - (e.touches[0].clientY - top)) / (canvas.height / 2);
        points.push(x, y);

        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < points.length; i += 2) {
            gl.vertexAttrib3f(aPosition, points[i], points[i + 1], 0);
            gl.uniform4f(uFragColor, Math.random(), Math.random(), Math.random(), 1.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };

    canvas.ontouchmove = function(e: TouchEvent) {
        handleMove(e, canvas, gl, aPosition, uFragColor); 
    };

    canvas.ontouchstart = function() { isMoving = true; }
    canvas.ontouchend = function() { isMoving = false; }
}

/**
 * @description initShader
 * @param {WebGLRenderingContext} gl
 */
function initShaders(gl: WebGLRenderingContext, source: string, type: number) {
    const shader = <WebGLShader>gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('compile shader failed: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }

    return shader;
}

/**
 * @description initProgram
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vShader 
 * @param {WebGLShader} fShader 
 */
function initProgram(gl: WebGLRenderingContext, vShader: WebGLShader, fShader: WebGLShader) {
    const program = <WebGLProgram>gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('link program failed: ' + gl.getProgramInfoLog(program));
        return;
    }

    return program;
}

export default main;