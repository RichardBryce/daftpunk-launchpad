const MAIN = document.querySelector("main");
const soundboard = MAIN.querySelector(".soundboard");
const background = MAIN.querySelector(".background");
const title = MAIN.querySelector(".title");
const cover = MAIN.querySelector(".cover");
const functionToggle = MAIN.querySelector('.function .toggle');
const functionStop = MAIN.querySelector('.function .stop');
const functionSection = MAIN.querySelectorAll('.section-button');
const intro = MAIN.querySelector('.intro');

let colorSet = {
    index: 0,
    loop: true,
    color: ["red", "pink", "blue", "ice", "green", "yellow", "orange"],
};
let soundSet = {
    directory: "",
    cover: "",
    title: "", 
    button: [],
    volum: -5
};
let iconSet = {
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><polygon points="19.2 32.4 32.4 24 19.2 15.6 19.2 32.4"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><rect x="18" y="16.8" width="3.6" height="14.4"/><rect x="26.4" y="16.8" width="3.6" height="14.4"/></svg>',
    stop: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.2,19.2,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.62,15.62,0,0,1,24,39.6Z"/><rect x="16.8" y="16.8" width="14.4" height="14.4"/></svg>'
};

// Initialize Soundboard
function initialize(){
    HBFS();

    intro.remove();

    Tone.Master.volume.value = soundSet.volum;
    
    functionToggle.innerHTML = iconSet.play;
    functionToggle.classList.add('paused');
    functionStop.innerHTML = iconSet.stop;

    window.removeEventListener('keydown', initialize);
}

function HBFS(){
    var sounds = ["Instrumental", "Work-it",  "Make-it",  "Do-it",  "Makes-us",  "Harder",  "Better",  "Faster",  "Stronger",  "More-than",  "Hour",  "Our",  "Never",  "Ever",  "After",  "Work-is",  "Over", "Work-it-2", "Make-it-2", "Do-it-2", "Makes-us-2", "Harder-2", "Better-2", "Faster-2", "Stronger-2", "More-than-2", "Hour-2", "Our-2", "Never-2", "Ever-2", "After-2", "Work-is-2", "Over-2", "More-than-3", "Hour-3", "Our-3", "Never-3", "Ever-3", "After-3", "Work-is-3", "Over-3"];
    var bucket = {};

    for(var i = 1; i < sounds.length; i++){
        var jam = document.createElement("div");

        if(colorSet.loop === true && i === (colorSet.color.length * 2)){
            colorSet.index = 0;
            colorSet.loop = false;
        }

        jam.classList.add("jam");
        jam.setAttribute("data-jam", sounds[i]);
        jam.setAttribute("data-jam-color", colorSet.color[Math.floor(colorSet.index / 2)]);
        jam.setAttribute("role", "button");
        jam.setAttribute("tabindex", "0");
        jam.innerHTML = sounds[i];
        
        soundboard.appendChild(jam);
        
        colorSet.index++;
    }

    soundSet.directory = "assets/HBFS/";
    soundSet.title = "Harder, Better, Faster, Stronger";
    soundSet.button = document.querySelectorAll("[data-jam]");
    soundSet.cover = "url('" + soundSet.directory + "cover.jpg')";
    title.innerHTML = soundSet.title;
    cover.style.backgroundImage = soundSet.cover;
    background.style.backgroundImage = soundSet.cover;

    for(var i = 0; i < sounds.length; i++){
        bucket["" + sounds[i].replaceAll("-", "_").toLowerCase() + ""] = soundSet.directory + sounds[i].toLowerCase() + ".mp3";
    }

    multiPlayer = new Tone.Players(bucket).toDestination();

    instPlayer = new Tone.Buffer("" + soundSet.directory + "instrumental.mp3", function () {
        //the buffer is now available.
        var buff = instPlayer.get();
        console.log('inst loaded');
        functionToggle.removeAttribute("disabled");
        functionStop.removeAttribute("disabled");
    });

    soundSet.button.forEach(n => n.addEventListener("mousedown", function(){
        playJam(n);
    }));
}

// Play Soundboard Jamming
function playJam(e){
    let jam = e.getAttribute("data-jam").replaceAll("-", "_").toLowerCase();
    multiPlayer.player("" + jam + "").start();
}

// Play Instrumental
function playFunction(func, el){
    let f = [0, "played", "paused", "stopped"];

    switch(func){
        case "toggle":
            if (el.classList.contains("paused") || el.classList.contains("stopped")) {
                // toggle played
                f[0] = 1;
                multiPlayer.player("instrumental").start();
            } else {
                // toggle paused
                f[0] = 2;
            }
        break;

        case "stop":
            // stopped
            f[0] = 3;
            multiPlayer.player("instrumental").stop();
        break;

        default:
            console.log("empty button");
    }

    for(let i = 1; i < f.length; i++){
        functionToggle.classList.remove(f[i]);
        if(f[0] === i){
            functionToggle.classList.add(f[i]);
        }
        if(f[0] < 2){ 
            functionToggle.innerHTML = iconSet.pause;
        }else{
            functionToggle.innerHTML = iconSet.play;
        }
    }
}

// Press any key to continue
window.addEventListener('keydown', initialize);

// Click Function
functionToggle.addEventListener("click", function(){
    playFunction("toggle", this);
});
functionStop.addEventListener("click", function(){
    playFunction("stop", this);
});

// Click Section
functionSection.forEach(n => n.addEventListener("click", function(){
    functionSection.forEach(n => n.classList.remove("on"));
    n.classList.add("on");
}));

// Accessibility
soundSet.button.forEach(n => n.addEventListener('keydown', function (e) {
    const keyD = e.key !== undefined ? e.key : e.keyCode;

    if ((keyD === 'Enter' || keyD === 13) || (['Spacebar', ' '].indexOf(keyD) >= 0 || keyD === 32)) {
        e.preventDefault();
        playJam(n);
    }
}));