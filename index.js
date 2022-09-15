var tween = {
    /**
     * @param {*} t 已消耗时间
     * @param {*} b 初始位置
     * @param {*} c 目标位置
     * @param {*} d 动画持续总时间
     */
    linear: function (t, b, c, d) {
        return c * t / b + d;
    },
    easeIn: function (t, b, c, d) {
        return c * ( t /= d ) * t + b;
    },
    strongEaseIn: function(t, b, c, d) {
        return c * ( t /= d ) * t * t * t * t + b;
    },
    strongEaseOut: function(t, b, c, d){
        return c * (( t = t / d - 1 ) * t * t * t * t + 1) + b;
    },
    sineaseIn: function( t, b, c, d ){
        return c * ( t /= d ) * t * t + b; 
    },
    sineaseOut: function(t,b,c,d){
        return c * (( t = t / d - 1) * t * t * 1) + b;
    }
};

var Animate = function (dom) {
    this.dom = dom;
    this.startTime = 0; 
    this.startPos = 0; 
    this.endPos = 0; 
    this.propertyName = null;
    this.easing = null; 
    this.duration = null;
};

Animate.prototype.start = function (propertyName, endPos, duration, easing) {
    this.startTime = +new Date();
    this.startPos = this.dom.getBoundingClientRect()[propertyName];
    this.propertyName = propertyName;
    this.endPos = endPos;
    this.duration = duration;
    this.easing = tween[easing];

    var self = this;
    var timeId = setInterval(function() {
        if (self.step() === false) {
            clearInterval(timeId);
        }
    }, 19);
};

Animate.prototype.step = function () {
    var t = +new Date();
    if (t >= this.startTime + this.duration) {
        this.update(this.endPos);
        return false;
    }
    var pos = this.easing(
        t - this.startTime, 
        this.startPos, 
        this.endPos - this.startPos, 
        this.duration
    );
    this.update(pos);
};

Animate.prototype.update = function (pos) {
    console.log('update');
    this.dom.style[this.propertyName] = pos + 'px';
}

// var animate = new Animate(dom);
// animate.start('top', 1500, 500, 'sineaseIn');

/**
 * 策略模式
 * 1、封装的一系列用于用途方向一致的业务规则
 * 2、避免书写大量的条件判断或者选择语句
 * 3、易于扩展，易于移植，易于修改
 * 4、语义化好的情况下还容易定位出现问题的位置
 */

/**
 * 策略模式（例：表单校验）
 */
 var strategies = {
    isNonEmpty: function (value, errMsg) {
        if (value == '') {
            return errMsg;
        }
    },
    minLength: function (value, length, errMsg) {
        if (value.length < length) {
            return errMsg;
        }
    },
    isMobile: function (value, errMsg) {
        if (!/1\d{10}/g.test(value)) {
            return errMsg;
        }
    }
};

var Validator = function () {
    this.cache = [];
};

Validator.prototype.add = function (dom, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
        console.log(this.cache);
        (function (rule) {
            var strategyAry = rule.strategy.split(':');
            var errMsg = rule.errMsg;
            self.cache.push(function () {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errMsg);
                return strategies[strategy].apply(dom, strategyAry);
            })
        }(rule));
    }
}

Validator.prototype.start = function () {
    for (var i = 0, validateFunc; validateFunc = this.cache[i++];) {
        var errMsg = validateFunc();
        if (errMsg) {
            return errMsg;
        }
    }
};

var form = document.getElementById('form');

var validateFunc = function () {
    var validator = new Validator();
    validator.add(form.username, [{
        strategy: 'isNonEmpty',
        errMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:10',
        errMsg: '用户名不能少于10位'
    }]);
    validator.add(form.password, [{
        strategy: 'minLength:6',
        errMsg: '密码不能少于6位'
    }]);
    validator.add(form.phone, [{
        strategy: 'isMobile',
        errMsg: '手机号格式错误'
    }]);
    var errMsg = validator.start();
    return errMsg;
}

form.onsubmit = function () {
    var errMsg = validateFunc();
    console.log('errMsg: ', errMsg);
    if (errMsg) {
        alert(errMsg);
        return false;
    }
}
