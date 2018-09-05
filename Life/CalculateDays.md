<html>
<head>

	<title>日期计算</title>
	<style type="text/css">
	* {
		margin: 0;
		padding: 0;
	}
	input {
		margin: 20px 5%;
		padding: 5px;
		width: 90%;
		height: 30px;
	}
	button {
		margin: 20px 5%;
		padding: 5px;
		width: 90%;
		height: 44px;
	}
	#result-div {
		margin: 20px 5%;
		padding: 5px;
		width: 90%;
		height: 44px;
	}
	</style>
</head>
<body>

<input id="begin-date-input" type="date" />
<input id="calculate-days" type="number" placeholder="这里填假期天数" />
<button onclick="onClickCalculateButton()">计   算</button>
<div id="result-div"></div>

<script type="text/javascript">
	window.onload = function () {
		var beginDateInput = document.getElementById('begin-date-input');
		beginDateInput.value = getFormatDate();
	}
	
	function onClickCalculateButton () {
		var beginDateInput = document.getElementById('begin-date-input');
		var calclulateDays = document.getElementById('calculate-days');
		var days = calclulateDays.value - 1;
		var date = new Date(beginDateInput.value);
		var milliseconds = date.getTime() + 1000*60*60*24*days;
		var newDate= new Date(milliseconds);
		var resultDiv = document.getElementById("result-div");
		resultDiv.innerHTML = getFormatDate(newDate);
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
</script>

</body>
</html>