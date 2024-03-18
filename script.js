const RANDOM_SENTENCE_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const textInput = document.getElementById("textInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./sound/audio_typing-sound.mp3");
const wrongSound = new Audio("./sound/audio_wrong.mp3");
const correctSound = new Audio("./sound/audio_correct.mp3");

textInput.addEventListener("input", () => {

    // typeSound
    typeSound.play();
    typeSound.currentTime = 0;

    
    const sentenceArray = typeDisplay.querySelectorAll("span");
    const inputArray = textInput.value.split("");
    let correct = true;
    sentenceArray.forEach((characterSpan, index) => {
        const inputCharacter = inputArray[index];

        if (!inputCharacter) {
            characterSpan.classList.remove("correct", "incorrect");
            correct = false;
        } else if (inputCharacter === characterSpan.innerText) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            wrongSound.play();
            wrongSound.volume = 0.3;
            wrongSound.currentTime = 0;
        }
    });

    if(correct == true){
        correctSound.play();
        correctSound.currentTime = 0;
         RenderNextSentence();
    }
});

async function getRandomSentence() {
    const response = await fetch(RANDOM_SENTENCE_API);
    const data = await response.json();
    return data.content;
}

async function RenderNextSentence() {
    const sentence = await getRandomSentence();
    typeDisplay.innerHTML = "";

    sentence.split("").forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        typeDisplay.appendChild(characterSpan);
    });

    textInput.value = "";

    StartTimer();
}

let startTime;
let originTime = 30;

function StartTimer() {
    timer.innerText = originTime;
    startTime = new Date();
    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if(timer.innerText <= 0) Timeup(); 
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function Timeup(){
    RenderNextSentence();
}
RenderNextSentence();
StartTimer();