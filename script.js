// 1. GLOBAL VARIABLES & SCOPING
// Declared at the top level to ensure all functions and listeners can access them.
let recognition; 
let audioContext;
let analyser;
let dataArray;
let animationId;

// State tracking
let currentMode = "Normal";
let totalFrames = 0;
let withinThresholdFrames = 0;

const thresholds = {
    "Whisper": 30,   // Low volume limit
    "Normal": 80,    // Medium volume limit
    "Speaker": 180   // High volume limit
};

// 2. DOM ELEMENT SELECTORS
const getStartedBtn = document.querySelector('.get-started');
const hideDiv = document.querySelector('.hide');
const playBtn = document.querySelector('.play');
const textDisplay = document.querySelector('#text');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
const icon = document.getElementById('settings-icon');
const menu = document.getElementById('mode-menu');
const title = document.getElementById('tittle');
const modeOptions = document.querySelectorAll('.mode-option');
const language = document.getElementById('Language');

// 3. SPEECH RECOGNITION INITIALIZATION
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        // Update text display with the "ghosting" effect for interim results
        textDisplay.innerHTML = `<span>${finalTranscript}</span><span style="color: gray;">${interimTranscript}</span>`;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };
} else {
    console.warn("Speech Recognition is not supported in this browser.");
}

// 4. GAUGE DRAWING LOGIC (Fits perfectly into your .status-box)
function drawGauge(canvasId, value, maxValue, color) {
    const gaugeCanvas = document.getElementById(canvasId);
    if (!gaugeCanvas) return;
    const ctx = gaugeCanvas.getContext('2d');

    // Sync internal resolution to the CSS size of the box
    gaugeCanvas.width = gaugeCanvas.offsetWidth;
    gaugeCanvas.height = gaugeCanvas.offsetHeight;

    const centerX = gaugeCanvas.width / 2;
    const centerY = gaugeCanvas.height - 10; // Positioned near bottom
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, gaugeCanvas.width, gaugeCanvas.height);

    // Draw Background Track (Semi-circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.strokeStyle = "#2e2e2e"; // Dark track background
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw Active Value (The color progress)
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    const endAngle = Math.PI + (Math.PI * percentage);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();
}

// 5. AUDIO ANALYSIS LOGIC
async function startAudio() {
    // Only create one AudioContext per session
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw();
}

function getAverageFrequency() {
    if (!analyser) return 0;
    let bufferLength = analyser.frequencyBinCount;
    let freqData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freqData);

    let values = 0;
    let count = 0;

    for (let i = 0; i < bufferLength; i++) {
        if (freqData[i] > 0) {
            values += i * (audioContext.sampleRate / analyser.fftSize);
            count++;
        }
    }
    return count === 0 ? 0 : Math.round(values / count);
}

// 6. MAIN ANIMATION LOOP
function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    // Sync Main Visualizer Canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Accuracy & Volume Logic
    const currentVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const limit = thresholds[currentMode];
    
    if (currentVolume > 5) { // Ensure there is actual sound
        totalFrames++;
        if (currentVolume <= limit) {
            withinThresholdFrames++;
        }
    }

    const accuracyScore = totalFrames === 0 ? 0 : Math.round((withinThresholdFrames / totalFrames) * 100);
    const avgFreq = getAverageFrequency();
    const isTooLoud = currentVolume > limit;

    // Update Text Elements
    document.getElementById('accValue').innerText = `${accuracyScore}%`;
    document.getElementById('freqValue').innerText = `${avgFreq}Hz`;
    textDisplay.style.color = isTooLoud ? "#ff4d4d" : "white";

    // DRAW THE GAUGES
    drawGauge('accuracyGauge', accuracyScore, 100, isTooLoud ? "#ff4d4d" : "#47eb47");
    drawGauge('frequencyGauge', avgFreq, 10000, "#af46e8"); // Scaled to 10kHz

    // Render Visualizer Bars
    const barCount = 120;
    const gap = 4;
    const barWidth = (canvas.width / barCount) - gap;
    const centerY = canvas.height / 2;
    let step = Math.floor(dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
        let amplitude = dataArray[i * step];
        let barHeight = (amplitude / 255) * canvas.height * 0.8;
        if (barHeight < 5) barHeight = 5;

        const x = i * (barWidth + gap);
        const y = centerY - (barHeight / 2);

        canvasCtx.fillStyle = isTooLoud ? "#ff4d4d" : `hsl(${120 + (i / barCount) * 160}, 80%, 60%)`;

        canvasCtx.beginPath();
        if (canvasCtx.roundRect) {
            canvasCtx.roundRect(x, y, barWidth, barHeight, 20);
        } else {
            canvasCtx.rect(x, y, barWidth, barHeight);
        }
        canvasCtx.fill();
    }
}

// 7. EVENT LISTENERS & UI INTERACTION
getStartedBtn.addEventListener('click', () => {
    hideDiv.style.display = 'none';
});

icon.addEventListener('click', (e) => {
    menu.classList.toggle('active');
    e.stopPropagation();
});

modeOptions.forEach(option => {
    option.addEventListener('click', function() {
        currentMode = this.textContent.trim();
        title.textContent = currentMode;
        menu.classList.remove('active');
        
        // Reset accuracy stats when switching modes
        totalFrames = 0;
        withinThresholdFrames = 0;
    });
});

window.addEventListener('click', () => {
    menu.classList.remove('active');
});

// PLAY/PAUSE TRIGGER
playBtn.addEventListener('click', function() {
    if (this.classList.contains('fa-play')) {
        // Start Session
        this.classList.replace('fa-play', 'fa-pause');
        if (recognition) {
            try { recognition.start(); } catch(e) { console.warn("Recognition already started"); }
        }
        startAudio();
    } else {
        // Stop Session
        this.classList.replace('fa-pause', 'fa-play');
        if (recognition) recognition.stop();
        if (animationId) cancelAnimationFrame(animationId);
        if (audioContext) audioContext.close().then(() => audioContext = null);
    }
});