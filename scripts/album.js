/* Variables */
var playButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-play"></div></a>';
var pauseButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-pause"></div></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFIle = null;

var $previousButton = $('.left-controls .previous');
var $nextButton = $('.left-controls .next');

/* Functions */
var createSongRow = function(songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>';
	
	var $row = $(template);
	
	var clickHandler = function(event) {
		var $songItem = $(this);
		var songNum = parseInt($songItem.attr("data-song-number"));
		
		if (currentlyPlayingSongNumber === null) {
			$songItem.html(pauseButtonTemplate);
			setSong(songNum);
			updatePlayerBarSong();
		}
		else if (currentlyPlayingSongNumber === songNum) {
			$songItem.html(playButtonTemplate);
			$('.left-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
		} 
		else if (currentlyPlayingSongNumber !== songNum) {
			var $currentlyPlayingSongNumberElement = $("[data-song-number='" + currentlyPlayingSongNumber + "']");
			$currentlyPlayingSongNumberElement.html($currentlyPlayingSongNumberElement.attr('data-song-number'));
			
			$songItem.html(pauseButtonTemplate);
			setSong(songNum);
			updatePlayerBarSong();
		}
	};

	var onHover = function(event) {
		var $hoverSongItem = $(this).find(".song-item-number");
		var hoverSongNum = parseInt($hoverSongItem.attr("data-song-number"));
		
		if (hoverSongNum !== currentlyPlayingSongNumber) {
			$hoverSongItem.html(playButtonTemplate);
		}
	}
	
	var offHover = function(event) {
		var $leaveSongItem = $(this).find(".song-item-number");
		var leaveSongNum = parseInt($leaveSongItem.attr("data-song-number"));
		
		if (leaveSongNum !== currentlyPlayingSongNumber) {
			$leaveSongItem.html(leaveSongNum);
		}
	}
	
	$row.find(".song-item-number").click(clickHandler);
	$row.hover(onHover, offHover);
	
	return $row;
};

var setCurrentAlbum = function(album) {
	currentAlbum = album;
	
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

var updatePlayerBarSong = function() {
	var $playerBarSongName = $(".player-bar-control-group .song-name");
	var $playerBarArtistName = $(".player-bar-control-group .artist-name");
	var $playerBarArtistSongMobile = $(".player-bar-control-group .artist-song-mobile");
	
	if (currentSongFromAlbum !== null) {
		$playerBarSongName.text(currentSongFromAlbum.name);
		$playerBarArtistName.text(currentAlbum.artist);
		$playerBarArtistSongMobile.text($playerBarSongName + " - " + $playerBarArtistName);
	}

	$('.left-controls .play-pause').html(playerBarPauseButton);
};

var trackIndex = function (album, song) {
	return album.songs.indexOf(song);
};

var getSongElementByNumber = function(num) {
	return $("[data-song-number='" + num + "']");
}

var setSong = function(songNumber) {
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

var previousSong = function() {
	var currentIndex = 4;							// Set to end of album by defau;t
	
	if (currentSongFromAlbum != null) {				// If a song is being played
		currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);		// Set to previous index 
		--currentIndex;
	}
	
	if (currentIndex < 0) {						// Wrap around
		currentIndex = 4;
	}
	
	// Reset button for the last song
	var $lastSongElement = getSongElementByNumber(currentlyPlayingSongNumber);
	$lastSongElement.html($lastSongElement.attr('data-song-number'))
	
	// Set the new current song using currentIndex
	setSong(currentIndex + 1);
	
	// Update buttons to reflect new current song
	var $newCurrentSongElement = getSongElementByNumber(currentlyPlayingSongNumber);
	$newCurrentSongElement.html(pauseButtonTemplate);
	
	// Update player bar
	updatePlayerBarSong();
}

var nextSong = function() {
	var currentIndex = 0;						// Set to start of album by defau;t
	
	if (currentSongFromAlbum != null) {				// If a song is being played
		currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);		// Set to next index
		++currentIndex;
	}
	
	if (currentIndex >= currentAlbum.songs.length) {	// Wrap around
		currentIndex = 0;
	}
	
	// Reset button for the last song
	var $lastSongElement = getSongElementByNumber(currentlyPlayingSongNumber);
	$lastSongElement.html($lastSongElement.attr('data-song-number'))
	
	// Set the new current song using currentIndex
	setSong(currentIndex + 1);
	currentlyPlayingSongNumber = currentIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentIndex];
	
	// Update buttons to reflect new current song
	var $newCurrentSongElement = getSongElementByNumber(currentlyPlayingSongNumber);
	$newCurrentSongElement.html(pauseButtonTemplate);
	
	// Update player bar
	updatePlayerBarSong();
}

setCurrentAlbum(albumPicasso);

$(document).ready(function() {
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});

