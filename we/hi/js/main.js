window.onload = function() {
    // 认识时间
    var meetYou = new Date(2017, 1, 2, 13, 27);

    setInterval(function(){
        var now = new Date();
        var delTime = now.getTime() - meetYou.getTime();
        //计算出相差天数
        var days=Math.floor(delTime/(24*3600*1000));

        //计算出小时数
        var leave1=delTime%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));

        //计算相差秒数
        var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000)%60;

        var dayArea = document.getElementById('meetday');
        dayArea.innerHTML = days;
        var hourArea = document.getElementById('meethour');
        hourArea.innerHTML = hours;
        var minuteArea = document.getElementById('meetminute');
        minuteArea.innerHTML = minutes;
        var secondArea = document.getElementById('meetsecond');
        secondArea.innerHTML = seconds;
    }, 1000);

}

