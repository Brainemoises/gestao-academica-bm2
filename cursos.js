// Desenvolvido por Braine Moisés - Instituto BM²

function carregarCursos() {
    const cursos = getCursos();
    const searchTerm = document.getElementById('searchCurso')?.value.toLowerCase() || '';
    const estudantes = getEstudantes();
    
    let filtered = cursos;
    if (searchTerm) {
        filtered = cursos.filter(c => 
            c.nome.toLowerCase().includes(searchTerm) || 
            c.codigo.toLowerCase().includes(searchTerm)
        );
    }
    
    const tbody = document.getElementById('listaCursos');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum curso encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(c => {
        const qtdEstudantes = estudantes.filter(e => e.cursoId == c.id).length;
        return `
            <tr>
                <td>${c.id}</td>
                <td><strong>${c.codigo}</strong></td>
                <td>${c.nome}</td>
                <td>${c.duracao} semestres</td>
                <td>${c.periodo}</td>
                <td><span class="badge bg-success">MZN ${(c.preco || 10000).toLocaleString()}</span></td>
                <td><span class="badge bg-info">${qtdEstudantes}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarCurso(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="excluirCurso(${c.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function validarCurso() {
    const codigo = document.getElementById('codigo').value.trim();
    const nome = document.getElementById('nomeCurso').value.trim();
    const duracao = document.getElementById('duracao').value;
    
    if (!codigo) { alert('❌ Código do curso é obrigatório!'); return false; }
    if (!nome) { alert('❌ Nome do curso é obrigatório!'); return false; }
    if (!duracao || duracao < 1) { alert('❌ Duração inválida!'); return false; }
    return true;
}

function salvarCurso() {
    if (!validarCurso()) return;
    
    const curso = {
        codigo: document.getElementById('codigo').value.trim().toUpperCase(),
        nome: document.getElementById('nomeCurso').value.trim(),
        duracao: parseInt(document.getElementById('duracao').value),
        periodo: document.getElementById('periodo').value,
        descricao: document.getElementById('descricaoCurso').value.trim(),
        preco: parseInt(document.getElementById('preco').value) || 10000
    };
    
    const id = document.getElementById('cursoId').value;
    if (id) {
        updateCurso(id, curso);
        alert('✅ Curso atualizado com sucesso!');
    } else {
        addCurso(curso);
        alert('✅ Curso cadastrado com sucesso!');
    }
    
    fecharModalCurso();
    carregarCursos();
    if (typeof atualizarDashboard === 'function') atualizarDashboard();
}

function editarCurso(id) {
    const curso = getCursos().find(c => c.id == id);
    if (curso) {
        document.getElementById('cursoId').value = curso.id;
        document.getElementById('codigo').value = curso.codigo;
        document.getElementById('nomeCurso').value = curso.nome;
        document.getElementById('duracao').value = curso.duracao;
        document.getElementById('periodo').value = curso.periodo;
        document.getElementById('descricaoCurso').value = curso.descricao || '';
        document.getElementById('preco').value = curso.preco || 10000;
        
        new bootstrap.Modal(document.getElementById('cursoModal')).show();
    }
}

function excluirCurso(id) {
    if (confirm('⚠️ Tem certeza que deseja excluir este curso?')) {
        if (deleteCurso(id)) {
            carregarCursos();
            if (typeof atualizarDashboard === 'function') atualizarDashboard();
            alert('✅ Curso excluído com sucesso!');
        }
    }
}

function abrirModalCadastroCurso() {
    document.getElementById('cursoForm').reset();
    document.getElementById('cursoId').value = '';
    document.getElementById('preco').value = '10000';
}

function fecharModalCurso() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cursoModal'));
    if (modal) modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCursos();
    if (document.getElementById('searchCurso')) {
        document.getElementById('searchCurso').addEventListener('keyup', carregarCursos);
    }
});