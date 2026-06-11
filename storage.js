// ============================================
// SISTEMA DE GESTÃO ACADÊMICA - INSTITUTO BM²
// Desenvolvido por: Braine Moises
// Localização: Manica, Moçambique
// Email: brainemoises@gmail.com
// NIB: 000100000032367542157 (Banco BIM)
// ============================================

// ============= CHAVES DO LOCALSTORAGE =============
const USERS_KEY = 'sistema_usuarios_bm2';
const ESTUDANTES_KEY = 'gestao_estudantes_bm2';
const CURSOS_KEY = 'gestao_cursos_bm2';
const MATRICULAS_KEY = 'gestao_matriculas_bm2';
const CONTEUDOS_KEY = 'gestao_conteudos_bm2';
const EXAMES_KEY = 'gestao_exames_bm2';
const NOTAS_KEY = 'notas_bm2';
const EVENTOS_KEY = 'eventos_calendario_bm2';

// ============= INFORMAÇÕES DA INSTITUIÇÃO =============
const INSTITUICAO = {
    nome: 'Instituto de Ciências e Tecnologia - Mentes Limpas (BM²)',
    localizacao: 'Manica, Moçambique',
    fundador: 'Residente de Manica',
    nibMae: '000100000032367542157',
    banco: 'BIM - Banco de Moçambique',
    email: 'brainemoises@gmail.com',
    telefone: '+258 84 000 0000'
};

// ============= DADOS INICIAIS =============

// Cursos Iniciais
const cursosIniciais = [
    { id: 1, codigo: 'SI', nome: 'Sistemas de Informação', duracao: 8, periodo: 'Noturno', descricao: 'Bacharelado em Sistemas de Informação', preco: 12500 },
    { id: 2, codigo: 'ADS', nome: 'Análise e Desenvolvimento de Sistemas', duracao: 5, periodo: 'Noturno', descricao: 'Tecnólogo em ADS', preco: 10800 },
    { id: 3, codigo: 'CC', nome: 'Ciência da Computação', duracao: 8, periodo: 'Integral', descricao: 'Bacharelado em Ciência da Computação', preco: 15000 }
];

// Estudantes Iniciais (com NIBs gerados)
const estudantesIniciais = [
    { 
        id: 1, 
        matricula: 'BM20240001', 
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
        matricula: 'BM20240002', 
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
        matricula: 'BM20240003', 
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

// Usuários do Sistema
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

// Matrículas Iniciais
const matriculasIniciais = [];

// Conteúdos Iniciais
const conteudosIniciais = [];

// Exames Iniciais
const examesIniciais = [];

// Notas Iniciais
const notasIniciais = {};

// Eventos do Calendário
const eventosIniciais = [
    { id: 1, title: 'Início das Aulas', date: '2024-02-01', type: 'evento' },
    { id: 2, title: 'Feriado - Carnaval', date: '2024-02-12', type: 'feriado' },
    { id: 3, title: 'Provas 1º Bimestre', date: '2024-03-25', type: 'prova' },
    { id: 4, title: 'Feriado - Tiradentes', date: '2024-04-21', type: 'feriado' },
    { id: 5, title: 'Provas 2º Bimestre', date: '2024-05-20', type: 'prova' },
    { id: 6, title: 'Fim do 1º Semestre', date: '2024-06-30', type: 'evento' },
    { id: 7, title: 'Início do 2º Semestre', date: '2024-08-01', type: 'evento' },
    { id: 8, title: 'Provas 3º Bimestre', date: '2024-10-15', type: 'prova' },
    { id: 9, title: 'Provas 4º Bimestre', date: '2024-11-25', type: 'prova' },
    { id: 10, title: 'Matrículas 2025', date: '2024-11-15', type: 'matricula' }
];

// ============= FUNÇÕES AUXILIARES =============

// Gerar NIB único para cada estudante
function gerarNIB(estudanteId) {
    const nibMae = INSTITUICAO.nibMae;
    const idFormatado = String(estudanteId).padStart(3, '0');
    return nibMae + idFormatado;
}

// Gerar matrícula automática
function gerarMatricula() {
    const ano = new Date().getFullYear();
    const estudantes = getEstudantes();
    const sequencial = String(estudantes.length + 1).padStart(4, '0');
    return `BM${ano}${sequencial}`;
}

// Inicializar todos os dados
function initData() {
    // Usuários
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(usuariosPadrao));
        console.log('✅ Usuários inicializados');
    }
    
    // Cursos
    if (!localStorage.getItem(CURSOS_KEY)) {
        localStorage.setItem(CURSOS_KEY, JSON.stringify(cursosIniciais));
        console.log('✅ Cursos inicializados');
    }
    
    // Estudantes
    if (!localStorage.getItem(ESTUDANTES_KEY)) {
        localStorage.setItem(ESTUDANTES_KEY, JSON.stringify(estudantesIniciais));
        console.log('✅ Estudantes inicializados');
    }
    
    // Matrículas
    if (!localStorage.getItem(MATRICULAS_KEY)) {
        localStorage.setItem(MATRICULAS_KEY, JSON.stringify(matriculasIniciais));
        console.log('✅ Matrículas inicializadas');
    }
    
    // Conteúdos
    if (!localStorage.getItem(CONTEUDOS_KEY)) {
        localStorage.setItem(CONTEUDOS_KEY, JSON.stringify(conteudosIniciais));
        console.log('✅ Conteúdos inicializados');
    }
    
    // Exames
    if (!localStorage.getItem(EXAMES_KEY)) {
        localStorage.setItem(EXAMES_KEY, JSON.stringify(examesIniciais));
        console.log('✅ Exames inicializados');
    }
    
    // Notas
    if (!localStorage.getItem(NOTAS_KEY)) {
        localStorage.setItem(NOTAS_KEY, JSON.stringify(notasIniciais));
        console.log('✅ Notas inicializadas');
    }
    
    // Eventos
    if (!localStorage.getItem(EVENTOS_KEY)) {
        localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventosIniciais));
        console.log('✅ Calendário inicializado');
    }
    
    console.log('🎓 Sistema BM² inicializado com sucesso!');
}

// ============= CRUD ESTUDANTES =============
function getEstudantes() {
    const data = localStorage.getItem(ESTUDANTES_KEY);
    return data ? JSON.parse(data) : [];
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

function getEstudantePorEmail(email) {
    const estudantes = getEstudantes();
    return estudantes.find(e => e.email === email);
}

// ============= CRUD CURSOS =============
function getCursos() {
    const data = localStorage.getItem(CURSOS_KEY);
    return data ? JSON.parse(data) : [];
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

function getCursoPorId(id) {
    const cursos = getCursos();
    return cursos.find(c => c.id == id);
}

// ============= CRUD MATRÍCULAS =============
function getMatriculas() {
    const data = localStorage.getItem(MATRICULAS_KEY);
    return data ? JSON.parse(data) : [];
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

function getMatriculasPorEstudante(estudanteId) {
    const matriculas = getMatriculas();
    return matriculas.filter(m => m.estudanteId == estudanteId);
}

// ============= CRUD CONTEÚDOS =============
function getConteudos() {
    const data = localStorage.getItem(CONTEUDOS_KEY);
    return data ? JSON.parse(data) : [];
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
    const data = localStorage.getItem(EXAMES_KEY);
    return data ? JSON.parse(data) : [];
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

function getExamePorId(id) {
    const exames = getExames();
    return exames.find(e => e.id == id);
}

// ============= CRUD NOTAS =============
function getNotas() {
    const data = localStorage.getItem(NOTAS_KEY);
    return data ? JSON.parse(data) : {};
}

function saveNotas(notas) {
    localStorage.setItem(NOTAS_KEY, JSON.stringify(notas));
}

function getNotasEstudante(estudanteId, disciplina) {
    const notas = getNotas();
    const key = `${estudanteId}_${disciplina}`;
    return notas[key] || { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
}

function salvarNota(estudanteId, disciplina, bimestre, valor) {
    const notas = getNotas();
    const key = `${estudanteId}_${disciplina}`;
    if (!notas[key]) {
        notas[key] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
    }
    notas[key][`b${bimestre}`] = parseFloat(valor) || 0;
    saveNotas(notas);
}

function salvarFaltas(estudanteId, disciplina, faltas) {
    const notas = getNotas();
    const key = `${estudanteId}_${disciplina}`;
    if (!notas[key]) {
        notas[key] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
    }
    notas[key].faltas = parseInt(faltas) || 0;
    saveNotas(notas);
}

// ============= CRUD CALENDÁRIO =============
function getEventos() {
    const data = localStorage.getItem(EVENTOS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveEventos(eventos) {
    localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));
}

function addEvento(evento) {
    const eventos = getEventos();
    evento.id = Date.now();
    eventos.push(evento);
    saveEventos(eventos);
    return evento;
}

function deleteEvento(id) {
    let eventos = getEventos();
    eventos = eventos.filter(e => e.id != id);
    saveEventos(eventos);
}

// ============= ESTATÍSTICAS =============
function getEstatisticas() {
    const estudantes = getEstudantes();
    const cursos = getCursos();
    const matriculas = getMatriculas();
    const conteudos = getConteudos();
    const exames = getExames();
    
    return {
        totalEstudantes: estudantes.length,
        totalCursos: cursos.length,
        totalMatriculasAtivas: matriculas.filter(m => m.status === 'Ativa').length,
        totalConteudos: conteudos.length,
        totalExames: exames.length,
        estudantesPorCurso: cursos.map(curso => ({
            curso: curso.nome,
            quantidade: estudantes.filter(e => e.cursoId === curso.id).length
        }))
    };
}

// ============= INFORMAÇÕES DA INSTITUIÇÃO =============
function getInstituicao() {
    return INSTITUICAO;
}

// ============= BACKUP E RESTORE =============
function fazerBackup() {
    const backup = {
        usuarios: localStorage.getItem(USERS_KEY),
        estudantes: localStorage.getItem(ESTUDANTES_KEY),
        cursos: localStorage.getItem(CURSOS_KEY),
        matriculas: localStorage.getItem(MATRICULAS_KEY),
        conteudos: localStorage.getItem(CONTEUDOS_KEY),
        exames: localStorage.getItem(EXAMES_KEY),
        notas: localStorage.getItem(NOTAS_KEY),
        eventos: localStorage.getItem(EVENTOS_KEY),
        dataBackup: new Date().toISOString()
    };
    
    const backupStr = JSON.stringify(backup);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_bm2_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    alert('✅ Backup realizado com sucesso!');
}

function restaurarBackup(arquivo) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            if (backup.usuarios) localStorage.setItem(USERS_KEY, backup.usuarios);
            if (backup.estudantes) localStorage.setItem(ESTUDANTES_KEY, backup.estudantes);
            if (backup.cursos) localStorage.setItem(CURSOS_KEY, backup.cursos);
            if (backup.matriculas) localStorage.setItem(MATRICULAS_KEY, backup.matriculas);
            if (backup.conteudos) localStorage.setItem(CONTEUDOS_KEY, backup.conteudos);
            if (backup.exames) localStorage.setItem(EXAMES_KEY, backup.exames);
            if (backup.notas) localStorage.setItem(NOTAS_KEY, backup.notas);
            if (backup.eventos) localStorage.setItem(EVENTOS_KEY, backup.eventos);
            alert('✅ Restauro realizado com sucesso! Recarregue a página.');
            location.reload();
        } catch (error) {
            alert('❌ Erro ao restaurar backup! Arquivo inválido.');
        }
    };
    reader.readAsText(arquivo);
}

function limparTodosDados() {
    if (confirm('⚠️ ATENÇÃO! Isso irá apagar TODOS os dados do sistema. Esta ação não pode ser desfeita. Tem certeza?')) {
        if (confirm('⚠️ ÚLTIMO AVISO! Digite "CONFIRMAR" para prosseguir:')) {
            localStorage.removeItem(USERS_KEY);
            localStorage.removeItem(ESTUDANTES_KEY);
            localStorage.removeItem(CURSOS_KEY);
            localStorage.removeItem(MATRICULAS_KEY);
            localStorage.removeItem(CONTEUDOS_KEY);
            localStorage.removeItem(EXAMES_KEY);
            localStorage.removeItem(NOTAS_KEY);
            localStorage.removeItem(EVENTOS_KEY);
            initData();
            alert('✅ Todos os dados foram limpos e reinicializados!');
            location.reload();
        }
    }
}

// ============= EXPORTAÇÃO DAS FUNÇÕES =============
// Inicializar o sistema
initData();

// Log de inicialização
console.log('=' .repeat(50));
console.log('🎓 SISTEMA BM² CARREGADO COM SUCESSO!');
console.log('📍 Localização: Manica, Moçambique');
console.log('🏦 NIB: 000100000032367542157 (BIM)');
console.log('📧 Email: brainemoises@gmail.com');
console.log('👨‍💼 Admin: bmoises / bmoises123');
console.log('=' .repeat(50));