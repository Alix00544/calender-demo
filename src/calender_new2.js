// 初始化，获得当前日期日历
(function (date) {
    var calender = document.getElementById("calender"),
        dates = calender.getElementsByClassName("dates")[0], // 左侧日历界面
        headTitle = calender.getElementsByClassName("calender-header-title")[0], // 左侧顶部日期标题 'xxxx年xx月'
        infoTittle = calender.getElementsByClassName("info-date-tittle")[0], // 右侧顶部日期标题 'xxxx年xx月xx日 星期x'
        infoDate = calender.getElementsByClassName('info-date')[0], // 右侧中部展示的当前选中日期 'xx'
        selects = { // 右侧select中选择的时间
            morningHour= document.getElementById('morningHour'),
            morningMinute= document.getElementById('morningMinute'),
            morningHourEnd= document.getElementById('morningHourEnd'),
            morningMinuteEnd= document.getElementById('morningMinuteEnd'),
            afterHour= document.getElementById('afterHour'),
            afterMinute= document.getElementById('afterMinute'),
            afterHourEnd= document.getElementById('afterHourEnd'),
            afterMinuteEnd= document.getElementById('afterMinuteEnd')
        };
    var today = new Date(), // 当前时间
        selectDay = new Date(),  // 当前选中的日期，注意，选中的日期和展示的日期不同
        currentShowDate = new Date(), //当前展示的日期
        prevMoth = new Date().setMonth(currentShowDate.getMonth() - 1), // 当前展示日期的前一个月
        nextMonth = new Date().setMonth(currentShowDate.getMonth() + 1); // 当前展示日期的下一个月

    showCalender(today);
    addEventForHeader();
    setSelect();
}(new Date()))


function showCalender(date) {
    createCalender(date);
    addEvent();
}

// 创建新的日历界面
function createCalender(date) {
    var dateInfo = getDateInfo(date),
        today = new Date(),
        todayInfo = getDateInfo(today),
        prevDays = dateInfo.weekday - 1,
        calender = document.getElementById("calender"),
        dates = calender.getElementsByClassName("dates")[0],
        headTitle = calender.getElementsByClassName("calender-header-title")[0],
        infoTittle = calender.getElementsByClassName("info-date-tittle")[0],
        ul = document.createElement("ul"),
        eventDay,
        eventNumber;
    dates.innerHTML = '';
    ul.className = 'event-week';
    headTitle.innerText = '' + dateInfo.year + '年' + dateInfo.strMonth + '月';
    infoTittle.innerText = "" + todayInfo.year + "年" + todayInfo.strMonth + "月" + todayInfo.day + "日 " + todayInfo.strWeek;
    calender.getElementsByClassName('info-date')[0].innerText = todayInfo.strDay;

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
                var className = ele[i].className;
                ele[i].className = className.split(" selected")[0];
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
    var currentDate = getCurrentShowDate(),
        year = currentDate.getFullYear(),
        month = currentDate.getMonth(),
        showDate;
    if (this.firstChild.className == 'day-number prev-month') {
        showDate = new Date(year, month - 1, this.firstChild.innerText);
    } else if (this.firstChild.className == 'day-number') {
        showDate = new Date(year, month, this.firstChild.innerText);
    } else {
        showDate = new Date(year, month + 1, this.firstChild.innerText);
    }
    var date = getDateInfo(showDate);
    infoTittle.innerText = "" + date.year + "年" + date.strMonth + "月" + date.day + "日 " + date.strWeek;
    calender.getElementsByClassName('info-date')[0].innerText = date.strDay;
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

    morningHour.value = 8;
    morningMinute.value = 0;
    morningHourEnd.value = 12;
    morningMinuteEnd.value = 30;
    afterHour.value = 13;
    afterMinute.value = 0;
    afterHourEnd.value = 17;
    afterMinuteEnd.value = 30;

    btnSetWorkDay.addEventListener('click', function (e) {

    });
    btnSaveTime.addEventListener('click', function (e) {

    });
}


function getCurrentSelectDate() {
    var infoTittle = document.getElementById("calender").getElementsByClassName("info-date-tittle")[0].innerText;
}



