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
        void main() {
            gl_FragColor = vec4(0, 1, 0, 1);
        }
    `;

    const vertexShader = initShaders(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = initShaders(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader!, fragmentShader!);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    const gPointSize = gl.getAttribLocation(program, 'g_PointSize');

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib3f(aPosition, 0, 0, 0);
    gl.vertexAttrib1f(gPointSize, 10.0);

    const points:Array<number> = [];
    
    const handleClick = (e: MouseEvent, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, aPosition: number) => {
        const { left, top } = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ((e.clientX - left) - (canvas.width / 2)) / (canvas.width / 2);
        const y = ((canvas.height / 2) - (e.clientY - top)) / (canvas.height / 2);
        points.push(x, y);

        console.log('e: ', x, y);

        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < points.length; i += 2) {
            gl.vertexAttrib3f(aPosition, points[i], points[i + 1], 0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };

    canvas.onmousedown = function(e: MouseEvent) { 
        handleClick(e, canvas, gl, aPosition); 
    };
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