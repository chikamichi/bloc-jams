var pointsArray = document.getElementsByClassName("point");

var animatePoints = function(points) {
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

window.onload = function() {
	if (window.innerHeight > 950) {
		animatePoints(pointsArray);
	}
	
	window.addEventListener('scroll', function(event) {
		if (pointsArray[0].getBoundingClientRect().top <= 500) {
			animatePoints(pointsArray);
		}
	});
}