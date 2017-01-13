var $ = require('jquery');
var ease = require('./easing.js');

var Event = require('./event.js');
var utils = require('./utils.js');

var staff = require('../data/staff.json');
var reward = require('../data/reward.json');
// var newwwArr = [];
var staffInfo;

var rewrdResult = {
    '0': [],
    '1': [],
};

var html = {
    tpl: {
        base: '<li><img src="src/images/xiaolangren.png"></li>',
        staffList: (function() {
            var _current = [];                      
            for (var i = 0; i < staff.length; i++) {
                _current.push('<img index="' + i + '" name="' + staff[i].empName + '" staff-id="' + staff[i].EMPLOYEE_ID + '" class="staff-item" src="' + staff[i].IMAGE + '"/>');
            }
            return '<li class="people"><div class="staff-list">' + _current.join('') + '</div></li>';
        })()
    },
    createHtml: function(htmlTpl,length) {
        $('.list').html(htmlTpl);

         var newArr = [];
            for (var i = 0; i < length; i++) {
                var index = parseInt(Math.random() * staff.length);
                while(isInArray(index, newArr)){
                    index = Math.floor(Math.random() * 18);
                }
                newArr.push(index);
            }
            console.log(newArr);
        
        $('.staff-list').each(function(index) {
            $(this).css({
                'top': - newArr[index] * 222 + 'px',
            });
        })

    },

    createList: function(obj) {
        var type = obj.type;
        var tpl = this.tpl;
         switch (type) {   
            case '0':  
                var temp = tpl.staffList  + tpl.staffList + tpl.staffList;
                this.createHtml(temp,3);   
                break;
            case '1':
                var temp = tpl.staffList;
                this.createHtml(temp,1);
                break;
        }
    }
}

var rewardListSwtich = function() {
    if ($('.triangle').hasClass('on')) {
        $('.triangle').css({
            '-webkit-transform': 'translateY(-50%) rotate(-90deg)'
        }).addClass('off').removeClass('on');
        $('.bonus_set ul').css({
            'height': '0px',
            'border-top': 'none',
            'border-bottom': 'none'
        })
    } else {
        $('.triangle').css({
            '-webkit-transform': 'translateY(-50%) rotate(0deg)'
        }).addClass('on').removeClass('off');
        $('.bonus_set ul').css('display', 'block');
        $('.bonus_set ul').css({
            'height': '316px',
            'border-top': '3px solid #ff95a8',
            'border-bottom': '3px solid #ff95a8'
        })
    }
}

// staff-list 动画
var ani = {
    oneTime: 50, // 每人动画时间 100ms
    ing: false,
    oneHeight: 222,
    staffLen: staff.length,
    extraTime:100,
    linearLoopAni: function(ele) { // 循环匀速运行
        var _this = this;
        ele.animate({
            'top': -_this.oneHeight * (_this.staffLen - 1) + 'px'
        }, _this.oneTime * (_this.staffLen - 1), 'linear', function() {
            ele.css('top', '0');
            _this.linearLoopAni(ele);
        })
    },
    easeInAni: function(ele, cb) { // 加速运行到最底部
        var _this = this;
        var currentIndex = Math.round(Math.abs(parseInt(ele.css('top')) / ani.oneHeight));
        ele.animate({
            'top': -_this.oneHeight * (_this.staffLen - 1) + 'px'
        }, _this.oneTime * (_this.staffLen - currentIndex), 'easeInQuad', function() {
            ele.css('top', '0');
            cb && cb(ele);
        })
    },

    easeOutAni: function(ele, cb) { // 减速运行到目标位置
        var totalArray = rewrdResult[0].concat(rewrdResult[1]);
        var totalNum = reward[0].number - reward[1].number;  //
        if(totalNum === totalArray.length){
            console.log("完了");
                // rewrdResult[0].length = 0;
                // rewrdResult[1].length = 0;
                rewrdResult = {
                    '0': [],
                    '1': [],
                };
        //     rewrdResult[1].length = 0;
        }
        // if (rewrdResult[0].length === 18) {
        // alert(0000);
        // utils.confirm('您已抽过！是否重新抽取？', function() {
        
        //     rewrdResult[0].length = 0;
        //     rewrdResult[1].length = 0;
        
        // }, function() {
        //     window.drawErr = true;
        //     return;
        // })
        //  }
        var _this = this;
        var index = ele.index('.staff-list');
        var resultCon = $('.message li').eq($('.people').eq(index).index())[0];
        var currentTop = ele.css('top');
        var absTop = Math.abs(parseInt(currentTop));   
        var awardIndex =  parseFloat(absTop / ani.oneHeight).toFixed(2) ; 
        var reducedIndex = Math.floor(awardIndex); 
       
        console.log('awardIndex:'+awardIndex);
        console.log('reducedIndex:'+reducedIndex);
        console.log('totalNum: '+ totalNum);
        console.log('reducedIndex:'+reducedIndex);
        utils.setItem('rewrdResult', rewrdResult);
        // var rewardIndex = $('.bonus_set_title').attr('reward');

   // if(newwwArr.length > 3 && isInArray(reducedIndex, newwwArr) == false){
   //       reducedIndex = 18;
   //  } else if (newwwArr.length === 18) {
   //      newwwArr.length = 0;
   //  }
    
    
    
    // while(isInArray(reducedIndex, newwwArr)){
    //     reducedIndex = Math.floor(Math.random() * 18);
    // }
    //   newwwArr.push(reducedIndex);
    while(isInArray(reducedIndex, totalArray)){
        reducedIndex = Math.floor(Math.random() * staff.length);
    }
  

    if(rewardIndex == 0){ //砸鸡蛋
        rewrdResult[0].push(reducedIndex);
    }else if(rewardIndex == 1){ 
        rewrdResult[1].push(reducedIndex);
    }
    
    console.log(rewrdResult[0]);
    console.log(rewrdResult[1]);
        var imgAward = $('.staff-list').eq(index).find('img[index= '+reducedIndex+']');
        var staffId = imgAward.attr('staff-id');
        var name = imgAward.attr('name');
        ele.css({
            'top': (-(reducedIndex * 222))+'px'
        })
        resultCon.innerHTML = '<div>' + name + '</div><div>' + staffId+ '</div>';
    }
}

function isInArray(el, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) {
            return true;
        }
    }
    return false;
}


$('.bonus_set_title').on('click', function() {
    rewardListSwtich();
})


$('.bonus_set ul li').on('click', function() {
    window.drawErr = false;
    var index = $(this).attr('reward');   //几等奖
    rewardListSwtich();
    $('.bonus_set .bonus_set_title').css({
        'background': 'url(' + reward[index]['bg'] + ') no-repeat center '
    })
    html.createList({
        type: index
    })
    $('.bonus_set_title').attr('reward', index);
    
    if (index == 1){
         $('.message').html('<li><div>***</div><div>*****</div></li>');
    }else{
        $('.message').html('<li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li>');
    }
    
})


$('.start').on('click', function() {
    // var rewardIndex = $('.bonus_set_title').attr('reward');
     rewardIndex = $('.bonus_set_title').attr('reward');
    if (ani.ing && rewardIndex == 'null') {
        return;
    }
    ani.ing = true;

    Event.trigger('start', {
        type: rewardIndex
    })

    if (window.drawErr) {
        return;
    }
    if (rewardIndex == 1){
         $('.message').html('<li><div>***</div><div>*****</div></li>');
    }else{
        $('.message').html('<li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li>');
    }
    $('audio')[0].play();
    $('.staff-list').each(function(index) {
        var ele = $(this);
        setTimeout(function() {
            ani.easeInAni(ele, function(ele) {
                ani.linearLoopAni(ele);
            });
        }, index * 300);
    })
})



$('.stop').on('click', function() {
    if (!ani.ing) {
        return;
    }
    var counter = 0;
    $('.staff-list').each(function(index) {
        var ele = $(this);
        ele.stop();
        ani.easeOutAni(ele, function() {
            counter++;
            if (counter === $('.staff-list').length) {
                ani.ing = false;
                $('audio')[0].pause();
            }
        });
    })

})



var init = function() {
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




window.addEventListener('beforeunload', function(e) {  //beforeunload,在即将离开当前页面(刷新或关闭)时执行 JavaScript :
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
window.addEventListener('keyup', function(e) {
    if (e.ctrlKey && e.shiftKey && e.altKey && e.keyCode === 73) {
        utils.confirm('是否初始化抽奖程序？', function() {
            for (i in localStorage) {
                staffInfo = null;
                utils.removeItem(i);
            }
            init();
            console.log("has init all!");
        }, function() {
            console.log('no init all!');
        })
    }
})