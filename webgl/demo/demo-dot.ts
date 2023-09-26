import { initShaders, initProgram } from "../util";

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

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-dot');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
        return;
    }

    const vertexShader = initShaders(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = initShaders(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader!, fragmentShader!);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    const gPointSize = gl.getAttribLocation(program, 'g_PointSize');

    const uFragColor = <WebGLUniformLocation>gl.getUniformLocation(program, 'u_FragColor');

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib3f(aPosition, 0, 0, 0);
    gl.vertexAttrib1f(gPointSize, 10.0);
    gl.uniform3f(uFragColor, 1, 0, 0);

    const points: Array<number> = [];
    let isMoving = false;

    const handleMove = (e: MouseEvent, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, aPosition: number, uFragColor: WebGLUniformLocation) => {
        if (!isMoving) {
            return;
        }

        // 要想精确计算出光标所在位置，必须指定canvas元素的css宽高（非属性宽高）
        const { left, top } = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ((e.clientX - left) - (canvas.width / 2)) / (canvas.width / 2);
        const y = ((canvas.height / 2) - (e.clientY - top)) / (canvas.height / 2);
        points.push(x, y);

        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < points.length; i += 2) {
            gl.vertexAttrib3f(aPosition, points[i], points[i + 1], 0);
            gl.uniform4f(uFragColor, Math.random(), Math.random(), Math.random(), 1.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };

    canvas.onmousemove = (e: MouseEvent) => {
        handleMove(e, canvas, gl, aPosition, uFragColor);
    };

    canvas.onmousedown = function () { isMoving = true; }
    canvas.onmouseup = function () { isMoving = false; }
}

export default main;