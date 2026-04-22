
// PLAYER ELEMENTS
const playerBar = document.getElementById("audio-player")
const playBtn = document.getElementById("playButton")
const nextSongBtn = document.getElementById("nextSongButton")
const previousSongBtn = document.getElementById("previousSongButton")
const trackTitle = document.getElementById("trackTitle")
const trackArtist = document.getElementById("trackArtist")
const progressBar = document.getElementById("progressBar");
const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("durationElement");
const shuffleBtn = document.getElementById("shufflePlaylistButton");
const repeatPlaylistBtn = document.getElementById("repeatPlaylistButton");



// PLAYER STATE OBJECT

const player = {

  audio: new Audio(),
  queue: [],  // array of track objects
  currentIndex: 0,
  isPlaying: false,

  load(track) {
    this.audio.src = track.preview;
    this.currentTrack = track;
  },

  play() {
    this.audio.play();
    this.isPlaying = true;
    updatePlayerUI();
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    updatePlayerUI();
  },

  nextSong() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.load(this.queue[this.currentIndex]);
      this.play();
    }
  },

  previousSong() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.load(this.queue[this.currentIndex]);
    this.play();
  }

};



// UPDATE PLAYER UI 
const updatePlayerUI = function() {
    
  // Play / pause button icon
  if (playBtn) playBtn.textContent = player.isPlaying ? "⏸" : "▶";
 
  // Track info
  if (player.currentTrack) {
    if (trackTitle)  trackTitle.textContent  = player.currentTrack.title  || "Unknown Title";
    if (trackArtist) trackArtist.textContent = player.currentTrack.artist || "Unknown Artist";
  }
 
  // Show the player bar if it was hidden
  if (playerBar) playerBar.style.display = "flex";
 
};


// FORMAT SONG TIME

const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
}



const initPlayerListeners = function() {

   // ✅
    player.audio.addEventListener("timeupdate", () => {
        if (!player.audio.duration || isNaN(player.audio.duration)) return;
        const pct = (player.audio.currentTime / player.audio.duration) * 100;

    player.audio.addEventListener("loadedmetadata", () => {
        durationElement.textContent = formatTime(player.audio.duration);
    });

    player.audio.addEventListener("ended", () => player.nextSong());

    progressBar.parentElement.addEventListener("click", (e) => {
        if (!player.audio.duration || isNaN(player.audio.duration)) return; 
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        player.audio.currentTime = pct * player.audio.duration;
    });
}
}


initPlayerListeners();

