import {
    BattleEventType,
    BattleType,
    CardType,
    CountryColorEnum,
    GameMainWsEventType,
    MatchStatus,
    RoomType,
    SkillType
} from "@/interface";

const EDGE_LEN = 160;
class Scene_2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene_2' });
        console.log('Scene_2: ', this);
    }

    private isPc = false;
    private width = 0;
    private height = 0;
    private matchingText: Phaser.GameObjects.Text | null = null;
    private dots = '';
    private dotTimer = 0;
    private ws: WebSocket | null = null;
    private isMatching = true;
    private cards: Phaser.GameObjects.Sprite[] = [];
    private selectedCard: Phaser.GameObjects.Sprite | null = null;
    private gridPositions: { x: number; y: number }[][] = [];

    private renderSkills(skills: SkillType[]) {
        const container = this.add.container(-EDGE_LEN / 2, EDGE_LEN / 2 - ((skills.length - 1) * 18 + 10));

        skills.forEach((skill, index) => {
            const backColor = (skill?.isJudge || skill?.isLock) ? 0xEEAB11 : 0x1179EE;

            // 创建 Nine Slice（修正边距）
            const nineSliceSprite = this.add.nineslice(
                20, index * 18,
                'skill',
                0,
                40, 16,
                10, 10, 4, 4 // 边距调整
            );
            nineSliceSprite.setTint(backColor);
            nineSliceSprite.setInteractive();

            let tooltip: Phaser.GameObjects.Container | null = null;
            let desc: Phaser.GameObjects.Text | null = null;
            let timer: any = null;

            const show = () => {
                desc = this.add.text(0, 0, skill.desc, {
                    fontSize: 16,
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 5,
                        right: 5
                    },
                    color: '#FFE400',
                    lineSpacing: 4,
                    backgroundColor: '#000000',
                    wordWrap: { width: 160, useAdvancedWrap: true }
                });
                tooltip = this.add.container(nineSliceSprite.x + 30, nineSliceSprite.y - 20);
                tooltip.add(desc);
                container.add(tooltip);
            };

            const hide = () => {
                if (!tooltip) {
                    return;
                }
                tooltip.destroy();
            };

            if (this.isPc) {
                nineSliceSprite.on('pointerover', show);
                nineSliceSprite.on('pointerout', hide);
            } else {
                nineSliceSprite.on('pointerdown', () => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    setTimeout(hide, 3000);
                    show();
                });
            }

            const text = this.add.text(20 - 2, index * 18 + 1, skill.name, {
                fontSize: 12,
                padding: {
                    top: 2
                }
            });
            text.setOrigin(0.5, 0.5);
            container.add(nineSliceSprite);
            container.add(text);
        });

        return container;
    }

    private createSkillDots(x: number, y: number, value: number) {
        const container = this.add.container(x, y);
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xcccccc);
        graphics.fillStyle(0x000000);
        graphics.strokeRoundedRect(-10, -10, 20, 20, 5);
        graphics.fillRoundedRect(-10, -10, 20, 20, 5);
        container.add(graphics);

        const skilldot = this.add.text(0, 0, String(value), {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center'
        });
        skilldot.setOrigin(0.5, 0.5);
        container.add(skilldot);

        return container;
    };

    private createCard(x: number, y: number, card: CardType, draggable: boolean = false) {
        const _countryColor = CountryColorEnum[card.countryId];
        const container = this.add.container(x, y);
        container.setSize(EDGE_LEN, EDGE_LEN);

        const graphics = this.add.graphics();
        // graphics.fillStyle(+_countryColor);

        // graphics.fillRect(-EDGE_LEN / 2, -EDGE_LEN / 2 + 5, EDGE_LEN - 10, EDGE_LEN - 10);
        container.add(graphics);

        const text = this.add.text(0, 2, card.name, {
            fontSize: '32px',
            color: `#${_countryColor.slice(2)}`,
            fontStyle: 'bold',
            padding: {
                top: 2
            }
        });
        text.setOrigin(0.5);
        container.add(text);

        const skillDots = [{
            value: card.top,
            x: 0,
            y: -EDGE_LEN / 2 + 12
        }, {
            value: card.bottom,
            x: 0,
            y: EDGE_LEN / 2 - 12
        }, {
            value: card.left,
            x: -EDGE_LEN / 2 + 12,
            y: 0
        }, {
            value: card.right,
            x: EDGE_LEN / 2 - 12,
            y: 0
        }];

        skillDots.forEach(({ value, x, y }) => {
            const skillDotContainer = this.createSkillDots(x, y, value);
            container.add(skillDotContainer);
        });

        const skills = this.renderSkills(card.skills);
        container.add(skills);

        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, EDGE_LEN, EDGE_LEN), Phaser.Geom.Rectangle.Contains);
        this.input.setDraggable(container);

        return container;
    }

    private renderZone(x: number, y: number) {
        this.add.zone(x, y, EDGE_LEN, EDGE_LEN).setRectangleDropZone(EDGE_LEN, EDGE_LEN);
    }

    private renderCards() {
        const battle = <BattleType>this.data.get('battle');
        const {
            roomId,
            grid,
            roles,
            current
        } = battle;
        this.gridPositions[0].forEach((pos, index) => {
            this.createCard(pos.x, pos.y, roles[0].cards[index]);
        });
        this.gridPositions[1].forEach((pos) => {
            this.renderZone(pos.x, pos.y);
        });
        this.gridPositions[2].forEach((pos, index) => {
            this.createCard(pos.x, pos.y, roles[1].cards[index]);
        });
    }

    private renderIsMatching() {
        this.matchingText = this.add.text(this.width / 2, this.height / 2, '匹配中', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.matchingText.setOrigin(0.5);
    }

    private createCenterGrid() {
        const grid = this.add.grid(
            0,
            0,
            480,
            480,
            EDGE_LEN,
            EDGE_LEN,
            0xffffff,
            1,
            0x000000,
            1
        );
        return grid;
    }

    private createSideGrid() {
        const grid = this.add.grid(
            0,
            0,
            EDGE_LEN,
            800,
            EDGE_LEN,
            EDGE_LEN,
            0xffffff,
            1,
            0x000000,
            1
        );
        return grid;
    }

    private renderContent() {
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

        this.gridPositions = [
            // 左侧网格位置
            Array(5).fill(0).map((_, i) => ({
                x: leftX,
                y: gridY - 320 + i * EDGE_LEN
            })),
            // 中间网格位置
            Array(9).fill(0).map((_, i) => ({
                x: centerX - EDGE_LEN + (i % 3) * EDGE_LEN,
                y: gridY - EDGE_LEN + Math.floor(i / 3) * EDGE_LEN
            })),
            // 右侧网格位置
            Array(5).fill(0).map((_, i) => ({
                x: rightX,
                y: gridY - 320 + i * EDGE_LEN
            }))
        ];

        this.renderCards();
    }

    private matching() {
        this.ws?.send(JSON.stringify({
            type: 'request',
            path: '/matching'
        }));
    }

    private handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);
        this.data.set('room', data.data.room);
        this.data.set('battle', data.data.battle);

        if (data.type === GameMainWsEventType.BATTLE && data.subType === BattleEventType.START) {
            this.matchingText!.destroy();
            this.isMatching = false;
            this.renderContent();
        } else if (data.type === GameMainWsEventType.MATCH && data.subType === MatchStatus.PLAYING) {
            this.matchingText!.setText('用户已在游戏中');
            this.isMatching = false;
            this.renderContent();
        }
    }

    private registerEvents() {
        console.log('data: ', this.data);
        this.input.on('drag', (
            _: Phaser.Input.Pointer,
            container: Phaser.GameObjects.Container,
            dragX: any, dragY: any
        ) => {
            container.x = dragX;
            container.y = dragY;
        });

        this.input.on('dragstart', () => {
            // container.setData('startX', container.x);
            // container.setData('startY', container.y);
        });

        this.input.on('dragend', (
            _: Phaser.Input.Pointer,
            container: Phaser.GameObjects.Container,
            dropped: boolean
        ) => {
            if (!dropped) {
                container.x = container.input!.dragStartX;
                container.y = container.input!.dragStartY;
            }
        });

        this.input.on('drop', (
            _: Phaser.Input.Pointer,
            container: Phaser.GameObjects.Container,
            dropZone: Phaser.GameObjects.Container,
        ) => {
            if (dropZone.getData('occupied')) {
                container.x = container.input!.dragStartX;
                container.y = container.input!.dragStartY;
                return;
            }
            container.x = dropZone.x;
            container.y = dropZone.y;
            container.input!.enabled = false;
            dropZone.setData('occupied', true);
        });
    }

    preload() {
        this.width = this.scale.width;
        this.height = this.scale.height;
        this.ws = this.registry.get('getWsInstance')();
        this.isPc = !!this.sys.game.device.os.desktop;
        console.log('this.ws: ', this.ws);
        if (this.ws) {
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onopen = () => {
                this.matching();
            }
        }
        this.load.image('skill', '../resource/images/skill.svg');
    }

    create() {
        this.renderIsMatching();
        this.registerEvents();
    }

    update(_time: number, _delta: number): void {
        if (this.isMatching && this.matchingText) {
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