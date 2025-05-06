import { initPositionBuffer } from '../init-buffers';
import { drawScene } from '../draw-scene';
import { 
    copyVideo,
    initProgram,
    loadTexture,
    updateTexture,
    setupVideo
} from '../util-old';

function main() {
    /** @type { HTMLCanvasElement } */
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#gl_canvas-video-texture');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('不支持webgl');
        return;
    }

    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = (document.getElementById('vertex-shader') as HTMLScriptElement).text;
    const fragmentShaderSource = (document.getElementById('fragment-shader') as HTMLScriptElement).text;

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
    // const texture = loadTexture(gl, 'resource/demo.jpg');
    const texture = loadTexture(gl);
    const video = setupVideo("resource/video/demo.mp4");
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

export default main;