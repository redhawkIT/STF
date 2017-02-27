$(function() {

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