class Scene3 extends Phaser.Scene { 
    constructor () {
        super('Scene3');
        console.log('Scene3');
    }

    private createCenterGrid () {
        const grid = new Phaser.GameObjects.Grid(
            this, 
            0, 
            0, 
            480, 
            480, 
            160, 
            160, 
            0xffffff, 
            1, 
            0x000000, 
            1
        );
        this.add.existing(grid);
        return grid;
    }

    private createSideGrid () {
        const grid = new Phaser.GameObjects.Grid(
            this,
            0,
            0,
            160,
            800,
            160,
            160,
            0xffffff,
            1,
            0x000000,
            1
        );
        this.add.existing(grid);
        return grid;
    }

    create () {
        const centerGrid = this.createCenterGrid();
        const leftGrid = this.createSideGrid();
        const rightGrid = this.createSideGrid();

        // 计算网格的总宽度和高度
        const totalWidth = this.scale.width;
        const totalHeight = this.scale.height;
        
        // 计算每个网格的位置
        const gridSpacing = totalWidth / 3;
        const leftX = gridSpacing / 2;
        const centerX = totalWidth / 2;
        const rightX = totalWidth - gridSpacing / 2;
        const gridY = totalHeight / 2;

        // 设置每个网格的位置
        leftGrid.setPosition(leftX, gridY);
        centerGrid.setPosition(centerX, gridY);
        rightGrid.setPosition(rightX, gridY);

        // 设置每个网格的原点为中心点
        [leftGrid, centerGrid, rightGrid].forEach(grid => {
            grid.setOrigin(0.5, 0.5);
        });
    }
}

export default Scene3;