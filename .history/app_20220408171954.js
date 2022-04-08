const MAIN = document.querySelector("main");
const soundboard = MAIN.querySelector(".soundboard");
const background = MAIN.querySelector(".background");
const title = MAIN.querySelector(".title");
const cover = MAIN.querySelector(".cover");
const functionToggle = MAIN.querySelector('.function .toggle');
const functionStop = MAIN.querySelector('.function .stop');
const functionSection = MAIN.querySelectorAll('.section-button');
const intro = MAIN.querySelector('.intro');

let init = false;
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
    volum: -10
};
let iconSet = {
    baseElement: '',
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><polygon points="19.2 32.4 32.4 24 19.2 15.6 19.2 32.4"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><rect x="18" y="16.8" width="3.6" height="14.4"/><rect x="26.4" y="16.8" width="3.6" height="14.4"/></svg>',
    stop: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.2,19.2,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.62,15.62,0,0,1,24,39.6Z"/><rect x="16.8" y="16.8" width="14.4" height="14.4"/><rect class="cls-1" width="48" height="48"/></svg>'
};

// Initialize Soundboard
function initialize(){
    if(!init){
        HBFS();
    
        intro.remove();
    
        Tone.Master.volume.value = soundSet.volum;
        
        functionToggle.innerHTML = iconSet.play;
        functionToggle.classList.add('paused');
        functionStop.innerHTML = iconSet.stop;

        init = true;
    }else{
        return;
    }
}

function HBFS(){
    var sounds = [
        "Work-it", 
        "Make-it", 
        "Do-it", 
        "Makes-us", 
        "Harder", 
        "Better", 
        "Faster", 
        "Stronger", 
        "More-than", 
        "Hour", 
        "Our", 
        "Never", 
        "Ever", 
        "After", 
        "Work-is", 
        "Over"
    ];

    for(var i = 0; i < sounds.length; i++){
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

    multiPlayer = new Tone.Players({
        instrumental: soundSet.directory + "instrumental.mp3",
        work_it: soundSet.directory + "work-it.mp3",
        make_it: soundSet.directory + "make-it.mp3",
        do_it: soundSet.directory + "do-it.mp3",
        makes_us: soundSet.directory + "makes-us.mp3",
        harder: soundSet.directory + "harder.mp3",
        better: soundSet.directory + "better.mp3",
        faster: soundSet.directory + "faster.mp3",
        stronger: soundSet.directory + "stronger.mp3",
        more_than: soundSet.directory + "more-than.mp3",
        hour: soundSet.directory + "hour.mp3",
        our: soundSet.directory + "our.mp3",
        never: soundSet.directory + "never.mp3",
        ever: soundSet.directory + "ever.mp3",
        after: soundSet.directory + "after.mp3",
        work_is: soundSet.directory + "work-is.mp3",
        over: soundSet.directory + "over.mp3",
    }).toDestination();

    instPlayer = new Tone.Buffer("" + soundSet.directory + "instrumental.mp3", function () {
        //the buffer is now available.
        var buff = instPlayer.get();
        console.log('inst loaded');
        functionToggle.removeAttribute("disabled");
        functionStop.removeAttribute("disabled");
    });

    soundSet.button.forEach(n => n.addEventListener('mousedown', function(){
        playJam(n);
    }));
}

// Play Soundboard Jamming
function playJam(e){
    let jam = e.getAttribute('data-jam').replace('-', '_').toLowerCase();
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
window.addEventListener('keydown', function(){
    initialize();
});

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