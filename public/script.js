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

$(document).ready(function() {
    $('body').attr('data-theme', 'dark');
    $('#convertToMorseButton').click(() => {
        convertToMorse();
    });
    $('#toggleTheme').click(() => {
        toggleTheme();
    })
});

function convertToMorse() {
    try {
        const inputText = $('#inputText').val().toUpperCase().trim();

        if (!inputText) {
            alert('Please enter text to convert to Morse code.');
        }

        let morseText = '';
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            if (morseCode[char]) {
                morseText += morseCode[char] + ' ';
            } else {
                console.warn(`Character '${char}' is not supported in Morse code.`);
            }
        }
        $('#outputCode').val(morseText.trim());
        console.log('Morse code:', morseText.trim());
        beepFromMorse(morseText.trim());
    } catch (error) {
        console.error('Error in convertToMorse:', error.message);
    }
}

function toggleTheme() {
    const body = $('body');
    const currentTheme = body.attr('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.attr('data-theme', newTheme);
    $('#toggleTheme').text(newTheme === 'light' ? 'Dark Mode' : 'Light Mode');
    console.log('Theme toggled to:', newTheme);
}


function beepFromMorse(morseText) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

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

            switch (currentChar) {
                case '.':
                case '-':
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
                    audioContext.resume();
                    setTimeout(() => {
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        currentIndex++;
                        setTimeout(playNextSignal, charSpaceDuration);
                    }, currentChar === '.' ? dotDuration : dashDuration);
                    break;
                case ' ':
                    setTimeout(() => {
                        currentIndex++;
                        playNextSignal();
                    }, spaceDuration);
                    break;
                default:
                    currentIndex++;
                    playNextSignal();
            }
        };
        playNextSignal();
    } catch (error) {
        console.error('Error in beepFromMorse:', error.message);
    }
}


    