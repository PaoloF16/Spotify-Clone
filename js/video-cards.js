const videoCardsWrapper = document.getElementById("video-cards-wrapper")

const YOUTUBE_API_KEY = "AIzaSyCSQB7BQufTgKWDGeo7ObqOSB8DmoJPua4"

// Duración del cache: 12 horas
const VIDEO_CARDS_CACHE_KEY = "spotify_clone_youtube_video_cards_cache_v1"
const VIDEO_CARDS_CACHE_DURATION = 12 * 60 * 60 * 1000

// Set fijo por géneros / moods
const curatedYoutubeCards = [
  {
    key: "kpop",
    eyebrow: "K-pop picks",
    fallbackTitle: "K-pop now",
    subtitle: "Mood • YouTube",
    description:
      "Visuales brillantes, energía alta y una estética moderna inspirada en playlists de K-pop.",
    query: "k-pop aesthetic playlist",
    tag: "K-pop",
    fallbackPoster:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=60",
  },
  {
    key: "popvibes",
    eyebrow: "Pop vibes",
    fallbackTitle: "Pop glow",
    subtitle: "Mood • YouTube",
    description:
      "Una selección colorida y luminosa con espíritu pop, ideal para una card tipo Spotify.",
    query: "pop vibes official playlist",
    tag: "Pop",
    fallbackPoster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=60",
  },
  {
    key: "nightdrive",
    eyebrow: "Night drive",
    fallbackTitle: "Night drive vibes",
    subtitle: "Mood • YouTube",
    description:
      "Neones, carretera y una vibra nocturna para una experiencia más cinematográfica.",
    query: "night drive music mix",
    tag: "Night",
    fallbackPoster:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=60",
  },
  {
    key: "chill",
    eyebrow: "Chill mood",
    fallbackTitle: "Chill feels",
    subtitle: "Mood • YouTube",
    description:
      "Una card más suave y relajada, pensada para fondos limpios y una estética tranquila.",
    query: "chill music vibes playlist",
    tag: "Chill",
    fallbackPoster:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=60",
  },
  {
    key: "dance",
    eyebrow: "Dance energy",
    fallbackTitle: "Dance motion",
    subtitle: "Mood • YouTube",
    description:
      "Más ritmo, más color y un look enérgico para destacar entre las cards del home.",
    query: "dance hits playlist",
    tag: "Dance",
    fallbackPoster:
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200&auto=format&fit=crop&q=60",
  },
  {
    key: "indie",
    eyebrow: "Indie feels",
    fallbackTitle: "Indie mood",
    subtitle: "Mood • YouTube",
    description:
      "Una selección más estética y alternativa, con aire editorial y personalidad visual propia.",
    query: "indie aesthetic playlist",
    tag: "Indie",
    fallbackPoster:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=60",
    fallbackBackground:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&auto=format&fit=crop&q=60",
  },
]

let youtubeIframeApiReady = false
const youtubePlayers = {}

const injectVideoCardsStyles = () => {
  if (document.getElementById("youtube-video-cards-style")) return

  const style = document.createElement("style")
  style.id = "youtube-video-cards-style"
  style.textContent = `
    .spotify-video-section-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 1.25rem;
    }

    .spotify-video-card {
      position: relative;
      min-height: 380px;
      border-radius: 18px;
      overflow: hidden;
      background: #121212;
      cursor: pointer;
      box-shadow:
        0 14px 30px rgba(0, 0, 0, 0.28),
        inset 0 0 0 1px rgba(255, 255, 255, 0.04);
      transition:
        transform 0.22s ease,
        box-shadow 0.22s ease,
        filter 0.22s ease;
      isolation: isolate;
    }

    .spotify-video-card:hover {
      transform: translateY(-4px);
      filter: brightness(1.03);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.34),
        inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    .spotify-video-card-bg,
    .spotify-video-card-player-slot {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .spotify-video-card-bg {
      object-fit: cover;
      display: block;
      transform: scale(1.02);
      transition: transform 0.35s ease, filter 0.35s ease;
      filter: saturate(1.05) contrast(1.03);
    }

    .spotify-video-card:hover .spotify-video-card-bg {
      transform: scale(1.06);
    }

    .spotify-video-card-player-slot {
      z-index: 0;
      display: none;
      background: #000;
    }

    .spotify-video-card.is-playing .spotify-video-card-player-slot {
      display: block;
    }

    .spotify-video-card.is-playing .spotify-video-card-bg {
      opacity: 0;
      pointer-events: none;
    }

    .spotify-video-card-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.18) 0%,
          rgba(0, 0, 0, 0.28) 28%,
          rgba(0, 0, 0, 0.48) 62%,
          rgba(0, 0, 0, 0.78) 100%
        );
      z-index: 1;
      transition: opacity 0.25s ease;
    }

    .spotify-video-card.is-playing .spotify-video-card-overlay {
      opacity: 0.28;
    }

    .spotify-video-card-content {
      position: relative;
      z-index: 2;
      height: 100%;
      min-height: 380px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
    }

    .spotify-video-card-topline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.72);
      margin-bottom: 10px;
    }

    .spotify-video-card-main {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .spotify-video-card-poster {
      width: 74px;
      min-width: 74px;
      height: 74px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
    }

    .spotify-video-card-text {
      min-width: 0;
    }

    .spotify-video-card-title {
      font-size: 1.9rem;
      line-height: 1.02;
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px 0;
      letter-spacing: -0.02em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .spotify-video-card-subtitle {
      font-size: 0.92rem;
      color: rgba(255, 255, 255, 0.76);
      margin: 0;
    }

    .spotify-video-card-description {
      font-size: 0.9rem;
      line-height: 1.35;
      color: rgba(255, 255, 255, 0.86);
      margin: 0 0 14px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .spotify-video-card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .spotify-video-card-left-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spotify-video-pill-btn {
      border: none;
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 0.82rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.58);
      color: #fff;
      backdrop-filter: blur(8px);
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .spotify-video-pill-btn:hover {
      background: rgba(0, 0, 0, 0.78);
      transform: translateY(-1px);
    }

    .spotify-video-icon-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .spotify-video-icon-btn:hover {
      background: rgba(0, 0, 0, 0.74);
      transform: translateY(-1px);
    }

    .spotify-video-play-btn {
      width: 52px;
      height: 52px;
      border: none;
      border-radius: 50%;
      background: #fff;
      color: #000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .spotify-video-play-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
    }

    .spotify-video-card-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.36);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      backdrop-filter: blur(8px);
    }

    @media (max-width: 991.98px) {
      .spotify-video-card {
        min-height: 340px;
      }

      .spotify-video-card-content {
        min-height: 340px;
      }

      .spotify-video-card-title {
        font-size: 1.55rem;
      }
    }

    @media (max-width: 575.98px) {
      .spotify-video-card {
        min-height: 320px;
      }

      .spotify-video-card-content {
        min-height: 320px;
        padding: 14px;
      }

      .spotify-video-card-poster {
        width: 60px;
        min-width: 60px;
        height: 60px;
      }

      .spotify-video-card-title {
        font-size: 1.3rem;
      }

      .spotify-video-card-description {
        font-size: 0.82rem;
        -webkit-line-clamp: 2;
      }
    }
  `
  document.head.appendChild(style)
}

const getCachedVideoCards = () => {
  try {
    const raw = localStorage.getItem(VIDEO_CARDS_CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null

    const isExpired = Date.now() - parsed.timestamp > VIDEO_CARDS_CACHE_DURATION

    if (isExpired) return null

    return parsed.data
  } catch (error) {
    console.warn("Cache read error:", error)
    return null
  }
}

const setCachedVideoCards = (cards) => {
  try {
    localStorage.setItem(
      VIDEO_CARDS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: cards,
      }),
    )
  } catch (error) {
    console.warn("Cache write error:", error)
  }
}

const clearExpiredVideoCardsCache = () => {
  try {
    const raw = localStorage.getItem(VIDEO_CARDS_CACHE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp) return

    const isExpired = Date.now() - parsed.timestamp > VIDEO_CARDS_CACHE_DURATION

    if (isExpired) {
      localStorage.removeItem(VIDEO_CARDS_CACHE_KEY)
    }
  } catch (error) {
    console.warn("Cache cleanup error:", error)
  }
}

const buildFallbackCards = () => {
  return curatedYoutubeCards.map((card, index) => ({
    id: `fallback-${index}`,
    title: card.fallbackTitle,
    subtitle: card.subtitle,
    description: card.description,
    poster: card.fallbackPoster,
    background: card.fallbackBackground,
    eyebrow: card.eyebrow,
    youtubeId: "",
    tag: card.tag,
    isFallback: true,
  }))
}

const loadYouTubeIframeApi = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      youtubeIframeApiReady = true
      resolve()
      return
    }

    if (window.__youtubeIframeApiLoading) {
      const checkReady = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkReady)
          youtubeIframeApiReady = true
          resolve()
        }
      }, 100)
      return
    }

    window.__youtubeIframeApiLoading = true

    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    document.head.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      youtubeIframeApiReady = true
      resolve()
    }
  })
}

const fetchYoutubeCard = async (cardConfig) => {
  const params = new URLSearchParams({
    part: "snippet",
    q: cardConfig.query,
    type: "video",
    maxResults: "1",
    key: YOUTUBE_API_KEY,
    safeSearch: "moderate",
  })

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`)
  }

  const data = await response.json()
  const item = data.items?.[0]

  if (!item) {
    return {
      id: `fallback-empty-${cardConfig.key}`,
      title: cardConfig.fallbackTitle,
      subtitle: cardConfig.subtitle,
      description: cardConfig.description,
      poster: cardConfig.fallbackPoster,
      background: cardConfig.fallbackBackground,
      eyebrow: cardConfig.eyebrow,
      youtubeId: "",
      tag: cardConfig.tag,
      isFallback: true,
    }
  }

  return {
    id: item.id.videoId,
    title: item.snippet.title || cardConfig.fallbackTitle,
    subtitle: cardConfig.subtitle,
    description: cardConfig.description,
    poster:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url ||
      cardConfig.fallbackPoster,
    background:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      cardConfig.fallbackBackground,
    eyebrow: cardConfig.eyebrow,
    youtubeId: item.id.videoId,
    tag: cardConfig.tag,
    isFallback: false,
  }
}

const fetchCuratedYoutubeCards = async () => {
  const results = await Promise.allSettled(
    curatedYoutubeCards.map(fetchYoutubeCard),
  )

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value
    }

    console.error(
      `YouTube search error for ${curatedYoutubeCards[index].key}:`,
      result.reason,
    )

    return {
      id: `fallback-error-${index}`,
      title: curatedYoutubeCards[index].fallbackTitle,
      subtitle: curatedYoutubeCards[index].subtitle,
      description: curatedYoutubeCards[index].description,
      poster: curatedYoutubeCards[index].fallbackPoster,
      background: curatedYoutubeCards[index].fallbackBackground,
      eyebrow: curatedYoutubeCards[index].eyebrow,
      youtubeId: "",
      tag: curatedYoutubeCards[index].tag,
      isFallback: true,
    }
  })
}

const createVideoCard = (card, index) => {
  const safeDescription = card.description?.trim()
    ? card.description
    : "Video card pronta per integrare clip reali da YouTube in stile Spotify."

  const badgeLabel = card.isFallback ? `${card.tag} • Fallback` : card.tag

  return `
    <div class="col-12 col-md-6">
      <article
        class="spotify-video-card"
        data-card-index="${index}"
        data-youtube-id="${card.youtubeId || ""}"
      >
        <img
          class="spotify-video-card-bg"
          src="${card.background}"
          alt="${card.title}"
        />

        <div
          class="spotify-video-card-player-slot"
          id="youtube-player-slot-${index}"
        ></div>

        <div class="spotify-video-card-overlay"></div>

        <div class="spotify-video-card-content">
          <div>
            <div class="spotify-video-card-topline">
              <span>${card.eyebrow}</span>
              <span class="spotify-video-card-tag">
                <i class="bi bi-youtube"></i>
                <span>${badgeLabel}</span>
              </span>
            </div>

            <div class="spotify-video-card-main">
              <img
                class="spotify-video-card-poster"
                src="${card.poster}"
                alt="${card.title}"
              />

              <div class="spotify-video-card-text">
                <h3 class="spotify-video-card-title">${card.title}</h3>
                <p class="spotify-video-card-subtitle">${card.subtitle}</p>
              </div>
            </div>
          </div>

          <div>
            <p class="spotify-video-card-description">${safeDescription}</p>

            <div class="spotify-video-card-actions">
              <div class="spotify-video-card-left-actions">
                <button
                  type="button"
                  class="spotify-video-pill-btn"
                  data-action="show"
                  ${card.youtubeId ? "" : "disabled"}
                >
                  <i class="bi bi-camera-reels me-1"></i>
                  ${card.youtubeId ? "Ver clip" : "Solo preview visual"}
                </button>

                <button
                  type="button"
                  class="spotify-video-icon-btn"
                  data-action="more"
                >
                  <i class="bi bi-three-dots"></i>
                </button>
              </div>

              <button
                type="button"
                class="spotify-video-play-btn"
                data-action="play"
                aria-label="Reproducir video"
                ${card.youtubeId ? "" : "disabled"}
              >
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  `
}

const stopAllYoutubePlayers = (exceptIndex = null) => {
  Object.entries(youtubePlayers).forEach(([key, player]) => {
    const numericKey = Number(key)

    if (exceptIndex !== null && numericKey === exceptIndex) return

    try {
      player.pauseVideo()
    } catch (error) {
      console.warn("pauseVideo error:", error)
    }

    const card = document.querySelector(`[data-card-index="${numericKey}"]`)
    if (card) {
      card.classList.remove("is-playing")
    }
  })
}

const createOrPlayYoutubePlayer = async (cardElement) => {
  const youtubeId = cardElement.dataset.youtubeId
  const index = Number(cardElement.dataset.cardIndex)
  const slotId = `youtube-player-slot-${index}`

  if (!youtubeId) return

  await loadYouTubeIframeApi()
  stopAllYoutubePlayers(index)

  if (youtubePlayers[index]) {
    cardElement.classList.add("is-playing")
    youtubePlayers[index].playVideo()
    return
  }

  youtubePlayers[index] = new YT.Player(slotId, {
    videoId: youtubeId,
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: (event) => {
        cardElement.classList.add("is-playing")
        event.target.playVideo()
      },
      onStateChange: (event) => {
        if (
          event.data === YT.PlayerState.PAUSED ||
          event.data === YT.PlayerState.ENDED
        ) {
          cardElement.classList.remove("is-playing")
        }

        if (event.data === YT.PlayerState.PLAYING) {
          cardElement.classList.add("is-playing")
        }
      },
    },
  })
}

const bindVideoCardEvents = () => {
  const cards = videoCardsWrapper.querySelectorAll(".spotify-video-card")

  cards.forEach((card) => {
    card.addEventListener("click", async (event) => {
      const button = event.target.closest("button")
      if (!button) return

      const action = button.dataset.action

      if (action === "more") return

      if ((action === "show" || action === "play") && card.dataset.youtubeId) {
        await createOrPlayYoutubePlayer(card)
      }
    })
  })
}

const renderCards = (cards) => {
  videoCardsWrapper.innerHTML = cards
    .map((card, index) => createVideoCard(card, index))
    .join("")

  bindVideoCardEvents()
}

const renderVideoCards = async () => {
  if (!videoCardsWrapper) return

  clearExpiredVideoCardsCache()

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "PEGA_AQUI_TU_API_KEY") {
    renderCards(buildFallbackCards())
    return
  }

  const cachedCards = getCachedVideoCards()
  if (cachedCards?.length) {
    renderCards(cachedCards)
    return
  }

  videoCardsWrapper.innerHTML = `
    <div class="col-12">
      <p class="text-secondary">Cargando video cards...</p>
    </div>
  `

  try {
    const cards = await fetchCuratedYoutubeCards()

    if (!cards.length) {
      const fallbackCards = buildFallbackCards()
      renderCards(fallbackCards)
      setCachedVideoCards(fallbackCards)
      return
    }

    renderCards(cards)
    setCachedVideoCards(cards)
  } catch (error) {
    console.error("renderVideoCards fatal error:", error)
    const fallbackCards = buildFallbackCards()
    renderCards(fallbackCards)
    setCachedVideoCards(fallbackCards)
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  injectVideoCardsStyles()
  await renderVideoCards()
})
