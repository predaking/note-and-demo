struct Solution {}

impl Solution {
    pub fn generate_matrix(n: i32) -> Vec<Vec<i32>> {
        let mut res = vec![vec![0; n as usize]; n as usize];

        let (mut i, mut j) = (0, 0);
        let mut direction = 0;

        const LTR: i32 = 0;
        const TTB: i32 = 1;
        const RTL: i32 = 2;
        const BTT: i32 = 3;

        let mut count = 1;
        let total = n * n;

        while count <= total {
            res[i][j] = count;
    
            match direction {
                LTR =>
                    if j as i32 == n - 1 {
                        i += 1;
                        direction = TTB;
                    } else {
                        if res[i][j + 1] > 0 {
                            direction = TTB;
                            i += 1;
                        } else {
                            j += 1;
                        }
                    }
                TTB =>
                    if i as i32 == n - 1 {
                        j -= 1;
                        direction = RTL;
                    } else {
                        if res[i + 1][j] > 0 {
                            direction = RTL;
                            j -= 1;
                        } else {
                            i += 1;
                        }
                    }
                RTL =>
                    if j == 0 {
                        i -= 1;
                        direction = BTT;
                    } else {
                        if res[i][j - 1] > 0 {
                            direction = BTT;
                            i -= 1;
                        } else {
                            j -= 1;
                        }
                    }
                BTT =>
                    if i == 0 {
                        j += 1;
                        direction = LTR;
                    } else {
                        if res[i - 1][j] > 0 {
                            direction = LTR;
                            j += 1;
                        } else {
                            i -= 1;
                        }
                    }
                _ => {}
            }

            count += 1;
        }

        res
    }
}

fn main() {
    let res = Solution::generate_matrix(5);
    println!("{:?}", res);
}