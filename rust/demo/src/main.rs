use std::{vec, cmp};

struct Solution {}

impl Solution {
    pub fn insert(mut intervals: Vec<Vec<i32>>, mut new_interval: Vec<i32>) -> Vec<Vec<i32>> {
        let mut stack = Vec::new();
        loop {
            if intervals.is_empty() {
                stack.append(&mut vec![new_interval]);
                return stack;
            }

            if new_interval[1] < intervals[0][0] {
                intervals.insert(0, new_interval);
                stack.append(&mut intervals);
                return stack;
            }

            if new_interval[0] > intervals[0][1] {
                stack.append(&mut vec![intervals.remove(0)]);
                continue;
            }

            let tmp = vec![cmp::min(new_interval[0], intervals[0][0]), cmp::max(new_interval[1], intervals[0][1])];
            new_interval = tmp;
            intervals.remove(0);
        }
    }
}

fn main() {
    let res = Solution::insert(vec![vec![1, 2], vec![3, 5], vec![6, 7], vec![8, 10], vec![12, 16]], vec![4, 8]);
    println!("debug-res: {:?}", res);
}
