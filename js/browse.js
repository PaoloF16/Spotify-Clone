const generiPage = document.getElementById("generi")
const browseViewContent = document.getElementById("browse-view-content")
const audioPlayer = document.getElementById("audio-player")
const mainContainer = document.getElementById("big-container")
const openBrowseBtn = document.getElementById("open-browse-btn")
const openPodcastBrowseBtn = document.getElementById("open-podcast-browse-btn")

const genreCards = [
  {
    nome: "Pop",
    colore: "#e1339b",
    querySeeds: ["Taylor Swift", "Dua Lipa", "Ariana Grande"],
    img: "https://i.scdn.co/image/ab67706f00000002ea13d8f3b2a0a8d3c46b8a2d",
  },
  {
    nome: "Rock",
    colore: "#1e3264",
    querySeeds: ["Queen", "Arctic Monkeys", "Linkin Park"],
    img: "https://i.scdn.co/image/ab67706f00000002d13e53d3b9b0d6d39f7f4b6a",
  },
  {
    nome: "Hip Hop",
    colore: "#ba5d07",
    querySeeds: ["Drake", "Kendrick Lamar", "Travis Scott"],
    img: "https://i.scdn.co/image/ab67706f00000002a7f53144c0db2f5f9e0d2b3f",
  },
  {
    nome: "Jazz",
    colore: "#9b59b6",
    querySeeds: ["Miles Davis", "John Coltrane", "Nina Simone"],
    img: "https://i.scdn.co/image/ab67706f00000002c3f7df3f9a6d2f8bd5f7a6e8",
  },
  {
    nome: "Latin",
    colore: "#2774db",
    querySeeds: ["Bad Bunny", "Karol G", "J Balvin"],
    img: "https://i.scdn.co/image/ab67706f00000002d6f89a9d8bdb74fd9f5c1581",
  },
  {
    nome: "Dance",
    colore: "#6c8a00",
    querySeeds: ["David Guetta", "Calvin Harris", "Avicii"],
    img: "https://i.scdn.co/image/ab67706f0000000247f9f47d7bdb89b7f8d4d71c",
  },
  {
    nome: "Reggae",
    colore: "#1f8f4c",
    querySeeds: ["Bob Marley", "Sean Paul", "Shaggy"],
    img: "https://i.scdn.co/image/ab67706f0000000254f1d45d33f7f7348a4f5c55",
  },
  {
    nome: "Indie",
    colore: "#555555",
    querySeeds: ["Tame Impala", "Phoebe Bridgers", "The Strokes"],
    img: "https://i.scdn.co/image/ab67706f00000002427f4e6d0f4c0a2f6c2df31f",
  },
  {
    nome: "K-Pop",
    colore: "#6f52ed",
    querySeeds: ["BTS", "BLACKPINK", "JENNIE"],
    img: "https://i.scdn.co/image/ab67706f00000002ddc1f8cf260f1fdb93f8b6d1",
  },
  {
    nome: "Classica",
    colore: "#4d829d",
    querySeeds: ["Mozart", "Beethoven", "Vivaldi"],
    img: "https://i.scdn.co/image/ab67706f000000028e1c0b5f62a66f6efb66db77",
  },
  {
    nome: "Metal",
    colore: "#2f2f2f",
    querySeeds: ["Metallica", "Iron Maiden", "Slipknot"],
    img: "https://i.scdn.co/image/ab67706f0000000224f4d1c54db8f2c3a4b2b8f3",
  },
  {
    nome: "R&B",
    colore: "#e91429",
    querySeeds: ["SZA", "Rihanna", "The Weeknd"],
    img: "https://i.scdn.co/image/ab67706f000000021868b6d00fa0c2c8e85b2e54",
  },
]

const showBrowseView = () => {
  if (!generiPage || !mainContainer || !audioPlayer) return
  generiPage.classList.remove("d-none")
  mainContainer.classList.add("d-none")
  audioPlayer.classList.add("d-none")
}

const showHomeView = () => {
  if (!generiPage || !mainContainer || !audioPlayer) return
  generiPage.classList.add("d-none")
  mainContainer.classList.remove("d-none")
  audioPlayer.classList.remove("d-none")
}

const bindBackButtons = () => {
  document.querySelectorAll(".back-home-btn").forEach((btn) => {
    btn.addEventListener("click", showHomeView)
  })

  document.querySelectorAll(".back-genres-btn").forEach((btn) => {
    btn.addEventListener("click", renderGenreGrid)
  })

  document.querySelectorAll(".back-podcast-btn").forEach((btn) => {
    btn.addEventListener("click", renderPodcastBrowseHome)
  })
}

const formatDuration = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const getUniqueTracks = (tracks = []) => {
  const seen = new Set()
  const unique = []

  tracks.forEach((track) => {
    if (!track?.id || seen.has(track.id)) return
    seen.add(track.id)
    unique.push(track)
  })

  return unique
}

const buildTrackListHtml = (tracks, title, backClass = "back-home-btn") => {
  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">${title}</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill ${backClass}">
          Torna indietro
        </button>
      </div>

      <div class="d-flex flex-column gap-2">
        ${tracks
          .map(
            (track, index) => `
            <a
              href="./album-page.html?albumId=${track.album?.id || ""}"
              class="text-decoration-none"
            >
              <div
                class="d-flex align-items-center justify-content-between rounded px-3 py-2"
                style="background-color: #181818;"
              >
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                  <div class="text-secondary" style="width: 24px;">
                    ${index + 1}
                  </div>

                  <img
                    src="${track.album?.cover_small || track.album?.cover_medium || ""}"
                    alt="${track.title}"
                    class="rounded"
                    style="width: 48px; height: 48px; object-fit: cover;"
                  />

                  <div class="overflow-hidden">
                    <div class="text-white fw-bold text-truncate">${track.title}</div>
                    <div class="text-secondary small text-truncate">${track.artist?.name || ""}</div>
                  </div>
                </div>

                <div class="text-secondary small">
                  ${formatDuration(track.duration || 0)}
                </div>
              </div>
            </a>
          `,
          )
          .join("")}
      </div>
    </div>
  `
}

const renderGenreGrid = () => {
  if (!browseViewContent) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Explorar todo</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-3">
        ${genreCards
          .map(
            (genre, index) => `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div
                class="spotify-genre-card"
                data-genre-index="${index}"
                style="background-color: ${genre.colore};"
              >
                <h3>${genre.nome}</h3>
                <img src="${genre.img}" alt="${genre.nome}" />
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `

  document.querySelectorAll(".spotify-genre-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const genreIndex = Number(card.dataset.genreIndex)
      const genre = genreCards[genreIndex]
      if (!genre) return
      await renderGenrePage(genre)
    })
  })

  bindBackButtons()
}

const renderGenrePage = async (genre) => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">${genre.nome}</h1>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
            Tutti i generi
          </button>
          <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
            Home
          </button>
        </div>
      </div>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const resultSets = await Promise.all(
      genre.querySeeds.map((seed) => window.fetchSearchResults(seed)),
    )

    const merged = resultSets.flat()
    const uniqueTracks = getUniqueTracks(merged)
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))
      .slice(0, 24)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="text-white m-0">${genre.nome}</h1>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
              Tutti i generi
            </button>
            <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
              Home
            </button>
          </div>
        </div>

        <div class="d-flex flex-column gap-2">
          ${uniqueTracks
            .map(
              (track, index) => `
              <a
                href="./album-page.html?albumId=${track.album?.id || ""}"
                class="text-decoration-none"
              >
                <div
                  class="d-flex align-items-center justify-content-between rounded px-3 py-2"
                  style="background-color: #181818;"
                >
                  <div class="d-flex align-items-center gap-3 overflow-hidden">
                    <div class="text-secondary" style="width: 24px;">${index + 1}</div>
                    <img
                      src="${track.album?.cover_small || track.album?.cover_medium || ""}"
                      alt="${track.title}"
                      class="rounded"
                      style="width: 48px; height: 48px; object-fit: cover;"
                    />
                    <div class="overflow-hidden">
                      <div class="text-white fw-bold text-truncate">${track.title}</div>
                      <div class="text-secondary small text-truncate">${track.artist?.name || ""}</div>
                    </div>
                  </div>
                  <div class="text-secondary small">${formatDuration(track.duration || 0)}</div>
                </div>
              </a>
            `,
            )
            .join("")}
        </div>
      </div>
    `

    bindBackButtons()
  } catch (error) {
    console.error("renderGenrePage error:", error)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <h1 class="text-white">${genre.nome}</h1>
        <p class="text-danger">Errore nel caricamento del genere.</p>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-light btn-sm rounded-pill back-genres-btn">
            Tutti i generi
          </button>
          <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
            Home
          </button>
        </div>
      </div>
    `

    bindBackButtons()
  }
}

const renderTopPopularTracks = async () => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <h1 class="text-white">Top 50 canciones populares</h1>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const queries = ["top hits", "global hits", "popular music"]
    const results = await Promise.all(
      queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()
    const tracks = getUniqueTracks(
      merged.sort((a, b) => (b.rank || 0) - (a.rank || 0)),
    ).slice(0, 50)

    browseViewContent.innerHTML = buildTrackListHtml(
      tracks,
      "Top 50 canciones populares",
      "back-podcast-btn",
    )

    bindBackButtons()
  } catch (error) {
    console.error("renderTopPopularTracks error:", error)
  }
}

const renderTracksOfDay = async () => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <h1 class="text-white">20 canciones del día</h1>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const queries = ["today hits", "new music", "viral songs"]
    const results = await Promise.all(
      queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()
    const tracks = getUniqueTracks(
      merged.sort((a, b) => (b.rank || 0) - (a.rank || 0)),
    ).slice(0, 20)

    browseViewContent.innerHTML = buildTrackListHtml(
      tracks,
      "20 canciones del día",
      "back-podcast-btn",
    )

    bindBackButtons()
  } catch (error) {
    console.error("renderTracksOfDay error:", error)
  }
}

const renderBestOfYear = async () => {
  if (!browseViewContent || !window.fetchSearchResults) return

  const currentYear = new Date().getFullYear()

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <h1 class="text-white">50 mejores del año ${currentYear}</h1>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const queries = [
      `${currentYear} best songs`,
      `${currentYear} top hits`,
      `${currentYear} popular songs`,
    ]

    const results = await Promise.all(
      queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()
    const tracks = getUniqueTracks(
      merged.sort((a, b) => (b.rank || 0) - (a.rank || 0)),
    ).slice(0, 50)

    browseViewContent.innerHTML = buildTrackListHtml(
      tracks,
      `50 mejores del año ${currentYear}`,
      "back-podcast-btn",
    )

    bindBackButtons()
  } catch (error) {
    console.error("renderBestOfYear error:", error)
  }
}

const podcastBrowseCards = [
  {
    title: "Podcast in evidenza",
    text: "Storie, interviste e nuovi punti di vista.",
    button: "Scopri di più",
    color: "linear-gradient(135deg, #3b225c, #1a132f)",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60",
    action: "popular",
  },
  {
    title: "Podcast Originali",
    text: "Solo su Spotify",
    button: "Esplora",
    color: "linear-gradient(135deg, #1d2d6b, #111827)",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&auto=format&fit=crop&q=60",
    action: "day",
  },
  {
    title: "Parliamo di...",
    text: "Temi, cultura e attualità",
    button: "Ascolta",
    color: "linear-gradient(135deg, #0b3d2e, #10251d)",
    img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format&fit=crop&q=60",
    action: "year",
  },
  {
    title: "True Crime",
    text: "Misteri, indagini e storie vere",
    button: "Esplora",
    color: "linear-gradient(135deg, #5a1f2d, #241015)",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60",
    action: "popular",
  },
  {
    title: "Comedy",
    text: "Risate garantite, sempre",
    button: "Scopri",
    color: "linear-gradient(135deg, #8a4b2a, #2d1710)",
    img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=60",
    action: "day",
  },
]

const renderPodcastBrowseHome = () => {
  if (!browseViewContent) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Sfoglia i podcast</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-4">
        ${podcastBrowseCards
          .map(
            (card, index) => `
            <div class="col-12 col-md-6 col-xl-4">
              <div
                class="spotify-podcast-card"
                id="podcast-card-${index}"
                style="background: ${card.color};"
              >
                <div class="spotify-podcast-card-title">${card.title}</div>
                <div class="spotify-podcast-card-text">${card.text}</div>
                <div class="spotify-podcast-card-button">${card.button}</div>
                <img src="${card.img}" alt="${card.title}" />
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `

  podcastBrowseCards.forEach((card, index) => {
    const el = document.getElementById(`podcast-card-${index}`)
    if (!el) return

    el.addEventListener("click", () => {
      if (card.action === "popular") renderTopPopularTracks()
      if (card.action === "day") renderTracksOfDay()
      if (card.action === "year") renderBestOfYear()
    })
  })

  bindBackButtons()
}

document.addEventListener("DOMContentLoaded", () => {
  if (openBrowseBtn) {
    openBrowseBtn.addEventListener("click", () => {
      showBrowseView()
      renderGenreGrid()
    })
  }

  if (openPodcastBrowseBtn) {
    openPodcastBrowseBtn.addEventListener("click", () => {
      showBrowseView()
      renderPodcastBrowseHome()
    })
  }
})
