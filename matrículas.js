// Desenvolvido por Braine Moisés - Instituto BM²

function carregarMatriculas() {
    const matriculas = getMatriculas();
    const searchTerm = document.getElementById('searchMatricula')?.value.toLowerCase() || '';
    const estudantes = getEstudantes();
    const cursos = getCursos();
    
    let filtered = matriculas;
    if (searchTerm) {
        filtered = matriculas.filter(m => {
            const estudante = estudantes.find(e => e.id == m.estudanteId);
            return estudante && estudante.nome.toLowerCase().includes(searchTerm);
        });
    }
    
    const tbody = document.getElementById('listaMatriculas');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhuma matrícula encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(m => {
        const estudante = estudantes.find(e => e.id == m.estudanteId);
        const curso = cursos.find(c => c.id == m.cursoId);
        
        let statusClass = '';
        if (m.status === 'Ativa') statusClass = 'bg-success';
        else if (m.status === 'Trancada') statusClass = 'bg-warning';
        else if (m.status === 'Concluída') statusClass = 'bg-info';
        else statusClass = 'bg-danger';
        
        return `
            <tr>
                <td>${m.id}</td>
                <td><strong>${estudante ? estudante.nome : '-'}</strong><br><small class="text-muted">${estudante ? estudante.matricula : ''}</small></td>
                <td>${curso ? curso.nome : '-'}</td>
                <td>${m.dataMatricula || '-'}</td>
                <td>${m.anoLetivo}/${m.semestre}</td>
                <td><span class="badge ${statusClass}">${m.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarMatricula(${m.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="excluirMatricula(${m.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function carregarSelects() {
    const estudantes = getEstudantes();
    const cursos = getCursos();
    
    const selectEstudante = document.getElementById('estudanteId');
    selectEstudante.innerHTML = '<option value="">Selecione um estudante...</option>' + 
        estudantes.filter(e => e.status === 'Ativo').map(e => `<option value="${e.id}">${e.matricula} - ${e.nome}</option>`).join('');
    
    const selectCurso = document.getElementById('cursoMatriculaId');
    selectCurso.innerHTML = '<option value="">Selecione um curso...</option>' + 
        cursos.map(c => `<option value="${c.id}">${c.codigo} - ${c.nome} (MZN ${(c.preco || 10000).toLocaleString()}/mês)</option>`).join('');
}

function validarMatricula() {
    const estudanteId = document.getElementById('estudanteId').value;
    const cursoId = document.getElementById('cursoMatriculaId').value;
    const anoLetivo = document.getElementById('anoLetivo').value;
    
    if (!estudanteId) { alert('❌ Selecione um estudante!'); return false; }
    if (!cursoId) { alert('❌ Selecione um curso!'); return false; }
    if (!anoLetivo || anoLetivo < 2020) { alert('❌ Ano letivo inválido!'); return false; }
    return true;
}

function salvarMatricula() {
    if (!validarMatricula()) return;
    
    const matricula = {
        estudanteId: parseInt(document.getElementById('estudanteId').value),
        cursoId: parseInt(document.getElementById('cursoMatriculaId').value),
        anoLetivo: parseInt(document.getElementById('anoLetivo').value),
        semestre: parseInt(document.getElementById('semestre').value),
        status: document.getElementById('statusMatricula').value
    };
    
    const id = document.getElementById('matriculaId').value;
    const estudante = getEstudantes().find(e => e.id == matricula.estudanteId);
    
    if (id) {
        updateMatricula(id, matricula);
        alert('✅ Matrícula atualizada com sucesso!');
    } else {
        addMatricula(matricula);
        alert(`✅ Matrícula realizada com sucesso!\n\nEstudante: ${estudante ? estudante.nome : ''}\nNIB para pagamento: ${estudante ? estudante.nib : 'N/A'}\n\nUtilize o NIB do estudante para fazer depósitos.`);
    }
    
    fecharModalMatricula();
    carregarMatriculas();
    if (typeof atualizarDashboard === 'function') atualizarDashboard();
}

function editarMatricula(id) {
    const matricula = getMatriculas().find(m => m.id == id);
    if (matricula) {
        document.getElementById('matriculaId').value = matricula.id;
        document.getElementById('estudanteId').value = matricula.estudanteId;
        document.getElementById('cursoMatriculaId').value = matricula.cursoId;
        document.getElementById('anoLetivo').value = matricula.anoLetivo;
        document.getElementById('semestre').value = matricula.semestre;
        document.getElementById('statusMatricula').value = matricula.status;
        
        new bootstrap.Modal(document.getElementById('matriculaModal')).show();
    }
}

function excluirMatricula(id) {
    if (confirm('⚠️ Tem certeza que deseja excluir esta matrícula?')) {
        deleteMatricula(id);
        carregarMatriculas();
        if (typeof atualizarDashboard === 'function') atualizarDashboard();
        alert('✅ Matrícula excluída com sucesso!');
    }
}

function abrirModalCadastroMatricula() {
    document.getElementById('matriculaForm').reset();
    document.getElementById('matriculaId').value = '';
    document.getElementById('anoLetivo').value = new Date().getFullYear();
    carregarSelects();
}

function fecharModalMatricula() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('matriculaModal'));
    if (modal) modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarMatriculas();
    if (document.getElementById('searchMatricula')) {
        document.getElementById('searchMatricula').addEventListener('keyup', carregarMatriculas);
    }
});