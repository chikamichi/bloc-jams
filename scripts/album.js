/* Variables */
var playButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-play"></div></a>';
var pauseButtonTemplate = '<a class="album-song-button"><div class="album-song-button-icon ion-pause"></div></a>';

var playerBarPlayButton = '<div class="ion-play"></div>';
var playerBarPauseButton = '<div class="ion-pause"></div>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $(".left-controls .previous");
var $nextButton = $(".left-controls .next");
var $playButton = $(".left-controls .play-pause");

/* Album */
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
			updateSeekBarWhileSongPlays();
		}
		else if (currentlyPlayingSongNumber === songNum) {	// Or if the same song is reselected
			$(this).html(playButtonTemplate);				// Reset the icon template
			$('.left-controls .play-pause').html(playerBarPlayButton);	// Reset the player bar play icon
			if (currentSoundFile.isPaused()) {
				currentSoundFile.play();
				updateSeekBarWhileSongPlays()
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

/* Seekbar  */
var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	
	var percentageString = offsetXPercent + '%';
	$seekBar.find(".fill").width(percentageString);
	$seekBar.find(".thumb").css({left: percentageString});
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind("timeupdate", function timeUpdate(event) {
			// Only update when the song is playing
			if (!currentSoundFile.isPaused()) {
				var seekBarFillRatio = this.getTime()/this.getDuration();
				var $seekBar = $(".seek-control .seek-bar");
				updateSeekPercentage($seekBar, seekBarFillRatio);
				setCurrentTimeInPlayerBar(currentSoundFile.getTime());
				setTotalTimeInPlayerBar(currentSoundFile.getDuration());
			}
		});
	}
};

var setupSeekBars = function() {
	var $seekBars = $(".player-bar .seek-bar");
	
	$seekBars.click(function(event) {
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		var seekBarFillRatio = offsetX/barWidth;
		
		if ($(this).parents("div.seek-control").length > 0 && currentSoundFile) {
			seek(seekBarFillRatio * currentSoundFile.getDuration());
			updateSeekPercentage($(this), seekBarFillRatio);
		}
		else if ($(this).parents("div.volume").length > 0 && currentSoundFile) {
			currentSoundFile.setVolume(seekBarFillRatio * 100);
			updateSeekPercentage($(this), seekBarFillRatio);
		}
	});
	
	$seekBars.find(".thumb").mousedown(function(event) {
		var $seekBar = $(this).parent();
		$(document).bind("mousemove.thumb", function(event) {
			currentSoundFile.pause();	// Pause the song while seeking
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX/barWidth;
			updateSeekPercentage($seekBar, seekBarFillRatio);
		});
		
		$(document).bind("mouseup.thumb", function() {
			currentSoundFile.play();	// Play the song once seeking is done
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
};

/* Player bar  */
var updatePlayerBarSong = function() {
	var $playerBarSongName = $(".player-bar-control-group .song-name");
	var $playerBarArtistName = $(".player-bar-control-group .artist-name");
	var $playerBarArtistSongMobile = $(".player-bar-control-group .artist-song-mobile");
	
	if (currentSongFromAlbum) {
		$playerBarSongName.text(currentSongFromAlbum.name);
		$playerBarArtistName.text(currentAlbum.artist);
		$playerBarArtistSongMobile.text($playerBarSongName + " - " + $playerBarArtistName);
	}
	
	if (currentSoundFile) {
		// Set default volume
		var $volumeSeekBar = $(".volume .seek-bar");
		var volumeDefault = currentSoundFile.getVolume()/100
		updateSeekPercentage($volumeSeekBar, volumeDefault);
	}

	$('.left-controls .play-pause').html(playerBarPauseButton);
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
	
	setSong(currentIndex + 1); 		// Set the new current song using currentIndex
	currentSoundFile.play();		// Play the new current song
	updatePlayerBarSong();			// Update player bar
	updateSeekBarWhileSongPlays(); 	// Begin seekbar update
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
	
	setSong(currentIndex + 1); 		// Set the new current song using currentIndex
	currentSoundFile.play();		// Play the new current song
	updatePlayerBarSong();			// Update player bar
	updateSeekBarWhileSongPlays();	// Begin seekbar update
};

var togglePlayFromPlayerBar = function () {
	if (!currentSoundFile) { 					// Check for existing song
		return;
	}
	var $songElement = getSongElementByNumber(currentlyPlayingSongNumber);
		
	if (currentSoundFile.isPaused()) {			// When song is paused
		$songElement.html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
	}
	else {										// When song is oplaying
		$songElement.html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.pause();
	}
}

/* Helpers */
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

var setCurrentTimeInPlayerBar = function(currentTime) {
	$(".current-time").text(parseTimeCode(currentTime));
}

var setTotalTimeInPlayerBar = function(totalTime) {
	$(".total-time").text(parseTimeCode(totalTime));
}

var parseTimeCode = function(timeInSeconds) {
	/*
	var formattedTime = buzz.toTimer(timeInSeconds);
	return formattedTime;
	*/
	var minutes = Math.floor(timeInSeconds/60);
	var seconds = Math.floor(timeInSeconds - (minutes * 60));
	var formattedTime = minutes + ":";
	if (seconds < 10)	{formattedTime += "0";}
	formattedTime += seconds;
	
	return formattedTime;
}

/* Main */
setCurrentAlbum(albumPicasso);

$(document).ready(function() {
	setupSeekBars();
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playButton.click(togglePlayFromPlayerBar);
});

