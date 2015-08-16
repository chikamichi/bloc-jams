var animatePoints = function() {
	var points = document.getElementsByClassName("point");
	
	var revealPoint = function(index) {
		points[index].style.opacity = 1;
		points[index].style.webkitTransform = "scaleX(1) translateY(0)";
		points[index].style.msTransform = "scaleX(1) translateY(0)";
		points[index].style.transform = "scaleX(1) translateY(0)";
	}
	
	revealPoint(0);
	revealPoint(1);
	revealPoint(2);
}

animatePoints();