const searchInput = document.getElementById("inputSearch")
const dataList = document.getElementById("listaData")
const containerProfileArtist =
  document.getElementById("cardArtist") ||
  document.getElementById("intestazione-artista")

const cardSongs =
  document.getElementById("cardSongs") ||
  document.getElementById("lista-brani-popolari")

const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q="

const artistBgImage =
  document.getElementById("artist-bg-image") ||
  document.getElementById("intestazione-artista")
const artistNameElement = document.getElementById("nome-artista")
const monthlyListenersElement = document.getElementById("ascoltatori-mensili")

const rightSidebarMainTitle = document.getElementById("side-bar-main-title")
const rightSidebarPosterImg = document.getElementById("side-poster-img")
const rightSidebarSongTitle = document.getElementById("side-song-title")
const rightSidebarSongArtist = document.getElementById("side-song-artist")
const creditArtistImg = document.getElementById("credit-artist-img")
const creditArtistName = document.getElementById("credit-artist-name")
const rightSidebarWriter = document.getElementById("right-sidebar-writer")
const rightSidebarNextImg = document.getElementById("right-sidebar-next-img")
const rightSidebarNextTitle = document.getElementById(
  "right-sidebar-next-title",
)
const rightSidebarNextArtist = document.getElementById(
  "right-sidebar-next-artist",
)

const formatNumber = (value) => {
  return new Intl.NumberFormat("it-IT").format(value || 0)
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const styleSuggestionsDropdown = () => {
  if (!dataList) return

  dataList.className = "position-absolute mt-2 w-100 z-3"
  dataList.style.maxHeight = "420px"
  dataList.style.overflowY = "auto"
  dataList.style.overflowX = "hidden"
  dataList.style.listStyle = "none"
  dataList.style.margin = "0"
  dataList.style.padding = "8px"
  dataList.style.paddingLeft = "8px"
  dataList.style.background =
    "linear-gradient(180deg, rgba(36,36,36,0.98) 0%, rgba(24,24,24,0.98) 100%)"
  dataList.style.borderRadius = "12px"
  dataList.style.boxShadow = "0 16px 40px rgba(0,0,0,0.55)"
  dataList.style.border = "none"
  dataList.style.backdropFilter = "blur(10px)"
  dataList.style.scrollbarWidth = "thin"
  dataList.style.scrollbarColor = "#8a8a8a transparent"
  dataList.style.top = "100%"
  dataList.style.left = "0"
}

const injectSuggestionScrollbarStyles = () => {
  if (document.getElementById("spotify-suggestion-scrollbar-styles")) return

  const style = document.createElement("style")
  style.id = "spotify-suggestion-scrollbar-styles"
  style.textContent = `
    #listaData::-webkit-scrollbar {
      width: 10px;
    }

    #listaData::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
    }

    #listaData::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #8c8c8c 0%, #6f6f6f 100%);
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    #listaData::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #a5a5a5 0%, #818181 100%);
      border: 2px solid transparent;
      background-clip: padding-box;
    }
  `
  document.head.appendChild(style)
}

const createSuggestionItem = (artistItem) => {
  const li = document.createElement("li")
  li.style.listStyle = "none"
  li.style.cursor = "pointer"
  li.style.border = "none"
  li.style.backgroundColor = "transparent"
  li.style.borderRadius = "10px"
  li.style.padding = "10px 12px"
  li.style.transition = "background-color 0.2s ease"
  li.style.marginBottom = "2px"

  li.innerHTML = `
    <div class="d-flex align-items-center gap-3 overflow-hidden">
      <img
        src="${
          artistItem.picture_small ||
          artistItem.picture_medium ||
          artistItem.picture ||
          "./assets/imgs/fallback/fallback-cover.png"
        }"
        alt="${artistItem.name}"
        style="width: 48px; height: 48px; object-fit: cover; border-radius: 50%; flex-shrink: 0;"
      />
      <div class="d-flex flex-column overflow-hidden">
        <span
          class="text-white fw-bold text-truncate"
          style="font-size: 0.95rem; line-height: 1.2;"
        >
          ${artistItem.name}
        </span>
        <span
          class="text-secondary text-truncate"
          style="font-size: 0.85rem; line-height: 1.2;"
        >
          Artista
        </span>
      </div>
    </div>
  `

  li.addEventListener("mouseenter", () => {
    li.style.backgroundColor = "#2a2a2a"
  })

  li.addEventListener("mouseleave", () => {
    li.style.backgroundColor = "transparent"
  })

  return li
}

const createMessageItem = (message, color = "#b3b3b3") => {
  const li = document.createElement("li")
  li.textContent = message
  li.style.listStyle = "none"
  li.style.padding = "12px"
  li.style.borderRadius = "10px"
  li.style.border = "none"
  li.style.backgroundColor = "transparent"
  li.style.color = color
  li.style.fontSize = "0.9rem"
  return li
}

const searchArtistSuggestions = async (artist) => {
  try {
    const response = await fetch(apiUrl + encodeURIComponent(artist))
    if (!response.ok) {
      throw new Error("Data not found")
    }

    const data = await response.json()
    dataList.innerHTML = ""

    styleSuggestionsDropdown()

    const uniqueArtists = []
    const artistIds = new Set()

    data.data.forEach((song) => {
      if (song.artist?.id && !artistIds.has(song.artist.id)) {
        artistIds.add(song.artist.id)
        uniqueArtists.push(song.artist)
      }
    })

    const queryLower = artist.trim().toLowerCase()

    uniqueArtists.sort((a, b) => {
      const aName = (a.name || "").toLowerCase()
      const bName = (b.name || "").toLowerCase()

      const aExact =
        aName === queryLower
          ? 3
          : aName.startsWith(queryLower)
            ? 2
            : aName.includes(queryLower)
              ? 1
              : 0
      const bExact =
        bName === queryLower
          ? 3
          : bName.startsWith(queryLower)
            ? 2
            : bName.includes(queryLower)
              ? 1
              : 0

      return bExact - aExact
    })

    uniqueArtists.slice(0, 8).forEach((artistItem) => {
      const li = createSuggestionItem(artistItem)

      li.addEventListener("click", () => {
        searchInput.value = artistItem.name
        dataList.innerHTML = ""
        renderArtistProfile(artistItem.name)
      })

      dataList.appendChild(li)
    })

    if (!uniqueArtists.length) {
      dataList.appendChild(createMessageItem("Nessun artista trovato"))
    }
  } catch (error) {
    console.error(error)
    dataList.innerHTML = ""
    styleSuggestionsDropdown()
    dataList.appendChild(
      createMessageItem("Errore al buscar artista", "#ff6b6b"),
    )
  }
}

const getUniqueSongs = (songs) => {
  const uniqueSongs = []
  const usedKeys = new Set()

  songs.forEach((song) => {
    const key = `${song.title}-${song.album.id}`
    if (!usedKeys.has(key)) {
      usedKeys.add(key)
      uniqueSongs.push(song)
    }
  })

  return uniqueSongs
}

const renderSongsList = (songs) => {
  if (!cardSongs) return

  cardSongs.innerHTML = ""

  const songsWrapper = document.createElement("div")

  songs.slice(0, 10).forEach((song, index) => {
    const row = document.createElement("div")
    row.className =
      "d-flex align-items-center justify-content-between py-2 px-2 rounded hover-riga"

    row.dataset.trackIndex = index
    row.dataset.trackId = song.id || ""
    row.dataset.trackTitle = song.title || ""
    row.dataset.trackArtist = song.artist?.name || ""
    row.dataset.trackCover =
      song.album?.cover_medium ||
      song.album?.cover_small ||
      song.album?.cover ||
      "./assets/imgs/fallback/fallback-cover.png"
    row.dataset.trackDuration = song.duration || 0
    row.dataset.trackRank = song.rank || 0

    if (song.preview) {
      row.dataset.trackSrc = song.preview
    }

    row.style.cursor = song.preview ? "pointer" : "default"

    row.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1 overflow-hidden">
        <div
          class="text-secondary me-3 text-center"
          style="width: 30px; min-width: 30px"
        >
          ${index + 1}
        </div>

        <img
          src="${song.album.cover_small || song.album.cover_medium || song.album.cover}"
          class="rounded me-3"
          style="width: 40px; height: 40px; object-fit: cover"
          alt="${song.title}"
        />

        <div class="text-truncate">
          <p class="mb-0 text-white fw-bold text-truncate">${song.title}</p>
          <small class="text-secondary">${song.artist.name}</small>
        </div>
      </div>

      <div class="d-flex align-items-center text-secondary ms-3">
        <div class="d-none d-md-block me-4">${formatNumber(song.rank)}</div>
        <div style="width: 50px; text-align: right">${formatDuration(song.duration)}</div>
      </div>
    `

    songsWrapper.appendChild(row)
  })

  cardSongs.appendChild(songsWrapper)

  if (window.GlobalPlayer) {
    window.GlobalPlayer.rebuildQueueFromDOM()
  }
}

const renderRightSidebar = (artistInfo, songs) => {
  if (!songs.length) return

  const firstSong = songs[0]
  const secondSong = songs[1] || songs[0]

  if (rightSidebarMainTitle) {
    rightSidebarMainTitle.textContent = artistInfo.name || "Nome Artista"
  }

  if (rightSidebarPosterImg) {
    rightSidebarPosterImg.src =
      artistInfo.picture_xl ||
      artistInfo.picture_big ||
      artistInfo.picture_medium ||
      artistInfo.picture
    rightSidebarPosterImg.alt = artistInfo.name || "Artist poster"
  }

  if (rightSidebarSongTitle) {
    rightSidebarSongTitle.textContent = artistInfo.name || "Nome Artista"
  }

  if (rightSidebarSongArtist) {
    rightSidebarSongArtist.textContent = "Artista"
  }

  if (creditArtistImg) {
    creditArtistImg.src =
      artistInfo.picture_small ||
      artistInfo.picture_medium ||
      artistInfo.picture
    creditArtistImg.alt = artistInfo.name || "Artist avatar"
  }

  if (creditArtistName) {
    creditArtistName.textContent = artistInfo.name || "Nome Artista"
  }

  if (rightSidebarWriter) {
    rightSidebarWriter.textContent = firstSong.artist.name || "—"
  }

  if (rightSidebarNextImg) {
    rightSidebarNextImg.src =
      secondSong.album.cover_small ||
      secondSong.album.cover_medium ||
      secondSong.album.cover
    rightSidebarNextImg.alt = secondSong.title || "Next track"
  }

  if (rightSidebarNextTitle) {
    rightSidebarNextTitle.textContent = secondSong.title || "Nessun brano"
  }

  if (rightSidebarNextArtist) {
    rightSidebarNextArtist.textContent =
      secondSong.artist.name || "Nessun artista"
  }
}

const renderArtistError = () => {
  if (artistNameElement) {
    artistNameElement.textContent = "Errore"
  }

  if (monthlyListenersElement) {
    monthlyListenersElement.textContent = "Errore al caricare artista"
  }

  if (artistBgImage) {
    artistBgImage.style.backgroundImage = "none"
    artistBgImage.style.backgroundColor = "#333"
  }

  if (cardSongs) {
    cardSongs.innerHTML =
      '<p class="text-danger">Errore al caricare artista</p>'
  }

  if (rightSidebarMainTitle) {
    rightSidebarMainTitle.textContent = "Errore"
  }

  if (rightSidebarSongTitle) {
    rightSidebarSongTitle.textContent = "Nessun dato"
  }

  if (rightSidebarSongArtist) {
    rightSidebarSongArtist.textContent = "Errore"
  }

  if (creditArtistName) {
    creditArtistName.textContent = "Errore"
  }

  if (rightSidebarWriter) {
    rightSidebarWriter.textContent = "—"
  }
}

const renderCenterArtistInfo = (artistInfo, firstSong) => {
  if (artistNameElement) {
    artistNameElement.textContent = artistInfo.name || "Nome Artista"
  }

  if (monthlyListenersElement) {
    monthlyListenersElement.textContent = `${formatNumber(
      artistInfo.nb_fan || artistInfo.nb_fans || firstSong.rank || 0,
    )} ascoltatori mensili`
  }

  if (artistBgImage) {
    artistBgImage.style.backgroundImage = `url('${
      artistInfo.picture_xl ||
      artistInfo.picture_big ||
      artistInfo.picture_medium ||
      artistInfo.picture
    }')`
  }
}

const renderArtistProfile = async (artist) => {
  try {
    const response = await fetch(apiUrl + encodeURIComponent(artist))
    if (!response.ok) {
      throw new Error("Data not found")
    }

    const data = await response.json()

    if (!data.data.length) {
      if (artistNameElement) {
        artistNameElement.textContent = "Artist not found"
      }

      if (monthlyListenersElement) {
        monthlyListenersElement.textContent = "0 ascoltatori mensili"
      }

      if (cardSongs) {
        cardSongs.innerHTML = "<p>Artist not found</p>"
      }

      return
    }

    const firstSong = data.data[0]
    const artistInfo = firstSong.artist
    const uniqueSongs = getUniqueSongs(data.data)

    renderCenterArtistInfo(artistInfo, firstSong)
    renderSongsList(uniqueSongs)
    renderRightSidebar(artistInfo, uniqueSongs)
  } catch (error) {
    console.error(error)
    renderArtistError()
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const artistName = searchInput.value.trim()

    if (artistName === "") {
      if (dataList) dataList.innerHTML = ""
      return
    }

    searchArtistSuggestions(artistName)
  })
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()

      const artistName = searchInput.value.trim()
      if (artistName === "") return

      if (dataList) dataList.innerHTML = ""
      renderArtistProfile(artistName)
    }
  })
}

document.addEventListener("click", (event) => {
  if (
    dataList &&
    searchInput &&
    !dataList.contains(event.target) &&
    event.target !== searchInput
  ) {
    dataList.innerHTML = ""
  }
})

document.addEventListener("DOMContentLoaded", () => {
  injectSuggestionScrollbarStyles()

  const params = new URLSearchParams(window.location.search)
  const artistFromUrl = params.get("artist")

  if (artistFromUrl && artistFromUrl.trim() !== "") {
    if (searchInput) {
      searchInput.value = artistFromUrl
    }

    renderArtistProfile(artistFromUrl)
    return
  }

  const randomArtists = [
    "Drake",
    "The Weeknd",
    "Adele",
    "Taylor Swift",
    "Ed Sheeran",
    "Bruno Mars",
    "Dua Lipa",
    "Billie Eilish",
    "Olivia Rodrigo",
    "Harry Styles",
    "Justin Bieber",
    "Post Malone",
    "Travis Scott",
    "Kanye West",
    "Eminem",
    "Rihanna",
    "Beyoncé",
    "Ariana Grande",
    "Nicki Minaj",
    "Doja Cat",
    "SZA",
    "Kendrick Lamar",
    "J. Cole",
    "Future",
    "Lil Baby",
    "21 Savage",
    "Bad Bunny",
    "Karol G",
    "J Balvin",
    "Rauw Alejandro",
    "Feid",
    "Ozuna",
    "Anuel AA",
    "Rosalía",
    "Shakira",
    "Maluma",
    "Coldplay",
    "Imagine Dragons",
    "Maroon 5",
    "OneRepublic",
    "Linkin Park",
    "Arctic Monkeys",
    "The Killers",
    "Tame Impala",
    "Red Hot Chili Peppers",
    "Metallica",
    "Queen",
    "The Beatles",
    "Pink Floyd",
    "David Guetta",
    "Calvin Harris",
    "Martin Garrix",
    "Avicii",
    "Kygo",
    "Alan Walker",
    "Swedish House Mafia",
    "Sfera Ebbasta",
    "Luchè",
    "Marracash",
    "Salmo",
    "Madame",
    "Annalisa",
    "Mahmood",
    "Ultimo",
    "Blanco",
    "Elodie",
    "Fedez",
    "Tananai",
    "Capo Plaza",
    "Ghali",
    "Fabri Fibra",
    "Coez",
    "Negramaro",
    "Cesare Cremonini",
    "Ligabue",
    "Vasco Rossi",
    "Laura Pausini",
    "Eros Ramazzotti",
    "Zucchero",
  ]

  const randomIndex = Math.floor(Math.random() * randomArtists.length)
  const selectedArtist = randomArtists[randomIndex]

  if (searchInput) {
    searchInput.value = selectedArtist
  }

  renderArtistProfile(selectedArtist)
})
