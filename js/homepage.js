const SEARCH_API = "https://striveschool-api.herokuapp.com/api/deezer/search?q="
const ALBUM_API = "https://striveschool-api.herokuapp.com/api/deezer/album/"
const ARTIST_API = "https://striveschool-api.herokuapp.com/api/deezer/artist/"

const searchInput = document.getElementById("inputSearch")
const dataList = document.getElementById("listaData")

const smallCardsWrapper = document.getElementById("small-cards-wrapper")
const primoCarosello = document.getElementById("primo-carosello")
const secondoCarosello = document.getElementById("secondo-carosello")
const artistiWrapper = document.getElementById("artisti-scroll-row")
const artistSidebarRail = document.getElementById("artistSidebarRail")

const favoriteIcon = document.getElementById("favorite-icon")

const artisti = [
  "shakira",
  "eminem",
  "lucio dalla",
  "ramazzotti",
  "ana mena",
  "gigi d'alessio",
  "bruno mars",
  "the weeknd",
  "billie eilish",
  "ariana grande",
  "justin bieber",
  "coldplay",
  "u2",
  "queen",
  "david bowie",
  "elton john",
  "frank sinatra",
  "whitney houston",
  "mariah carey",
  "bob marley",
  "amy winehouse",
  "daft punk",
  "avicii",
  "calvin harris",
  "vasco rossi",
  "zucchero",
  "eros ramazzotti",
  "laura pausini",
  "tiziano ferro",
  "jovanotti",
  "ligabue",
  "claudio baglioni",
  "pino daniele",
  "fabrizio de andre",
  "mina",
  "ornella vanoni",
  "massimo ranieri",
  "al bano",
  "riccardo cocciante",
  "giorgio moroder",
  "ivan graziani",
  "fiorella mannoia",
  "giorgia",
  "elisa",
]

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

const fetchArtistAlbums = async (artistId) => {
  const response = await fetch(`${ARTIST_API}${artistId}/albums`)
  if (!response.ok) {
    throw new Error(`Artist albums API error: ${response.status}`)
  }
  return response.json()
}

const goToArtistPage = (artistName) => {
  if (!artistName) return
  window.location.href = `./artist-page.html?artist=${encodeURIComponent(
    artistName,
  )}`
}

const goToAlbumPage = (albumId) => {
  if (!albumId) return
  window.location.href = `./album-page.html?albumId=${encodeURIComponent(
    albumId,
  )}`
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

const createSuggestionItem = (item, type) => {
  const li = document.createElement("li")
  li.style.listStyle = "none"
  li.style.cursor = "pointer"
  li.style.border = "none"
  li.style.backgroundColor = "transparent"
  li.style.borderRadius = "10px"
  li.style.padding = "10px 12px"
  li.style.transition = "background-color 0.2s ease"
  li.style.marginBottom = "2px"

  const imageSrc =
    type === "artist"
      ? item.artist.picture_small ||
        item.artist.picture_medium ||
        item.artist.picture ||
        "https://via.placeholder.com/48"
      : item.album.cover_small ||
        item.album.cover_medium ||
        item.album.cover ||
        "https://via.placeholder.com/48"

  const title = type === "artist" ? item.artist.name : item.title
  const subtitle =
    type === "artist" ? "Artista" : `Canción • ${item.artist.name}`

  li.innerHTML = `
    <div class="d-flex align-items-center gap-3 overflow-hidden">
      <img
        src="${imageSrc}"
        alt="${title}"
        style="width: 48px; height: 48px; object-fit: cover; border-radius: ${
          type === "artist" ? "50%" : "6px"
        }; flex-shrink: 0;"
      />
      <div class="d-flex flex-column overflow-hidden">
        <span class="text-white fw-bold text-truncate" style="font-size: 0.95rem; line-height: 1.2;">
          ${title}
        </span>
        <span class="text-secondary text-truncate" style="font-size: 0.85rem; line-height: 1.2;">
          ${subtitle}
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

const searchMixedSuggestions = async (query) => {
  try {
    const results = await fetchSearchResults(query)
    dataList.innerHTML = ""
    styleSuggestionsDropdown()

    const uniqueArtists = []
    const artistIds = new Set()

    const uniqueSongs = []
    const songIds = new Set()

    results.forEach((item) => {
      if (item.artist?.id && !artistIds.has(item.artist.id)) {
        artistIds.add(item.artist.id)
        uniqueArtists.push(item)
      }

      if (item.id && !songIds.has(item.id)) {
        songIds.add(item.id)
        uniqueSongs.push(item)
      }
    })

    const mixedResults = [
      ...uniqueArtists.slice(0, 4).map((item) => ({ type: "artist", item })),
      ...uniqueSongs.slice(0, 4).map((item) => ({ type: "song", item })),
    ]

    mixedResults.forEach(({ type, item }) => {
      const li = createSuggestionItem(item, type)

      li.addEventListener("click", () => {
        dataList.innerHTML = ""

        if (type === "artist") {
          searchInput.value = item.artist.name
          goToArtistPage(item.artist.name)
        } else {
          searchInput.value = item.title
          goToAlbumPage(item.album?.id)
        }
      })

      dataList.appendChild(li)
    })

    if (!mixedResults.length) {
      dataList.appendChild(createMessageItem("Nessun risultato trovato"))
    }
  } catch (error) {
    console.error("searchMixedSuggestions error:", error)
    dataList.innerHTML = ""
    styleSuggestionsDropdown()
    dataList.appendChild(
      createMessageItem("Errore durante la ricerca", "#ff6b6b"),
    )
  }
}

const createAlbumArray = async () => {
  const albumInfo = []

  const promises = artisti.map(async (artista) => {
    try {
      const searchData = await fetchSearchResults(artista)
      if (!searchData.length) return

      // 🔥 buscar el artista correcto (no el primero random)
      const artistaMatch = searchData.find((item) =>
        item.artist?.name?.toLowerCase().includes(artista.toLowerCase()),
      )

      if (!artistaMatch) return

      const artistaData = artistaMatch.artist
      const albumsData = await fetchArtistAlbums(artistaData.id)

      if (!albumsData || !albumsData.data) return

      albumsData.data.forEach((album) => {
        albumInfo.push({
          id: album.id,
          titolo: album.title,
          cover_medium: album.cover_medium,
          cover_small: album.cover_small,
          data: album.release_date,
          artista: artistaData.name || "",
          idArtista: artistaData.id,
          type: artistaData.type || "Artista",
          imgArtista: artistaData.picture,
          imgArtistaSmall: artistaData.picture_small,
          imgArtistaMedium: artistaData.picture_medium,
        })
      })
    } catch (error) {
      console.log("errore", error)
    }
  })

  await Promise.allSettled(promises)
  localStorage.setItem("albumInfo", JSON.stringify(albumInfo))
  return albumInfo
}

const getAlbumData = async () => {
  const albumSalvati = JSON.parse(localStorage.getItem("albumInfo"))

  if (albumSalvati && albumSalvati.length > 0) {
    return albumSalvati
  }

  return createAlbumArray()
}

const popolaCarosello = (array, carosello) => {
  if (!carosello) return

  carosello.innerHTML = ""

  array.forEach((album) => {
    if (carosello.querySelectorAll(".card").length > 16) return

    carosello.innerHTML += `
      <a href="./album-page.html?albumId=${album.id}" class="text-decoration-none text-light">
        <div class="card text-light flex-shrink-0 border-0 overflow-hidden rounded-3" style="width: 160px; background-color: #181818;">
          <img src="${album.cover_medium}" class="card-img-top" alt="${album.titolo}" />
          <div class="card-body">
            <h4 class="m-0 fs-6 text-truncate">${album.titolo}</h4>
            <p class="card-text small text-secondary text-truncate">${album.data}</p>
          </div>
        </div>
      </a>
    `
  })
}

const popolaPiccoleCards = (array, wrapper) => {
  if (!wrapper) return

  wrapper.innerHTML = ""

  array.forEach((album) => {
    if (wrapper.querySelectorAll(".col").length === 8) return

    wrapper.innerHTML += `
      <div class="col">
        <a href="./album-page.html?albumId=${album.id}" class="text-decoration-none">
          <div class="row g-0 rounded-2 overflow-hidden" style="background-color: #2a2a2a">
            <div class="col-3">
              <img src="${album.cover_small}" alt="${album.titolo}" class="h-100 w-100 object-fit-cover" />
            </div>
            <div class="col-9 d-flex flex-column justify-content-center px-2">
              <span class="fw-bold text-truncate text-light">${album.titolo}</span>
              <span class="text-secondary small">${album.data}</span>
            </div>
          </div>
        </a>
      </div>
    `
  })
}

const popolaArtisti = (array, wrapper) => {
  if (!wrapper) return

  wrapper.innerHTML = ""

  const artistiUsati = new Set()

  array.forEach((album) => {
    if (wrapper.querySelectorAll(".card").length > 20) return
    if (artistiUsati.has(album.idArtista)) return

    artistiUsati.add(album.idArtista)

    wrapper.innerHTML += `
      <a href="./artist-page.html?artist=${encodeURIComponent(
        album.artista,
      )}" class="card text-decoration-none text-light bg-black border-0 flex-shrink-0">
        <img src="${album.imgArtistaMedium}" class="rounded-circle object-fit-cover" style="width: 140px; height: 140px" />
        <div class="py-1">
          <h6 class="m-0">${album.artista}</h6>
          <p class="m-0 small text-secondary">${album.type}</p>
        </div>
      </a>
    `
  })
}

const popolaSidebarRail = (array, wrapper) => {
  if (!wrapper) return

  wrapper.innerHTML = ""

  array.slice(0, 6).forEach((album, index) => {
    wrapper.innerHTML += `
      <a href="./album-page.html?albumId=${album.id}" class="text-decoration-none">
        <div class="d-flex align-items-center gap-2 px-2">
          <img
            src="${album.cover_small}"
            alt="${album.titolo}"
            class="rounded"
            style="width: 40px; height: 40px; object-fit: cover"
          />
          <div class="text-truncate hide-on-closed">
            <div class="text-white small fw-bold text-truncate">${index + 1}. ${album.titolo}</div>
            <div class="text-secondary small text-truncate">${album.artista}</div>
          </div>
        </div>
      </a>
    `
  })
}

const attachOriginalCarouselScroll = () => {
  const tracks = document.querySelectorAll(".carosello")
  const prevs = document.querySelectorAll(".prev")
  const nexts = document.querySelectorAll(".next")

  const widthImage = 180

  nexts.forEach((nextBtn, index) => {
    nextBtn.addEventListener("click", () => {
      tracks[index]?.scrollBy({ left: widthImage, behavior: "smooth" })
    })
  })

  prevs.forEach((prevBtn, index) => {
    prevBtn.addEventListener("click", () => {
      tracks[index]?.scrollBy({ left: -widthImage, behavior: "smooth" })
    })
  })

  tracks.forEach((scrollRow) => {
    scrollRow.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault()
        scrollRow.scrollBy({ left: e.deltaY * 2, behavior: "smooth" })
      },
      { passive: false },
    )
  })
}

const setFooterYear = () => {
  const dateElement = document.getElementById("date")
  if (!dateElement) return

  const currentYear = new Date().getFullYear()
  dateElement.innerText = `@${currentYear} Spotify AB`
}

const initFavoriteHeart = () => {
  if (!favoriteIcon) return

  favoriteIcon.style.cursor = "pointer"
  favoriteIcon.style.transition = "all 0.1s ease"
  favoriteIcon.style.color = "#b3b3b3"

  favoriteIcon.addEventListener("click", function () {
    const isLiked = this.classList.contains("bi-heart-fill")

    if (isLiked) {
      this.classList.replace("bi-heart-fill", "bi-heart")
      this.style.color = "#b3b3b3"
      this.style.transform = "scale(1)"
    } else {
      this.classList.replace("bi-heart", "bi-heart-fill")
      this.style.color = "#ff0000"
      this.style.transform = "scale(1.3)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 200)
    }
  })

  favoriteIcon.addEventListener("mouseenter", function () {
    if (!this.classList.contains("bi-heart-fill")) {
      this.style.color = "#ffffff"
    }
  })

  favoriteIcon.addEventListener("mouseleave", function () {
    if (!this.classList.contains("bi-heart-fill")) {
      this.style.color = "#b3b3b3"
    }
  })
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim()

    if (!query) {
      if (dataList) dataList.innerHTML = ""
      return
    }

    searchMixedSuggestions(query)
  })

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault()

      const query = searchInput.value.trim()
      if (!query) return

      try {
        const results = await fetchSearchResults(query)
        const firstArtist = results.find((item) => item.artist?.name)

        if (firstArtist?.artist?.name) {
          dataList.innerHTML = ""
          goToArtistPage(firstArtist.artist.name)
        }
      } catch (error) {
        console.error("home enter search error:", error)
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

  const albumSalvati = await getAlbumData()

  const unTerzo = Math.floor(albumSalvati.length / 3)
  const primoTerzo = albumSalvati
    .slice(0, unTerzo)
    .sort(() => Math.random() - 0.5)
  const secondoTerzo = albumSalvati
    .slice(unTerzo, unTerzo * 2)
    .sort(() => Math.random() - 0.5)
  const ultimoTerzo = albumSalvati
    .slice(unTerzo * 2)
    .sort(() => Math.random() - 0.5)
  const arrayMischiato = [...albumSalvati].sort(() => Math.random() - 0.5)

  popolaCarosello(primoTerzo, primoCarosello)
  popolaCarosello(secondoTerzo, secondoCarosello)
  popolaPiccoleCards(ultimoTerzo, smallCardsWrapper)
  popolaArtisti(arrayMischiato, artistiWrapper)
  popolaSidebarRail(arrayMischiato, artistSidebarRail)

  attachOriginalCarouselScroll()
  setFooterYear()
  initFavoriteHeart()
})
