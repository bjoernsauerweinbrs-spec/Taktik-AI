// public/js/auth.js
function updateStatus(msg, isError = false) {
  const el = document.getElementById('status');
  if (el) {
    el.textContent = msg;
    el.style.color = isError ? '#b00020' : '';
  }
}

function enterApp(username) {
  sessionStorage.setItem('sessionUser', username);

  const auth = document.getElementById('auth-section');
  const app = document.getElementById('app-section');

  if (auth) auth.style.display = 'none';
  if (app) app.style.display = 'block';

  const data = Storage.loadUserData(username);
  const dataEl = document.getElementById('user-data');
  if (dataEl) dataEl.value = data || '';

  updateStatus(`Angemeldet als ${username}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const regBtn = document.getElementById('register-btn');
  const loginBtn = document.getElementById('login-btn');

  if (regBtn) {
    regBtn.addEventListener('click', () => {
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();

      if (!u || !p) return updateStatus('Bitte Benutzername und Passwort eingeben.', true);

      Storage.saveUser(u, p);
      updateStatus('Registrierung erfolgreich. Jetzt anmelden.');
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();

      const user = Storage.getUser(u);
      if (!user || user.password !== p) {
        return updateStatus('Login fehlgeschlagen.', true);
      }

      enterApp(u);
    });
  }
});