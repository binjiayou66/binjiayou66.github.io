<a id="top" name="top"></a>

<a href="www.baidu.com">aaaaaaaaaaa</a>

<script type="text/javascript">
	window.onload = function () {
		var eles = document.getElementsByTagName('a');
		for (var i = 0; i < eles.length; i++) {
			eles[i].setAttribute('target', '_blank');
		}
	}
</script>