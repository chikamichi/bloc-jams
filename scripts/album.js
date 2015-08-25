/* Variables */
var playButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-play"></div></a>';
var pauseButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-pause"></div></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $(".left-controls .previous");
var $nextButton = $(".left-controls .next");
var $playButton = $(".left-controls .play-pause");

/* Functions */
var createSongRow = function(songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>';
	
	var $row = $(template);
	
	var clickHandler = function() {
		var songNum = parseInt($(this).attr("data-song-number"));
		
		if (currentlyPlayingSongNumber !== null) {			// If a song is already selected
			// Reset current song icon to song number
			var $currentlyPlayingElement = $("[data-song-number='" + currentlyPlayingSongNumber + "']");
			$currentlyPlayingElement.html($currentlyPlayingElement.attr('data-song-number'));
		}
		
		if (currentlyPlayingSongNumber !== songNum) { 		// If a different song is selected
			setSong(songNum);								// Set new song
			$(this).html(pauseButtonTemplate);				// Toggle pause icon
			updatePlayerBarSong();							// Update player bar
			currentSoundFile.play();						// Play the new song file
		}
		else if (currentlyPlayingSongNumber === songNum) {	// Or if the same song is reselected
			$(this).html(playButtonTemplate);				// Reset the icon template
			$('.left-controls .play-pause').html(playerBarPlayButton);	// Reset the player bar play icon
			if (currentSoundFile.isPaused()) {
				currentSoundFile.play();
			}
			else {
				currentSoundFile.pause();
			}
		} 
	};

	var onHover = function(event) {
		var $hoverSongItem = $(this).find(".song-item-number");
		var hoverSongNum = parseInt($hoverSongItem.attr("data-song-number"));
		
		if (hoverSongNum !== currentlyPlayingSongNumber || currentSoundFile.isPaused()) {
			$hoverSongItem.html(playButtonTemplate);
		}
	}
	
	var offHover = function(event) {
		var $leaveSongItem = $(this).find(".song-item-number");
		var leaveSongNum = parseInt($leaveSongItem.attr("data-song-number"));
		
		if (leaveSongNum !== currentlyPlayingSongNumber || currentSoundFile.isPaused()) {
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
};

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: ["mp3"],
		preload: true
	});
	
	setVolume(currentVolume);
};

var setVolume = function(newVolume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(newVolume);
	}
};

var previousSong = function() {
	var currentIndex = 4;							// Set to end of album by defau;t
	
	if (currentSongFromAlbum != null) {				// If a song is being played
		currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);		// Set to previous index 
		--currentIndex;
	}
	
	if (currentIndex < 0) {							// Wrap around
		currentIndex = 4;
	}
	
	// Reset button for the last song
	var $lastSongElement = getSongElementByNumber(currentlyPlayingSongNumber);
	$lastSongElement.html($lastSongElement.attr('data-song-number'))
	
	// Update buttons to reflect new current song
	var $newCurrentSongElement = getSongElementByNumber(currentIndex + 1);
	$newCurrentSongElement.html(pauseButtonTemplate);
	
	setSong(currentIndex + 1); 	// Set the new current song using currentIndex
	currentSoundFile.play();	// Play the new current song
	updatePlayerBarSong();		// Update player bar
};

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
	
	// Update buttons to reflect new current song
	var $newCurrentSongElement = getSongElementByNumber(currentIndex + 1);
	$newCurrentSongElement.html(pauseButtonTemplate);
	
	setSong(currentIndex + 1); 	// Set the new current song using currentIndex
	currentSoundFile.play();	// Play the new current song
	updatePlayerBarSong();		// Update player bar
};

var togglePlayFromPlayerBar = function () {
	if (currentSoundFile.isPaused()) {		
	}
}

setCurrentAlbum(albumPicasso);

$(document).ready(function() {
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playButton.click(togglePlayFromPlayerBar);
});

