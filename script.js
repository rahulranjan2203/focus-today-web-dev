document.addEventListener('DOMContentLoaded', () => {

    // --- THIS IS THE MISSING CODE BLOCK THAT MAKES THE THEME CHANGER WORK ---
    const changeBgBtn = document.getElementById('change-bg-btn');
    const bgChooserModal = document.getElementById('bg-chooser-modal');
    const closeBgModalBtn = document.getElementById('closeBgModal');
    const bgOptions = document.querySelectorAll('.bg-option');
    const themePrefix = 'theme-bg-';

    changeBgBtn.addEventListener('click', () => {
        bgChooserModal.classList.remove('hidden');
    });

    closeBgModalBtn.addEventListener('click', () => {
        bgChooserModal.classList.add('hidden');
    });

    bgOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.dataset.theme;
            
            // Remove any old theme classes from the <html> element
            document.documentElement.classList.remove(themePrefix + '1', themePrefix + '2', themePrefix + '3');
            // Add the new theme class
            document.documentElement.classList.add(selectedTheme);
            // Save the user's choice to local storage
            localStorage.setItem('userBackgroundTheme', selectedTheme);
            
            bgChooserModal.classList.add('hidden');
        });
    });
    // --- END OF MISSING CODE BLOCK ---

    // --- BACKGROUND MUSIC LOGIC ---
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

    // --- FULLSCREEN LOGIC ---
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    const fullscreenIcon = fullscreenToggleBtn.querySelector('i');

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
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

    // --- MINIMALIST CLOCK LOGIC ---
    const hoursElement = document.querySelector('[data-unit="hours"]');
    const minutesElement = document.querySelector('[data-unit="minutes"]');
    const secondsElement = document.querySelector('[data-unit="seconds"]');

    function updateMinimalClock() {
        const now = new Date();
        hoursElement.textContent = String(now.getHours()).padStart(2, '0');
        minutesElement.textContent = String(now.getMinutes()).padStart(2, '0');
        secondsElement.textContent = String(now.getSeconds()).padStart(2, '0');
    }
    setInterval(updateMinimalClock, 1000);

    // --- STATE MANAGEMENT ---
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let gameState = JSON.parse(localStorage.getItem('gameState')) || {
        streak: 0,
        lastCompletedDate: null
    };
    let currentView = 'list';

    // --- DOM SELECTORS ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const taskInput = document.getElementById('taskInput');
    const durationInput = document.getElementById('durationInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskListView = document.getElementById('task-list-view');
    const kanbanView = document.getElementById('kanban-view');
    const listViewBtn = document.getElementById('listViewBtn');
    const kanbanViewBtn = document.getElementById('kanbanViewBtn');
    const streakCountSpan = document.getElementById('streak-count');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalBody = document.getElementById('modal-body');
    const summaryButton = document.getElementById('summaryButton');

    // --- FOCUS SESSION LOGIC ---
    function startFocusSession(task) {
        const duration = task.focusDuration || 25;
        const taskText = encodeURIComponent(task.text);
        window.open(`focus.html?id=${task.id}&text=${taskText}&duration=${duration}`, '_blank');
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'taskCompletedInFocus') {
            const taskId = parseInt(localStorage.getItem('taskCompletedInFocus'));
            if (taskId) {
                toggleTaskComplete(taskId);
                localStorage.removeItem('taskCompletedInFocus');
            }
        }
    });

    // --- THEME & VIEW SWITCHING ---
    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggleBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };

    function switchView(view) {
        currentView = view;
        if (view === 'list') {
            listViewBtn.classList.add('active');
            kanbanViewBtn.classList.remove('active');
            taskListView.classList.remove('hidden');
            kanbanView.classList.add('hidden');
        } else {
            listViewBtn.classList.remove('active');
            kanbanViewBtn.classList.add('active');
            taskListView.classList.add('hidden');
            kanbanView.classList.remove('hidden');
        }
        render();
    }

    // --- RENDER FUNCTIONS ---
    const render = () => {
        saveState();
        updateStreakDisplay();
        if (currentView === 'list') renderListView();
        else renderKanbanView();
        addDragAndDropListeners();
    };

    const renderListView = () => {
        taskListView.innerHTML = '';
        tasks.sort((a, b) => a.order - b.order).forEach(task => taskListView.appendChild(createTaskElement(task)));
    };

    const renderKanbanView = () => {
        document.querySelectorAll('.kanban-tasks').forEach(col => col.innerHTML = '');
        tasks.forEach(task => {
            const column = kanbanView.querySelector(`.kanban-tasks[data-column="${task.status}"]`);
            if (column) column.appendChild(createTaskElement(task));
        });
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('draggable', 'true');
        li.dataset.id = task.id;
        const isCompleted = task.status === 'done';

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} title="Mark as done">
            <span class="priority-tag ${task.priority}">${task.priority}</span>
            <div class="task-item-content ${isCompleted ? 'completed' : ''}">
                <p>${task.text}</p>
                <div class="task-meta">
                    <span class="task-duration">
                        <i class="fas fa-stopwatch"></i> ${task.focusDuration || 25} min
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="focus-btn" title="Start Focus Session"><i class="fas fa-crosshairs"></i></button>
                <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        li.querySelector('.focus-btn').addEventListener('click', () => startFocusSession(task));
        li.querySelector('.task-checkbox').addEventListener('change', () => toggleTaskComplete(task.id));
        li.querySelector('.edit-btn').addEventListener('click', () => openEditModal(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        return li;
    };

    // --- CORE APP LOGIC ---
    const addTask = () => {
        const text = taskInput.value.trim();
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const duration = durationInput.value || 25;

        tasks.push({
            id: Date.now(),
            text,
            priority: prioritySelect.value,
            status: 'todo',
            order: tasks.length,
            focusDuration: parseInt(duration)
        });

        taskInput.value = '';
        durationInput.value = '';
        render();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        render();
    };

    const toggleTaskComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            if (task.status !== 'done') {
                task.status = 'done';
                updateStreak();
            } else {
                task.status = 'todo';
            }
            render();
        }
    };

    const updateTask = (id, newText) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            modal.classList.add('hidden');
            render();
        }
    };

    let draggedItemId = null;
    const addDragAndDropListeners = () => {
        const taskItems = document.querySelectorAll('.task-item');
        const kanbanColumns = document.querySelectorAll('.kanban-tasks');

        taskItems.forEach(item => {
            item.addEventListener('dragstart', e => {
                draggedItemId = parseInt(e.currentTarget.dataset.id);
                setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
            });
            item.addEventListener('dragend', e => e.currentTarget.classList.remove('dragging'));
        });

        const dragOverHandler = e => e.preventDefault();

        kanbanColumns.forEach(col => {
            col.addEventListener('dragover', dragOverHandler);
            col.addEventListener('drop', e => {
                e.preventDefault();
                const task = tasks.find(t => t.id === draggedItemId);
                if (task) {
                    task.status = e.currentTarget.dataset.column;
                    render();
                }
            });
        });
    };

    const openEditModal = (id) => {
        const task = tasks.find(t => t.id === id);
        modalBody.innerHTML = `<h2>Edit Task</h2>
            <div class="input-container" style="flex-direction: column; gap: 15px;">
                <input type="text" id="editTaskInput" value="${task.text}">
                <button id="saveEditButton">Save Changes</button>
            </div>`;
        modal.classList.remove('hidden');

        document.getElementById('saveEditButton').addEventListener('click', () => {
            const newText = document.getElementById('editTaskInput').value;
            updateTask(id, newText);
        });
    };

    const showSummaryModal = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        modalBody.innerHTML = `<h2>Productivity Summary</h2>
            <ul class="summary-list">
                <li><strong>Total Tasks:</strong> ${totalTasks}</li>
                <li><strong>Tasks Completed:</strong> ${completedTasks}</li>
                <li><strong>Tasks Pending:</strong> ${pendingTasks}</li>
                <li><strong>Completion Rate:</strong> ${completionRate}%</li>
            </ul>`;
        modal.classList.remove('hidden');
    };

    const updateStreak = () => { /* Stub */ };
    const updateStreakDisplay = () => {
        streakCountSpan.textContent = gameState.streak;
    };
    const saveState = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('gameState', JSON.stringify(gameState));
    };

    // --- EVENT LISTENERS ---
    addTaskButton.addEventListener('click', addTask);
    themeToggleBtn.addEventListener('click', toggleTheme);
    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    summaryButton.addEventListener('click', showSummaryModal);
    listViewBtn.addEventListener('click', () => switchView('list'));
    kanbanViewBtn.addEventListener('click', () => switchView('kanban'));

    // --- INITIALIZATION ---
    function init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        updateMinimalClock();
        switchView('list');
    }
    
    init();
});