import drawVideoTexture from './demo/demo-video-texture';
import drawDot from './demo/demo-dot';
import drawShape from './demo/demo-shape';

const webgl = {
    main() {
        drawVideoTexture();
        drawDot();
        drawShape();
    }
}

export default webgl;

