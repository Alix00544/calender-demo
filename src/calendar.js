/**
 * 兼容：
 * classList  IE 10+
 */
var data = {
    "2019-08-09": {
        "holiday": false,
        "morningHour": "08",
        "morningMinute": "30",
        "morningHourEnd": "12",
        "morningMinuteEnd": "00",
        "afterHour": "13",
        "afterMinute": "00",
        "afterHourEnd": "17",
        "afterMinuteEnd": "30"
    },
    "2019-08-11": {
        "holiday": false,
        "morningHour": "08",
        "morningMinute": "30",
        "morningHourEnd": "12",
        "morningMinuteEnd": "00",
        "afterHour": "13",
        "afterMinute": "00",
        "afterHourEnd": "17",
        "afterMinuteEnd": "30"
    }
};
// 初始化，获得当前日期日历
(function (date) {
    showCalender(date);
    initHeader();
    addEventForHeader();
    setSelect();
}(new Date(new Date().setDate(1))))


function showCalender(date) {
    createCalender(date);
    updateWorkDayInfo();
    addEvent();
}

function initHeader() {
    var todayInfo = getDateInfo(new Date()),
        calender = document.getElementById("calender"),
        infoTittle = calender.getElementsByClassName("info-date-tittle")[0];
    infoTittle.innerText = "" + todayInfo.year + "年" + todayInfo.strMonth + "月" + todayInfo.strDay + "日 " + todayInfo.strWeek;
    calender.getElementsByClassName('info-date')[0].innerText = todayInfo.strDay;
}

// 创建新的日历界面
function createCalender(date) {
    var dateInfo = getDateInfo(date),
        today = new Date(),
        prevDays = dateInfo.weekday - 1,
        calender = document.getElementById("calender"),
        dates = calender.getElementsByClassName("dates")[0],
        headTitle = calender.getElementsByClassName("calender-header-title")[0],
        ul = document.createElement("ul"),
        eventDay,
        eventNumber;
    dates.innerHTML = '';
    ul.className = 'event-week';
    headTitle.innerText = '' + dateInfo.year + '年' + dateInfo.strMonth + '月';

    for (var i = 1; i <= 42; i++) {
        eventDay = document.createElement("li");
        eventDay.className = "event-day";
        eventNumber = document.createElement("p");
        if (i <= prevDays) {
            eventNumber.className = "day-number prev-month";
            eventNumber.innerHTML = dateInfo.lastMonthDays - prevDays + i;
        } else if (i <= prevDays + dateInfo.totaldays) {
            if (i - prevDays == today.getDate() && dateIsEaqule(date, today)) {
                eventDay.className = "event-day today";
            }
            eventNumber.className = "day-number";
            eventNumber.innerHTML = i - prevDays;
        } else {
            eventNumber.className = "day-number next-month";
            eventNumber.innerHTML = i - dateInfo.weekday - dateInfo.totaldays + 1;
        }
        eventDay.appendChild(eventNumber);
        ul.appendChild(eventDay);
    }
    dates.appendChild(ul);
}


// 绑定事件 + 添加holiday属性 +  border-left 属性 + border-bottom
function addEvent() {
    var calender = document.getElementById("calender"),
        ul = calender.getElementsByClassName("event-week")[0],
        eleLis = ul.getElementsByTagName('li');
    for (var i = 0; i < eleLis.length; i++) {
        if (i % 7 == 0) { eleLis[i].className += " left-border"; }
        if (i % 7 == 5 || i % 7 == 6) { eleLis[i].className += " holiday"; }
        if (i >= 35) { eleLis[i].className += " bottom-border"; }

        //绑定 点击设置选中背景事件；
        eleLis[i].addEventListener('click', function (e) {
            var ele = document.getElementById("calender").getElementsByClassName("event-day selected");
            for (var i = 0; i < ele.length; i++) {
                var classname = ele[i].className;
                if (ele[i].classList) {
                    ele[i].classList.remove("selected");
                } else {
                    var classArr = classname.split(" ");
                    classArr.splice(classArr.indexOf("selected"), 1);
                    ele[i].className = classArr.join(" ");
                }
            }
            this.className += " selected";
            updateInfoBody.call(this);
            return false;
        });
    }
}


// 切换右方日期展示界面
function updateInfoBody() {
    var infoTittle = document.getElementById("calender").getElementsByClassName("info-date-tittle")[0];
    var btnSetWorkDay = document.getElementById("btnSetWorkDay");
    var currentDate = getCurrentShowDate(),
        year = currentDate.getFullYear(),
        month = currentDate.getMonth(),
        showDate;
    if (this.firstElementChild.className.indexOf('prev-month') != -1) {
        showDate = new Date(year, month - 1, this.firstElementChild.innerText);
    } else if (this.firstElementChild.className.indexOf('next-month') != -1) {
        showDate = new Date(year, month + 1, this.firstElementChild.innerText);
    } else {
        showDate = new Date(year, month, this.firstElementChild.innerText);
    }
    var date = getDateInfo(showDate);
    infoTittle.innerText = "" + date.year + "年" + date.strMonth + "月" + date.strDay + "日 " + date.strWeek;
    calender.getElementsByClassName('info-date')[0].innerText = date.strDay;
    if (this.className.indexOf("holiday") == -1) {
        btnSetWorkDay.innerText = "设置为非工作日";
    } else {
        btnSetWorkDay.innerText = "设置为工作日";
    }
}

// 为日历标题添加月份切换事件
function addEventForHeader() {
    var prevMonth = calender.getElementsByClassName("prev-month")[0],
        nextMonth = calender.getElementsByClassName("next-month")[0];

    prevMonth.addEventListener('click', function (e) {
        var currentDate = getCurrentShowDate();
        showCalender(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    });

    nextMonth.addEventListener('click', function (e) {
        var currentDate = getCurrentShowDate();
        showCalender(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    });
}


// 从标题获取日期信息
function getCurrentShowDate() {
    var calender = document.getElementById("calender"),
        tittle = calender.getElementsByClassName("calender-header-title")[0],
        dateStr = tittle.innerText,
        reg = /(\d{4})年(\d{2})月/;
    reg.test(dateStr);
    return new Date(RegExp.$1, parseInt(RegExp.$2) - 1);
}

// 获取某月含有的天数
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// 获取日期信息
function getDateInfo(date) {
    var weekday = date.getDay(),
        year = date.getFullYear(),
        day = date.getDate(),
        month = date.getMonth(),
        totaldays = getDaysInMonth(year, month),
        lastMonthDays = getDaysInMonth(year, month - 1),
        strMonth = month + 1 < 10 ? '0' + (month + 1) : (month + 1),
        week = ['日', '一', '二', '三', '四', '五', '六'];
    return {
        day: day,
        year: year,
        month: month,
        weekday: weekday == 0 ? 7 : weekday,
        totaldays: totaldays,
        lastMonthDays: lastMonthDays,
        strMonth: strMonth,
        strWeek: '星期' + week[weekday],
        strDay: day < 10 ? '0' + day : day,
    }
}

// 判断两个日期，年月是否相同
function dateIsEaqule(dateA, dateB) {
    var A = getDateInfo(dateA),
        B = getDateInfo(dateB);
    return A.year == B.year && A.month == B.month;
}

// 设置select 中的options选项
function setSelect() {
    var morningHour = document.getElementById('morningHour'),
        morningMinute = document.getElementById('morningMinute'),
        morningHourEnd = document.getElementById('morningHourEnd'),
        morningMinuteEnd = document.getElementById('morningMinuteEnd'),
        afterHour = document.getElementById('afterHour'),
        afterMinute = document.getElementById('afterMinute'),
        afterHourEnd = document.getElementById('afterHourEnd'),
        afterMinuteEnd = document.getElementById('afterMinuteEnd'),
        numstr;
    for (var i = 1; i < 13; i++) {
        numstr = i < 10 ? "0" + i : i;
        morningHour.add(new Option(numstr, i), null);
        morningHourEnd.add(new Option(numstr, i), null);
    }
    for (var i = 13; i < 24; i++) {
        afterHour.add(new Option(i, i), null);
        afterHourEnd.add(new Option(i, i), null);
    }
    for (var i = 0; i < 60; i++) {
        numstr = i < 10 ? "0" + i : i;
        morningMinute.add(new Option(numstr, i), null);
        morningMinuteEnd.add(new Option(numstr, i), null);
        afterMinute.add(new Option(numstr, i), null);
        afterMinuteEnd.add(new Option(numstr, i), null);
    }

    // 设置 select 默认值
    morningHour.value = 8;
    morningMinute.value = 0;
    morningHourEnd.value = 12;
    morningMinuteEnd.value = 30;
    afterHour.value = 13;
    afterMinute.value = 0;
    afterHourEnd.value = 17;
    afterMinuteEnd.value = 30;

    btnSetWorkDay.addEventListener('click', function (e) {
        // console.log(getCurrentSelectDate());
        if (this.innerText == "设置为工作日") {
            data[getCurrentSelectDate()] = {
                holiday: false,
                morningHour: addPreZero(morningHour.value),
                morningMinute: addPreZero(morningMinute.value),
                morningHourEnd: addPreZero(morningHourEnd.value),
                morningMinuteEnd: addPreZero(morningMinuteEnd.value),
                afterHour: addPreZero(afterHour.value),
                afterMinute: addPreZero(afterMinute.value),
                afterHourEnd: addPreZero(afterHourEnd.value),
                afterMinuteEnd: addPreZero(afterMinuteEnd.value)
            }
            this.innerText="设置为非工作日";
        } else {
            data[getCurrentSelectDate()] = {
                holiday: true
            }
            this.innerText="设置为工作日";
        }
        updateWorkDayInfo();
        // console.log(data);
    });
    btnSaveTime.addEventListener('click', function (e) {
        //:TODO
        console.log(getCurrentSelectDate());
    });
}

// 返回两位字符串 8 => '08'
function addPreZero(num) {
    return num < 10 ? '0' + num : num;
}

function updateWorkDayInfo() {
    var currentDate = getCurrentShowDate(),
        prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
        nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    var calender = document.getElementById("calender"),
        ul = calender.getElementsByClassName("event-week")[0],
        btnSetWorkDay = document.getElementById("btnSetWorkDay"),
        eleLis = ul.getElementsByTagName('li'),
        str = "",
        formatDate;
    for (var i = 0; i < eleLis.length; i++) {
        str = eleLis[i].firstElementChild.className;
        day = eleLis[i].firstElementChild.innerText;

        if (str.indexOf("prev-month") != -1) {
            formatDate = getFormatDate(new Date(prevMonth.setDate(day)));
        } else if (str.indexOf("next-month") != -1) {
            formatDate = getFormatDate(new Date(nextMonth.setDate(day)));
        } else {
            formatDate = getFormatDate(new Date(currentDate.setDate(day)));
        }
        if (data[formatDate]) {
            if (!data[formatDate]["holiday"]) {
                var morn = "上午：" + data[formatDate].morningHour + ":" + data[formatDate].morningMinute + "至" +
                    data[formatDate].morningHourEnd + ":" + data[formatDate].morningMinuteEnd;
                var after = "下午：" + data[formatDate].afterHour + ":" + data[formatDate].afterMinute + "至" +
                    data[formatDate].afterHourEnd + ":" + data[formatDate].afterMinuteEnd;
                var tempnode = eleLis[i].firstElementChild;
                var tempText = tempnode.innerText;

                if(eleLis[i].className.indexOf("holiday") != -1){
                    var classname = eleLis[i].className;
                    var classArr = classname.split(" ");
                    classArr.splice(classArr.indexOf("holiday"), 1);
                    eleLis[i].className = classArr.join(" ");
                }

                // 设置为空后，chrome没有问题，IE中tempnode的innerHtml值为空；
                eleLis[i].innerHTML = "";
                tempnode.innerText = tempText;
                eleLis[i].appendChild(tempnode);
                eleLis[i].innerHTML += "<div class='event-box'><p class='event-item'>" + morn +
                    "</p><p class='event-item'>" + after +
                    "</p></div>";
                // btnSetWorkDay.innerText = "设置为工作日";
            } else {
                if (eleLis[i].className.indexOf("holiday") == -1) {
                    eleLis[i].className += ' holiday';
                }
                var tempnode = eleLis[i].firstElementChild;
                var tempText = tempnode.innerText;
                eleLis[i].innerHTML = "";
                tempnode.innerText = tempText;
                eleLis[i].appendChild(tempnode);
                // btnSetWorkDay.innerText = "设置为非工作日";
            }
        }
    }
}

function getFormatDate(date) {
    var year = date.getFullYear(),
        day = date.getDate(),
        month = date.getMonth(),
        strMonth = month + 1 < 10 ? '0' + (month + 1) : (month + 1),
        strDay = day < 10 ? '0' + day : day;
    return "" + year + "-" + strMonth + "-" + strDay;
}

function getCurrentSelectDate() {
    var infoTittle = document.getElementById("calender").getElementsByClassName("info-date-tittle")[0].innerText;
    reg = /(\d{4})年(\d{2})月(\d{2})日/;
    reg.test(infoTittle);
    return RegExp.$1 + "-" + RegExp.$2 + "-" + RegExp.$3;
}