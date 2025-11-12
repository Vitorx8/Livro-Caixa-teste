// ==== IndexedDB ====
let db;
const dbPromise = idb.openDB('livrocaixa', 1, {
  upgrade(db) {
    db.createObjectStore('dados', { keyPath: 'id' });
  }
});

window.iniciarApp = async () => {
  db = await dbPromise;

  const salvar = async (id, valor) => await db.put('dados', { id, valor });
  const carregar = async (id, padrao) => {
    const item = await db.get('dados', id);
    return item ? item.valor : padrao;
  };

  // ==== DADOS ====
  let usuarios = await carregar('usuarios', []);
  let empresa = await carregar('empresa', { nome: '', cnpj: '', logo: '' });
  let lancamentos = await carregar('lancamentos', []);
  let licenca = await carregar('licenca', { serial: '', validade: null, licencasGeradas: [] });
  let usuarioLogado = null;

  // ==== FUNÇÕES GLOBAIS ====
  window.salvarDados = async () => {
    await salvar('usuarios', usuarios);
    await salvar('empresa', empresa);
    await salvar('lancamentos', lancamentos);
    await salvar('licenca', licenca);
  };

  // ==== LOGIN ====
  document.getElementById('formLogin').onsubmit = async e => {
    e.preventDefault();
    const login = document.getElementById('loginUser').value.trim().toLowerCase();
    const senha = document.getElementById('loginPass').value;

    if (login === 'admin') {
      let hashSalvo = await carregar('admin_hash');
      const hashAtual = btoa(senha);
      if (!hashSalvo) {
        await salvar('admin_hash', hashAtual);
        alert('Senha admin definida!');
      } else if (hashSalvo !== hashAtual) {
        return alert('Senha admin incorreta!');
      }
      usuarioLogado = { login: 'admin', perfil: 'admin' };
    } else {
      const user = usuarios.find(u => u.login.toLowerCase() === login && u.senha === senha);
      if (!user) return alert('Usuário ou senha incorretos!');
      usuarioLogado = { ...user };
    }

    // MOSTRA UI
    document.getElementById('mainNavbar').classList.remove('d-none');
    document.getElementById('infoBar').classList.remove('d-none');
    irPara('dashboard');
  };

  // ==== RESTO DO SEU CÓDIGO (adaptado para IndexedDB) ====
  // Todas as funções: adicionarLancamento, salvarEmpresa, etc.
  // Substitua localStorage por salvarDados()
  // EXEMPLO:
  window.adicionarLancamento = () => {
    // ... seu código ...
    lancamentos.push({ ... });
    salvarDados();
    carregarLancamentos();
  };

  // ... (todo o resto do seu JS, só trocando localStorage por salvarDados/carregar)
};