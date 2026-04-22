const LASTFM_API_KEY = "ad84a968efa030abfdfe622251a2e0df"
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/"

const lastFmFetch = async (params = {}) => {
  const query = new URLSearchParams({
    ...params,
    api_key: LASTFM_API_KEY,
    format: "json",
  })

  const response = await fetch(`${LASTFM_BASE_URL}?${query.toString()}`)

  if (!response.ok) {
    throw new Error(`Last.fm error: ${response.status}`)
  }

  return response.json()
}

const fetchLastFmArtistInfo = async (artistName) => {
  return lastFmFetch({
    method: "artist.getInfo",
    artist: artistName,
    autocorrect: 1,
  })
}

const fetchLastFmArtistSimilar = async (artistName, limit = 8) => {
  return lastFmFetch({
    method: "artist.getSimilar",
    artist: artistName,
    autocorrect: 1,
    limit,
  })
}

const fetchLastFmArtistTopAlbums = async (artistName, limit = 8) => {
  return lastFmFetch({
    method: "artist.getTopAlbums",
    artist: artistName,
    autocorrect: 1,
    limit,
  })
}

const fetchLastFmAlbumInfo = async (artistName, albumTitle) => {
  return lastFmFetch({
    method: "album.getInfo",
    artist: artistName,
    album: albumTitle,
    autocorrect: 1,
  })
}

const fetchLastFmTrackInfo = async (artistName, trackTitle) => {
  return lastFmFetch({
    method: "track.getInfo",
    artist: artistName,
    track: trackTitle,
    autocorrect: 1,
  })
}

const fetchLastFmGlobalTopArtists = async (limit = 12) => {
  return lastFmFetch({
    method: "chart.getTopArtists",
    limit,
  })
}

const fetchLastFmGlobalTopTracks = async (limit = 12) => {
  return lastFmFetch({
    method: "chart.getTopTracks",
    limit,
  })
}

window.LastFmAPI = {
  fetchLastFmArtistInfo,
  fetchLastFmArtistSimilar,
  fetchLastFmArtistTopAlbums,
  fetchLastFmAlbumInfo,
  fetchLastFmTrackInfo,
  fetchLastFmGlobalTopArtists,
  fetchLastFmGlobalTopTracks,
}
