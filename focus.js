document.addEventListener('DOMContentLoaded', () => {
    // Apply theme from main page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Get task data from URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('id');
    const taskText = params.get('text');
    const duration = params.get('duration') || 25;

    const taskTextElement = document.getElementById('focus-task-text');
    const completeBtn = document.getElementById('focus-complete-btn');
    
    // Display the task
    taskTextElement.textContent = taskText;
    document.title = `${taskText} - Focus Session`;

    // --- MUSIC PLAYER LOGIC ---
    const musicToggleBtn = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const musicIcon = musicToggleBtn.querySelector('i');

    musicToggleBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        } else {
            backgroundMusic.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    });

    // --- POMODORO TIMER LOGIC ---
    const timerDisplay = document.getElementById('pomodoro-timer');
    const startBtn = document.getElementById('pomodoro-start');
    const pauseBtn = document.getElementById('pomodoro-pause');
    const resetBtn = document.getElementById('pomodoro-reset');
    
    let timerInterval = null;
    let timeLeft = parseInt(duration) * 60; // Default to 25 minutes
    let isPaused = true;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const displayString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = displayString;
        document.title = `${displayString} - ${taskText}`;
    }

    function startTimer() {
        if (isPaused) {
            isPaused = false;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');

            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('Focus session finished!');
                    window.close(); // Close the tab when the timer is done
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        isPaused = true;
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        clearInterval(timerInterval);
    }

    function resetTimer() {
        pauseTimer();
       timeLeft = parseInt(duration) * 60;
        updateTimerDisplay();
    }
    
    // --- TASK COMPLETION LOGIC ---
    completeBtn.addEventListener('click', () => {
        // Use localStorage to communicate back to the main tab
        localStorage.setItem('taskCompletedInFocus', taskId);
        alert(`Task "${taskText}" marked as complete!`);
        window.close(); // Close the tab
    });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initialize
    updateTimerDisplay();
});

// Add this code block to your focus.js file

// --- FULLSCREEN LOGIC ---
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
const fullscreenIcon = fullscreenToggleBtn.querySelector('i');

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen mode
        document.documentElement.requestFullscreen();
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Listen for fullscreen changes (like pressing the ESC key) to update the icon
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenIcon.classList.remove('fa-expand');
        fullscreenIcon.classList.add('fa-compress');
    } else {
        fullscreenIcon.classList.remove('fa-compress');
        fullscreenIcon.classList.add('fa-expand');
    }
});

fullscreenToggleBtn.addEventListener('click', toggleFullScreen);