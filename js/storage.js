// public/js/storage.js
const Storage = {
  saveUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[username] = { username, password };
    localStorage.setItem('users', JSON.stringify(users));
  },

  getUser(username) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username] || null;
  },

  saveUserData(username, data) {
    const key = `userData_${username}`;
    localStorage.setItem(key, data);
  },

  loadUserData(username) {
    const key = `userData_${username}`;
    return localStorage.getItem(key) || '';
  },

  exportAll(username) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const data = this.loadUserData(username);

    const exportObj = {
      user: users[username] || { username },
      data: data || ''
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importFromFile(file, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        callback(null, obj);
      } catch (err) {
        callback(err);
      }
    };
    reader.onerror = () => callback(reader.error);
    reader.readAsText(file);
  }
};