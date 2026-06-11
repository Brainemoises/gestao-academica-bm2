// Desenvolvido por Braine Moisés - Instituto BM²
// Email institucional: brainemoises@gmail.com
// Localização: Manica, Moçambique

const USERS_KEY = 'sistema_usuarios_bm2';
const ESTUDANTES_KEY = 'gestao_estudantes_bm2';
const CURSOS_KEY = 'gestao_cursos_bm2';
const MATRICULAS_KEY = 'gestao_matriculas_bm2';
const CONTEUDOS_KEY = 'gestao_conteudos_bm2';
const EXAMES_KEY = 'gestao_exames_bm2';
const SESSION_KEY = 'sessao_usuario_bm2';
const TIPO_USUARIO_KEY = 'tipo_usuario_bm2';

// Informações da Instituição
const INSTITUICAO = {
    nome: 'Instituto de Ciências e Tecnologia - Mentes Limpas (BM²)',
    localizacao: 'Manica, Moçambique',
    fundador: 'Residente de Manica',
    nibMae: '000100000032367542157',
    banco: 'BIM - Banco de Moçambique',
    email: 'brainemoises@gmail.com'
};

// Dados iniciais de cursos
const cursosIniciais = [
    { id: 1, codigo: 'SI', nome: 'Sistemas de Informação', duracao: 8, periodo: 'Noturno', descricao: 'Bacharelado em Sistemas de Informação', preco: 8500 },
    { id: 2, codigo: 'ADS', nome: 'Análise e Desenvolvimento de Sistemas', duracao: 5, periodo: 'Noturno', descricao: 'Tecnólogo em ADS', preco: 10800 },
    { id: 3, codigo: 'CC', nome: 'Ciência da Computação', duracao: 8, periodo: 'Integral', descricao: 'Bacharelado em Ciência da Computação', preco: 6000 }
];

// Dados iniciais de estudantes (com NIBs gerados)
const estudantesIniciais = [
    { 
        id: 1, 
        matricula: 'BM20260001', 
        nome: 'João Silva', 
        email: 'joao.silva@instituto.edu', 
        senha: 'joao123', 
        telefone: '+258 84 111 1111', 
        cursoId: 1, 
        dataNascimento: '2000-01-15', 
        endereco: 'Manica, Moçambique',
        status: 'Ativo',
        nib: '000100000032367542157001',
        dataCadastro: new Date().toISOString()
    },
    { 
        id: 2, 
        matricula: 'BM20260002', 
        nome: 'Maria Santos', 
        email: 'maria.santos@instituto.edu', 
        senha: 'maria123', 
        telefone: '+258 84 222 2222', 
        cursoId: 2, 
        dataNascimento: '2001-05-20', 
        endereco: 'Manica, Moçambique',
        status: 'Ativo',
        nib: '000100000032367542157002',
        dataCadastro: new Date().toISOString()
    },
    { 
        id: 3, 
        matricula: 'BM20260003', 
        nome: 'Pedro Costa', 
        email: 'pedro.costa@instituto.edu', 
        senha: 'pedro123', 
        telefone: '+258 84 333 3333', 
        cursoId: 1, 
        dataNascimento: '1999-12-10', 
        endereco: 'Manica, Moçambique',
        status: 'Ativo',
        nib: '000100000032367542157003',
        dataCadastro: new Date().toISOString()
    }
];

// Usuários padrão do sistema
const usuariosPadrao = [
    {
        id: 1,
        username: 'bmoises',
        password: 'bmoises123',
        nome: 'Braine Moises - Diretor',
        email: 'brainemoises@gmail.com',
        role: 'admin',
        criadoEm: new Date().toISOString()
    },
    {
        id: 2,
        username: 'admin',
        password: 'admin123',
        nome: 'Administrador do Sistema',
        email: 'admin@bm2.edu',
        role: 'admin',
        criadoEm: new Date().toISOString()
    },
    {
        id: 3,
        username: 'professor',
        password: 'professor123',
        nome: 'Professor Carlos Silva',
        email: 'professor@bm2.edu',
        role: 'professor',
        criadoEm: new Date().toISOString()
    }
];

// Função para gerar NIB único para cada estudante
function gerarNIB(estudanteId) {
    const nibMae = INSTITUICAO.nibMae;
    const idFormatado = String(estudanteId).padStart(3, '0');
    return nibMae + idFormatado;
}

// Função para gerar matrícula automática
function gerarMatricula() {
    const ano = new Date().getFullYear();
    const estudantes = getEstudantes();
    const sequencial = String(estudantes.length + 1).padStart(4, '0');
    return `BM${ano}${sequencial}`;
}

// Inicializar dados
function initData() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(usuariosPadrao));
    }
    if (!localStorage.getItem(ESTUDANTES_KEY)) {
        localStorage.setItem(ESTUDANTES_KEY, JSON.stringify(estudantesIniciais));
    }
    if (!localStorage.getItem(CURSOS_KEY)) {
        localStorage.setItem(CURSOS_KEY, JSON.stringify(cursosIniciais));
    }
    if (!localStorage.getItem(MATRICULAS_KEY)) {
        localStorage.setItem(MATRICULAS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(CONTEUDOS_KEY)) {
        localStorage.setItem(CONTEUDOS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(EXAMES_KEY)) {
        localStorage.setItem(EXAMES_KEY, JSON.stringify([]));
    }
}

// ============= LOGIN =============
function loginAdmin(username, password, rememberMe = false) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const session = {
            userId: user.id,
            username: user.username,
            nome: user.nome,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            localStorage.setItem(TIPO_USUARIO_KEY, user.role);
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            sessionStorage.setItem(TIPO_USUARIO_KEY, user.role);
        }
        return true;
    }
    return false;
}

function loginEstudante(email, matricula) {
    const estudantes = JSON.parse(localStorage.getItem(ESTUDANTES_KEY)) || [];
    const estudante = estudantes.find(e => e.email === email && e.matricula === matricula && e.status === 'Ativo');
    
    if (estudante) {
        // Verificar se está matriculado
        const matriculas = getMatriculas();
        const temMatricula = matriculas.some(m => m.estudanteId === estudante.id && m.status === 'Ativa');
        
        if (!temMatricula) {
            return false;
        }
        
        const session = {
            userId: estudante.id,
            nome: estudante.nome,
            email: estudante.email,
            matricula: estudante.matricula,
            cursoId: estudante.cursoId,
            role: 'estudante',
            loginTime: new Date().toISOString()
        };
        
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(TIPO_USUARIO_KEY, 'estudante');
        return true;
    }
    return false;
}

function isLoggedIn() {
    let session = sessionStorage.getItem(SESSION_KEY);
    if (session) return true;
    session = localStorage.getItem(SESSION_KEY);
    if (session) return true;
    return false;
}

function getCurrentUser() {
    let session = sessionStorage.getItem(SESSION_KEY);
    if (!session) session = localStorage.getItem(SESSION_KEY);
    if (session) return JSON.parse(session);
    return null;
}

function getTipoUsuario() {
    let tipo = sessionStorage.getItem(TIPO_USUARIO_KEY);
    if (!tipo) tipo = localStorage.getItem(TIPO_USUARIO_KEY);
    return tipo;
}

function fazerLogout() {
    sessionStorage.clear();
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TIPO_USUARIO_KEY);
    window.location.href = 'index.html';
}

function isAdmin() {
    const tipo = getTipoUsuario();
    return tipo === 'admin';
}

function isProfessor() {
    const tipo = getTipoUsuario();
    return tipo === 'admin' || tipo === 'professor';
}

function isEstudante() {
    const tipo = getTipoUsuario();
    return tipo === 'estudante';
}

// ============= CRUD ESTUDANTES =============
function getEstudantes() {
    return JSON.parse(localStorage.getItem(ESTUDANTES_KEY)) || [];
}

function saveEstudantes(estudantes) {
    localStorage.setItem(ESTUDANTES_KEY, JSON.stringify(estudantes));
}

function addEstudante(estudante) {
    const estudantes = getEstudantes();
    const novoId = Date.now();
    estudante.id = novoId;
    estudante.matricula = gerarMatricula();
    estudante.nib = gerarNIB(novoId);
    estudante.dataCadastro = new Date().toISOString();
    estudante.status = 'Ativo';
    estudantes.push(estudante);
    saveEstudantes(estudantes);
    return estudante;
}

function updateEstudante(id, dadosAtualizados) {
    const estudantes = getEstudantes();
    const index = estudantes.findIndex(e => e.id == id);
    if (index !== -1) {
        estudantes[index] = { ...estudantes[index], ...dadosAtualizados, id: estudantes[index].id };
        saveEstudantes(estudantes);
        return true;
    }
    return false;
}

function deleteEstudante(id) {
    const matriculas = getMatriculas();
    const temMatricula = matriculas.some(m => m.estudanteId == id);
    if (temMatricula) {
        alert('❌ Não é possível excluir estudante com matrículas ativas!');
        return false;
    }
    let estudantes = getEstudantes();
    estudantes = estudantes.filter(e => e.id != id);
    saveEstudantes(estudantes);
    return true;
}

function getEstudantePorId(id) {
    const estudantes = getEstudantes();
    return estudantes.find(e => e.id == id);
}

// ============= CRUD CURSOS =============
function getCursos() {
    return JSON.parse(localStorage.getItem(CURSOS_KEY)) || [];
}

function saveCursos(cursos) {
    localStorage.setItem(CURSOS_KEY, JSON.stringify(cursos));
}

function addCurso(curso) {
    const cursos = getCursos();
    curso.id = Date.now();
    cursos.push(curso);
    saveCursos(cursos);
    return curso;
}

function updateCurso(id, dadosAtualizados) {
    const cursos = getCursos();
    const index = cursos.findIndex(c => c.id == id);
    if (index !== -1) {
        cursos[index] = { ...cursos[index], ...dadosAtualizados };
        saveCursos(cursos);
        return true;
    }
    return false;
}

function deleteCurso(id) {
    const estudantes = getEstudantes();
    const temEstudante = estudantes.some(e => e.cursoId == id);
    if (temEstudante) {
        alert('❌ Não é possível excluir curso com estudantes vinculados!');
        return false;
    }
    let cursos = getCursos();
    cursos = cursos.filter(c => c.id != id);
    saveCursos(cursos);
    return true;
}

// ============= CRUD MATRÍCULAS =============
function getMatriculas() {
    return JSON.parse(localStorage.getItem(MATRICULAS_KEY)) || [];
}

function saveMatriculas(matriculas) {
    localStorage.setItem(MATRICULAS_KEY, JSON.stringify(matriculas));
}

function addMatricula(matricula) {
    const matriculas = getMatriculas();
    matricula.id = Date.now();
    matricula.dataMatricula = new Date().toISOString().split('T')[0];
    matricula.status = 'Ativa';
    matriculas.push(matricula);
    saveMatriculas(matriculas);
    
    // Atualizar curso do estudante
    const estudantes = getEstudantes();
    const estudanteIndex = estudantes.findIndex(e => e.id == matricula.estudanteId);
    if (estudanteIndex !== -1) {
        estudantes[estudanteIndex].cursoId = matricula.cursoId;
        saveEstudantes(estudantes);
    }
    return matricula;
}

function updateMatricula(id, dadosAtualizados) {
    const matriculas = getMatriculas();
    const index = matriculas.findIndex(m => m.id == id);
    if (index !== -1) {
        matriculas[index] = { ...matriculas[index], ...dadosAtualizados };
        saveMatriculas(matriculas);
        return true;
    }
    return false;
}

function deleteMatricula(id) {
    let matriculas = getMatriculas();
    matriculas = matriculas.filter(m => m.id != id);
    saveMatriculas(matriculas);
    return true;
}

// ============= CRUD CONTEÚDOS =============
function getConteudos() {
    return JSON.parse(localStorage.getItem(CONTEUDOS_KEY)) || [];
}

function saveConteudos(conteudos) {
    localStorage.setItem(CONTEUDOS_KEY, JSON.stringify(conteudos));
}

function addConteudo(conteudo) {
    const conteudos = getConteudos();
    conteudo.id = Date.now();
    conteudo.dataPublicacao = new Date().toISOString();
    conteudos.push(conteudo);
    saveConteudos(conteudos);
    return conteudo;
}

function updateConteudo(id, dadosAtualizados) {
    const conteudos = getConteudos();
    const index = conteudos.findIndex(c => c.id == id);
    if (index !== -1) {
        conteudos[index] = { ...conteudos[index], ...dadosAtualizados };
        saveConteudos(conteudos);
        return true;
    }
    return false;
}

function deleteConteudo(id) {
    let conteudos = getConteudos();
    conteudos = conteudos.filter(c => c.id != id);
    saveConteudos(conteudos);
    return true;
}

// ============= CRUD EXAMES =============
function getExames() {
    return JSON.parse(localStorage.getItem(EXAMES_KEY)) || [];
}

function saveExames(exames) {
    localStorage.setItem(EXAMES_KEY, JSON.stringify(exames));
}

function addExame(exame) {
    const exames = getExames();
    exame.id = Date.now();
    exame.dataCriacao = new Date().toISOString();
    exames.push(exame);
    saveExames(exames);
    return exame;
}

function updateExame(id, dadosAtualizados) {
    const exames = getExames();
    const index = exames.findIndex(e => e.id == id);
    if (index !== -1) {
        exames[index] = { ...exames[index], ...dadosAtualizados };
        saveExames(exames);
        return true;
    }
    return false;
}

function deleteExame(id) {
    let exames = getExames();
    exames = exames.filter(e => e.id != id);
    saveExames(exames);
    return true;
}

function getInstituicao() {
    return INSTITUICAO;
}

// Inicializar
initData();