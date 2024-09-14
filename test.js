/**
 * const arr = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
];
输出 1 2 3 4 8 12 11 10 9 5 6 7
const arr = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,16],
];
输出 1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10
 */

const traversal = (arr) => {
    const states = {
        1: 'LTR',
        2: 'RTB',
        3: 'BTL',
        4: 'LTT'
    };

    const m = arr.length;
    const n = arr[0].length;

    const res = [];
    let state = states[1];

    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            switch (state) {
                case 'LTR':
                    console.log('debug: ', i, j);
                    if (j + 1 < n) {
                        res.push(arr[i][j]);
                    } else {
                        j = 0;
                        i++;
                        state = 'RTB';
                    }
                    break;
                case 'RTB':
                    if (i + 1 < m) {
                        res.push(arr[i][j]);
                    } else {
                        state = 'BTL';
                    }
                    break;
                case 'BTL':
                    if (j - 1 > 0) {
                        res.push(arr[i][j]);
                    } else {
                        state = 'LTT';
                    }
                    break;
                case 'LTT':
                    if (i - 1 > 0) {
                        res.push(arr[i][j]);
                    } else {
                        state = 'LTR';
                    }
                    break;
                default: break;
            }
        }
    }

    return res;
};

const arr = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
];

// console.log(traversal(arr));
const _arr = [1, 2, 3, 4, 5];

var shuffle = (arr) => {
    const res = [];
    let _arr = [];
    const len = arr.length;

    const backTrack = (index) => {
        if (_arr.length === len) {
            res.push(_arr);
            return;
        }

        for (let i = 0; i < len; ++i) {

        }
    };

    backTrack(0);

    console.log('res: ', res);
};

shuffle = (arr) => {
    const _arr = [];
} 

console.log(shuffle(_arr));