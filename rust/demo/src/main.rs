struct Solution {}

impl Solution {
    pub fn get_permutation(mut n: i32, mut k: i32) -> String {
        if n == 1 {
            return "1".to_string();
        }

        let mut ans: Vec<i32> = Vec::new();
        let mut arr: Vec<i32> = (1..=n).collect();

        let factarial = |n: usize| -> i32 {
            return (1..=n).fold(1, |acc, cur| acc * cur as i32);
        };

        while n > 0 {
            let tmp = factarial(n as usize - 1);
            let idx = (k + tmp - 1) / tmp - 1;
            if idx >= 0 {
                ans.push(arr.remove(idx as usize));
            } else {
                ans.push(arr.pop().unwrap_or(0));
            }
            k %= tmp;
            n -= 1;
        }

        ans.iter().map(|vl| vl.to_string()).collect::<Vec<String>>().join("")
    }
}

fn main() {
    let res = Solution::get_permutation(4, 3);
    println!("{}", res);
}