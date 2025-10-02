// Toggle between login and signup forms
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
  signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
  clearErrors();
}

function clearErrors() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('signupError').textContent = '';
}

// Signup validation & handler
function handleSignup(event) {
  event.preventDefault();
  clearErrors();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (password !== confirmPassword) {
    document.getElementById('signupError').textContent = 'Passwords do not match';
    return false;
  }
  // For demo: store user in localStorage (simulate signup)
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) {
    document.getElementById('signupError').textContent = 'Email already registered';
    return false;
  }
  users[email] = { name, email, password };
  localStorage.setItem('users', JSON.stringify(users));

  alert('Signup successful! Please log in.');
  toggleForms();
  return false;
}

// Login validation & handler
function handleLogin(event) {
  event.preventDefault();
  clearErrors();
  const identity = document.getElementById('loginIdentity').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  let foundUser = null;
  for (const key in users) {
    if (users[key].email === identity || users[key].name === identity) {
      foundUser = users[key];
      break;
    }
  }
  if (!foundUser || foundUser.password !== password) {
    document.getElementById('loginError').textContent = 'Invalid credentials';
    return false;
  }

  showMainPlatform(foundUser.name);
  return false;
}

// Get user progress points or start at 0
function getUserProgress() {
  return parseInt(localStorage.getItem('userProgress') || '0', 10);
}

// Update progress bar and text
function updateProgressBar() {
  const progress = getUserProgress();
  const maxPoints = 50;
  const percentage = Math.min((progress / maxPoints) * 100, 100);
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');

  if (bar && text) {
    bar.style.width = percentage + '%';
    text.textContent = `Your Progress: ${progress} / ${maxPoints} points`;
  }
}

// Show main platform and update banner & progress
function showMainPlatform(userName) {
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('mainPlatform').style.display = 'block';

  const banner = document.querySelector('.banner');
  banner.textContent = `Welcome ${userName}! Downloadable offline lectures in multiple languages to support students facing illiteracy and accessibility challenges.`;
  banner.innerHTML += `
    <div class="progress-container" aria-label="User Progress Bar">
      <div class="progress-bar" id="progressBar"></div>
      <div class="progress-text" id="progressText"></div>
    </div>`;

  updateProgressBar();

  showSection('home');
  populateClassTabs();
  showSection('courses');
  showTutorialsSection();
}

// Show content section by id
function showSection(id) {
  const sections = document.querySelectorAll('.content-section, .sections');
  sections.forEach(s => {
    s.style.display = (s.id === id) ? '' : 'none';
  });
  if (id === 'courses') showTutorialsSection();
}

// Populate class tabs from 1 to 12
function populateClassTabs() {
  const classTabs = document.getElementById('classTabs');
  classTabs.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    let tab = document.createElement('div');
    tab.className = 'tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', '0');
    tab.textContent = `Class ${i}`;
    tab.onclick = () => selectClass(i);
    tab.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') selectClass(i);
    };
    classTabs.appendChild(tab);
  }
}

// Select a class and show demo course content
function selectClass(classNumber) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  tabs[classNumber - 1].classList.add('active');

  const content = document.getElementById('courseContent');
  content.textContent = `Course content for Class ${classNumber}:\n- Downloadable offline lectures\n- English speaking tutorials\n- Gadget tutorials\n- Confidence building videos\n- Motivational activities`;
}

// Show tutorials section when courses opened
function showTutorialsSection() {
  const tutorials = document.getElementById('tutorials');
  tutorials.style.display = 'grid';
}

// Add points to user progress and update bar
function addProgressPoints(points) {
  let current = getUserProgress();
  current += points;
  if (current > 50) current = 50;
  localStorage.setItem('userProgress', current);
  updateProgressBar();
}

// Quiz submission with points awarded for correct answer
function submitQuiz(event) {
  event.preventDefault();
  const quizResult = document.getElementById('quizResult');
  const form = document.getElementById('quizForm');
  const answer = form.q1.value;
  if (answer === 'Delhi') {
    quizResult.textContent = 'Correct! Great job.';
    addProgressPoints(10);
  } else {
    quizResult.textContent = 'Incorrect. The correct answer is Delhi.';
  }
  return false;
}
/* Reset & base */
