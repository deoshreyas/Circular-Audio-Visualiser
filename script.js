let music = new Audio("music.mp3"); // CHANGE THIS TO THE PATH TO YOUR MUSIC FILE

let musicIcon = document.querySelector("#musicIcon");

function musicStateChange() {
    // Autoplay bug fix
    if (music_ctx.state === "suspended") {
        music_ctx.resume().then(() => {
            console.log("AudioContext resumed!");
        });
    }
    
    if (music.paused) {
        music.play();
        musicIcon.classList.remove("fa-play");
        musicIcon.classList.add("fa-pause");
    } else {
        music.pause();
        musicIcon.classList.remove("fa-pause");
        musicIcon.classList.add("fa-play");
    }
}

// Set up canvas
const container = document.querySelector("#container");
const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// Set up audio
const music_ctx = new (window.AudioContext || window.webkitAudioContext)();
let music_source = music_ctx.createMediaElementSource(music);
let analyser = music_ctx.createAnalyser();
music_source.connect(analyser);
analyser.connect(music_ctx.destination);

// Set up bars
analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength;

function animateCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    analyser.getByteFrequencyData(dataArray); // Get frequency data

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100; // Adjust as needed
    const maxBarHeight = canvas.height / 2 - radius; // Maximum height of bars
    const totalBars = bufferLength;
    const sliceWidth = (Math.PI * 2) / totalBars;

    for (let i = 0; i < totalBars; i++) {
        const barHeight = (dataArray[i] / 255.0) * maxBarHeight; // Scale bar height
        const angle = sliceWidth * i;

        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY + radius * Math.sin(angle);
        const x2 = centerX + (radius + barHeight) * Math.cos(angle);
        const y2 = centerY + (radius + barHeight) * Math.sin(angle);

        // Style the bar
        const red = (i * barHeight) / 10;
        const green = i * 4;
        const blue = barHeight / 4 - 12;
        ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.lineWidth = barWidth; // Adjust bar width as needed

        // Draw the bar
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    requestAnimationFrame(animateCircle); // Loop
}

animateCircle();
