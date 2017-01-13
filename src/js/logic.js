var utils = require('./utils.js');
var $ = require('jquery');
var Event = require('./event.js');

var staff = require('../data/staff.json');
var reward = require('../data/reward.json');


var staffInfo;
var rewrdResult;
var init = function () {
    staffInfo = null;
    if (utils.getItem('staffInfo') === null) {
        staffInfo = staff;
        utils.setItem('staffInfo', staffInfo);
    } else {
        staffInfo = utils.getItem('staffInfo');
    }
    if (utils.getItem('rewrdResult') === null) {
        rewrdResult = {
            '0': [],
            '1': [],
        };
        utils.setItem('rewrdResult', rewrdResult);
    } else {
        rewrdResult = utils.getItem('rewrdResult');
    }
}
init();

window.addEventListener('beforeunload', function (e) {  //beforeunload,在即将离开当前页面(刷新或关闭)时执行 JavaScript :
    if (staffInfo !== null) {
        utils.setItem('staffInfo', staffInfo);
    }
    if (rewrdResult !== null) {
        utils.setItem('rewrdResult', rewrdResult);
    }
    var message = "是否退出抽奖？";
    e.returnValue = message;
    return message;
});

// ctrl+shift+alt+i 初始化抽奖程序
window.addEventListener('keyup', function (e) {
    if (e.ctrlKey && e.shiftKey && e.altKey && e.keyCode === 73) {
        utils.confirm('是否初始化抽奖程序？', function () {
            for (i in localStorage) {
                staffInfo = null;
                utils.removeItem(i);
            }
            init();
            console.log("has init all!");
        }, function () {
            console.log('no init all!');
        })
    }
})

var drawLottery = function (obj) {

    if (!obj) {
        return;
    }

    var type = obj.type;
    var awards = reward[obj.type];
    var result;


    if (checkDraw(obj)) {
        // $(".start").trigger("click");
    } else if (awards) {
        utils.confirm('您已抽过' + awards.name + '！是否重新抽取？', function () {
            // alert('ooooo');
            // rewrdResult[0].length = 0;
            // rewrdResult[1].length = 0;
            utils.removeItem('rewrdResult');
            drawLottery(obj);
            window.drawErr = false;
        }, function () {
            window.drawErr = true;
            return;
        })
    }
}

var cnt = 0;
var checkDraw = function (obj) {  //检查抽奖  是否需要下一轮

    if (!obj || !obj.type || !rewrdResult) {
        return true;
    }


    var type = obj.type;
    var awards = reward[obj.type];

    /**
     * 未选择一等或者二等奖时，空指针保护
     */
    if (!rewrdResult[type]) {
        return true;
    }

    if (rewrdResult[type].length >= awards.number && awards.number !== '-1') {  //一次即可抽完的非现金红包
        return false;
    } else {   //没抽完　　或者是现金红包
        return true;
    }
}

Event.on('start', function (obj) {

    if (!obj) {
        return;
    }

    drawLottery(obj);
});


// var checkDraw = function (obj) {  //检查抽奖  是否需要下一轮
//     var type = obj.type;
//     var awards = reward[obj.type];
//     if (rewrdResult[type].length >= awards.number && awards.number !== '-1') {  //一次即可抽完的非现金红包
//         return false;
//     } else {   //该奖项需要进行下一轮　　或者是现金红包
//         return true;
//     }
// }



