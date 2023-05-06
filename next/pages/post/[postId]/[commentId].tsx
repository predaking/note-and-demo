import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Post(props: any) {
    const router = useRouter();
    const { query: { postId } } = router;

    return (
        <div>Post {props.data[postId as string]}</div>
    );
}

const getParams = () => {
    const res = [{
        postId: '1',
        commentId: '11'
    }, {
        postId: '2',
        commentId: '21'
    }];

    // res.push({
    //     postId: '3',
    //     commentId: '31'
    // });

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(res);
        }, 500);
    });
}

export async function getStaticProps() {
    console.log('getStaticProps');
    const data = {
        1: "1-1",
        2: "2-1",
        3: "3-1"
    };

    return {
        props: {
            data
        }
    }
}

export async function getStaticPaths() {
    console.log('getStaticPaths');
    const res = [];

    res.push({
        postId: '3',
        commentId: '31'
    });
    const paths = (res as []).map(item => ({
        params: item
    }));
    return {
        paths,
        fallback: false
    }
}