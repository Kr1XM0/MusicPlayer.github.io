//* DOM 
let song = document.querySelector('#song')
let progress = document.querySelector('#song-progress')
let btnStart = document.querySelector('#btnStart')
let btnNext = document.querySelector('#btnNext')
let btnBack = document.querySelector('#btnBack')

//* MUSIC
const MUSIC = {
    0: ['music/forest-lullaby-110624.mp3','music/cover-1.png','Forest Lullaby'],
    1: ['music/lost-in-city-lights-145038.mp3','music/cover-2.png','Lost in city lights']
}

//* BOTTONS NEXT & BACK
let actuallySong = 0 
btnNext.addEventListener('click',nextSong)
function nextSong(){
    actuallySong++
    progress.value = 0
    if(actuallySong > 1){actuallySong = 1}
    song.src = MUSIC[actuallySong][0]
    song.addEventListener('loadedmetadata', () => {
        document.querySelector('.song-img').src = MUSIC[actuallySong][1]
        document.querySelector('.song-title').innerText = MUSIC[actuallySong][2]
        countRight()
        play()
    });
}
btnBack.addEventListener('click',function(){
    actuallySong--
    progress.value = 0
    if(actuallySong < 0){actuallySong = 0}
    song.src = MUSIC[actuallySong][0]
    song.addEventListener('loadedmetadata', () => {
        document.querySelector('.song-img').src = MUSIC[actuallySong][1]
        document.querySelector('.song-title').innerText = MUSIC[actuallySong][2]
        countRight()
        play()
    });
})

//* BOTTON PLAY
let advance
btnStart.addEventListener('click', play)

function play(){
    if(song.paused){
        song.play()
        progress.max = song.duration
        advance = setInterval(() => {
            if(progress.value < progress.max){
                progress.value = song.currentTime
            } else {
                clearInterval(advance)
            }
        }, 1000)
    } else {
        clearInterval(advance)
        song.pause()
    }
}

//* ENDEN 
song.addEventListener('ended', nextSong)


//* CONTADORES
function countRight(){
    let minutes = String(Math.floor(song.duration / 60)) 
    let seconds = String(Math.floor(song.duration % 60))
    document.querySelector('.contadorRight').innerText = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2, '0')}`;
}
let countMax
function countLeft(){
    let minutes = Math.floor(song.currentTime / 60);
    let seconds = Math.floor(song.currentTime % 60);
    document.querySelector('.contadorLeft').innerText = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2, '0')}`;
}
song.addEventListener('timeupdate', countLeft);
song.addEventListener('loadedmetadata', () => {
    countLeft(); 
});

//* PROGRESS
progress.addEventListener('mousedown',startMoving)
document.addEventListener('mousemove', moveBar);
document.addEventListener('mouseup', stopMoving);

let isDown = false;

function startMoving(e) {
    isDown = true;
    updateValue(e.clientX);
}
function moveBar(e) {
    if (!isDown) return;
    updateValue(e.clientX);
}

function stopMoving() {
    isDown = false;
}

function updateValue(clientX) {
    const rect = progress.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(x / rect.width * 100, 100));
    progress.value = song.duration * (percentage / 100);
    song.currentTime = song.duration * (percentage / 100);
}