var albumPicasso = {
	name: "The Colors",
	artist: "Pablo Picasso",
	label: "Cubism",
	year: "1881",
	albumArtUrl: "assets/images/album_covers/01.png",
	songs: [
		{name: "Blue", length: "4:26"},
		{name: "Green", length: "3:14"},
		{name: "Red", length: "5:01"},
		{name: "Pink", length: "3:21"},
		{name: "Magenta", length: "2:15"}
	]
};


var albumMarconi = {
	name: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ name: 'Hello, Operator?', length: '1:01' },
		{ name: 'Ring, ring, ring', length: '5:01' },
		{ name: 'Fits in your pocket', length: '3:21'},
		{ name: 'Can you hear me now?', length: '3:14' },
		{ name: 'Wrong phone number', length: '2:15'}
	]
};

var createSongRow = function(songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>';
	
	return $(template);
};

var setCurrentAlbum = function(album) {
	var albumTitle = $(".album-view-title");
	var albumArtist = $(".album-view-artist");
	var albumReleaseInfo = $(".album-view-release-info");
	var albumImage = $(".album-cover-art");
	var albumSongList = $(".album-view-song-list");
	
	albumTitle.text(album.name);
	albumArtist.text(album.artist);
	albumReleaseInfo.text(album.year + " " + album.label);
	albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (i = 0; i < album.songs.length; ++i) {
		var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
	}
};

setCurrentAlbum(albumPicasso);

var findParentByClassName = function(element, name) {
	var currentNode = element;
	while (true) {
		if (currentNode.parentNode != null) {					// Check for null	
			if (currentNode.parentNode.className === name) { 	// Check for equality
				return currentNode.parentNode;					// Return found parent
			} 
			else {
				currentNode = currentNode.parentNode;			// Bubble through hierarchy
			}
		}
		else {
			break;
		}
	}
	return null;
};

var getSongItem = function(element) {
	var songItemNum;
	var songRowParent;
	
	switch (element.className) {
		case "song-item-number":
			songItemNum = element;
			break;
		case "album-view-song-item":
			songItemNum = element.querySelector(".song-item-number");
			break;
		default:
			songRowParent = findParentByClassName(element, "album-view-song-item");
			songItemNum = songRowParent.querySelector(".song-item-number");
			break;
	}
	return songItemNum;
};


var playButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-play"></div></a>';
var pauseButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-pause"></div></a>';

var currentlyPlayingSong = null;

var clickHandler = function(targetElement) {
	var songItem = getSongItem(targetElement);
	
	if (currentlyPlayingSong === null) {
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute("data-song-number");
	}
	else if (currentlyPlayingSong === songItem.getAttribute("data-song-number")) {
		songItem.innerHTML = playButtonTemplate;
		currentlyPlayingSong = null;
	} 
	else if (currentlyPlayingSong !== songItem.getAttribute("data-song-number")) {
		var currentlyPlayingSongElement = document.querySelector("[data-song-number='" + currentlyPlayingSong + "']");
		currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	}
};

var songListContainer = document.getElementsByClassName("album-view-song-list")[0];
var songRows = document.getElementsByClassName("album-view-song-item");

window.onload = function() {
	songListContainer.addEventListener("mouseover", function(event) {
		if (event.target.parentElement.className === "album-view-song-item") {
			var enteringSongItem = getSongItem(event.target);
			var enteringSongItemNumber = enteringSongItem.getAttribute("data-song-number");
			
			if (enteringSongItemNumber !== currentlyPlayingSong) {
				enteringSongItem.innerHTML = playButtonTemplate;
			}
		}
	});
	
	for (var i = 0; i < songRows.length; ++i) {
		songRows[i].addEventListener("mouseleave", function(event) {
			var leavingSongItem = getSongItem(event.target);
			var leavingSongItemNumber = leavingSongItem.getAttribute("data-song-number");
			
			if (leavingSongItemNumber !== currentlyPlayingSong) {
				leavingSongItem.innerHTML = leavingSongItemNumber;
			}
		});
		
		songRows[i].addEventListener("click", function(event) {
			clickHandler(event.target);
		});
	}
}

