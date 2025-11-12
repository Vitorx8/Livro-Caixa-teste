// ==== BANCO DE DADOS ====
let dbPromise;
try {
  dbPromise = idb.openDB('livrocaixa', 1, {
    upgrade(db) { db.createObjectStore('dados', { keyPath: 'id' }); }
  });
} catch (e) {
  console.error("IndexedDB não suportado", e);
}

// ==== FUNÇÃO DE INÍCIO ====
window.iniciarLogin = async () => {
  const form = document.getElementById('formLogin');
  if (!form) return;

  form.onsubmit = async e => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (user !== 'admin') {
      alert('Usuário deve ser "admin"');
      return;
    }

    let hashSalvo = null;
    try {
      if (dbPromise) {
        const db = await dbPromise;
        const item = await db.get('dados', 'admin_hash');
        hashSalvo = item ? item.valor : null;
      }
    } catch (e) {
      console.warn("Erro ao ler hash", e);
    }

    const hashAtual = btoa(pass);

    if (!hashSalvo) {
      // PRIMEIRA VEZ
      try {
        if (dbPromise) {
          const db = await dbPromise;
          await db.put('dados', { id: 'admin_hash', valor: hashAtual });
        }
      } catch (e) { console.warn("Erro ao salvar", e); }
      alert('Senha definida!');
    } else if (hashSalvo !== hashAtual) {
      alert('Senha incorreta!');
      return;
    }

    // LOGIN BEM-SUCEDIDO
    document.getElementById('pageLogin').classList.remove('active');
    document.getElementById('pageDashboard').classList.add('active');
  };
};

// ==== LOGOUT ====
function logout() {
  document.getElementById('pageDashboard').classList.remove('active');
  document.getElementById('pageLogin').classList.add('active');
  document.getElementById('formLogin').reset();
}