$(function () {
	$('input[type="text"]').focus(function () {
		$(this).addClass('focus');
	}).blur(function () {
		$(this).removeClass('focus');
	});
});