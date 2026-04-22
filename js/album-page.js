const SEARCH_API = "https://striveschool-api.herokuapp.com/api/deezer/search?q="
const ALBUM_API = "https://striveschool-api.herokuapp.com/api/deezer/album/"
const ARTIST_API = "https://striveschool-api.herokuapp.com/api/deezer/artist/"

const searchInput = document.getElementById("inputSearch")
const dataList = document.getElementById("listaData")

const albumHeader = document.getElementById("intestazione-artista")
const albumNameElement = document.getElementById("nome-album")
const albumMetaElement = document.getElementById("ascoltatori-mensili")
const cardSongs = document.getElementById("cardSongs")
const artistSidebarRail = document.getElementById("artistSidebarRail")

const rightSidebarMainTitle = document.getElementById("side-bar-main-title")
const rightSidebarPosterImg = document.getElementById("side-poster-img")
const rightSidebarSongTitle = document.getElementById("side-song-title")
const rightSidebarSongArtist = document.getElementById("side-song-artist")
const creditArtistImg = document.getElementById("credit-artist-img")
const creditArtistName = document.getElementById("credit-artist-name")
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

const formatReleaseDate = (dateString) => {
  if (!dateString) return "Data sconosciuta"

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
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

const fetchSearchResults = async (query) => {
  const response = await fetch(SEARCH_API + encodeURIComponent(query))

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status}`)
  }

  const data = await response.json()

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid search response")
  }

  return data.data
}

const fetchAlbumDetail = async (albumId) => {
  const response = await fetch(`${ALBUM_API}${albumId}`)

  if (!response.ok) {
    throw new Error(`Album API error: ${response.status}`)
  }

  return response.json()
}

const fetchArtistDetail = async (artistId) => {
  const response = await fetch(`${ARTIST_API}${artistId}`)

  if (!response.ok) {
    throw new Error(`Artist API error: ${response.status}`)
  }

  return response.json()
}

const goToAlbumPage = (albumId) => {
  if (!albumId) return
  window.location.href = `./album-page.html?albumId=${encodeURIComponent(albumId)}`
}

const createSuggestionItem = (item) => {
  const li = document.createElement("li")
  li.style.listStyle = "none"
  li.style.cursor = "pointer"
  li.style.border = "none"
  li.style.backgroundColor = "transparent"
  li.style.borderRadius = "10px"
  li.style.padding = "10px 12px"
  li.style.transition = "background-color 0.2s ease"
  li.style.marginBottom = "2px"

  const cover =
    item.album?.cover_small ||
    item.album?.cover_medium ||
    item.album?.cover ||
    "./assets/imgs/fallback/fallback-cover.png"

  li.innerHTML = `
    <div class="d-flex align-items-center gap-3 overflow-hidden">
      <img
        src="${cover}"
        alt="${item.album?.title || item.title}"
        style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0;"
      />
      <div class="d-flex flex-column overflow-hidden">
        <span
          class="text-white fw-bold text-truncate"
          style="font-size: 0.95rem; line-height: 1.2;"
        >
          ${item.album?.title || "Album"}
        </span>
        <span
          class="text-secondary text-truncate"
          style="font-size: 0.85rem; line-height: 1.2;"
        >
          Album • ${item.artist?.name || "Artista"}
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

const searchAlbumSuggestions = async (query) => {
  try {
    const results = await fetchSearchResults(query)

    dataList.innerHTML = ""
    styleSuggestionsDropdown()

    const uniqueAlbums = []
    const albumIds = new Set()

    results.forEach((item) => {
      if (item.album?.id && !albumIds.has(item.album.id)) {
        albumIds.add(item.album.id)
        uniqueAlbums.push(item)
      }
    })

    uniqueAlbums.slice(0, 8).forEach((item) => {
      const li = createSuggestionItem(item)

      li.addEventListener("click", () => {
        searchInput.value = item.album?.title || ""
        dataList.innerHTML = ""
        goToAlbumPage(item.album?.id)
      })

      dataList.appendChild(li)
    })

    if (!uniqueAlbums.length) {
      const emptyItem = document.createElement("li")
      emptyItem.textContent = "Nessun album trovato"
      emptyItem.style.listStyle = "none"
      emptyItem.style.padding = "12px"
      emptyItem.style.borderRadius = "10px"
      emptyItem.style.border = "none"
      emptyItem.style.backgroundColor = "transparent"
      emptyItem.style.color = "#b3b3b3"
      emptyItem.style.fontSize = "0.9rem"
      dataList.appendChild(emptyItem)
    }
  } catch (error) {
    console.error("searchAlbumSuggestions error:", error)

    dataList.innerHTML = ""
    styleSuggestionsDropdown()

    const errorItem = document.createElement("li")
    errorItem.textContent = "Errore al cercare album"
    errorItem.style.listStyle = "none"
    errorItem.style.padding = "12px"
    errorItem.style.borderRadius = "10px"
    errorItem.style.border = "none"
    errorItem.style.backgroundColor = "transparent"
    errorItem.style.color = "#ff6b6b"
    errorItem.style.fontSize = "0.9rem"

    dataList.appendChild(errorItem)
  }
}

const renderAlbumSidebarRail = (albumData) => {
  if (!artistSidebarRail) return

  const tracks = albumData.tracks?.data || []

  artistSidebarRail.innerHTML = tracks
    .slice(0, 6)
    .map(
      (track, index) => `
        <div class="d-flex align-items-center gap-2 px-2">
          <img
            src="${
              albumData.cover_small ||
              albumData.cover_medium ||
              albumData.cover_big ||
              albumData.cover
            }"
            alt="${track.title}"
            class="rounded"
            style="width: 40px; height: 40px; object-fit: cover"
          />
          <div class="text-truncate hide-on-closed">
            <div class="text-white small fw-bold text-truncate">${index + 1}. ${track.title}</div>
            <div class="text-secondary small text-truncate">${albumData.artist?.name || ""}</div>
          </div>
        </div>
      `,
    )
    .join("")
}

const renderAlbumHeader = (albumData) => {
  if (albumNameElement) {
    albumNameElement.textContent = albumData.title || "Nome Album"
  }

  if (albumMetaElement) {
    const artistName = albumData.artist?.name || "Artista sconosciuto"
    const releaseDate = formatReleaseDate(albumData.release_date)
    const trackCount = formatNumber(
      albumData.nb_tracks || albumData.tracks?.data?.length || 0,
    )

    albumMetaElement.textContent = `${artistName} • ${releaseDate} • ${trackCount} brani`
  }

  if (albumHeader) {
    const cover =
      albumData.cover_xl ||
      albumData.cover_big ||
      albumData.cover_medium ||
      albumData.cover

    albumHeader.style.backgroundImage = `
      linear-gradient(to top, rgba(18,18,18,0.96), rgba(18,18,18,0.35)),
      url('${cover}')
    `
    albumHeader.style.backgroundSize = "cover"
    albumHeader.style.backgroundPosition = "center"
    albumHeader.style.backgroundRepeat = "no-repeat"
  }
}

const renderAlbumTracks = (albumData) => {
  if (!cardSongs) return

  const tracks = albumData.tracks?.data || []
  cardSongs.innerHTML = ""

  const tracksWrapper = document.createElement("div")

  tracks.forEach((track, index) => {
    const row = document.createElement("div")
    row.className =
      "d-flex align-items-center justify-content-between py-2 px-2 rounded hover-riga"

    row.dataset.trackIndex = index
    row.dataset.trackId = track.id || ""
    row.dataset.trackTitle = track.title || ""
    row.dataset.trackArtist = albumData.artist?.name || ""
    row.dataset.trackCover =
      albumData.cover_medium ||
      albumData.cover_small ||
      albumData.cover_big ||
      albumData.cover ||
      ""
    if (track.preview) {
      row.dataset.trackSrc = track.preview
    }
    row.dataset.trackDuration = track.duration || 0
    row.dataset.trackRank = track.rank || 0

    row.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1 overflow-hidden">
        <div
          class="text-secondary me-3 text-center"
          style="width: 30px; min-width: 30px"
        >
          ${index + 1}
        </div>

        <img
          src="${
            albumData.cover_small ||
            albumData.cover_medium ||
            albumData.cover_big ||
            albumData.cover
          }"
          class="rounded me-3"
          style="width: 40px; height: 40px; object-fit: cover"
          alt="${track.title}"
        />

        <div class="text-truncate">
          <p class="mb-0 text-white fw-bold text-truncate">${track.title}</p>
          <small class="text-secondary">${albumData.artist?.name || ""}</small>
        </div>
      </div>

      <div class="d-flex align-items-center text-secondary ms-3">
        <div class="d-none d-md-block me-4">${formatNumber(track.rank || 0)}</div>
        <div style="width: 50px; text-align: right">${formatDuration(track.duration || 0)}</div>
      </div>
    `

    tracksWrapper.appendChild(row)
  })

  cardSongs.appendChild(tracksWrapper)

  if (window.GlobalPlayer) {
    window.GlobalPlayer.rebuildQueueFromDOM()
  }
}

const renderAlbumRightSidebar = (albumData, artistDetail) => {
  const tracks = albumData.tracks?.data || []
  const secondTrack = tracks[1] || tracks[0]

  if (rightSidebarMainTitle) {
    rightSidebarMainTitle.textContent = albumData.title || "Album"
  }

  if (rightSidebarPosterImg) {
    rightSidebarPosterImg.src =
      albumData.cover_xl ||
      albumData.cover_big ||
      albumData.cover_medium ||
      albumData.cover
    rightSidebarPosterImg.alt = albumData.title || "Album poster"
  }

  if (rightSidebarSongTitle) {
    rightSidebarSongTitle.textContent = albumData.title || "Album"
  }

  if (rightSidebarSongArtist) {
    rightSidebarSongArtist.textContent = albumData.artist?.name || "Artista"
  }

  if (creditArtistImg) {
    creditArtistImg.src =
      artistDetail?.picture_small ||
      artistDetail?.picture_medium ||
      albumData.artist?.picture_small ||
      albumData.artist?.picture_medium ||
      albumData.cover_small
    creditArtistImg.alt = albumData.artist?.name || "Artist avatar"
  }

  if (creditArtistName) {
    creditArtistName.textContent = albumData.artist?.name || "Artista"
  }

  if (rightSidebarNextImg && secondTrack) {
    rightSidebarNextImg.src =
      albumData.cover_small ||
      albumData.cover_medium ||
      albumData.cover_big ||
      albumData.cover
    rightSidebarNextImg.alt = secondTrack.title || "Next track"
  }

  if (rightSidebarNextTitle) {
    rightSidebarNextTitle.textContent = secondTrack?.title || "Nessun brano"
  }

  if (rightSidebarNextArtist) {
    rightSidebarNextArtist.textContent =
      albumData.artist?.name || secondTrack?.artist?.name || "Nessun artista"
  }
}

const renderAlbumError = () => {
  if (albumNameElement) {
    albumNameElement.textContent = "Errore"
  }

  if (albumMetaElement) {
    albumMetaElement.textContent = "Errore al caricare album"
  }

  if (cardSongs) {
    cardSongs.innerHTML = '<p class="text-danger">Errore al caricare album</p>'
  }

  if (albumHeader) {
    albumHeader.style.backgroundImage = "none"
    albumHeader.style.backgroundColor = "#333"
  }

  if (rightSidebarMainTitle) {
    rightSidebarMainTitle.textContent = "Errore"
  }
}

const getRandomAlbumId = async () => {
  const randomArtists = [
    "Drake",
    "The Weeknd",
    "Taylor Swift",
    "Dua Lipa",
    "Bad Bunny",
    "Coldplay",
    "Imagine Dragons",
    "Billie Eilish",
    "Eminem",
    "Sfera Ebbasta",
    "Marracash",
    "Mahmood",
    "Annalisa",
    "Luchè",
    "Bruno Mars",
    "Adele",
    "Rihanna",
    "Arctic Monkeys",
    "Linkin Park",
    "Rosalía",
  ]

  const randomArtist =
    randomArtists[Math.floor(Math.random() * randomArtists.length)]

  const results = await fetchSearchResults(randomArtist)

  const uniqueAlbumIds = [
    ...new Set(results.map((item) => item.album?.id).filter(Boolean)),
  ]

  if (!uniqueAlbumIds.length) {
    throw new Error("No random album found")
  }

  return uniqueAlbumIds[Math.floor(Math.random() * uniqueAlbumIds.length)]
}

const renderAlbumPage = async (albumId) => {
  try {
    const albumData = await fetchAlbumDetail(albumId)
    const artistDetail = albumData.artist?.id
      ? await fetchArtistDetail(albumData.artist.id)
      : null

    renderAlbumHeader(albumData)
    renderAlbumTracks(albumData)
    renderAlbumRightSidebar(albumData, artistDetail)
    renderAlbumSidebarRail(albumData)

    if (searchInput) {
      searchInput.value = albumData.title || ""
    }
  } catch (error) {
    console.error("renderAlbumPage error:", error)
    renderAlbumError()
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim()

    if (!value) {
      if (dataList) dataList.innerHTML = ""
      return
    }

    searchAlbumSuggestions(value)
  })

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault()

      const value = searchInput.value.trim()
      if (!value) return

      try {
        const results = await fetchSearchResults(value)
        const firstAlbum = results.find((item) => item.album?.id)

        if (!firstAlbum?.album?.id) return

        if (dataList) dataList.innerHTML = ""
        goToAlbumPage(firstAlbum.album.id)
      } catch (error) {
        console.error("album enter search error:", error)
      }
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

document.addEventListener("DOMContentLoaded", async () => {
  injectSuggestionScrollbarStyles()

  const params = new URLSearchParams(window.location.search)
  const albumIdFromUrl = params.get("albumId")

  try {
    if (albumIdFromUrl) {
      await renderAlbumPage(albumIdFromUrl)
    } else {
      const randomAlbumId = await getRandomAlbumId()
      history.replaceState(
        null,
        "",
        `./album-page.html?albumId=${encodeURIComponent(randomAlbumId)}`,
      )
      await renderAlbumPage(randomAlbumId)
    }
  } catch (error) {
    console.error("initial album load error:", error)
    renderAlbumError()
  }
})
