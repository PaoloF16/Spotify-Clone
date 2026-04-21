


// ─── CONSTANTS ───────────────────────────────────────────────

const DEFAULT_PLAYLIST_IMAGE = "https://images.pexels.com/photos/20385069/pexels-photo-20385069.jpeg";

const DEFAULT_ASIDE_CONTENT = `
  <div class="bg-secondary bg-opacity-10 rounded-3 p-3 mb-3 mt-2 hide-on-closed">
    <p class="fw-bold text-white mb-1">Crea la tua prima playlist</p>
    <p class="text-light small mb-3 opacity-75">È facile, ti aiuteremo</p>
    <button class="btn btn-light rounded-pill fw-bold btn-sm px-3">
      <a href="#" class="text-decoration-none text-black">Crea playlist</a>
    </button>
  </div>`;


// ─── STATE ───────────────────────────────────────────────────

// Load playlists and liked songs from localStorage if there are any
let userPlaylists = [];
let likedSongs = [];

try {
  userPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || [];
} catch {
  userPlaylists = [];
}

try {
  likedSongs = JSON.parse(localStorage.getItem("userLikedSongs")) || [];
} catch {
  likedSongs = [];
}

// set Id of the playlist that is being edited (null = create mode)
let editingId = null;


// ─── CLASSES ─────────────────────────────────────────────────

class Playlist {
  constructor(title = "", creator = "User", description = "", image = DEFAULT_PLAYLIST_IMAGE) {
    this.id          = `pl-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    this.title       = title.trim();
    this.creator     = creator.trim();
    this.description = description.trim();
    this.img         = image.trim() || DEFAULT_PLAYLIST_IMAGE;
    this.isPublic    = true;
    this.createdAt   = new Date().toISOString().split("T")[0];
    this.tracks      = [];
    this.followerCount      = 0;
    this.totalDurationSeconds = 0;
  }

    // Add a track object { id, title, artist, duration } to the playlist.
    // Duplicate tracks (same id) are silently ignored
  addTrack(track) {
    if (!track || !track.id) {
      console.warn("addTrack: invalid track object", track);
      return;
    }
    if (this.tracks.some(t => t.trackId === track.id)) {
      console.log(`Track "${track.title}" is already in "${this.title}".`);
      return;
    }
    this.tracks.push({
      trackId:  track.id,
      title:    track.title   || "Unknown Title",
      artist:   track.artist  || "Unknown Artist",
      duration: track.duration || 0,
    });
    this.totalDurationSeconds += track.duration || 0;
    console.log(`Added "${track.title}" to "${this.title}".`);
  }

  /** Remove a track by its id. */
  removeTrack(id) {
    const track = this.tracks.find(t => t.trackId === id);
    if (track) this.totalDurationSeconds -= track.duration || 0;
    this.tracks = this.tracks.filter(t => t.trackId !== id);
  }

  /** Formatted total duration string, e.g. "1h 23m" or "45m 10s". */
  get formattedDuration() {
    const h = Math.floor(this.totalDurationSeconds / 3600);
    const m = Math.floor((this.totalDurationSeconds % 3600) / 60);
    const s = this.totalDurationSeconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
}


class Artist {
  constructor(id = "", name = "", picture = "", fans = 0) {
    this.id      = id;
    this.name    = name;
    this.picture = picture;
    this.fans    = fans;
    this.albums  = [];
    this.topTracks = [];
  }

  addAlbum(album) {
    if (!this.albums.some(a => a.id === album.id)) {
      this.albums.push(album);
    }
  }
}


// ─── PERSISTENCE HELPERS ─────────────────────────────────────

const savePlaylists = () =>
  localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists));

const saveLikedSongs = () =>
  localStorage.setItem("userLikedSongs", JSON.stringify(likedSongs));


// ─── DOM REFERENCES ──────────────────────────────────────────

const asidePlaylistList = document.getElementById("playlists");
const createPlaylistForm = document.getElementById("createPlaylistForm");
const clearFormButton = document.getElementById("clearInputs");
const discardBtn = document.getElementById("discardButton");
const formHeading = document.querySelector("h1");
const submitBtn = createPlaylistForm ? createPlaylistForm.querySelector("button[type=submit]") : null;


// ─── SIDEBAR TOGGLE ──────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const sidebar   = document.getElementById("main-sidebar");
  const toggleBtn = document.getElementById("toggle-sidebar");
  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("closed"));
  }
});


// ─── FORM HELPERS ────────────────────────────────────────────

// Reset the form fields. 
const clearForm = (e) => {
  if (e) e.preventDefault();
  createPlaylistForm.reset();
};

// Switch UI into CREATE mode.
const enterCreateMode = () => {
  editingId = null;
  if (formHeading) formHeading.innerText = "Create your playlist";
  if (submitBtn)   submitBtn.innerText   = "Create Playlist";
  if (discardBtn)  discardBtn.style.display = "none";
};

/** Switch UI into EDIT mode. */
const enterEditMode = () => {
  if (formHeading) formHeading.innerText = "Edit your playlist";
  if (submitBtn)   submitBtn.innerText   = "Save Changes";
  if (discardBtn)  discardBtn.style.display = "inline-block";
};

/** Basic validation — returns an error string or null if valid. */
const validateForm = (title) => {
  if (!title || title.trim() === "") return "Playlist title is required.";
  if (title.trim().length > 100)    return "Title must be 100 characters or fewer.";
  return null;
};


// ─── API HELPERS (ready to use, currently commented out) ─────

/*
const getArtist = async (artistId) => {
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getArtist error:", err);
    return null;
  }
};

const getAlbum = async (albumId) => {
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getAlbum error:", err);
    return null;
  }
};
*/


// ─── CREATE / EDIT PLAYLIST ──────────────────────────────────

const createPlaylist = (e) => {
  e.preventDefault();

  const title = document.getElementById("playlistTitle").value;
  const description = document.getElementById("playlistDescription").value;
  const image = document.getElementById("playlistImage").value;
  const isPublic = document.getElementById("playlistPublicCheck").checked;

  // Validate
  const validationError = validateForm(title);

  if (validationError) {
    alert(validationError);        // swap for a toast/inline error in production
    return;
  }

  if (editingId) {
    // ── EDIT MODE ──
    const playlist = userPlaylists.find(pl => pl.id === editingId);

    if (!playlist) {
      console.error(`Playlist with id "${editingId}" not found.`);
      enterCreateMode();
      return;
    }

    playlist.title = title.trim();
    playlist.description = description.trim();
    playlist.img = image.trim() || DEFAULT_PLAYLIST_IMAGE;
    playlist.isPublic = isPublic;

    enterCreateMode();

  } else {
    // ── CREATE MODE ──
    const newPlaylist    = new Playlist(title, "User", description, image);
    newPlaylist.isPublic = isPublic;
    userPlaylists.push(newPlaylist);
  }

  clearForm();
  savePlaylists();
  displayAsidePlaylists();
};


// ─── DELETE PLAYLIST ─────────────────────────────────────────

const deletePlaylist = (id) => {
  const index = userPlaylists.findIndex(pl => pl.id === id);
  if (index === -1) {
    console.warn(`deletePlaylist: no playlist with id "${id}"`);
    return;
  }

  const confirmed = window.confirm(
    `Delete "${userPlaylists[index].title}"? This cannot be undone.`
  );
  if (!confirmed) return;

  // If we're currently editing this playlist, exit edit mode
  if (editingId === id) {
    enterCreateMode();
    clearForm();
  }

  userPlaylists.splice(index, 1);
  savePlaylists();
  displayAsidePlaylists();
};


// ─── EDIT PLAYLIST ───────────────────────────────────────────

const editPlaylist = (e) => {
  e.preventDefault();

  const card = e.target.closest(".card");
  const playlistId = card?.dataset.id;
  if (!playlistId) return;

  const playlist = userPlaylists.find(p => p.id === playlistId);
  if (!playlist) return;

  // Populate form
  document.getElementById("playlistTitle").value = playlist.title;
  document.getElementById("playlistDescription").value = playlist.description;
  document.getElementById("playlistImage").value = playlist.img;
  document.getElementById("playlistPublicCheck").checked = playlist.isPublic;

  // Remember which playlist we're editing and update UI
  editingId = playlistId;
  enterEditMode();

  // Scroll form into view so the user knows it was populated
  createPlaylistForm.scrollIntoView({ behavior: "smooth", block: "start" });
};


// ─── DISPLAY ASIDE PLAYLISTS ─────────────────────────────────

const displayAsidePlaylists = () => {
  if (!asidePlaylistList) return;

  if (userPlaylists.length === 0) {
    asidePlaylistList.innerHTML = DEFAULT_ASIDE_CONTENT;
    return;
  }

  asidePlaylistList.innerHTML = "";

  const list = document.createElement("div");
  list.classList.add("hide-on-closed");

  userPlaylists.forEach((playlist) => {
    const card = document.createElement("div");
    card.classList.add("card", "bg-secondary", "bg-opacity-10", "text-white", "p-1", "my-4", "d-flex", "flex-row");
    card.dataset.id = playlist.id;

    card.innerHTML = `
      <img
        src="${escapeHtml(playlist.img)}"
        class="rounded-start"
        style="width: 80px; min-width: 80px; object-fit: cover;"
        alt="Cover for ${escapeHtml(playlist.title)}"
        onerror="this.src='${DEFAULT_PLAYLIST_IMAGE}'"
      >
      <div class="card-body">
        <h5 class="card-title mb-2">
          <a
            class="text-decoration-none text-white"
            href="./album-page.html?id=${encodeURIComponent(playlist.id)}"
          >${escapeHtml(playlist.title)}</a>
        </h5>
        <p class="card-text text-secondary mb-2">
            <i>${escapeHtml(playlist.description)}</i>
        </p>
        <div class="d-flex align-items-center justify-content-start mb-3 gap-2">
          <small class="text-secondary mb-3">${playlist.tracks.length} songs</small>
          <small class="text-secondary fw-bold mb-3">
            ${playlist.isPublic ? "Public" : "Private"}
          </small>
        </div>
        <div class="d-flex align-items-center justify-content-start gap-2">
          <a href="#" class="play-playlist-btn btn btn-sm btn-success px-3">Play</a>
          <a href="#" class="edit-playlist-btn btn btn-sm btn-dark px-3">Edit</a>
        </div>
      </div>`;

    list.appendChild(card);
  });

  asidePlaylistList.appendChild(list);
};


// ─── SECURITY HELPER ─────────────────────────────────────────

/** Escape user-supplied strings before inserting into innerHTML. */
const escapeHtml = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
};


// ─── LIKED SONGS HELPERS ─────────────────────────────────────

const likeTrack = (track) => {
  if (!track || !track.id) return;
  if (likedSongs.some(t => t.id === track.id)) {
    console.log(`"${track.title}" is already liked.`);
    return;
  }
  likedSongs.push(track);
  saveLikedSongs();
};

const unlikeTrack = (trackId) => {
  likedSongs = likedSongs.filter(t => t.id !== trackId);
  saveLikedSongs();
};


// ─── EVENT LISTENERS ─────────────────────────────────────────

// Create / edit playlist form submit
if (createPlaylistForm) {
  createPlaylistForm.addEventListener("submit", createPlaylist);
}

// Clear form button
if (clearFormButton) {
  clearFormButton.addEventListener("click", clearForm);
}

// Discard changes button (exit edit mode)
if (discardBtn) {
  discardBtn.addEventListener("click", (e) => {
    e.preventDefault();
    enterCreateMode();
    clearForm();
  });
}

// Delegated clicks on aside playlist cards

if (asidePlaylistList) {
  asidePlaylistList.addEventListener("click", (e) => {

    // Edit
    if (e.target.classList.contains("edit-playlist-btn")) {
      editPlaylist(e);
    }

    // Delete
    if (e.target.classList.contains("delete-playlist-btn")) {
      e.preventDefault();
      const card = e.target.closest(".card");
      if (card?.dataset.id) deletePlaylist(card.dataset.id);
    }

    // Play (stub — wire up your audio player here)
    if (e.target.classList.contains("play-playlist-btn")) {
      e.preventDefault();
      const card = e.target.closest(".card");
      const playlist = userPlaylists.find(p => p.id === card?.dataset.id);
      if (playlist) console.log("Playing playlist:", playlist.title, playlist.tracks);
    }

  });
}


// ─── INIT ────────────────────────────────────────────────────

displayAsidePlaylists();