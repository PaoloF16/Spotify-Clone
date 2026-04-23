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
  },
  {
    nome: "Rock",
    colore: "#1e3264",
    querySeeds: ["Queen", "Arctic Monkeys", "Linkin Park"],
  },
  {
    nome: "Hip Hop",
    colore: "#ba5d07",
    querySeeds: ["Drake", "Kendrick Lamar", "Travis Scott"],
  },
  {
    nome: "Jazz",
    colore: "#9b59b6",
    querySeeds: ["Miles Davis", "John Coltrane", "Nina Simone"],
  },
  {
    nome: "Latin",
    colore: "#2774db",
    querySeeds: ["Bad Bunny", "Karol G", "J Balvin"],
  },
  {
    nome: "Dance",
    colore: "#6c8a00",
    querySeeds: ["David Guetta", "Calvin Harris", "Avicii"],
  },
  {
    nome: "Reggae",
    colore: "#1f8f4c",
    querySeeds: ["Bob Marley", "Sean Paul", "Shaggy"],
  },
  {
    nome: "Indie",
    colore: "#555555",
    querySeeds: ["Tame Impala", "Phoebe Bridgers", "The Strokes"],
  },
  {
    nome: "K-Pop",
    colore: "#6f52ed",
    querySeeds: ["BTS", "BLACKPINK", "JENNIE"],
  },
  {
    nome: "Classica",
    colore: "#4d829d",
    querySeeds: ["Mozart", "Beethoven", "Vivaldi"],
  },
  {
    nome: "Metal",
    colore: "#2f2f2f",
    querySeeds: ["Metallica", "Iron Maiden", "Slipknot"],
  },
  {
    nome: "R&B",
    colore: "#e91429",
    querySeeds: ["SZA", "Rihanna", "The Weeknd"],
  },
]

const rankingSections = [
  {
    id: "italy",
    title: "Top del giorno - Italia",
    shortTitle: "Italia",
    text: "Le canzoni più forti del momento in Italia.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #1f7a3d, #10251d)",
    emoji: "🇮🇹",
    badge: "Daily Top 20",
    queries: ["italy top hits", "italian hits", "top italy music"],
    limit: 20,
  },
  {
    id: "europe",
    title: "Top del giorno - Europa",
    shortTitle: "Europa",
    text: "I brani più ascoltati del giorno in Europa.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #1d4ed8, #172554)",
    emoji: "🇪🇺",
    badge: "Daily Top 20",
    queries: ["europe top hits", "europe popular songs", "top european music"],
    limit: 20,
  },
  {
    id: "global",
    title: "Top mondiale",
    shortTitle: "Mondo",
    text: "La selezione globale più ascoltata del momento.",
    button: "Apri classifica",
    color: "linear-gradient(135deg, #7c3aed, #2e1065)",
    emoji: "🌍",
    badge: "Global Top 20",
    queries: ["global hits", "world top hits", "popular music worldwide"],
    limit: 20,
  },
]

const createBrowseGenreArtwork = async (genre) => {
  try {
    if (!window.fetchSearchResults) {
      return "https://via.placeholder.com/300x300?text=Music"
    }

    const seed = genre.querySeeds[0]
    const results = await window.fetchSearchResults(seed)

    if (results && results.length > 0) {
      return (
        results[0]?.album?.cover_medium ||
        results[0]?.album?.cover_big ||
        results[0]?.album?.cover ||
        "https://via.placeholder.com/300x300?text=Music"
      )
    }
  } catch (e) {
    console.warn("Artwork fallback:", e)
  }

  return "https://via.placeholder.com/300x300?text=Music"
}

const createRankingHeroArtwork = async (section) => {
  try {
    if (!window.fetchSearchResults) {
      return "https://via.placeholder.com/400x400?text=Top"
    }

    const results = await Promise.all(
      section.queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()
    const firstTrack = merged.find(
      (item) => item?.album?.cover_big || item?.album?.cover_medium,
    )

    return (
      firstTrack?.album?.cover_big ||
      firstTrack?.album?.cover_medium ||
      firstTrack?.album?.cover ||
      "https://via.placeholder.com/400x400?text=Top"
    )
  } catch (error) {
    console.warn("Ranking hero artwork fallback:", error)
    return "https://via.placeholder.com/400x400?text=Top"
  }
}

const injectBrowseEnhancements = () => {
  if (document.getElementById("browse-enhancements-style")) return

  const style = document.createElement("style")
  style.id = "browse-enhancements-style"
  style.textContent = `
  .chart-play-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: #1ed760;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  box-shadow: 0 8px 18px rgba(30,215,96,0.28);
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.chart-row:hover .chart-play-icon {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.chart-row.no-preview .chart-play-icon {
  display: none;
}
    .ranking-hero-card {
      position: relative;
      min-height: 220px;
      border-radius: 18px;
      overflow: hidden;
      padding: 24px;
      cursor: pointer;
      box-shadow: 0 14px 32px rgba(0,0,0,0.28);
      transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
      isolation: isolate;
    }

    .ranking-hero-card:hover {
      transform: translateY(-4px);
      filter: brightness(1.05);
      box-shadow: 0 18px 40px rgba(0,0,0,0.36);
    }

    .ranking-hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.28;
      transform: scale(1.08);
      filter: saturate(1.08) contrast(1.05);
      z-index: 0;
    }

    .ranking-hero-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.32) 100%);
      pointer-events: none;
      z-index: 1;
    }

    .ranking-hero-content {
      position: relative;
      z-index: 3;
      max-width: 64%;
    }

    .ranking-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
      color: white;
      background: rgba(255,255,255,0.14);
      backdrop-filter: blur(8px);
      margin-bottom: 14px;
    }

    .ranking-hero-title {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1.02;
      color: white;
      margin-bottom: 10px;
    }

    .ranking-hero-text {
      color: rgba(255,255,255,0.82);
      font-size: 0.98rem;
      line-height: 1.4;
      margin-bottom: 18px;
    }

    .ranking-hero-button {
      display: inline-block;
      border-radius: 999px;
      background: white;
      color: black;
      font-weight: 800;
      padding: 10px 16px;
      font-size: 0.9rem;
    }

    .ranking-hero-art {
      position: absolute;
      right: 18px;
      bottom: 14px;
      width: 154px;
      height: 154px;
      border-radius: 16px;
      transform: rotate(18deg);
      background: rgba(255,255,255,0.08);
      box-shadow: 0 18px 30px rgba(0,0,0,0.28);
      z-index: 2;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ranking-hero-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      position: absolute;
      inset: 0;
      opacity: 0.58;
    }

    .ranking-hero-art-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.42) 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 14px;
      z-index: 1;
    }

    .ranking-hero-art-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(255,255,255,0.82);
      font-size: 0.8rem;
      font-weight: 800;
    }

    .ranking-hero-art-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ranking-hero-art-lines span {
      display: block;
      height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.2);
    }

    .ranking-hero-art-lines span:nth-child(1) { width: 100%; }
    .ranking-hero-art-lines span:nth-child(2) { width: 76%; }
    .ranking-hero-art-lines span:nth-child(3) { width: 58%; }

    .ranking-hero-art-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      color: white;
      font-weight: 900;
      line-height: 0.95;
    }

    .ranking-hero-art-bottom .big-rank {
      font-size: 2.6rem;
    }

    .ranking-hero-art-bottom .small-rank {
      font-size: 0.85rem;
      opacity: 0.78;
      text-align: right;
    }

    .chart-row {
      background: #181818;
      border-radius: 14px;
      transition: transform 0.18s ease, background-color 0.18s ease;
      cursor: pointer;
    }

    .chart-row:hover {
      transform: scale(1.01);
      background: #222222;
    }

    .chart-row.no-preview {
      cursor: default;
      opacity: 0.72;
    }

    .chart-rank-block {
      width: 64px;
      min-width: 64px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .chart-rank-number {
      font-size: 1.45rem;
      font-weight: 900;
      color: white;
    }

    .chart-rank-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #b3b3b3;
      margin-top: 5px;
    }

    .chart-cover-wrap {
      position: relative;
      width: 56px;
      height: 56px;
      min-width: 56px;
    }

    .chart-cover-wrap img {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 10px;
      display: block;
    }

    .chart-cover-wrap::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 10px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
      pointer-events: none;
    }

    .chart-meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      color: #e5e5e5;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 7px 12px;
      margin-bottom: 18px;
    }

    .chart-play-hint {
      font-size: 0.74rem;
      color: #1ed760;
      font-weight: 700;
      margin-top: 2px;
    }

    .chart-album-link {
      text-decoration: none;
      color: white;
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 999px;
      padding: 7px 12px;
      font-size: 0.76rem;
      font-weight: 700;
      transition: background-color 0.18s ease, border-color 0.18s ease;
      white-space: nowrap;
    }

    .chart-album-link:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.28);
      color: white;
    }

    @media (max-width: 767.98px) {
      .ranking-hero-content {
        max-width: 100%;
      }

      .ranking-hero-art {
        width: 120px;
        height: 120px;
        right: 12px;
        bottom: 10px;
      }

      .ranking-hero-title {
        font-size: 1.45rem;
        max-width: 78%;
      }

      .ranking-hero-text {
        max-width: 72%;
        font-size: 0.9rem;
      }

      .chart-album-link {
        display: none;
      }
    }
  `
  document.head.appendChild(style)
}

const showBrowseView = () => {
  if (!generiPage || !mainContainer || !audioPlayer) return
  generiPage.classList.remove("d-none")
  mainContainer.classList.add("d-none")
  audioPlayer.classList.remove("d-none")
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

  document.querySelectorAll(".back-rankings-btn").forEach((btn) => {
    btn.addEventListener("click", renderRankingsHome)
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

const buildPlayableTrackListHtml = (
  tracks,
  title,
  backClass = "back-home-btn",
  metaBadge = "🔥 Classifica aggiornata",
) => {
  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div class="chart-meta-badge">${metaBadge}</div>
          <h1 class="text-white m-0">${title}</h1>
        </div>
        <button class="btn btn-outline-light btn-sm rounded-pill ${backClass}">
          Torna indietro
        </button>
      </div>

      <div id="browse-ranking-list" class="d-flex flex-column gap-2">
        ${tracks
          .map((track, index) => {
            const hasPreview = Boolean(track.preview)
            return `
              <div
                class="chart-row d-flex align-items-center justify-content-between px-3 py-3 ${hasPreview ? "" : "no-preview"}"
                ${hasPreview ? `data-track-src="${track.preview}"` : ""}
                data-track-index="${index}"
                data-track-id="${track.id || ""}"
                data-track-title="${track.title || ""}"
                data-track-artist="${track.artist?.name || ""}"
                data-track-cover="${track.album?.cover_medium || track.album?.cover_small || ""}"
                data-track-duration="${track.duration || 0}"
                data-track-rank="${track.rank || 0}"
              >
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                  <div class="chart-rank-block">
                    <div class="chart-rank-number">${index + 1}</div>
                    <div class="chart-rank-label">Top</div>
                  </div>

                  <div class="chart-cover-wrap">
                    <img
                      src="${track.album?.cover_small || track.album?.cover_medium || ""}"
                      alt="${track.title}"
                    />
                  </div>

                  <div class="overflow-hidden">
                    <div class="text-white fw-bold text-truncate">${track.title}</div>
                    <div class="text-secondary small text-truncate">${track.artist?.name || ""}</div>
                   <div class="small text-secondary text-truncate">${track.artist?.name || ""}</div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3 ms-3">
                  <div class="text-secondary small">
                    ${formatDuration(track.duration || 0)}
                  </div>

                  <a
                    href="./album-page.html?albumId=${track.album?.id || ""}"
                    class="chart-album-link"
                    data-no-play="true"
                  >
                    Vai all'album
                  </a>
                </div>
              </div>
            `
          })
          .join("")}
      </div>
    </div>
  `
}

const renderGenreGrid = async () => {
  if (!browseViewContent) return

  const cardsHtmlArray = await Promise.all(
    genreCards.map(async (genre, index) => {
      const artwork = await createBrowseGenreArtwork(genre)

      return `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div
            class="spotify-genre-card"
            data-genre-index="${index}"
            style="background-color: ${genre.colore};"
          >
            <h3>${genre.nome}</h3>
            <div class="spotify-genre-card-artwork">
              <img src="${artwork}" alt="${genre.nome}" />
            </div>
          </div>
        </div>
      `
    }),
  )

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Explorar todo</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-3">
        ${cardsHtmlArray.join("")}
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

    browseViewContent.innerHTML = buildPlayableTrackListHtml(
      uniqueTracks,
      genre.nome,
      "back-genres-btn",
      `🎵 ${genre.nome}`,
    )

    bindBackButtons()

    if (window.GlobalPlayer) {
      window.GlobalPlayer.rebuildQueueFromDOM()
    }
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

const renderRankingsHome = async () => {
  if (!browseViewContent) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Rankings</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>
      <p class="text-secondary">Caricamento rankings...</p>
    </div>
  `

  const cards = await Promise.all(
    rankingSections.map(async (section, index) => {
      const artwork = await createRankingHeroArtwork(section)

      return `
        <div class="col-12 col-md-6 col-xl-4">
          <div
            class="ranking-hero-card"
            id="ranking-card-${index}"
            style="background: ${section.color};"
          >
            <img class="ranking-hero-bg" src="${artwork}" alt="${section.title}" />

            <div class="ranking-hero-content">
              <div class="ranking-hero-badge">
                <span>${section.emoji}</span>
                <span>${section.badge}</span>
              </div>

              <div class="ranking-hero-title">${section.title}</div>
              <div class="ranking-hero-text">${section.text}</div>
              <div class="ranking-hero-button">${section.button}</div>
            </div>

            <div class="ranking-hero-art">
              <img src="${artwork}" alt="${section.title}" />
              <div class="ranking-hero-art-inner">
                <div class="ranking-hero-art-top">
                  <span>${section.emoji}</span>
                  <span>CHART</span>
                </div>

                <div class="ranking-hero-art-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div class="ranking-hero-art-bottom">
                  <div class="big-rank">#1</div>
                  <div class="small-rank">${section.shortTitle}<br/>Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }),
  )

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="browse-section-title m-0">Rankings</h1>
        <button class="btn btn-outline-light btn-sm rounded-pill back-home-btn">
          Torna alla home
        </button>
      </div>

      <div class="row g-4">
        ${cards.join("")}
      </div>
    </div>
  `

  rankingSections.forEach((section, index) => {
    const el = document.getElementById(`ranking-card-${index}`)
    if (!el) return

    el.addEventListener("click", () => {
      renderRankingTracks(section)
    })
  })

  bindBackButtons()
}

const renderRankingTracks = async (section) => {
  if (!browseViewContent || !window.fetchSearchResults) return

  browseViewContent.innerHTML = `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div class="chart-meta-badge">${section.emoji} ${section.badge}</div>
          <h1 class="text-white m-0">${section.title}</h1>
        </div>
        <button class="btn btn-outline-light btn-sm rounded-pill back-rankings-btn">
          Torna ai rankings
        </button>
      </div>
      <p class="text-secondary">Caricamento...</p>
    </div>
  `

  try {
    const results = await Promise.all(
      section.queries.map((query) => window.fetchSearchResults(query)),
    )

    const merged = results.flat()

    const tracks = getUniqueTracks(
      merged.sort((a, b) => (b.rank || 0) - (a.rank || 0)),
    ).slice(0, section.limit || 20)

    browseViewContent.innerHTML = buildPlayableTrackListHtml(
      tracks,
      section.title,
      "back-rankings-btn",
      `${section.emoji} ${section.badge}`,
    )

    bindBackButtons()

    if (window.GlobalPlayer) {
      window.GlobalPlayer.rebuildQueueFromDOM()
    }
  } catch (error) {
    console.error("renderRankingTracks error:", error)

    browseViewContent.innerHTML = `
      <div class="container-fluid">
        <h1 class="text-white">${section.title}</h1>
        <p class="text-danger">Errore nel caricamento della classifica.</p>
        <button class="btn btn-outline-light btn-sm rounded-pill back-rankings-btn">
          Torna ai rankings
        </button>
      </div>
    `

    bindBackButtons()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectBrowseEnhancements()

  if (openBrowseBtn) {
    openBrowseBtn.addEventListener("click", async () => {
      showBrowseView()
      await renderGenreGrid()
    })
  }

  if (openPodcastBrowseBtn) {
    openPodcastBrowseBtn.addEventListener("click", async () => {
      showBrowseView()
      await renderRankingsHome()
    })
  }
})
