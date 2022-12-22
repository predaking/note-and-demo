function bitCalc(num1, num2) {
    console.log(num1 & num2, num1 | num2, num1 ^ num2);
}

var OPTION_A = 1; // 00001
var OPTION_B = 2; // 00010
var OPTION_C = 4; // 00100
var OPTION_D = 8; // 01000
var OPTION_E = 16; // 10000

var options = OPTION_A | OPTION_C | OPTION_D;

console.log(26 & 1)

// bitCalc(29, 7)