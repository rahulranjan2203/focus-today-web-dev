FocusFlow ✨ - A Modern To-Do Dashboard
FocusFlow is a beautiful, feature-rich to-do list application designed to enhance productivity through a clean, immersive, and customizable interface. Built with vanilla HTML, CSS, and JavaScript, this app goes beyond a simple list, incorporating modern UI trends like glassmorphism, dynamic themes, and integrated productivity tools.

## Live Demo 🌐
 https://rahulranjan2203.github.io/focus-today-web-dev/

## Core Features :
Complete Task Management: Add, edit, delete, and mark tasks as complete.

Task Organization:

Assign Low, Medium, or High priority to each task.

Set a specific due date.

Assign a custom focus duration for the Pomodoro timer.

Dual Views: Seamlessly switch between a classic List View and a Trello-style Kanban Board (To Do, In Progress, Done).

Dedicated Focus Sessions: Start a distraction-free focus session for any task, which opens in a new, dedicated tab with a massive timer.

Persistent Storage: All tasks and user preferences are automatically saved to the browser's Local Storage.

Rich Customization:

Light & Dark Mode themes.

3 Selectable Backgrounds (Lush Garden, Misty Mountains, Calm Ocean) to match your mood.

Productivity Tools:

Integrated Pomodoro Timer with custom durations.

Productivity Summary modal to track your progress.

Gamification: A "Streak" counter to build daily habits.

User Experience:

Immersive Fullscreen Mode.

Ambient Background Music with play/pause controls.

A beautiful glassmorphism UI that looks stunning on top of the scenic backgrounds.

Fully responsive design that works on desktop and mobile.

## Tech Stack 💻
This project was built from the ground up using fundamental web technologies:

HTML5: For the core structure and content.

CSS3: For all styling, including CSS Variables for theming, Flexbox and Grid for layout, and advanced animations.

Vanilla JavaScript (ES6+): For all application logic, including DOM manipulation, state management, and browser APIs like localStorage and Fullscreen.

Font Awesome: For a clean and modern icon set.

## The Development Journey: Challenges & Learning 🌱
Building FocusFlow was an iterative process that involved overcoming several interesting challenges. This journey was key to evolving the app from a simple list to a polished, feature-complete dashboard.

The Flip Clock Saga:

Challenge: My initial goal was to include a complex, skeuomorphic flip clock. This proved to be a major hurdle, with persistent bugs related to CSS alignment, transform origins, and synchronizing JavaScript timers with CSS animations.

Learning: This was a deep dive into the complexities of browser rendering. After multiple attempts, I pivoted to a more elegant and 100% reliable minimalist digital clock. This taught me a valuable lesson in prioritizing stability and user experience over unnecessarily complex features.

Inter-Tab Communication:

Challenge: A key feature is the dedicated "Focus Tab." The main challenge was passing the specific task data (text, duration) to the new tab and then communicating back when a task was marked as complete.

Learning: I solved this by using URL parameters to send the initial data to the focus tab. For communication back to the main app, I implemented a storage event listener. When the focus tab saves a "taskCompleted" flag to localStorage, the main tab listens for that change and updates its own UI in real-time.

Stateful Theming & Layout:

Challenge: Ensuring that all user preferences—such as the light/dark mode and the selected background image—persisted across page reloads and were correctly applied to both the main tab and any new focus tabs.

Learning: I implemented a robust system using localStorage to save these choices. A small script was placed in the HTML <head> to read these values and apply the correct CSS classes to the <html> element before the page content loads, preventing any "flash" of the default theme.
