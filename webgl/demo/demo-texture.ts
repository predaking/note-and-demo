import { initProgram, initShaders } from "../util";

const VERTEX_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

const FRAGMENT_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord) * texture2D(u_Sampler1, v_TexCoord);
        // gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;

/**
 * @description initBuffer
 * @param {WebGLRenderingContext} gl 
 */
function initBuffer(gl: WebGLRenderingContext, data: Float32Array) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

/**
 * @description initTexture
 * @param {WebGLRenderingContext} gl 
 */
function initTexture(gl: WebGLRenderingContext, program: WebGLProgram) {
    const texture = gl.createTexture();
    const texture1 = gl.createTexture();
    const uSampler = gl.getUniformLocation(program, 'u_Sampler');
    const uSampler1 = gl.getUniformLocation(program, 'u_Sampler1');

    let unit = false;
    let unit1 = false;

    const loadTexture = (image: TexImageSource) => {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.activeTexture(unit ? gl.TEXTURE0 : gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, unit ? texture : texture1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(unit ? uSampler : uSampler1, unit ? 0 : 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        unit && unit1 && gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    const image = new Image();
    const image1 = new Image();

    image.onload = () => {
        unit = true;
        loadTexture(image);
    }

    image1.onload = () => {
        unit1 = true;
        loadTexture(image1);
    }

    image1.src = '../../assets/books.jpg';
    image.src = '../../assets/titter.gif';
}

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-texture');

    const gl = <WebGLRenderingContext>canvas.getContext('webgl');

    if (!gl) {
        console.error('not support webgl');
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = <WebGLShader>initShaders(gl, VERTEX_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = <WebGLShader>initShaders(gl, FRAGMENT_SOURCE, gl.FRAGMENT_SHADER);

    const program = <WebGLProgram>initProgram(gl, vertexShader, fragmentShader);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    const aTexCoord = gl.getAttribLocation(program, 'a_TexCoord');

    const data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0, 
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    const FSIZE = data.BYTES_PER_ELEMENT;

    initBuffer(gl, data);
        
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(aTexCoord);

    initTexture(gl, program);
}

export default main;
