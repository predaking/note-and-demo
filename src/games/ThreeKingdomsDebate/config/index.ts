import Phaser from 'phaser';
import Scene_1 from '../scenes/scenes_1';
import Scene_2 from '../scenes/scenes_2';
import Scene_3 from '../scenes/scenes_3';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    parent: 'game',
    // scene: [Scene_1, Scene_2, Scene_3],
    scene: [Scene_2]
}

export default config;
