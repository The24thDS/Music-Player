const love = document.getElementById("love-it")
const bar = document.getElementById("song-time")
const playButton = document.getElementById("play")
const audio = document.getElementById("playing-song")
const title = document.getElementById("name")
const artist = document.getElementById("playing-song-artist")
const cover = document.getElementById("playing-song-cover")
const currentTime = document.getElementById("current-time")
const totalTime = document.getElementById("total-time")
const nextButton = document.getElementById("next")
const backButton = document.getElementById("back")
let songs = [
    "BLACKPINK-BOOMBAYAH.mp3",
    "BLACKPINK-WHISTLE.mp3",
    "Zombie High.mp3",
]
let songMinutes, songSeconds, update, width = 0, step = 1, currentSecond = 0, currentMinute = 0, currentSong = getRndInteger(0, songs.length + 1)
audio.src = "songs/" + songs[currentSong]
love.addEventListener("click", toggleLove)
playButton.addEventListener("click", function () {
    playSong()
    toggleButtonState()
})
nextButton.addEventListener("click", function () {
    changeSong("next", audio.paused ? false : true)
})
backButton.addEventListener("click", function () {
    changeSong("back", audio.paused ? false : true)
})
function toggleLove() {
    this.style.color = this.style.color === "red" ? "transparent" : "red"
}
function toggleButtonState() {
    let newClass = playButton.getAttribute("class") === "fa fa-play" ? "fa fa-pause" : "fa fa-play"
    playButton.setAttribute("class", newClass)
}
function playSong() {
    if (audio.paused) {
        updateInformations()
        window.setTimeout(function () {
            audio.play()
        }, 500)
        updateBar()
    }
    else {
        audio.pause()
        clearInterval(update)
    }
}
function changeSong(direction, songWasPlaying) {
    audio.pause()
    if (direction === "next")
        currentSong = currentSong === songs.length - 1 ? 0 : currentSong + 1
    else if (direction === "back")
        currentSong = currentSong === 0 ? songs.length - 1 : currentSong - 1
    audio.src = "songs/" + songs[currentSong]
    width = currentMinute = currentSecond = 0
    clearInterval(update)
    bar.style.width = width + "%"
    currentTime.innerText = "00:00"
    if (songWasPlaying) {
        playSong()
        // toggleButtonState()
    }
    else updateInformations()
}
function updateBar() {
    update = setInterval(updateProgress, 1000)
    function updateProgress() {
        if (!width)
            step = 1 / (Math.floor(audio.duration) / 100)
        if (width >= 100) {
            clearInterval(update)
            width = 0;
            bar.style.width = width + "%"
            toggleButtonState()
            changeSong("next", true)
        }
        else {
            if (currentSecond >= 59) {
                currentMinute++
                currentSecond = 0
            } else currentSecond++
            currentTime.innerText = (currentMinute < 10 ? "0" + currentMinute : currentMinute) + ":" + (currentSecond < 10 ? "0" + currentSecond : currentSecond)
            width += step
            bar.style.width = width + "%"
        }
    }
}
function updateInformations() {
    jsmediatags.read(audio.src, {
        onSuccess: function (tag) {
            let tags = tag.tags
            artist.innerText = tags.artist
            let base64String = ""
            for (let i = 0; i < tags.picture.data.length; i++)
                base64String += String.fromCharCode(tags.picture.data[i])
            let base64 = "data:" + tags.picture.format + ";base64," + window.btoa(base64String)
            cover.setAttribute("src", base64)
            title.innerText = tags.title
            window.setTimeout(function () {
                for (songMinutes = 0, songSeconds = audio.duration; songSeconds > 59; songSeconds -= 60, songMinutes++);
                songSeconds = Math.floor(songSeconds)
                totalTime.innerText = (songMinutes < 10 ? "0" + songMinutes : songMinutes) + ":" + (songSeconds < 10 ? "0" + songSeconds : songSeconds)
            }, 500)
        }
    })
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}