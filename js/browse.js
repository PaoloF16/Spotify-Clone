const generiPage = document.getElementById("generi")
const browseViewContent = document.getElementById("browse-view-content")
const audioPlayer = document.getElementById("audio-player")
const mainContainer = document.getElementById("big-container")
const openBrowseBtn = document.getElementById("open-browse-btn")
const openPodcastBrowseBtn = document.getElementById("open-podcast-browse-btn")

const genreCards = [
  {
    nome: "Pop",
    colore: "#e61e32",
    seeds: ["Taylor Swift", "Dua Lipa", "Ed Sheeran", "Ariana Grande"],
  },
  {
    nome: "Rock",
    colore: "#1e3264",
    seeds: ["Queen", "Arctic Monkeys", "Linkin Park", "Coldplay"],
  },
  {
    nome: "Hip Hop",
    colore: "#ba5d07",
    seeds: ["Drake", "Kendrick Lamar", "Eminem", "Travis Scott"],
  },
  {
    nome: "Jazz",
    colore: "#9b4fcb",
    seeds: ["Miles Davis", "John Coltrane", "Nina Simone", "Louis Armstrong"],
  },
  {
    nome: "Latin",
    colore: "#0d73ec",
    seeds: ["Bad Bunny", "J Balvin", "Karol G", "Shakira"],
  },
  {
    nome: "Dance",
    colore: "#608108",
    seeds: ["David Guetta", "Calvin Harris", "Martin Garrix", "Avicii"],
  },
  {
    nome: "Reggae",
    colore: "#1e8a4c",
    seeds: ["Bob Marley", "Sean Paul", "Shaggy", "Ziggy Marley"],
  },
  {
    nome: "Indie",
    colore: "#4b4b4b",
    seeds: ["Tame Impala", "The Killers", "Phoebe Bridgers", "The Strokes"],
  },
  {
    nome: "K-Pop",
    colore: "#7358ff",
    seeds: ["BTS", "BLACKPINK", "JENNIE", "Stray Kids"],
  },
  {
    nome: "Classica",
    colore: "#477d95",
    seeds: ["Mozart", "Beethoven", "Chopin", "Vivaldi"],
  },
  {
    nome: "Metal",
    colore: "#2d2d2d",
    seeds: ["Metallica", "Iron Maiden", "Slipknot", "Megadeth"],
  },
  {
    nome: "R&B",
    colore: "#e91429",
    seeds: ["SZA", "The Weeknd", "Rihanna", "Beyonce"],
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
        <h1 class="text-white m-0">Sfoglia per genere</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 gy-4">
        ${genreCards
          .map(
            (genre, index) => `
            <div class="col">
              <div
                class="rounded-3 overflow-hidden position-relative genre-card text-white"
                data-genre-index="${index}"
                style="background-color: ${genre.colore}; height: 160px; cursor: pointer;"
              >
                <h3 class="p-3 fw-bold fs-5">${genre.nome}</h3>
                <div
                  class="position-absolute"
                  style="
                    width: 90px;
                    height: 90px;
                    background: rgba(255,255,255,0.18);
                    border-radius: 16px;
                    transform: rotate(25deg);
                    right: 12px;
                    bottom: 12px;
                  "
                ></div>
              </div>
            </div>
          `,
          )
          .join("")}
      </div>
    </div>
  `

  document.querySelectorAll(".genre-card").forEach((card) => {
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
      genre.seeds.map((seed) => window.fetchSearchResults(seed)),
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

const renderPodcastBrowseHome = () => {
  if (!browseViewContent) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white m-0">Explora música</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-4">
        <div class="col-12 col-md-4">
          <div
            class="rounded-4 p-4 h-100"
            id="browse-popular-tracks"
            style="background-color: #181818; cursor: pointer;"
          >
            <h3 class="text-white">Top 50 canciones populares</h3>
            <p class="text-secondary mb-0">Las más escuchadas ahora.</p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div
            class="rounded-4 p-4 h-100"
            id="browse-tracks-day"
            style="background-color: #181818; cursor: pointer;"
          >
            <h3 class="text-white">20 canciones del día</h3>
            <p class="text-secondary mb-0">Lo destacado de hoy.</p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div
            class="rounded-4 p-4 h-100"
            id="browse-best-year"
            style="background-color: #181818; cursor: pointer;"
          >
            <h3 class="text-white">50 mejores del año</h3>
            <p class="text-secondary mb-0">Selección anual destacada.</p>
          </div>
        </div>
      </div>
    </div>
  `

  document
    .getElementById("browse-popular-tracks")
    ?.addEventListener("click", renderTopPopularTracks)

  document
    .getElementById("browse-tracks-day")
    ?.addEventListener("click", renderTracksOfDay)

  document
    .getElementById("browse-best-year")
    ?.addEventListener("click", renderBestOfYear)

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
