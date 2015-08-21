var pointsArray = document.getElementsByClassName("point");

var animatePoints = function() {
	var revealPoint = function() {
		$(this).css({
			opacity: 1,
			transform: "scaleX(1) translateY(0)"
		});
	}
	
	$.each($(".point"), revealPoint);
}

$(window).load(function() {
	if ($(window).height() > 950) {
		animatePoints();
	}
	
	var magicScrollNum = 950 - $(window).height() + 50;
	$(window).scroll(function(event) {
		console.log($(window).scrollTop());
		if ($(window).scrollTop() >= magicScrollNum) {
			animatePoints();
		}
	});
});