console.log('Lets write javasript');

var currentsong = new Audio();

let currFolder;

let songs;



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {

    currFolder = folder

    let a = await fetch(`/${folder}/`)
    let response = await a.text();

    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUl = document.querySelector('.song-container').getElementsByTagName('ul')[0]

    songUl.innerHTML = ''



    for (const element of songs) {
        songUl.innerHTML = songUl.innerHTML + `
            <li>
              <img class="invert" src="/music.svg" alt="">
              <div class="info">
                <div class="ssong-name">${element.replaceAll("%20", " ")}</div>
                <div class="">Song Artist: Code-Smasher</div>
              </div>
              <span>Play Now</span>
              <img class="invert" src="/play.svg" alt=""></li>`
    }
    Array.from(document.querySelector(".song-container").getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)//

        })
    })




}

const playMusic = (track, pause = false) => {
    // var currentsong = new Audio();
    currentsong.src = `/${currFolder}/` + track

    if (!pause) {

        currentsong.play();
        playy.src = "pause.svg"
    }
    document.querySelector('.song-info').innerHTML = decodeURI(track)
    document.querySelector('.song-time').innerHTML = "00:00/00:00"




}

//album code below

async function displayAlbums() {

    let a = await fetch(`/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let b = await fetch(`/songs/${folder}/info.json`)
            let response = await b.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` 
            <div data-folder="${folder}" class="card">
            <div class="circular-image-play">

              
              <img class="circular-image-play" src="/cicularimageplay.svg" alt="">
            </div>

            
            <img src="/songs/${folder}/cover.jpeg "alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`
        }
    }

    //load songs from cards

    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener("click", async fol => {
            songs = await getSongs(`songs/${fol.currentTarget.dataset.folder}`)
            

        })
        e.addEventListener('click', () => {
            document.querySelector('.left').style.left = '0%'})
    })

    // Load the playlist whenever card is clicked
    // Array.from(document.getElementsByClassName("card")).forEach(e => { 
    //     e.addEventListener("click", async item => {
    //         console.log("Fetching Songs")
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
    //         playMusic(songs[0])

    //     })
    // })
}
//album code above

async function main() {



    await getSongs('songs')

    playMusic(songs[0], true)
    //display alll the card poster on the page

    displayAlbums()
}


//Attach event Listener to play-bar buttons
playy.addEventListener('click', () => {
    if (currentsong.paused) {
        currentsong.play()
        playy.src = "pause.svg"
    }
    else {
        currentsong.pause()
        playy.src = "play.svg"

    }
})

//Time Update listner
currentsong.addEventListener('timeupdate', () => {

    // let minsec=(currentsong.currentTime, currentsong.duration)
    // millisecondsToTime()
    console.log(currentsong.currentTime, currentsong.duration)
    // console.log(minsec); 

    document.querySelector('.song-time').innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector('.circle').style.left = (currentsong.currentTime) + "%";

})

//Add an event listner to seekbar
document.querySelector('.seekbar').addEventListener('click', e => {
    let seekbarwidth = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = seekbarwidth + "%"

    currentsong.currentTime = (currentsong.duration * seekbarwidth) / 100;


})

//add event listner

document.querySelector('.humberguger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0%'
})

document.querySelector('.cros-ham').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-100%'
})

previus.addEventListener('click', () => {
    let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])

    if ((index - 1) >= 0) {

        playMusic(songs[index - 1])
    }


})
forwartrack.addEventListener('click', () => {


    let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])

    if ((index + 1) < songs.length) {

        playMusic(songs[index + 1])
    }


})

// volume event listner

document.querySelector('.range-margin').addEventListener('change', (e) => {


    currentsong.volume = parseInt(e.target.value) / 100;

})

//mute button functionality
document.querySelector('.vol-imgage').addEventListener('click',e=>{
if(e.target.src.includes('volume.svg')){
    e.target.src=e.target.src.replace('volume.svg', 'volumemute.svg')
    currentsong.volume = 0;
    document.querySelector('.range-margin').value=0;
}
else{
    e.target.src=e.target.src.replace( 'volumemute.svg','volume.svg')
    currentsong.volume=.1
    document.querySelector('.range-margin').value=10;
}
})



main()
