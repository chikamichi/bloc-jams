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
	
	var $row = $(template);
	
	var clickHandler = function() {
		var $songItem = $(this);
		var songNum = $songItem.attr("data-song-number");
		
		if (currentSong === null) {
			$songItem.html(pauseButtonTemplate);
			currentSong = songNum;
		}
		else if (currentSong === songNum) {
			$songItem.html(playButtonTemplate);
			currentSong = null;
		} 
		else if (currentSong !== songNum) {
			var $currentSongElement = $("[data-song-number='" + currentSong + "']");
			$currentSongElement.html($currentSongElement.attr('data-song-number'));
			$songItem.html(pauseButtonTemplate);
			currentSong = songNum;
		}
	};

	var onHover = function(event) {
		var $hoverSongItem = $(this).find(".song-item-number");
		var hoverSongNum = $hoverSongItem.attr("data-song-number");
		
		if (hoverSongNum !== currentSong) {
			$hoverSongItem.html(playButtonTemplate);
		}
	}
	
	var offHover = function(event) {
		var $leaveSongItem = $(this).find(".song-item-number");
		var leaveSongNum = $leaveSongItem.attr("data-song-number");
		
		if (leaveSongNum !== currentSong) {
			$leaveSongItem.html(leaveSongNum);
		}
	}
	
	$row.find(".song-item-number").click(clickHandler);
	$row.hover(onHover, offHover);
	
	return $row;
};

var setCurrentAlbum = function(album) {
	var $albumTitle = $(".album-view-title");
	var $albumArtist = $(".album-view-artist");
	var $albumReleaseInfo = $(".album-view-release-info");
	var $albumImage = $(".album-cover-art");
	var $albumSongList = $(".album-view-song-list");
	
	$albumTitle.text(album.name);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + " " + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (i = 0; i < album.songs.length; ++i) {
		var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
	}
};

setCurrentAlbum(albumPicasso);

var currentSong = null;
var playButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-play"></div></a>';
var pauseButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-pause"></div></a>';

$(document).ready(function() {
});

