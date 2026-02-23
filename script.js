document.querySelector(".random-para");
const countDownElement = document.querySelector(".countdown");

let totalSeconds = 30;
let intervalId = null;
let isTimerRunning = false;
let timeElasped = 0; // Track time used


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

// Function to fetch a random paragraph and display it
const getRandomPara = async () => {
    const paraUrl = "http://metaphorpsum.com/paragraphs/1/3";
    try {
        const response = await fetch(paraUrl);
        const data = await response.text();
        loadParagraph(data);
    }
    catch (error) {
        console.error("Error fetching paragraph:", error);
    }
};

// Function to start the countdown timer
const startTimer = () => {
    if (isTimerRunning || intervalId) return;

    isTimerRunning = true;
    countDownElement.innerText = formatTime(totalSeconds);

    intervalId = setInterval(() => {
        totalSeconds--;
        timeElasped++;

        if (totalSeconds < 0) {
            clearInterval(intervalId);
            intervalId = null;
            calculateResults();   // Show results on screen
            return;
        }

        countDownElement.innerText = formatTime(totalSeconds);
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

    // Show results on screen
    document.querySelector(".status").innerText = "⏰ Time's Up!";
    document.querySelector(".wpm").innerText = `WPM: ${wpm}`;
    document.querySelector(".accuracy").innerText = `Accuracy: ${accuracy}%`;

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
};

// Reset All function
const resetAll = async () => {
    clearInterval(intervalId);
    intervalId = null;

    totalSeconds = 30;
    timeElasped = 0;
    isTimerRunning = false;

    countDownElement.innerText = formatTime(totalSeconds);

    document.getElementById("typing-para").value = "";
    document.getElementById("typing-para").disabled = false;

    document.querySelector(".status").innerText = "";
    document.querySelector(".wpm").innerText = "";
    document.querySelector(".accuracy").innerText = "";

    await getRandomPara();
};
const inputField = document.getElementById("typing-para");

inputField.addEventListener("input", () => {

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

// Reset button
document.querySelector(".reset-btn").addEventListener("click", resetAll);