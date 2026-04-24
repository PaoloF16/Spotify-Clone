// ─── CONSTANTS ───────────────────────────────────────────────

const DEFAULT_PLAYLIST_IMAGE = "https://images.pexels.com/photos/20385069/pexels-photo-20385069.jpeg";

const DEFAULT_FAVORITE_IMAGE = "https://images.pexels.com/photos/31839858/pexels-photo-31839858.jpeg"

const DEFAULT_ASIDE_CONTENT = `
  <div class="bg-secondary bg-opacity-10 rounded-3 p-3 mb-3 mt-2 hide-on-closed">
    <p class="fw-bold text-white mb-1">Crea la tua prima playlist</p>
    <p class="text-light small mb-3 opacity-75">È facile, ti aiuteremo</p>
    <button class="btn btn-light rounded-pill fw-bold btn-sm px-3">
      <a href="#" class="text-decoration-none text-black">Crea playlist</a>
    </button>
  </div>`;

const USER_ID = "User12345"


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
  
  addTrack(track) {

    if (!track || !track.id) {
      console.warn("addTrack: invalid track object", track);
      return;
    }
    // Duplicate tracks (same id) are silently ignored
    if (this.tracks.some(t => t.trackId === track.id)) {
      console.log(`Track "${track.title}" is already in "${this.title}".`);
      return;
    }
    this.tracks.push({
      trackId:  track.id,
      title:    track.title     || "Unknown Title",
      artist:   track.artist    || "Unknown Artist",
      cover:    track.cover     || DEFAULT_PLAYLIST_IMAGE,
      rank:     track.rank      || null,
      src:      track.src       || null,
      duration: track.duration  || 0,
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
  formattedDuration() {
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



// ─── STATE ───────────────────────────────────────────────────

let userPlaylists = [];
let userLikedSongs = [];

// Load playlists and liked songs from localStorage if there are any

try {
  userPlaylists = JSON.parse(localStorage.getItem(`user${USER_ID}Playlists`)) || [];
} catch {
  userPlaylists = [];
}

try {
  userLikedSongs = JSON.parse(localStorage.getItem(`user${USER_ID}LikedSongs`)) || []
} catch {
  userLikedSongs = [];
}

// set Id of the playlist that is being edited (null = create mode)
let editingId = null;




// ─── PERSISTENCE HELPERS ─────────────────────────────────────

const savePlaylists = () =>
  localStorage.setItem(`user${USER_ID}Playlists`, JSON.stringify(userPlaylists));

const saveLikedSongs = () =>
  localStorage.setItem(`user${USER_ID}LikedSongs`, JSON.stringify(userLikedSongs));


// ─── DOM REFERENCES ──────────────────────────────────────────

const asidePlaylistList         = document.getElementById("playlists");
const goToCreatePlaylistPage    = document.getElementById("goCreateNewPlaylist");
const createPlaylistForm        = document.getElementById("createPlaylistForm");
const clearFormButton           = document.getElementById("clearInputs");
const discardBtn                = document.getElementById("discardChangesButton");
const deletePlaylistBtn         = document.getElementById("deletePlaylistButton");
const formHeading               = document.querySelector("h1");
const submitBtn                 = createPlaylistForm ? createPlaylistForm.querySelector("button[type=submit]") : null;

const favoriteIcon              = document.getElementById("favorite-icon");


// ─── SIDEBAR TOGGLE ON CLICK ──────────────────────────────────────────

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
  if (createPlaylistForm) createPlaylistForm.reset();
};

// Switch UI into CREATE mode.
const enterCreateMode = () => {
  editingId = null;
  if (formHeading)       formHeading.innerText            = "Create your playlist";
  if (submitBtn)         submitBtn.innerText              = "Create Playlist";
  if (clearFormButton)   clearFormButton.style.display    = "inline-block";
  if (discardBtn)        discardBtn.style.display         = "none";
  if (deletePlaylistBtn) deletePlaylistBtn.style.display  = "none";
};

// Switch UI into EDIT mode.
const enterEditMode = () => {
  if (formHeading)       formHeading.innerText            = "Edit your playlist";
  if (submitBtn)         submitBtn.innerText              = "Save Changes";
  if (clearFormButton)   clearFormButton.style.display    = "none";
  if (discardBtn)        discardBtn.style.display         = "inline-block";
  if (deletePlaylistBtn) deletePlaylistBtn.style.display  = "inline-block";
};

// Basic validation — returns an error string or null if valid.
const validateForm = (title) => {
  if (!title || title.trim() === "") return "Playlist title is required.";
  if (title.trim().length > 100)     return "Title must be 100 characters or fewer.";
  return null;
};



// ─── LIKED SONGS ──────────────────────────────────

userLikedSongs.id                   = `ls-${USER_ID}`;
userLikedSongs.title                = "Liked Songs";
userLikedSongs.creator              = "Default";
userLikedSongs.description          = null;
userLikedSongs.img                  = DEFAULT_FAVORITE_IMAGE
userLikedSongs.isPublic             = true;
userLikedSongs.createdAt            = "Default"
userLikedSongs.tracks               = [];
userLikedSongs.followerCount        = null;
userLikedSongs.totalDurationSeconds = 0;



if (favoriteIcon) favoriteIcon.addEventListener("click", () => {
    
    if (!favoriteIcon.dataset.trackId) return

    const track = {
            id       : favoriteIcon.dataset.trackId,
            title    : favoriteIcon.dataset.trackTitle,
            artist   : favoriteIcon.dataset.trackArtist,
            cover    : favoriteIcon.dataset.trackCover,
            rank     : favoriteIcon.dataset.trackRank,
            src      : favoriteIcon.dataset.trackSrc,
            duration : favoriteIcon.dataset.trackDuration
        }


    const isCurrentlyLiked = favoriteIcon.classList.contains("bi-heart-fill");

    if (isCurrentlyLiked) {

        const unlikeAtIndex = userLikedSongs.findIndex((song) => song.id === track.id)

        userLikedSongs.splice(unlikeAtIndex, 1)
        saveLikedSongs()

    } else {

        userLikedSongs.push(track)
        saveLikedSongs()

    }
})

     


// ─── CREATE / EDIT PLAYLIST ──────────────────────────────────

const createPlaylist = (e) => {

  e.preventDefault();

  // Guard each form field individually — form may not exist on every page
  const titleEl       = document.getElementById("playlistTitle");
  const descriptionEl = document.getElementById("playlistDescription");
  const imageEl       = document.getElementById("playlistImage");
  const isPublicEl    = document.getElementById("playlistPublicCheck");

  if (!titleEl || !descriptionEl || !imageEl || !isPublicEl) return;

  const title       = titleEl.value;
  const description = descriptionEl.value;
  const image       = imageEl.value;
  const isPublic    = isPublicEl.checked;

  const validationError = validateForm(title);
  if (validationError) {
    alert(validationError);
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

    playlist.title       = title.trim();
    playlist.description = description.trim();
    playlist.img         = image.trim() || DEFAULT_PLAYLIST_IMAGE;
    playlist.isPublic    = isPublic;

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

  if (!id) return;

  const deletingIndex = userPlaylists.findIndex(pl => pl.id === id);
  if (deletingIndex === -1) return;

  const confirmed = window.confirm(
    `Delete "${userPlaylists[deletingIndex].title}"? This cannot be undone.`
  );

  if (!confirmed) return;

  userPlaylists.splice(deletingIndex, 1);

  savePlaylists();
  enterCreateMode();
  clearForm();
  displayAsidePlaylists();

  editingId = null;
};


// ─── EDIT PLAYLIST ───────────────────────────────────────────

const editPlaylist = (e) => {
  e.preventDefault();

  const card       = e.target.closest(".card");
  const playlistId = card?.dataset.id;
  if (!playlistId) return;

  const playlist = userPlaylists.find(p => p.id === playlistId);
  if (!playlist) return;

  // Guard each field — form may not exist on every page
  const titleEl       = document.getElementById("playlistTitle");
  const descriptionEl = document.getElementById("playlistDescription");
  const imageEl       = document.getElementById("playlistImage");
  const isPublicEl    = document.getElementById("playlistPublicCheck");

  if (titleEl)       titleEl.value        = playlist.title;
  if (descriptionEl) descriptionEl.value  = playlist.description;
  if (imageEl)       imageEl.value        = playlist.img;
  if (isPublicEl)    isPublicEl.checked   = playlist.isPublic;

  editingId = playlistId;
  enterEditMode();
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
    card.classList.add("card", "bg-secondary", "bg-opacity-10", "text-white", "p-1", "my-2", "d-flex", "flex-row");
    card.dataset.id = playlist.id;

    card.innerHTML = `
      <img
        src="${escapeHtml(playlist.img)}"
        class="rounded-start"
        style="width: 80px; min-width: 80px; object-fit: cover;"
        alt="Cover for ${escapeHtml(playlist.title)}"
        onerror="this.src='${DEFAULT_PLAYLIST_IMAGE}'"
      >
      <div class="card-body p-2 ms-2">
        <h6 class="card-title mb-1">
          <a
            class="text-decoration-none text-white"
            href="./album-page.html?id=${encodeURIComponent(playlist.id)}"
          >${escapeHtml(playlist.title)}</a>
        </h6>
        <div class="d-flex align-items-center justify-content-start mb-1 gap-2">
          <small class="text-secondary mb-1">${playlist.tracks.length} songs</small>
          <small class="text-secondary fw-bold mb-1">
            ${playlist.isPublic ? "Public" : "Private"}
          </small>
        </div>
        <div class="d-flex align-items-center justify-content-start gap-2 pt-2">
          <a href="#" class="play-playlist-btn btn btn-sm btn-success py-2 px-3">Play</a>
          <a href="#" class="edit-playlist-btn btn btn-sm btn-dark py-2 px-3">Edit</a>
        </div>
      </div>`;

    list.appendChild(card);
  });

  asidePlaylistList.appendChild(list);


    // Only run this on the home page
  if (window.location.pathname.endsWith("home-page.html") || window.location.pathname === "/") {
        if (goToCreatePlaylistPage) goToCreatePlaylistPage.style.display = "block";
  }
};


// ─── SECURITY HELPER ─────────────────────────────────────────

const escapeHtml = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
};



// ─── EVENT LISTENERS ─────────────────────────────────────────

if (createPlaylistForm) {
  createPlaylistForm.addEventListener("submit", createPlaylist);
}

if (clearFormButton) {
  clearFormButton.addEventListener("click", clearForm);
}

if (discardBtn) {
  discardBtn.addEventListener("click", (e) => {
    e.preventDefault();
    enterCreateMode();
    clearForm();
  });
}

if (deletePlaylistBtn) {
  deletePlaylistBtn.addEventListener("click", () => {
    deletePlaylist(editingId);
  });
}

if (asidePlaylistList) {
  asidePlaylistList.addEventListener("click", (e) => {

    if (e.target.classList.contains("edit-playlist-btn")) {
      e.preventDefault();
      const card = e.target.closest(".card");
      const playlistId = card?.dataset.id;
      if (!playlistId) return;

      // Save the id we want to edit, then navigate to the form page
      sessionStorage.setItem("editingPlaylistId", playlistId);
      window.location.href = "./create-playlist.html";
    }

    if (e.target.classList.contains("play-playlist-btn")) {
      e.preventDefault();
      const card = e.target.closest(".card");
      const playlist = userPlaylists.find(p => p.id === card?.dataset.id);
      if (playlist) console.log("Playing playlist:", playlist.title, playlist.tracks);
    }

  });
}


// ─── INIT ────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  displayAsidePlaylists();

  // Check if we arrived here from an "Edit" click on another page
  const pendingEditId = sessionStorage.getItem("editingPlaylistId");

  if (pendingEditId) {
    const playlist = userPlaylists.find(p => p.id === pendingEditId);

    if (playlist) {
      const titleEl       = document.getElementById("playlistTitle");
      const descriptionEl = document.getElementById("playlistDescription");
      const imageEl       = document.getElementById("playlistImage");
      const isPublicEl    = document.getElementById("playlistPublicCheck");

      if (titleEl)       titleEl.value        = playlist.title;
      if (descriptionEl) descriptionEl.value  = playlist.description;
      if (imageEl)       imageEl.value        = playlist.img;
      if (isPublicEl)    isPublicEl.checked   = playlist.isPublic;

      editingId = pendingEditId;
      enterEditMode();
    }

    // Clear it so refreshing the page doesn't re-trigger edit mode
    sessionStorage.removeItem("editingPlaylistId");
  }

});