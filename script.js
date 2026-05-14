/* 
Project Context:
This project redesigns a basic media player into a digital music album player.
The original reference focuses on general media playback, while this version is
adapted for a multi-track album listening experience.

Design Rationale:
The album cover is placed as the main visual focus because music albums are often
identified through artwork. Playback controls are positioned directly below the
cover to create a clear interaction hierarchy. The tracklist supports direct song
selection, while next and previous buttons support linear album listening.

Interaction Design:
The player includes play/pause, previous, next, volume control, loop, shuffle,
and like interactions. These features were chosen because they support common
music listening behaviours without making the interface overly complex.

Dynamic Feedback:
The play and pause icons change according to the playback state. The album cover,
track title, active tracklist item, progress bar, current time, and status text
also update dynamically. This helps users understand what is happening at all times.

External Resources:
The interface structure is inspired by the course media player and the provided
video player reference. Some coding support and design explanation were assisted
by AI tools. Icons are from Icons8. Music and image assets should be credited
according to their source and licence requirements.
*/

const audio = document.getElementById("audio-player");
const albumCover = document.getElementById("album-cover");
const nowPlaying = document.getElementById("now-playing");

const playPauseBtn = document.getElementById("play-pause-btn");
const playPauseImg = document.getElementById("play-pause-img");
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");

const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-bar-fill");

const volumeBtn = document.getElementById("volume-btn");
const volumeImg = document.getElementById("volume-img");
const volumeContainer = document.getElementById("volume-container");
const volumeSlider = document.getElementById("volume-slider");

const loopBtn = document.getElementById("loop-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const likeBtn = document.getElementById("like-btn");

const playerStatus = document.getElementById("player-status");
const modeStatus = document.getElementById("mode-status");
const likeCount = document.getElementById("like-count");

const trackListItems = document.querySelectorAll("#track-list li");

const tracks = [
  {
    title: "Dry Down",
    src: "music/p-hase_Dry-Down-feat-Ben-Snaath.mp3",
    cover: "images/drydown-Image.png"
  },
  {
    title: "Hes",
    src: "music/p-hase_Hes.mp3",
    cover: "images/hes-Image.png"
  },
  {
    title: "Leapt",
    src: "music/p-hase_Leapt.mp3",
    cover: "images/leapt-Image.png"
  },
  {
    title: "Water Feature",
    src: "music/p-hase_Water-Feature.mp3",
    cover: "images/waterfeature-Image.png"
  }
];

let currentTrackIndex = 0;
let likes = 0;
let isShuffleOn = false;
let isLoopOn = false;

function loadTrack(index) {
  currentTrackIndex = index;

  audio.src = tracks[currentTrackIndex].src;
  albumCover.src = tracks[currentTrackIndex].cover;
  nowPlaying.textContent = tracks[currentTrackIndex].title;

  trackListItems.forEach((item) => {
    item.classList.remove("active-track");
  });

    trackListItems[currentTrackIndex].classList.add("active-track");

  playerStatus.textContent = "Loaded: " + tracks[currentTrackIndex].title;
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function playNextTrack() {
  if (isShuffleOn) {
    currentTrackIndex = getRandomTrackIndex();
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }

  loadTrack(currentTrackIndex);
  audio.play();
}

function playPreviousTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + tracks.length) % tracks.length;

  loadTrack(currentTrackIndex);
  audio.play();
}

function getRandomTrackIndex() {
  let randomIndex = Math.floor(Math.random() * tracks.length);

  while (randomIndex === currentTrackIndex && tracks.length > 1) {
    randomIndex = Math.floor(Math.random() * tracks.length);
  }

  return randomIndex;
}

function updateProgress() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = progressPercent + "%";

    currentTimeText.textContent = formatTime(audio.currentTime);
    durationText.textContent = formatTime(audio.duration);
  }
}

function seekAudio(event) {
  const barWidth = progressBar.clientWidth;
  const clickPosition = event.offsetX;

  audio.currentTime = (clickPosition / barWidth) * audio.duration;
}

function formatTime(time) {
  if (isNaN(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

function toggleVolumeControl() {
  volumeContainer.classList.toggle("show-volume");
}

function updateVolume() {
  audio.volume = volumeSlider.value;

  if (audio.volume === 0) {
    volumeImg.src = "icons/icons8-no-audio-30.png";
    playerStatus.textContent = "Muted";
  } else {
    volumeImg.src = "icons/icons8-audio-30.apng.png";
    playerStatus.textContent = "Volume: " + Math.round(audio.volume * 100) + "%";
  }
}

function toggleLoop() {
  isLoopOn = !isLoopOn;
  audio.loop = isLoopOn;

  loopBtn.classList.toggle("active-control", isLoopOn);
  loopBtn.setAttribute("aria-pressed", isLoopOn);

  updateModeStatus();
}

function toggleShuffle() {
  isShuffleOn = !isShuffleOn;

  shuffleBtn.classList.toggle("active-control", isShuffleOn);
  shuffleBtn.setAttribute("aria-pressed", isShuffleOn);

  updateModeStatus();
}

function updateModeStatus() {
  const loopText = isLoopOn ? "Loop On" : "Loop Off";
  const shuffleText = isShuffleOn ? "Shuffle On" : "Shuffle Off";

  modeStatus.textContent = loopText + " · " + shuffleText;
}

function addLike() {
  likes++;
  likeCount.textContent = "Total likes: " + likes;
  playerStatus.textContent = "Liked this track";
}

playPauseBtn.addEventListener("click", togglePlayPause);
previousBtn.addEventListener("click", playPreviousTrack);
nextBtn.addEventListener("click", playNextTrack);

audio.addEventListener("play", () => {
  playPauseImg.src = "icons/icons8-pause-30.png";
  playerStatus.textContent = "Playing: " + tracks[currentTrackIndex].title;
});

audio.addEventListener("pause", () => {
  playPauseImg.src = "icons/icons8-play-30.png";
  playerStatus.textContent = "Paused";
});

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("ended", () => {
  if (!isLoopOn) {
    playNextTrack();
  }
});

progressBar.addEventListener("click", seekAudio);

volumeBtn.addEventListener("click", toggleVolumeControl);
volumeSlider.addEventListener("input", updateVolume);

loopBtn.addEventListener("click", toggleLoop);
shuffleBtn.addEventListener("click", toggleShuffle);
likeBtn.addEventListener("click", addLike);

trackListItems.forEach((item) => {
  item.addEventListener("click", () => {
    const index = Number(item.dataset.index);
    loadTrack(index);
    audio.play();
  });
});

loadTrack(currentTrackIndex);
updateModeStatus();