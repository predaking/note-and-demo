const fs = require('fs');

const skillList = [
    { id: 1, name: '占星', desc: '进场后，显示对方手牌', type: ['裁定技'] },
    { id: 2, name: '协作', desc: '相邻友军进攻后，自身发动进攻', type: ['锁定技', '裁定技'] },
    { id: 3, name: '整编', desc: '驱车对放置自己相邻的敌军发动进攻', type: ['锁定技'] },
    { id: 4, name: '降阵', desc: '自身移动至翻面时，己方手牌点数增加1', type: ['锁定技'] },
    { id: 5, name: '甄妃', desc: '被自己翻面的敌方单位将继续进攻', type: [] },
    { id: 6, name: '角逐', desc: '每次进攻后自身点数增加1', type: ['裁定技'] },
    { id: 7, name: '突袭', desc: '进场后，若自身相邻仅有1名敌方单位，则与其交换位置', type: [] },
    { id: 8, name: '强弓', desc: '可以隔着1名友军或者1个空格对敌方进行攻击', type: [] },
    { id: 9, name: '退避', desc: '进攻时，与敌军最小点数相比', type: ['裁定技'] },
    { id: 10, name: '护卫', desc: '相邻敌军被翻面后，尝试将其翻回', type: ['锁定技', '裁定技'] },
    { id: 11, name: '睡眠大叔', desc: '将自己翻面的单位也会被翻面', type: ['裁定技'] },
    { id: 12, name: '先驱', desc: '进场后，补1张牌', type: [] },
    { id: 13, name: '反骨', desc: '相邻友军被翻面时，跟随其翻面', type: [] },
    { id: 14, name: '鼓舞', desc: '置于相邻的友军点数增加1', type: [] },
    { id: 15, name: '压制', desc: '置于相邻的敌军点数降低1', type: [] },
    { id: 16, name: '温酒', desc: '每次被翻面，己方手牌点数增加1', type: ['裁定技'] },
    { id: 17, name: '业火', desc: '进场后，敌方场上卡牌点数降低1', type: ['裁定技'] },
    { id: 18, name: '机巧', desc: '敌方进场置于相邻时，则退后一格', type: ['裁定技'] },
    { id: 19, name: '离间', desc: '与敌军比点时，改为点数小的赢', type: [] },
    { id: 20, name: '新贵', desc: '攻击时且将被攻击单位推后一格', type: ['锁定技'] },
    { id: 21, name: '霸府', desc: '若有友军相邻，则抵消1次翻面（每回合1次）', type: ['锁定技', '裁定技'] },
    { id: 22, name: '青囊', desc: '进场后，相邻友军点数增加1，补1张卡牌点数增加1，并1张牌', type: [] },
    { id: 23, name: '鬼谋', desc: '进场后，相邻友军点数增加1，并全随机1至场上相邻友军发起攻击', type: [] },
    { id: 24, name: '智谋', desc: '任意单位置于相邻时，智谋跳跃机动1至格重新进场', type: ['锁定技'] },
    { id: 25, name: '历战', desc: '友军进场置于相邻时，自己发起进攻', type: ['锁定技'] },
    { id: 26, name: '绝境', desc: '友军首次置于相邻后，则互相换位并攻击', type: [] },
    { id: 27, name: '析除', desc: '移除被自己翻面的武将，补一张手牌', type: [] },
    { id: 28, name: '倾国', desc: '可以抵消1次被翻面', type: [] },
    { id: 29, name: '鬼才', desc: '被翻面时，将自身移除', type: ['裁定技'] }
];

const headers = [
    'id',
    'name',
    'desc',
    'type'
];

const content = [
    headers.join(','),
    ...skillList.map(skill => {
        return [
            skill.id,
            skill.name,
            skill.desc
        ].join(',');
    })
].join('\n');

fs.writeFileSync('./data.csv', content, 'utf-8');