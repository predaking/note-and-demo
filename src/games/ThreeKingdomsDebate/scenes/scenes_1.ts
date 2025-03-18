class Scene_1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene_1' });
        console.log('Scene_1: ', this);
    }

    private width = 0;
    private height = 0;

    private renderBtn() {
        const container = this.add.container(this.width / 2, this.height / 2);
        const graphics = this.add.graphics();

        const x = -100;
        const y = -30;
        const width = 200;
        const height = 60;
        const radius = 10;

        const setStyle = (isActive?: boolean) => {  
            // 添加阴影效果
            graphics.fillStyle(0xFFA000, 1);
            graphics.fillRoundedRect(x + 2, y + 2, width, height, radius);

            if (isActive) {
                // 按下状态的按钮效果
                graphics.fillStyle(0xFFC107, 0.7);
                graphics.fillRoundedRect(-100, -30, 200, 60, 10);
            } else {
                // 底层颜色
                graphics.fillStyle(0xFFB300);
                graphics.fillRoundedRect(x, y, width, height, radius);
                
                // 顶层渐变
                graphics.fillStyle(0xFFC107, 0.5);
                graphics.fillRoundedRect(x, y, width, height, radius);

                // 添加高光效果
                graphics.fillStyle(0xFFFFFF, 0.2);
                graphics.fillRoundedRect(x, y, width, height / 2, radius);
            }

            // 添加边框
            graphics.lineStyle(2, 0xFFA000);
            graphics.strokeRoundedRect(x, y, width, height, radius);
        }

        setStyle();

        const text = this.add.text(0, 0, '开始匹配', {
            fontSize: '26px',
            color: '#FFF',
            fontStyle: 'bold',
        });

        text.setOrigin(0.5);

        container.add(graphics);
        container.add(text);
        
        container.setInteractive(new Phaser.Geom.Rectangle(x, y, 200, 60), Phaser.Geom.Rectangle.Contains);

        container.on('pointerdown', () => {
            graphics.clear();
            setStyle(true);

            if (!this.registry.get('/isLogin')) {
                this.registry.get('/login')();
                return;
            }

            this.scene.start('Scene_2');
        });

        container.on('pointerup', () => {
            graphics.clear();
            setStyle();
        });
        
        return container; // 返回container以便外部控制
    }

    preload() {
        this.width = this.scale.width;
        this.height = this.scale.height;
    }

    create() {
        this.renderBtn();
    }

    update() {

    }
}

export default Scene_1;