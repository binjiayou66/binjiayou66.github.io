<html>
<head>

	<title>日期计算</title>
	<style type="text/css">
	* {
		margin: 0;
		padding: 0;
	}
	div.wrapper {
		margin: 20px 5%;
	}
	p {
		width: 15%;
		display: inline-block;
	}
	input {
		padding: 0 1%;
		width: 82%;
		height: 30px;
		display: inline-block;
	}
	button {
		margin: 20px 5%;
		padding: 5px;
		width: 90%;
		height: 44px;
	}
	</style>
</head>
<body>

<div class="wrapper"><p>开始日期：</p><input id="begin-date-input" type="date" /></div>
<div class="wrapper"><p>假期天数：</p><input id="calculate-days" type="number" placeholder="这里填假期天数" /></div>
<div class="wrapper"><p>截止日期：</p><input id="end-date-input" type="date" ></div>
<button onclick="onClickCalculateButton()">计   算</button>

<script type="text/javascript">

	var beginDateInput = document.getElementById('begin-date-input');
	var calclulateDays = document.getElementById('calculate-days');
	var endDateInput = document.getElementById("end-date-input");
	
	window.onload = function () {
	
	}
	
	function onClickCalculateButton () {
		var beginValue = beginDateInput.value;
		var daysValue = calclulateDays.value;
		var endValue = endDateInput.value;
	
		if (beginValue && daysValue && endValue) 
		{
			alert("只能任意输入两个值");
		} 
		else if (beginValue && daysValue && !endValue) 
		{
			var bd = new Date(beginValue);
			var d = daysValue - 1;
			var s = bd.getTime() + 1000*60*60*24*d;
			var ed = new Date(s);
			endDateInput.value = getFormatDate(ed);
		}
		else if (beginValue && !daysValue && endValue) 
		{
			calclulateDays.value = getDateDiff(beginValue, endValue);
		} 
		else if (!beginValue && daysValue && endValue) 
		{
			var bd = new Date(endValue);
			var d = daysValue - 1;
			var s = bd.getTime() + 1000*60*60*24*-d;
			var ed = new Date(s);
			beginDateInput.value = getFormatDate(ed);
		} 
		else 
		{
			alert("任意输入两个值");
		}
	}
	
	function getFormatDate(date) {
		if (!date) date = new Date();
	    var seperator1 = "-";
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    var currentdate = year + seperator1 + month + seperator1 + strDate;
	    return currentdate;
	}
	
	 function getDateDiff(sDate1, sDate2) {
	   var aDate, oDate1, oDate2, iDays;
	   aDate = sDate1.split("-");
	   oDate1 = new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	   aDate = sDate2.split("-"); 
	   oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	   iDays = parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24); 
	   return iDays + 1;
	}
</script>

</body>
</html>