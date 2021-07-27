import {
    useState,
    useEffect
} from 'react';

import {
    List,
    Button,
    Skeleton,
    Avatar,
} from 'antd';

import {
    LoadingOutlined,
} from '@ant-design/icons';

import './index.css';
import cimu from '../../assets/cimutongzi.jpg';
import yaodao from '../../assets/yaodaoji.png';
import datiangou from '../../assets/datiangou.jpg';

const ListItem = List.Item;
const {
    Meta
} = ListItem;

const headUrlArr = [cimu, yaodao, datiangou];
const listData = [
    {
        name: '茨木童子',
        headUrl: headUrlArr[0],
        desc: '大妖，曾被源赖光用鬼切斩断右臂'
    }, {
        name: '妖刀姬',
        headUrl: headUrlArr[1],
        desc: '内心善良，受到刺激后化身妖刀'
    }, {
        name: '大天狗',
        headUrl: headUrlArr[2],
        desc: '大妖，黑晴明两大护法之一，另为雪女'
    }
];

/**
 * [TestList description]
 * @method TestList
 */
const TestList = () => {
    const [loading, changeLoading] = useState(false);

    /**
     * [loadmore description]
     * @method loadmore
     * @param {event} e
     */
    const loadmore = e => {
        changeLoading(true);
        const loadMoreData = setTimeout(() => {
            listData.push(listData[Math.floor(Math.random() * 3)]);
            changeLoading(false);
            clearTimeout(loadMoreData);
        }, 1000);
    };

    const loadmoreTpl = (
        !loading && <Button onClick={loadmore}>加载更多</Button>
    );

    return (
        <div className="list">
            <List
                loading={loading}
                loadMore={loadmoreTpl}
                size="large"
                itemLayout="vertical"
                header={<h2>阴阳师</h2>}
                footer={<h2>...</h2>}
                dataSource={listData}
                renderItem={item =>
                    <ListItem
                        actions={[
                            <div><LoadingOutlined /></div>,
                            <div>编辑</div>,
                            <a>删除</a>
                        ]}
                    >
                        <Skeleton
                            loading={false}
                        >
                            <Meta
                                avatar={<Avatar src={item.headUrl}/>}
                                title={item.name}
                                description={item.desc}
                            />
                            <div>传记...</div>
                        </Skeleton>
                    </ListItem>
                }
            />
        </div>
    );
};

export default TestList;
