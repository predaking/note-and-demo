function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('gl_canvas-dot');
    const gl = canvas.getContext('webgl');
    console.log('debug: ', gl);
}

export default main;