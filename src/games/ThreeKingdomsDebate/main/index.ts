import Phaser from 'phaser';
import Scene_1 from '../scenes/scenes_1';

const preload = function () {

}

const create = function () {

}

const update = function () {

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: [Scene_1],
}

const game = new Phaser.Game(config);

export default game;
