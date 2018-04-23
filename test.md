<a id="top" name="top"></a>

<a href="www.baidu.com">aaaaaaaaaaa</a>

<script type="text/javascript">
	window.onload = function () {
		var eles = document.getElementsByTagName('a');
		for (ele in eles) {
			ele.target = '_blank';
		}
	}
</script>