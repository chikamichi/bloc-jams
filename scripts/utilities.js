function forEach(arr, func) {
	for (var i = arr.length - 1; i >= 0; --i) {
		func(arr[i]);
	}
}