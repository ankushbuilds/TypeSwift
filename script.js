document.querySelector(".random-para");
const countDownElement = document.querySelector(".countdown");

let totalSeconds = 30;
let intervalId = null;
let isTimerRunning = false;
let timeElasped = 0; // Track time used
let audioContext = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

// Function to play beep sound
const playBeep = (frequency = 800, duration = 200) => {
    if (!audioContext) initAudioContext();
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
    
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
};


const paragraphs = [
    "Every morning, Mia walks to school with her best friend. They talk about their favorite games and laugh at silly jokes. After school, they like to sit under a big tree and share snacks. It is their favorite time of the day.",
    "The sun was shining brightly in the clear blue sky. Children were playing in the park, laughing and running around happily. A gentle breeze moved the leaves on the trees, making a soft rustling sound.",
    "Typing is an important skill to learn. It helps us finish our work faster and more easily. When we practice every day, our fingers become quicker. Good typing also helps us avoid mistakes.",
    "Fast typing saves time in school and at work. It allows us to write emails and documents quickly. With patience and daily practice, anyone can become a good typist.",
    "Virat Kohli is a famous cricket player from India. He was born on November 5, 1988. He is known for his strong batting and hard work. Many people enjoy watching him play. He is also very fit and practices every day to improve his game.",
    "Rohit Sharma is a famous cricket player from India. He is known for his calm nature and excellent batting skills. He has scored many centuries in international cricket. Many fans love to watch him play because he hits beautiful shots.",
    "MS Dhoni is a famous cricket player from India. He is known for his calm mind and smart captaincy. He was the captain of the Indian cricket team and won many important matches. Many fans admire him for his leadership and finishing skills.",
    "India is a large and beautiful country in South Asia. It is known for its rich history and diverse culture. The capital city of India is New Delhi. Many different languages are spoken in the country.",
    "Maharana Pratap was a brave king of Mewar. He is known for his courage and love for his land. He fought against the Mughal emperor to protect his kingdom. His loyal horse, Chetak, is also remembered in history.",
    "A keyboard is a device used to type letters, numbers, and symbols on a computer. It has many keys that help us write and control the computer. There are different types of keyboards, like mechanical, wireless, and laptop keyboards."
];

// Function to load paragraph into the DOM with each character wrapped in a span
const paraContainer = document.querySelector(".random-para");

const loadParagraph = (text) => {
    paraContainer.innerHTML = "";

    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char;

        if (index === 0) {
            span.classList.add("current");
        }

        paraContainer.appendChild(span);
    });
};

// Function to get a random paragraph from local array and display it
const getRandomPara = async () => {
    try {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        const randomParagraph = paragraphs[randomIndex];
        loadParagraph(randomParagraph);
    }
    catch (error) {
        console.error("Error loading paragraph:", error);
        // Fallback text if something goes wrong
        loadParagraph("The quick brown fox jumps over the lazy dog.");
    }
};

// Function to start the countdown timer
const startTimer = () => {
    if (isTimerRunning || intervalId) return;

    isTimerRunning = true;
    const countdownEl = document.querySelector(".countdown");
    countdownEl.innerHTML = `<span class='timer-label'>⏱️ Time</span><span class='timer-value'>${formatTime(totalSeconds)}</span>`;

    intervalId = setInterval(() => {
        totalSeconds--;
        timeElasped++;

        if (totalSeconds < 0) {
            clearInterval(intervalId);
            intervalId = null;
            calculateResults();   // Show results on screen
            return;
        }

        countdownEl.innerHTML = `<span class='timer-label'>⏱️ Time</span><span class='timer-value'>${formatTime(totalSeconds)}</span>`;
        
        // Toggle warning style when below 10 seconds
        if (totalSeconds < 5) {
            countdownEl.parentElement.classList.add("timer-warning");
            // Play beep sound
            playBeep(800, 150);
        } else {
            countdownEl.parentElement.classList.remove("timer-warning");
        }
    }, 1000);
};

// Function to calculate WPM & Accuracy
const calculateResults = () => {

    const typedText = document.getElementById("typing-para").value;
    const originalText = document.querySelector(".random-para").textContent;

    const totalCharsTyped = typedText.length;
    const timeInMinutes = timeElasped / 60;

    let correctChars = 0;

    for (let i = 0; i < Math.min(typedText.length, originalText.length); i++) {
        if (typedText[i] === originalText[i]) {
            correctChars++;
        }
    }

    // WPM using correct characters 
    const wpm = timeInMinutes > 0
        ? Math.round((correctChars / 5) / timeInMinutes)
        : 0;

    const accuracy = totalCharsTyped > 0
        ? ((correctChars / totalCharsTyped) * 100).toFixed(2)
        : 0;

    // Show results on screen with dynamic styling
    const statusEl = document.querySelector(".status");
    const wpmEl = document.querySelector(".wpm");
    const accuracyEl = document.querySelector(".accuracy");
    
    statusEl.innerHTML = "<span class='status-icon'>⏰</span> Time's Up!";
    wpmEl.innerHTML = `<span class='result-label'>💨 WPM</span><span class='result-value'>${wpm}</span>`;
    accuracyEl.innerHTML = `<span class='result-label'>🎯 Accuracy</span><span class='result-value'>${accuracy}%</span>`;
    
    // Add animation classes
    statusEl.classList.add("show-results");
    wpmEl.classList.add("show-results");
    accuracyEl.classList.add("show-results");
    
    // Play three beeps to signal time's up
    playBeep(1200, 100);
    setTimeout(() => playBeep(1200, 100), 150);
    setTimeout(() => playBeep(1200, 150), 300);
    
    // Stagger animations
    setTimeout(() => wpmEl.classList.add("show-results-delay1"), 300);
    setTimeout(() => accuracyEl.classList.add("show-results-delay2"), 600);

    document.getElementById("typing-para").disabled = true;

    isTimerRunning = false;
};

// Format seconds into MM:SS
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};

// Stop timer function
const stopTimer = () => {
    clearInterval(intervalId);
    intervalId = null;
    isTimerRunning = false;
    
    // Show continue button and hide stop button
    document.querySelector(".stop-btn").style.display = "none";
    document.querySelector(".continue-btn").style.display = "inline-block";
};

// Continue timer function
const continueTimer = () => {
    // Hide continue button and show stop button
    document.querySelector(".continue-btn").style.display = "none";
    document.querySelector(".stop-btn").style.display = "inline-block";
    
    // Resume the timer
    startTimer();
};

// Reset All function
const resetAll = async () => {
    clearInterval(intervalId);
    intervalId = null;

    totalSeconds = 30;
    timeElasped = 0;
    isTimerRunning = false;

    const countdownEl = document.querySelector(".countdown");
    countdownEl.innerHTML = `<span class='timer-label'>⏱️ Time</span><span class='timer-value'>${formatTime(totalSeconds)}</span>`;
    document.querySelector(".timer").classList.remove("timer-warning");

    document.getElementById("typing-para").value = "";
    document.getElementById("typing-para").disabled = false;

    const statusEl = document.querySelector(".status");
    const wpmEl = document.querySelector(".wpm");
    const accuracyEl = document.querySelector(".accuracy");
    
    statusEl.innerText = "";
    wpmEl.innerText = "";
    accuracyEl.innerText = "";
    
    // Remove animation classes
    statusEl.classList.remove("show-results");
    wpmEl.classList.remove("show-results", "show-results-delay1");
    accuracyEl.classList.remove("show-results", "show-results-delay2");
    
    // Show Stop button
    document.querySelector(".stop-btn").style.display = "inline-block";
    document.querySelector(".continue-btn").style.display = "none";

    await getRandomPara();
};
const inputField = document.getElementById("typing-para");

inputField.addEventListener("input", () => {
    
    // Initialize audio context on first interaction
    initAudioContext();

    startTimer();

    const spans = document.querySelectorAll(".random-para span");
    const typedText = inputField.value;

    spans.forEach((span, index) => {

        span.classList.remove("correct", "wrong", "current");

        const typedChar = typedText[index];

        if (typedChar == null) {
            // nothing
        }
        else if (typedChar === span.innerText) {
            span.classList.add("correct");
        }
        else {
            span.classList.add("wrong");
        }

        if (index === typedText.length) {
            span.classList.add("current");
        }

    });

    // Auto stop if finished
    if (typedText.length === spans.length) {
        clearInterval(intervalId);
        calculateResults();
    }

});

// Load paragraph on page load
document.addEventListener("DOMContentLoaded", getRandomPara);

// Start timer on typing
document.getElementById("typing-para").addEventListener("input", startTimer);

// Stop button
document.querySelector(".stop-btn").addEventListener("click", stopTimer);

// Continue button
document.querySelector(".continue-btn").addEventListener("click", continueTimer);

// Reset button
document.querySelector(".reset-btn").addEventListener("click", resetAll);