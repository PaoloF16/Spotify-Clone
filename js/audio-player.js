document.addEventListener("DOMContentLoaded", () => {
  const GlobalPlayer = (() => {
    const audio = new Audio()

    const state = {
      queue: [],
      currentIndex: -1,
      isShuffle: false,
      isRepeat: false,
      isFavorite: false,
      volume: 1,
      initialized: false,
    }

    const els = {
      player: document.getElementById("audio-player"),
      cardSongs: null,

      controlBtns: document.getElementById("control-btns"),
      rangeBar: document.getElementById("range-bar"),
      volumeBar: document.getElementById("volume-bar"),
      favoriteIcon: document.getElementById("favorite-icon"),

      footerTitle: document.querySelector("#audio-player .song-title h4"),
      footerArtist: document.querySelector("#audio-player .song-title p"),
      footerCover: document.querySelector("#audio-player .song-title img"),

      rightSidebarMainTitle: document.getElementById("side-bar-main-title"),
      rightSidebarPosterImg: document.getElementById("side-poster-img"),
      rightSidebarSongTitle: document.getElementById("side-song-title"),
      rightSidebarSongArtist: document.getElementById("side-song-artist"),
      creditArtistImg: document.getElementById("credit-artist-img"),
      creditArtistName: document.getElementById("credit-artist-name"),
      rightSidebarNextImg: document.getElementById("right-sidebar-next-img"),
      rightSidebarNextTitle: document.getElementById(
        "right-sidebar-next-title",
      ),
      rightSidebarNextArtist: document.getElementById(
        "right-sidebar-next-artist",
      ),

      heroPlayButton: document.querySelector(
        "#main-content .bg-success.rounded-circle",
      ),
    }

    const controlButtons = els.controlBtns
      ? els.controlBtns.querySelectorAll("button")
      : []

    const buttons = {
      shuffle: controlButtons[0] || null,
      prev: controlButtons[1] || null,
      playPause: controlButtons[2] || null,
      next: controlButtons[3] || null,
      repeat: controlButtons[4] || null,
    }

    const playPauseIcon = buttons.playPause
      ? buttons.playPause.querySelector("i")
      : null

    let observedSongsContainer = null
    let songsObserver = null

    function getSongsContainer() {
      els.cardSongs =
        document.getElementById("cardSongs") ||
        document.getElementById("lista-brani-popolari") ||
        document.getElementById("browse-ranking-list") ||
        null

      return els.cardSongs
    }

    function formatTime(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    function paintRange(input, percentage) {
      if (!input) return
      const safePercentage = Math.max(0, Math.min(100, percentage))
      input.style.background = `linear-gradient(to right, #1ed760 0%, #1ed760 ${safePercentage}%, #4d4d4d ${safePercentage}%, #4d4d4d 100%)`
    }

    function getTimeLabels() {
      const spans = document.querySelectorAll("#time-bar span")
      return {
        current: spans[0] || null,
        duration: spans[1] || null,
      }
    }

    function normalizeTrack(track) {
      if (!track) return null

      const src = track.preview || track.src || track.trackSrc || ""
      if (!src) return null

      return {
        id:
          track.id ||
          track.trackId ||
          `${track.title || track.trackTitle || "track"}-${
            track.artist?.name ||
            track.artistName ||
            track.trackArtist ||
            track.artist ||
            "artist"
          }-${src}`,
        title: track.title || track.trackTitle || "Titolo brano",
        artist:
          track.artist?.name ||
          track.artistName ||
          track.trackArtist ||
          track.artist ||
          "Artista brano",
        cover:
          track.album?.cover_medium ||
          track.album?.cover_small ||
          track.album?.cover ||
          track.trackCover ||
          track.cover ||
          "./assets/imgs/main/image-12.jpg",
        rank: Number(track.rank || track.trackRank || 0),
        duration: Number(track.duration || track.trackDuration || 30),
        src,
      }
    }

    function buildTrackFromRow(row) {
      if (!row) return null

      return normalizeTrack({
        trackId: row.dataset.trackId,
        trackTitle: row.dataset.trackTitle,
        trackArtist: row.dataset.trackArtist,
        trackCover: row.dataset.trackCover,
        trackSrc: row.dataset.trackSrc,
        trackDuration: row.dataset.trackDuration,
        trackRank: row.dataset.trackRank,
      })
    }

    function rebuildQueueFromDOM() {
      const container = getSongsContainer()

      if (!container) {
        state.queue = []
        state.currentIndex = -1
        updateNextPreview()
        return
      }

      const rows = Array.from(container.querySelectorAll("[data-track-src]"))

      state.queue = rows.map(buildTrackFromRow).filter(Boolean)

      if (!state.queue.length) {
        state.currentIndex = -1
      } else if (state.currentIndex >= state.queue.length) {
        state.currentIndex = 0
      }

      updateNextPreview()
    }

    function updatePlayPauseIcon() {
      if (!playPauseIcon) return

      if (audio.paused) {
        playPauseIcon.classList.remove("bi-pause-circle-fill")
        playPauseIcon.classList.add("bi-play-circle-fill")
      } else {
        playPauseIcon.classList.remove("bi-play-circle-fill")
        playPauseIcon.classList.add("bi-pause-circle-fill")
      }
    }

    function updateFavoriteIcon() {
      if (!els.favoriteIcon) return

      els.favoriteIcon.classList.toggle("bi-heart", !state.isFavorite)
      els.favoriteIcon.classList.toggle("bi-heart-fill", state.isFavorite)
      els.favoriteIcon.classList.toggle("text-success", state.isFavorite)
    }

    function updateVolumeIcon() {
      const volumeIcon = document.querySelector('label[for="volume-bar"] i')
      if (!volumeIcon) return

      volumeIcon.classList.remove(
        "bi-volume-up",
        "bi-volume-down",
        "bi-volume-mute",
      )

      if (audio.volume === 0) {
        volumeIcon.classList.add("bi-volume-mute")
      } else if (audio.volume < 0.5) {
        volumeIcon.classList.add("bi-volume-down")
      } else {
        volumeIcon.classList.add("bi-volume-up")
      }
    }

    function updateFooter(track) {
      if (!track) return

      if (els.footerTitle) els.footerTitle.textContent = track.title
      if (els.footerArtist) els.footerArtist.textContent = track.artist

      if (els.footerCover) {
        els.footerCover.src = track.cover
        els.footerCover.alt = track.title
      }
    }

    function updateRightSidebar(track) {
      if (!track) return

      if (els.rightSidebarMainTitle) {
        els.rightSidebarMainTitle.textContent = track.artist
      }

      if (els.rightSidebarPosterImg) {
        els.rightSidebarPosterImg.src = track.cover
        els.rightSidebarPosterImg.alt = track.artist
      }

      if (els.rightSidebarSongTitle) {
        els.rightSidebarSongTitle.textContent = track.title
      }

      if (els.rightSidebarSongArtist) {
        els.rightSidebarSongArtist.textContent = track.artist
      }

      if (els.creditArtistImg) {
        els.creditArtistImg.src = track.cover
        els.creditArtistImg.alt = track.artist
      }

      if (els.creditArtistName) {
        els.creditArtistName.textContent = track.artist
      }
    }

    function updateNextPreview() {
      if (!state.queue.length) {
        if (els.rightSidebarNextTitle) {
          els.rightSidebarNextTitle.textContent = "Nessun brano"
        }
        if (els.rightSidebarNextArtist) {
          els.rightSidebarNextArtist.textContent = "Nessun artista"
        }
        return
      }

      let nextIndex = state.currentIndex + 1
      if (nextIndex >= state.queue.length || state.currentIndex === -1) {
        nextIndex = 0
      }

      const nextTrack = state.queue[nextIndex]
      if (!nextTrack) return

      if (els.rightSidebarNextImg) {
        els.rightSidebarNextImg.src = nextTrack.cover
        els.rightSidebarNextImg.alt = nextTrack.title
      }

      if (els.rightSidebarNextTitle) {
        els.rightSidebarNextTitle.textContent = nextTrack.title
      }

      if (els.rightSidebarNextArtist) {
        els.rightSidebarNextArtist.textContent = nextTrack.artist
      }
    }

    function updateTimeUI() {
      const labels = getTimeLabels()

      const duration = Number.isFinite(audio.duration) ? audio.duration : 30
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0

      if (els.rangeBar) {
        els.rangeBar.max = duration
        els.rangeBar.value = current

        const percentage = duration > 0 ? (current / duration) * 100 : 0
        paintRange(els.rangeBar, percentage)
      }

      if (labels.current) labels.current.textContent = formatTime(current)
      if (labels.duration) labels.duration.textContent = formatTime(duration)
    }

    function clearActiveRows() {
      const container = getSongsContainer()
      if (!container) return

      container.querySelectorAll(".gp-active-track").forEach((row) => {
        row.classList.remove("gp-active-track")
      })
    }

    function setActiveRow(index) {
      clearActiveRows()

      const container = getSongsContainer()
      if (!container) return

      const row = container.querySelector(`[data-track-index="${index}"]`)
      if (row) row.classList.add("gp-active-track")
    }

    function ensureActiveRowStyles() {
      if (document.getElementById("global-player-styles")) return

      const style = document.createElement("style")
      style.id = "global-player-styles"
      style.textContent = `
        .gp-active-track {
          background-color: rgba(255,255,255,0.12) !important;
        }

        .gp-active-track p,
        .gp-active-track small,
        .gp-active-track div,
        .gp-active-track span {
          color: #1ed760 !important;
        }
      `
      document.head.appendChild(style)
    }

    function loadTrack(index, autoplay = true) {
      if (!state.queue.length) return
      if (index < 0 || index >= state.queue.length) return

      state.currentIndex = index
      state.isFavorite = false
      updateFavoriteIcon()

      const track = state.queue[index]

      audio.src = track.src
      audio.load()

      // -------------------------
      // Tancredi function 
      // -------------------------

      if (els.favoriteIcon) {
        els.favoriteIcon.dataset.trackId       = track.id;
        els.favoriteIcon.dataset.trackTitle    = track.title;
        els.favoriteIcon.dataset.trackArtist   = track.artist;
        els.favoriteIcon.dataset.trackCover    = track.cover;
        els.favoriteIcon.dataset.trackRank     = track.rank;
        els.favoriteIcon.dataset.trackSrc      = track.src;
        els.favoriteIcon.dataset.trackDuration = track.duration;
      }
      
      // -------------------------
      // Tancredi function 
      // -------------------------

      updateFooter(track)
      updateRightSidebar(track)
      updateNextPreview()
      setActiveRow(index)

      if (autoplay) {
        audio.play().catch((error) => {
          console.error("Errore durante la riproduzione:", error)
        })
      }

      updatePlayPauseIcon()
    }

    function togglePlayPause() {
      if (!audio.src) {
        rebuildQueueFromDOM()

        if (state.queue.length > 0) {
          loadTrack(state.currentIndex >= 0 ? state.currentIndex : 0, true)
        }
        return
      }

      if (audio.paused) {
        audio.play().catch((error) => {
          console.error("Errore play:", error)
        })
      } else {
        audio.pause()
      }

      updatePlayPauseIcon()
    }

    function playNext() {
      rebuildQueueFromDOM()
      if (!state.queue.length) return

      let nextIndex

      if (state.isShuffle) {
        if (state.queue.length === 1) {
          nextIndex = 0
        } else {
          do {
            nextIndex = Math.floor(Math.random() * state.queue.length)
          } while (nextIndex === state.currentIndex)
        }
      } else {
        nextIndex = state.currentIndex + 1
        if (nextIndex >= state.queue.length || state.currentIndex === -1) {
          nextIndex = 0
        }
      }

      loadTrack(nextIndex, true)
    }

    function playPrev() {
      rebuildQueueFromDOM()
      if (!state.queue.length) return

      if (audio.currentTime > 3) {
        audio.currentTime = 0
        return
      }

      let prevIndex = state.currentIndex - 1
      if (prevIndex < 0) prevIndex = state.queue.length - 1

      loadTrack(prevIndex, true)
    }

    function bindControls() {
      if (buttons.playPause) {
        buttons.playPause.addEventListener("click", togglePlayPause)
      }

      if (buttons.next) {
        buttons.next.addEventListener("click", playNext)
      }

      if (buttons.prev) {
        buttons.prev.addEventListener("click", playPrev)
      }

      if (buttons.shuffle) {
        buttons.shuffle.addEventListener("click", () => {
          state.isShuffle = !state.isShuffle
          buttons.shuffle.classList.toggle("text-light", state.isShuffle)
          buttons.shuffle.classList.toggle("text-secondary", !state.isShuffle)
        })
      }

      if (buttons.repeat) {
        buttons.repeat.addEventListener("click", () => {
          state.isRepeat = !state.isRepeat
          audio.loop = state.isRepeat
          buttons.repeat.classList.toggle("text-light", state.isRepeat)
          buttons.repeat.classList.toggle("text-secondary", !state.isRepeat)
        })
      }

      if (els.favoriteIcon) {
        els.favoriteIcon.addEventListener("click", () => {
          state.isFavorite = !state.isFavorite
          updateFavoriteIcon()
        })
      }

      if (els.rangeBar) {
        els.rangeBar.min = 0
        els.rangeBar.max = 30
        els.rangeBar.step = 0.1
        els.rangeBar.value = 0
        paintRange(els.rangeBar, 0)

        els.rangeBar.addEventListener("input", () => {
          const value = Number(els.rangeBar.value || 0)
          const max = Number(els.rangeBar.max || 30)

          audio.currentTime = value

          const percentage = max > 0 ? (value / max) * 100 : 0
          paintRange(els.rangeBar, percentage)

          const labels = getTimeLabels()
          if (labels.current) {
            labels.current.textContent = formatTime(value)
          }
        })
      }

      if (els.volumeBar) {
        els.volumeBar.min = 0
        els.volumeBar.max = 100
        els.volumeBar.step = 1
        els.volumeBar.value = state.volume * 100

        audio.volume = state.volume
        paintRange(els.volumeBar, state.volume * 100)
        updateVolumeIcon()

        els.volumeBar.addEventListener("input", () => {
          const rawValue = Number(els.volumeBar.value || 0)
          const normalizedVolume = Math.max(0, Math.min(1, rawValue / 100))

          state.volume = normalizedVolume
          audio.volume = normalizedVolume

          paintRange(els.volumeBar, rawValue)
          updateVolumeIcon()
        })
      }

      if (els.heroPlayButton) {
        els.heroPlayButton.addEventListener("click", () => {
          rebuildQueueFromDOM()

          if (!state.queue.length) {
            togglePlayPause()
            return
          }

          if (state.currentIndex === -1) {
            loadTrack(0, true)
          } else {
            togglePlayPause()
          }
        })
      }
    }

    function bindTrackClicks() {
      document.addEventListener("click", (event) => {
        if (event.target.closest('[data-no-play="true"]')) return

        const row = event.target.closest("[data-track-src]")
        if (!row) return

        rebuildQueueFromDOM()

        const index = Number(row.dataset.trackIndex)
        if (Number.isNaN(index)) return

        if (index === state.currentIndex && audio.src) {
          togglePlayPause()
          return
        }

        loadTrack(index, true)
      })
    }

    function bindAudioEvents() {
      audio.addEventListener("loadedmetadata", updateTimeUI)
      audio.addEventListener("timeupdate", updateTimeUI)
      audio.addEventListener("play", updatePlayPauseIcon)
      audio.addEventListener("pause", updatePlayPauseIcon)

      audio.addEventListener("ended", () => {
        if (state.isRepeat) {
          audio.currentTime = 0
          audio.play().catch((error) => {
            console.error("Errore repeat:", error)
          })
          return
        }

        playNext()
      })
    }

    function watchSongContainer() {
      const attachObserver = () => {
        const container = getSongsContainer()

        if (songsObserver) {
          songsObserver.disconnect()
          songsObserver = null
        }

        observedSongsContainer = container

        if (!container) return

        songsObserver = new MutationObserver(() => {
          rebuildQueueFromDOM()
        })

        songsObserver.observe(container, {
          childList: true,
          subtree: true,
        })
      }

      attachObserver()

      const bodyObserver = new MutationObserver(() => {
        const currentContainer = getSongsContainer()

        if (currentContainer !== observedSongsContainer) {
          attachObserver()
        }
      })

      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }

    function initDefaultUI() {
      updatePlayPauseIcon()
      updateFavoriteIcon()
      updateNextPreview()
      updateVolumeIcon()

      const labels = getTimeLabels()
      if (labels.current) labels.current.textContent = "0:00"
      if (labels.duration) labels.duration.textContent = "0:30"

      if (els.volumeBar) {
        els.volumeBar.value = state.volume * 100
        paintRange(els.volumeBar, state.volume * 100)
      }

      if (els.rangeBar) {
        els.rangeBar.value = 0
        els.rangeBar.max = 30
        paintRange(els.rangeBar, 0)
      }
    }

    function init() {
      if (state.initialized) return
      if (!els.player) return

      ensureActiveRowStyles()
      bindControls()
      bindTrackClicks()
      bindAudioEvents()
      watchSongContainer()
      rebuildQueueFromDOM()
      initDefaultUI()

      state.initialized = true
    }

    return {
      init,
      rebuildQueueFromDOM,
      togglePlayPause,
      playNext,
      playPrev,
      audio,
    }
  })()

  window.GlobalPlayer = GlobalPlayer
  GlobalPlayer.init()
})
