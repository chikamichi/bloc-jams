var pointsArray = document.getElementsByClassName("point");

var animatePoints = function(points) {
	var revealPoint = function(obj) {
		obj.style.opacity = 1;
		obj.style.webkitTransform = "scaleX(1) translateY(0)";
		obj.style.msTransform = "scaleX(1) translateY(0)";
		obj.style.transform = "scaleX(1) translateY(0)";
	}
	
	forEach(points, revealPoint);
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