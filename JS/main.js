// Selectors

const songTitle = document.querySelector(".song-details h2"),
  nameSong = document.querySelector(".song-details p"),
  theImage = document.querySelector(".image img"),
  theAudio = document.querySelector("audio"),
  nextBtn = document.querySelector(".next"),
  prevBtn = document.querySelector(".prev"),
  playBtn = document.querySelector(".play"),
  reapetBtn = document.querySelector("#repeat"),
  progressBar = document.querySelector(".progress-bar"),
  currentTimer = document.querySelector(".currentTimer"),
  EndOfTime = document.querySelector(".EndOfTime"),
  progressArea = document.querySelector(".progress-area");



// Set Option
let musicIndx = 0,
  isPlaying = false;

// GetData
function getData(theIndx) {
  songTitle.innerHTML = allMusic[theIndx].name;
  nameSong.innerHTML = allMusic[theIndx].artist;
  theImage.src = allMusic[theIndx].image;
  theAudio.src = allMusic[theIndx].audioSrc;
}

getData(musicIndx);

// PlayFunction's

function playMusic() {
  isPlaying = true;
  playBtn.querySelector("i").innerHTML = "pause";
  theAudio.play();
}
function pauseMusic() {
  isPlaying = false;
  playBtn.querySelector("i").innerHTML = "play_arrow";
  theAudio.pause();
}
playBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});

// Next Music

function nextMusic() {
  musicIndx++;
  musicIndx > allMusic.length - 1 ? (musicIndx = 0) : (musicIndx = musicIndx);
  getData(musicIndx);
  playMusic();
}
function prevMusic() {
  musicIndx--;
  musicIndx < 0 ? (musicIndx = allMusic.length - 1) : (musicIndx = musicIndx);
  getData(musicIndx);
  playMusic();
}

nextBtn.addEventListener("click", () => {
  nextMusic();
});
prevBtn.addEventListener("click", () => {
  prevMusic();
});

reapetBtn.addEventListener("click", () => {
  // GetInnerHTML
  let getText = reapetBtn.innerHTML.trim();
  switch (getText) {
    case "repeat":
      reapetBtn.innerHTML = "repeat_one";
      reapetBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      reapetBtn.innerHTML = "shuffle";
      reapetBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      reapetBtn.innerHTML = "repeat";
      reapetBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Function TheAudio At Ended

theAudio.addEventListener("ended", () => {
  let getText = reapetBtn.innerHTML.trim();
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      theAudio.currentTime = 0;
      getData(musicIndx);
      playMusic();
      break;
    case "shuffle":
      let randomNumber = Math.floor(Math.random() * allMusic.length);
      do {
        randomNumber = Math.floor(Math.random() * allMusic.length);
      } while (musicIndx == randomNumber);
      {
        musicIndx = randomNumber;
        getData(musicIndx);
        playMusic();
      }
      break;
  }
});


// UpDate

theAudio.addEventListener("timeupdate", (e) => {
  let currentTime = e.target.currentTime;
  let duration = e.target.duration;
  console.log(`This Is CurrentTime ${currentTime}`);
  console.log(`This Is Duration ${duration}`);
  let theWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${theWidth}%`;
  theAudio.addEventListener("loadeddata", (e) => {
    let theInterval = setInterval(() => {
      let currentTime = e.target.currentTime;
      currentTimer.innerHTML = formatTimer(currentTime);
    }, 1000)
    let durationTime = e.target.duration;
    EndOfTime.innerHTML = formatTimer(durationTime);
    theAudio.addEventListener("ended", () => {
      clearInterval(theInterval);
    })
  })
});

// ProgressArea
progressArea.addEventListener("click", (e) => {
  let clientWidth = progressArea.clientWidth;
  let offsetX = e.offsetX;
  let theDuration = theAudio.duration;
  theAudio.currentTime = (offsetX / clientWidth) * theDuration;
  playMusic();
});


// formatTimer

const formatTimer = (time) => {
  if (time && !isNaN(time)) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`
  } else {
    return `00 : 00`
  }
}