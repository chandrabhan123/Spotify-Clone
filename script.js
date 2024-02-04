console.log("Let's write some javascript")

const musicPlayer = document.querySelector(".music_player")
const playBtn = document.querySelector("#play")
const preBtn = document.querySelector("#pre")
const nextBtn = document.querySelector("#next")
const audio = document.querySelector("#audio")


// Speed Adjustments

const speedIndicator = document.querySelector('.speed')
const speedNumber = document.querySelector('.speed p')
const speedOptions = [1.0, 1.5, 1.75, 2.0]
let speedIndex = 0;

// Progress Bar 

const progressContainer = document.querySelector('.music_player_progress');

const progress = document.querySelector('.progress')

// music title

const audioTitle = document.querySelector(".music_title")
const musicImg = document.querySelector(".music_img")

// songs
let songs;
let songIndex = 0;


// Update UI with the current song
function loadSong(song) {
    audioTitle.innerText = song.title;
    audio.src = `${song.audio}`
    musicImg.style.backgroundImage = `url('${song.cover}')`;
}


// Check if the song is playing

function isAudioPlaying(){
return (musicPlayer.classList.contains('playing'))
}

// play audio of current song
function playAudio(){
    musicPlayer.classList.add('playing')
    playBtn.querySelector('i').classList.remove('fa-circle-play')
    playBtn.querySelector('i').classList.add('fa-circle-pause')
    audio.playbackRate = `${speedOptions[speedIndex]}`
    audio.play();
}

// pause audio of current song
function pauseAudio(){
    musicPlayer.classList.remove('playing')
    playBtn.querySelector('i').classList.add('fa-circle-play')
    playBtn.querySelector('i').classList.remove('fa-circle-pause')
    audio.pause();
}

// load a song from server

async function retrieveSongsFromServer() {
    await fetch('audio.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json();
        })

        .then((data) => {
            songs = data.songs;
            console.log(songs[songIndex]);
            loadSong(songs[songIndex]);
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);

        })
}
retrieveSongsFromServer()

// previous song
function preSong(){
    songIndex -= 1;
    if(songIndex < 0){
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() :pauseAudio(); 
}

// next song

function nextSong(){
    songIndex += 1;
    if(songIndex > songs.length - 1){
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() :pauseAudio(); 
}


// update progress bar width

function updateProgressBar(e){
const { duration, currentTime} = e.srcElement;
const progressPercentage = (currentTime / duration) * 100;
progress.style.width = `${progressPercentage}%`
}

// move audio to where you click on playing audio track

function updateProgressBarPlayPosition(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = audio;
    audio.currentTime = (clickX / width) * duration;
}


// update speed indicator

function updateSpeedIndicator(){
    speedIndex += 1;
    if(speedIndex > speedIndex.length -1){
        speedIndex = 0;
    }
    speedNumber.textContent = `${speedOptions[speedIndex]}x`;
    playAudio();
}

// Event listeners

// Play, prev, next btns
playBtn.addEventListener('click',() =>{
isAudioPlaying() ? pauseAudio() : playAudio();
});

preBtn.addEventListener('click', preSong)
nextBtn.addEventListener('click', nextSong)


// update speed indicator

speedIndicator.addEventListener('click',updateSpeedIndicator)


// Progress bar updates

audio.addEventListener('timeupdate', updateProgressBar);

progressContainer.addEventListener('click',updateProgressBarPlayPosition);

// move to next song when song finishes

