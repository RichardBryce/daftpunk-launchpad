const MAIN = document.querySelector("main");
const soundboard = MAIN.querySelector(".soundboard");
const background = MAIN.querySelector(".background");
const title = MAIN.querySelector(".title");
const cover = MAIN.querySelector(".cover");
const functionButtons = MAIN.querySelectorAll("[data-function]");
const intro = MAIN.querySelector(".intro");

let colorSet = {
    index: 0,
    loop: true,
    color: ["red", "pink", "blue", "ice", "green", "yellow", "orange"]
};
let soundSet = {
    title: "",
    cover: "",
    directory: "",
    audio: [],
    buttons: [],
    currentSection: 1,
    volum: -10
};
let iconSet = {
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><polygon points="19.2 32.4 32.4 24 19.2 15.6 19.2 32.4"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.19,19.19,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.63,15.63,0,0,1,24,39.6Z"/><rect x="18" y="16.8" width="3.6" height="14.4"/><rect x="26.4" y="16.8" width="3.6" height="14.4"/></svg>',
    stop: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M24,4.8A19.2,19.2,0,1,0,43.2,24,19.2,19.2,0,0,0,24,4.8Zm0,34.8A15.6,15.6,0,1,1,39.6,24,15.62,15.62,0,0,1,24,39.6Z"/><rect x="16.8" y="16.8" width="14.4" height="14.4"/></svg>'
};

// Press any key to continue
window.addEventListener("keydown", initialize);

// Initialize Soundboard
function initialize(e) {
    // Tone Preset
    Tone.Master.volume.value = soundSet.volum;
    Tone.context.lookAhead = 0;

    // Function buttons
    functionButtons.forEach(n => n.addEventListener("click", playFunction));

    // Press letter, number, enter and space key to continue
    if(e.which >= 48 && e.which <= 57 || e.which >= 65 && e.which <= 90 || e.which === 13 || e.which === 32) {
        // Playing musical instruments
        HBFS();
    
        // Quit intro display
        intro.remove();
        
        functionButtons[0].classList.add("paused");
        functionButtons[0].innerHTML = iconSet.play;
        functionButtons[1].innerHTML = iconSet.stop;
    
    
        // Press key to launchpad
        window.addEventListener("keydown", pressKey);
    
        // Finish initialize
        window.removeEventListener("keydown", initialize);
    }
}

// Harder, Better, Faster, Stronger
function HBFS(){
    var bucket = {};

    soundSet.audio = ["Instrumental", "Work-it", "Make-it", "Do-it", "Makes-us", "Harder", "Better", "Faster", "Stronger", "More-than", "Hour", "Our", "Never", "Ever", "After", "Work-is", "Over", "Work-it-2", "Make-it-2", "Do-it-2", "Makes-us-2", "Harder-2", "Better-2", "Faster-2", "Stronger-2", "More-than-2", "Hour-2", "Our-2", "Never-2", "Ever-2", "After-2", "Work-is-2", "Over-2", "More-than-3", "Hour-3", "Our-3", "Never-3", "Ever-3", "After-3", "Work-is-3", "Over-3"];
    soundSet.directory = "assets/HBFS/";
    soundSet.title = "Harder, Better, Faster, Stronger";
    soundSet.cover = "url('" + soundSet.directory + "cover.jpg')";

    title.innerHTML = soundSet.title;
    cover.style.backgroundImage = soundSet.cover;
    background.style.backgroundImage = soundSet.cover;

    // Gathering all sounds into bucket
    for(var i = 0; i < soundSet.audio.length; i++){
        bucket["" + convertName(soundSet.audio[i], 1, 1) + ""] = soundSet.directory + convertName(soundSet.audio[i], 0, 1) + ".mp3";
    }

    // Initialize Board Sections
    initSection(3);

    // Create Launchpad Buttons
    makeLaunchpad(1, 16);

    // Player Stanby
    initPlayer(bucket);
}

// Converting Name: hypen to underline or to lowercase or both
function convertName(name, underline, lowercase){
    if(underline === 1){
        name = name.replaceAll("-", "_");
    }
    if(lowercase === 1){
        name = name.toLowerCase();
    }
    return name;
}

// initialize Player
function initPlayer(bucket){
    multiPlayer = new Tone.Players(bucket).toDestination();
    instPlayer = new Tone.Buffer(bucket["instrumental"], function(){
        // instrumental is now available.
        console.log("instrumental loaded");

        multiPlayer.player("instrumental").sync().start(0);

        functionButtons.forEach(n => {
            n.removeAttribute("disabled");
        });
    });
}

// initialize Section
function initSection(num){
    for(var i = 0; i < num; i++){
        var section = document.createElement("button");

        section.setAttribute("type", "button");
        section.setAttribute("data-section-order", i + 1);
        section.classList.add("section-button");
        section.innerHTML = "<span>" + (i + 1) + "</span>";
        section.addEventListener("click", changeSection);

        if(i === 0){
            section.classList.add("on");
        }

        MAIN.querySelector(".sections").appendChild(section);
    }
}

// Changing Section
function changeSection(){
    let order = parseInt(this.getAttribute("data-section-order"));

    if(order !== soundSet.currentSection){
        MAIN.querySelectorAll(".section-button").forEach((n, index) => {
            if(index === order - 1){
                n.classList.add("on");
            }else{
                n.classList.remove("on");
            }
        });

        soundSet.currentSection = order;
        
        changeLaunchpad(order);
    }
}

// Making Launchpad
function makeLaunchpad(start, end){
    for(var i = start; i <= end; i++){
        var button = document.createElement("div");

        if(colorSet.loop === true && i === (colorSet.color.length * 2)){
            colorSet.index = 0;
            colorSet.loop = false;
        }

        button.innerHTML = soundSet.audio[i];
        button.setAttribute("data-button", soundSet.audio[i]);
        button.setAttribute("data-button-color", colorSet.color[Math.floor(colorSet.index / 2)]);
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.addEventListener("mousedown", playLaunchpad);
        
        soundboard.appendChild(button);
        
        soundSet.buttons.push(button);
        colorSet.index++;
    }
}

// Changing Launchpad
function changeLaunchpad(section){
    // Anchor = [Audio start position in array, button start position in soundboard]
    // Launchpad button position > 0: 0 ~ Position is disabled
    var anchor = [0, 0];

    switch(section){
        case 1:
            anchor = [1, 0];
            break;
        case 2:
            anchor = [17, 0];
            break;
        case 3:
            anchor = [32, 7];
            break;
        default:
            console.log("Empty Section");
    }
    for(var i = 0; i < soundSet.buttons.length; i++){
        if((anchor[1] > 1 && i === anchor[1]) || i < anchor[1]){
            soundSet.buttons[i].classList.add("disabled");
            soundSet.buttons[i].setAttribute("tabindex", "-1");
        }else{
            soundSet.buttons[i].classList.remove("disabled");
            soundSet.buttons[i].setAttribute("tabindex", "0");
            soundSet.buttons[i].setAttribute("data-button", soundSet.audio[i + anchor[0] - anchor[1]]);
        }
    }
}

// Play launchpad
function playLaunchpad(e){
    let button = e.target === undefined ? e : this;
    multiPlayer.player("" + convertName(button.getAttribute("data-button"), 1, 1) + "").start();

    // Play button animation
}

// Play Instrumental
function playFunction(){
    // f[0] = 1: Played, f[0] = 2: paused, f[0] = 3: Stopped
    let f = [0, "played", "paused", "stopped"];

    switch(this.getAttribute("data-function")){
        case "toggle":
            if(this.classList.contains("paused") || this.classList.contains("stopped")){
                f[0] = 1;
                Tone.Transport.start();
            }else{
                f[0] = 2;
                Tone.Transport.pause();
            }
            break;

        case "stop":
            f[0] = 3;
            Tone.Transport.stop();
            break;

        default:
            console.log("empty button");
    }

    for(let i = 1; i < f.length; i++){
        functionButtons[0].classList.remove(f[i]);
        if(f[0] === i){
            functionButtons[0].classList.add(f[i]);
        }
        if(f[0] < 2){
            functionButtons[0].innerHTML = iconSet.pause;
        }else{
            functionButtons[0].innerHTML = iconSet.play;
        }
    }
}

// Pressed Keyboard
function pressKey(e){
    // keyboard layout for 4x4
    const shortcut = ["3", "4", "5", "6", "e", "r", "t", "y", "d", "f", "g", "h", "c", "v", "b", "n"];
    const key = e.key;

    for(var i = 0; i < shortcut.length; i++){
        if(key === shortcut[i]){
            playLaunchpad(soundSet.buttons[i]);
        }
    }

    // For accessibility
    if((key === 'Enter' || key === 13) || (['Spacebar', ' '].indexOf(key) >= 0 || key === 32)){
        if(e.target.getAttribute('data-button')){
            e.preventDefault();
            playLaunchpad(e.target);
        }
    }
}