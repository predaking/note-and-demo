"use strict";
(() => {
var exports = {};
exports.id = 200;
exports.ids = [200];
exports.modules = {

/***/ 915:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Post),
  "getStaticPaths": () => (/* binding */ getStaticPaths),
  "getStaticProps": () => (/* binding */ getStaticProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: external "next/router"
const router_namespaceObject = require("next/router");
;// CONCATENATED MODULE: ./pages/post/[postId]/[commentId].tsx


function Post(props) {
    const router = (0,router_namespaceObject.useRouter)();
    const { query: { postId  }  } = router;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            "Post ",
            props.data[postId]
        ]
    });
}
const getParams = ()=>{
    const res = [
        {
            postId: "1",
            commentId: "11"
        },
        {
            postId: "2",
            commentId: "21"
        }
    ];
    // res.push({
    //     postId: '3',
    //     commentId: '31'
    // });
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(res);
        }, 500);
    });
};
async function getStaticProps() {
    console.log("getStaticProps");
    const data = {
        1: "1-1",
        2: "2-1",
        3: "3-1"
    };
    return {
        props: {
            data
        }
    };
}
async function getStaticPaths() {
    console.log("getStaticPaths");
    const res = [];
    res.push({
        postId: "3",
        commentId: "31"
    });
    const paths = res.map((item)=>({
            params: item
        }));
    return {
        paths,
        fallback: false
    };
}


/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(915));
module.exports = __webpack_exports__;

})();