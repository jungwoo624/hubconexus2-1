const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme in localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  body.classList.add(currentTheme);
  if (currentTheme === 'dark-mode') {
    toggleButton.textContent = 'Switch to Light Mode';
  }
}

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  let theme = 'light-mode';
  if (body.classList.contains('dark-mode')) {
    theme = 'dark-mode';
    toggleButton.textContent = 'Switch to Light Mode';
  } else {
    toggleButton.textContent = 'Switch to Dark Mode';
  }
  
  localStorage.setItem('theme', theme);
});
