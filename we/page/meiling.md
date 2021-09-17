<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1;" name="viewport" />
    <title></title>
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        body {
            background-color: #eee;
        }
        h1 {
            font-size: 16px;
        }
        #timeArea {
            text-align: center;
            width: 100%;
            height: 40px;
        }
        #time {
            width: 100%;
            margin: 10px auto;
        }
        #timeAreaLL {
            text-align: center;
            width: 100%;
            height: 40px;
        }
        #timeLL {
            width: 100%;
            margin: 10px auto;
        }
    </style>
</head>
<body>

<div id="timeArea"><h1 id="time"></h1></div>
<div id="timeAreaLL"><h1 id="timeLL"></h1></div>

<script type="text/javascript">
    window.onload = function() {
        // 认识时间
        var meetYou = new Date(2017, 1, 2, 13, 27);
        var meetYouLL = new Date(2021, 6, 5, 11, 20);

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

            var result = '与美美认识了 '+days+" 天 "+hours+" 小时 "+minutes+" 分钟 "+seconds+" 秒 啦！";
            var timeArea = document.getElementById('time');
            timeArea.innerHTML = result;

            // 泺泺
            var delTimeLL = now.getTime() - meetYouLL.getTime();
            //计算出相差天数
            var daysLL=Math.floor(delTimeLL/(24*3600*1000));

            //计算出小时数
            var leave1LL=delTimeLL%(24*3600*1000);    //计算天数后剩余的毫秒数
            var hoursLL=Math.floor(leave1LL/(3600*1000));
            //计算相差分钟数
            var leave2LL=leave1LL%(3600*1000);        //计算小时数后剩余的毫秒数
            var minutesLL=Math.floor(leave2LL/(60*1000));

            //计算相差秒数
            var leave3LL=leave2LL%(60*1000);     //计算分钟数后剩余的毫秒数
            var secondsLL=Math.round(leave3LL/1000)%60;

            var resultLL = '我们的泺泺已经出生 '+daysLL+" 天 "+hoursLL+" 小时 "+minutesLL+" 分钟 "+secondsLL+" 秒 啦！";
            var timeAreaLL = document.getElementById('timeLL');
            timeAreaLL.innerHTML = resultLL;

        }, 1000);

    }

</script>
</body>
</html>