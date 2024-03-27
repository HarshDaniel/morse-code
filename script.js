console.log('Script loaded');


const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
};


const dotDuration = 60; 
const dashDuration = dotDuration * 3; 
const spaceDuration = dotDuration * 3; 
const charSpaceDuration = dotDuration; 


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

function convertToMorse() {
    const text = document.querySelector('#inputText').value.toUpperCase();
    

    let morseText = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (morseCode[char]) {
            morseText += morseCode[char] + ' ';
        }
    }

    document.querySelector('#outputCode').value = morseText;

    console.log(morseText);
    beepFromMorse(morseText);
}

function beepFromMorse(morseText) {
    

    

    oscillator.type = 'sine'; 
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); 
    gainNode.connect(audioContext.destination); 
    oscillator.connect(gainNode); 

    oscillator.start();

    let currentIndex = 0;

    const playNextSignal = () => {
        if (currentIndex >= morseText.length) {
            setTimeout(() => {
                oscillator.stop(); 
            }, charSpaceDuration);
            return;
        }

        const currentChar = morseText[currentIndex];

        if (currentChar === '.') {
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            audioContext.resume();
            setTimeout(() => {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                currentIndex++;
                setTimeout(playNextSignal, charSpaceDuration);
            }, dotDuration);
        } else if (currentChar === '-') {
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            audioContext.resume();
            setTimeout(() => {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                currentIndex++;
                setTimeout(playNextSignal, charSpaceDuration);
            }, dashDuration);
        } else if (currentChar === ' ') {
            setTimeout(() => {
                currentIndex++;
                playNextSignal();
            }, spaceDuration);
        } else {
            currentIndex++;
            playNextSignal();
        }
    };
    playNextSignal();
}
