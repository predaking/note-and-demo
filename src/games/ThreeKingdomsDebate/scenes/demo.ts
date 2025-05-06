class Demo extends Phaser.Scene {
    constructor() {
        super('Demo');
        console.log('Demo');
    }

    preload() {
        this.load.setBaseURL('/resource/threeKingdomsDebate/img/')
        this.load.svg('skill', 'skill.svg')
    }

    create() {
        this.add.nineslice(400, 100, 'skill', 0, 100, 50, 50, 40)
    }

    update() {

    }
}

export default Demo;