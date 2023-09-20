function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-dot');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VSHADER_SOURCE = `
        void main() {
            gl_Position = vec4(0, 0, 0, 1);
            gl_PointSize = 5.0;
        }
    `;

    const FSHADER_SOURCE = `
        void main() {
            gl_FragColor = vec4(0, 1, 0, 1);
        }
    `;

    const vertexShader = initShaders(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = initShaders(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);

    initProgram(gl, vertexShader!, fragmentShader!);
    gl.drawArrays(gl.POINTS, 0, 1);
    console.log(vertexShader, fragmentShader);
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