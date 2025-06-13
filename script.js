$(function () {
  const playerTrack = $("#player-track");
  const albumName = $("#album-name");
  const trackName = $("#track-name");
  const albumArt = $("#album-art");
  const sArea = $("#s-area");
  const seekBar = $("#seek-bar");
  const trackTime = $("#track-time");
  const insTime = $("#ins-time");
  const sHover = $("#s-hover");
  const playPauseButton = $("#play-pause-button");
  const playPreviousTrackButton = $("#play-previous");
  const playNextTrackButton = $("#play-next");
  const tProgress = $("#current-time");
  const tTime = $("#track-length");

  const albums = [
    "Icona Pop",
    "Unsteady (Remix)",
    "Ghost Stories",
    "The Dutchess",
    "American Beauty/American Psycho",
    "Livingston",
    "Coming to Terms",
    "League of Legends",
    "No Pads, No Helmets...Just Balls",
    "Empires on Fire",
    "The Script",
    "The Betrayed"
  ];

  const trackNames = [
    "All Night - Icona Pop",
    "Unsteady - Ambassadors (Me Before You Remix)",
    "A Sky Full Of Stars - Coldplay",
    "Big Girls Don’t Cry - Fergie",
    "Favourite Record - Fall Out Boy",
    "Go - Livingston",
    "I’m Not Over - Caroline Liar",
    "Legends Never Die - League of Legends",
    "Perfect - Simple Plan",
    "Someone To You - BANNERS",
    "The Man Who Can’t Be Moved - The Script",
    "Where We Belong - LOSTPROPHETS"
  ];

  const albumArtworks = [
    "_1", "_2", "_3", "_4", "_5", "_6",
    "_7", "_8", "_9", "_10", "_11", "_12"
  ];

  const trackUrl = [
    "song1.mp3", "song2.mp3", "song3.mp3", "song4.mp3",
    "song5.mp3", "song6.mp3", "song7.mp3", "song8.mp3",
    "song9.mp3", "song10.mp3", "song11.mp3", "song12.mp3"
  ];

  let audio, currIndex = -1, seekT, seekLoc, seekBarPos;
  let curMinutes, curSeconds, durMinutes, durSeconds;
  let playProgress, bTime, nTime = 0, buffInterval = null;
  let tFlag = false, i = playPauseButton.find("i");

  function playPause() {
    setTimeout(() => {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    let cM = seekLoc / 60;
    let ctMinutes = Math.floor(cM);
    let ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) {
      insTime.text("--:--");
    } else {
      insTime.text(ctMinutes + ":" + ctSeconds);
    }

    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date().getTime();
    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;
    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    tProgress.text(isNaN(curMinutes) ? "00:00" : `${curMinutes}:${curSeconds}`);
    tTime.text(isNaN(durMinutes) ? "00:00" : `${durMinutes}:${durSeconds}`);

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    ) {
      trackTime.removeClass("active");
    } else {
      trackTime.addClass("active");
    }

    seekBar.width(playProgress + "%");

    if (playProgress === 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(() => {
      if ((nTime === 0) || (bTime - nTime > 1000)) {
        albumArt.addClass("buffering");
      } else {
        albumArt.removeClass("buffering");
      }
      bTime = new Date().getTime();
    }, 100);
  }

  function selectTrack(flag) {
    currIndex = flag === 0 || flag === 1 ? currIndex + 1 : currIndex - 1;

    if (currIndex >= 0 && currIndex < albumArtworks.length) {
      if (flag === 0) {
        i.attr("class", "fa fa-play");
      } else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }

      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");

      const currAlbum = albums[currIndex];
      const currTrackName = trackNames[currIndex];
      const currArtwork = albumArtworks[currIndex];
      const currTrackUrl = trackUrl[currIndex];

      audio.src = currTrackUrl;
      nTime = 0;
      bTime = new Date().getTime();

      if (flag !== 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");
        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find("img.active").removeClass("active");
      $("#" + currArtwork).addClass("active");
    } else {
      currIndex = flag === 0 || flag === 1 ? currIndex - 1 : currIndex + 1;
    }
  }

  function initPlayer() {
    audio = new Audio();
    selectTrack(0);
    audio.loop = false;

    playPauseButton.on("click", playPause);
    sArea.mousemove(showHover);
    sArea.mouseout(hideHover);
    sArea.on("click", playFromClickedPos);
    $(audio).on("timeupdate", updateCurrTime);
    playPreviousTrackButton.on("click", () => selectTrack(-1));
    playNextTrackButton.on("click", () => selectTrack(1));
  }

  initPlayer();
});
