import Phaser from 'phaser';
import Scene_1 from '../scenes/scenes_1';
import Scene_2 from '../scenes/scenes_2';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: [Scene_1, Scene_2],
}

export default config;
