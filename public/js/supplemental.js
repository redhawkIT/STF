$(function() {

	var $sidebar   = $(".sidebar"), 
		$window    = $(window),
		offset     = $sidebar.offset(),
		topPadding = 16;

	$window.scroll(function() {
		if ($window.scrollTop() > offset.top) {
			$sidebar.stop().animate({
				marginTop: $window.scrollTop() - offset.top + topPadding
			});
		} else {
			$sidebar.stop().animate({
				marginTop: 0
			});
		}
	});

	$('.btnShow').click(function() {
		var id = this.id.substr(this.id.indexOf('w') + 1)
		console.log(id)
		document.getElementById('desc' + id).classList.remove('hidden')
		document.getElementById('buttonHide' + id).classList.remove('hidden')
		this.classList.add('hidden')
	})

	$('.btnHide').click(function() {
		var id = this.id.substr(this.id.indexOf('e') + 1)
		console.log(id)
		document.getElementById('desc' + id).classList.add('hidden')
		document.getElementById('buttonShow' + id).classList.remove('hidden')
		this.classList.add('hidden')
	})
	
});