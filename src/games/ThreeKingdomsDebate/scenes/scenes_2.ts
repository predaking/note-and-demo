class Scene_2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene_2' });
        console.log('Scene_2: ', this);
    }

    private width = 0;
    private height = 0;
    private matchingText: Phaser.GameObjects.Text | null = null;
    private dots = '';
    private dotTimer = 0;

    private renderIsMatching() {
        this.matchingText = this.add.text(this.width / 2, this.height / 2, '匹配中', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.matchingText.setOrigin(0.5);
    }

    preload() {
        this.width = this.scale.width;
        this.height = this.scale.height;
    }

    create() {
        this.renderIsMatching();
    }

    update(_time: number, _delta: number): void {
        if (this.matchingText) {
            this.dotTimer += _delta;
            if (this.dotTimer >= 300) { // 每500毫秒更新一次点的数量
                this.dotTimer = 0;
                if (this.dots.length >= 3) {
                    this.dots = '';
                } else {
                    this.dots += '.';
                }
                this.matchingText.setText('匹配中' + this.dots);
            }
        }
    }
}

export default Scene_2;