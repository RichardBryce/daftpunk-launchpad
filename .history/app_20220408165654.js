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
    play: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="48px" viewBox="0 0 20 20" width="48px" fill="currentColor"><g><rect fill="none" height="20" width="20"/></g><g><path d="M10,2c-4.42,0-8,3.58-8,8s3.58,8,8,8s8-3.58,8-8S14.42,2,10,2z M10,16.5c-3.58,0-6.5-2.92-6.5-6.5S6.42,3.5,10,3.5 s6.5,2.92,6.5,6.5S13.58,16.5,10,16.5z"/><polygon points="8,13.5 13.5,10 8,6.5"/></g></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="48px" viewBox="0 0 20 20" width="48px" fill="currentColor"><g><rect fill="none" height="20" width="20"/></g><g><path d="M10,2c-4.42,0-8,3.58-8,8s3.58,8,8,8s8-3.58,8-8S14.42,2,10,2z M10,16.5c-3.58,0-6.5-2.92-6.5-6.5S6.42,3.5,10,3.5 s6.5,2.92,6.5,6.5S13.58,16.5,10,16.5z"/><rect height="6" width="1.5" x="7.5" y="7"/><rect height="6" width="1.5" x="11" y="7"/></g></svg>',
    stop: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48" width="48px" height="48px" viewBox="0 0 48 48" fill="currentColor"><g><path d="M24,4.8C13.4,4.8,4.8,13.4,4.8,24S13.4,43.2,24,43.2S43.2,34.6,43.2,24S34.6,4.8,24,4.8z M24,39.6c-8.6,0-15.6-7-15.6-15.6S15.4,8.4,24,8.4s15.6,7,15.6,15.6S32.6,39.6,24,39.6z" /><rect x="16.8" y="16.8" width="14.4" height="14.4" /></g></svg>'
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

    for(let i = 1; i < 3; i++){
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