import Phaser from 'phaser';
import Scene_1 from '../scenes/scenes_1';
import Scene_2 from '../scenes/scenes_2';
import Scene_3 from '../scenes/scenes_3';
import Demo from '../scenes/demo';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth - 40,
    height:  (window.innerWidth - 40) * 3 / 4,
    parent: 'game',
    // scene: [Scene_1, Scene_2, Scene_3],
    // scene: [Scene_2],
    scene: [Demo],
}

export default config;
