import { useEffect } from 'react';
import path from 'path';
import fs from 'fs/promises';

export default function Post(props: { list: any; }) {
    const { list } = props;

    useEffect(() => {
        console.log('props: ', props);
    }, []);

    return (
        <ul>
            {
                list.map((val: number) => <li key={val}>{val}</li>)
            }
        </ul>
    );
}

const getData = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([1, 2, 3]);
        }, 2000);
    })
};

const getParams = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([4, 5, 6])
        })
    })
}

export async function getStaticProps() {
    const list = await getData();
    const postsDirectory = path.join(process.cwd(), 'pages/other');
    const filenames = await fs.readdir(postsDirectory);

    const posts = filenames.map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return {
            filename,
            content: fileContent
        }
    })

    return {
        props: {
            // posts: await Promise.all(posts),
            list
        },
    }
}

export async function getStaticPaths() {
    const params = await getParams();
    return {
        paths: (params as []).map(val => ({
            params: {
                id: val + ''
            }
        })),
        fallback: false
    }
}
