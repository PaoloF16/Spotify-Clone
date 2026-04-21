
const likedSongs = []
const userPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || []


// DOM ELEMENTS

const asidePlaylistList = document.getElementById("playlists")

const createPlaylistForm = document.getElementById("createPlaylistForm")
const clearFormButton = document.getElementById("clearInputs")

// CLEAR FORM
const clearForm = function(e) {
    if (e) e.preventDefault()
    createPlaylistForm.reset()
}

// ASIDE EXPAND AND CONTRACT

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("main-sidebar");
    const toggleBtn = document.getElementById("toggle-sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("closed");
    });
});


// INITIALIZE PLAYLIST CLASS

const defaultPlaylistImage = "https://images.pexels.com/photos/20385069/pexels-photo-20385069.jpeg"

class Playlist {

    constructor(title = "", creator = "", description = "", image = defaultPlaylistImage) {
        this.id = `pl-${Math.floor(Math.random() * 100000)}`;
        this.title = title;
        this.creator = creator;
        this.description = description;
        this.img = image
        this.isPublic = true;
        this.createdAt = new Date().toISOString().split('T')[0];
        this.tracks = [];
        this.followerCount = 0;
        this.totalDurationSeconds = 0;
    }

    // Method to add a new song object to the array
    addTrack(id) {
        const newTrack = {
                // add track key:values
        };
        this.tracks.push(newTrack);
        console.log(`Added "${title}" to ${this.name}.`);
    }

    // Method to remove a track by its ID
    removeTrack(id) {
        this.tracks = this.tracks.filter(track => track.trackId !== id);
    }
}


class Artist {
    
}


// GET ARTIST FETCH FUNCTION 

/* 
const getArtist = function(artist) {

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/`)

    .then((response) => { 
        if (response.ok) {
            console.log(response)
            return response.json()
            } else {
                throw new Error(`Request failed: ${response.status}`)   
            }
        })

    .then((data) => {
        console.log(data)
    })

    .catch((error) => console.log(error))

    }


// GET ALBUM FETCH FUNCTION 

const getAlbum = function(album) {

    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/`)

    .then((response) => { 
        if (response.ok) {
            console.log(response)
            return response.json()
            } else {
                throw new Error(`Request failed: ${response.status}`)   
            }
        })

    .then((data) => {
        console.log(data)
    })

    .catch((error) => console.log(error))

    }
*/

// handle discard changes button
const discardBtn = document.getElementById("discardButton")

if (discardBtn) discardBtn.addEventListener("click", function(e) {
    e.preventDefault()
    editingId = null
    document.querySelector("h1").innerText = "Create your playlist"
    document.querySelector("button[type=submit]").innerText = "Create Playlist"
    discardBtn.style.display = "none"
    clearForm()
})


// CREATE PLAYLIST MAIN FUNCTION

const createPlaylist = function(e) {

    e.preventDefault()

    const playlistTitleInput = document.getElementById("playlistTitle").value
    const playlistDescriptionInput = document.getElementById("playlistDescription").value
    const playlistImageInput = document.getElementById("playlistImage").value
    const isPlaylistPublic = document.getElementById("playlistPublicCheck").checked

    if (editingId) {

        // find playlist with matching id
        const playlistToEdit = userPlaylists.find(pl => pl.id === editingId)
        if (!playlistToEdit) return

        // re-assign playlist attributes
        playlistToEdit.title = playlistTitleInput
        playlistToEdit.description = playlistDescriptionInput
        playlistToEdit.img = playlistImageInput || defaultPlaylistImage
        playlistToEdit.isPublic = isPlaylistPublic

        // reset editingId and UI after successful save
        editingId = null
        document.querySelector("h1").innerText = "Create your playlist"
        document.querySelector("button[type=submit]").innerText = "Create Playlist"
        discardBtn.style.display = "none"

    } else {

        // if editingId is null, create new playlist
        const newPlaylist = new Playlist(playlistTitleInput, "User", playlistDescriptionInput, playlistImageInput)
        newPlaylist.isPublic = isPlaylistPublic
        userPlaylists.push(newPlaylist)

    }

    // clear form after submitting
    clearForm()

    // push updated playlists to local storage
    localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists))

    // display updates in the aside section
    displayAsidePlaylists()

}

const deletePlaylist = function(id) {

}


// DISPLAY PLAYLIST CARDS FUNCTION

// stores default content in case there are no user  playlist currently saved
let defaultContent = `
    <div class="bg-secondary bg-opacity-10 rounded-3 p-3 mb-3 mt-2 hide-on-closed">
        <p class="fw-bold text-white mb-1">
            Crea la tua prima playlist
        </p>
        <p class="text-light small mb-3 opacity-75">
            È facile, ti aiuteremo
        </p>
        <button class="btn btn-light rounded-pill fw-bold btn-sm px-3">
            <a href="#" class="text-decoration-none text-black">
                Crea playlist
            </a>
        </button>
    </div>`

const displayAsidePlaylists = function() {

    if (userPlaylists.length !== 0) {

        asidePlaylistList.innerHTML = ""

        const list = document.createElement("div")
        list.classList.add("hide-on-closed")

        userPlaylists.forEach((playlist) => {
            // create card
            const card = document.createElement("div")
            card.classList.add("card", "bg-secondary", "bg-opacity-10", "text-white", "p-1", "my-4", "d-flex", "flex-row")

            // store playlist id in card
            card.dataset.id = playlist.id

            // card innerHTML
            card.innerHTML = `
                <img src="${playlist.img}" class="rounded-start" style="width: 80px; object-fit: cover;" alt="...">
                <div class="card-body">
                    <h5 class="card-title mb-3">
                        <a class="text-decoration-none text-white" href="./album-page.html">${playlist.title}</a>
                    </h5>
                    <p class="card-text text-secondary mb-3">${playlist.description}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="card-text mb-1">${playlist.tracks.length} songs</p>
                        <a href="#" class="edit-playlist-btn btn btn-sm btn-dark px-3">Edit</a>
                        <a href="#" class="play-playlist-btn btn btn-sm btn-success px-3">Play</a>
                    </div>
                </div>`

            // append card to list  
            list.appendChild(card)

        })

        // append list to div
        asidePlaylistList.appendChild(list)

    } else {
        // show default content if there are no playlists
        asidePlaylistList.innerHTML = defaultContent

    }
}


// EDIT PLAYLIST FUNCTION -> FETCHES PLAYLIST DETAILS, POPULATES THE FORM, STORES EDITING ID, 
// THEN REDIRECTS TO "CREATEPLAYLIST" IN EDITING MODE

let editingId = null

const editPlaylist = function(e) {

    e.preventDefault()

    let card = e.target.closest(".card")
    const playlistId = card.dataset.id

    // find playlist with matching id
    const playlistToEdit = userPlaylists.find((p) => p.id === playlistId)

    if (!playlistToEdit) return

    // re-populate the form with playlist details
    document.getElementById("playlistTitle").value = playlistToEdit.title
    document.getElementById("playlistDescription").value = playlistToEdit.description
    document.getElementById("playlistImage").value = playlistToEdit.img
    document.getElementById("playlistPublicCheck").checked = playlistToEdit.isPublic

    // remember which playlist we're editing
    editingId = playlistId  

}


// PUSH LIKED SONGS TO LOCAL STORAGE
localStorage.setItem("userLikedSongs", likedSongs)


//ADD EVENT LISTENERS

createPlaylistForm.addEventListener("submit", createPlaylist) // create playlist

clearFormButton.addEventListener("click", clearForm) // clear form 

asidePlaylistList.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-playlist-btn")) {
        editPlaylist(e)
    }
})

//getAlbum()
//getArtist()

displayAsidePlaylists()