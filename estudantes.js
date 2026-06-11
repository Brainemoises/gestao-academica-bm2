// Desenvolvido por Braine Moisés - Instituto BM²
// Localização: Manica

function carregarEstudantes() {
    const estudantes = getEstudantes();
    const searchTerm = document.getElementById('searchEstudante')?.value.toLowerCase() || '';
    const cursos = getCursos();
    
    let filtered = estudantes;
    if (searchTerm) {
        filtered = estudantes.filter(e => 
            e.nome.toLowerCase().includes(searchTerm) || 
            e.matricula.toLowerCase().includes(searchTerm) ||
            e.email.toLowerCase().includes(searchTerm) ||
            (e.nib && e.nib.toLowerCase().includes(searchTerm))
        );
    }
    
    const tbody = document.getElementById('listaEstudantes');
    if (filtered.length === 0) {
        tbody.innerHTML = ' hilab<td colspan="8" class="text-center">Nenhum estudante encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(e => {
        const curso = cursos.find(c => c.id == e.cursoId);
        return `
            <tr>
                <td>${e.id}</td>
                <td><strong>${e.matricula}</strong></td>
                <td>${e.nome}</td>
                <td>${e.email}</td>
                <td>${e.telefone || '-'}</td>
                <td><span class="badge bg-info">${curso ? curso.nome : '-'}</span></td>
                <td><small class="text-muted">${e.nib || 'Não gerado'}</small></td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="verNIB(${e.id})" title="Ver NIB">
                        <i class="fas fa-credit-card"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarEstudante(${e.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirEstudante(${e.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function verNIB(id) {
    const estudante = getEstudantePorId(id);
    const instituicao = getInstituicao();
    if (estudante) {
        const curso = getCursos().find(c => c.id == estudante.cursoId);
        const modalContent = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5><i class="fas fa-credit-card"></i> Informações Bancárias</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="fas fa-university"></i> <strong>${instituicao.nome}</strong><br>
                        <i class="fas fa-map-marker-alt"></i> ${instituicao.localizacao}<br>
                        <i class="fas fa-user-tie"></i> Fundador: ${instituicao.fundador}
                    </div>
                    <table class="table table-bordered">
                        <tr><th>Estudante:</th><td>${estudante.nome}</td></tr>
                        <tr><th>Matrícula:</th><td>${estudante.matricula}</td></tr>
                        <tr><th>Curso:</th><td>${curso ? curso.nome : '-'}</td></tr>
                        <tr><th>NIB do Estudante:</th><td><code class="bg-light p-2">${estudante.nib}</code></td></tr>
                        <tr class="table-warning"><th>NIB Mãe (Instituição):</th><td><code class="bg-warning p-2">${instituicao.nibMae}</code></td></tr>
                        <tr><th>Banco:</th><td>${instituicao.banco}</td></tr>
                    </table>
                    <div class="alert alert-success">
                        <i class="fas fa-info-circle"></i> 
                        <strong>Como funciona o NIB:</strong><br>
                        O NIB do estudante é vinculado ao NIB mãe da instituição. 
                        Quando o estudante deposita no seu NIB, o valor é direcionado automaticamente 
                        para a conta da instituição. Utilize o NIB do estudante para fazer pagamentos 
                        de mensalidades e taxas.
                    </div>
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Importante:</strong> O depósito deve ser feito no NIB do estudante.
                        O sistema identifica automaticamente o estudante pelo NIB gerado.
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="copiarNIB('${estudante.nib}')">
                        <i class="fas fa-copy"></i> Copiar NIB
                    </button>
                    <button class="btn btn-primary" onclick="emitirComprovante(${estudante.id})">
                        <i class="fas fa-print"></i> Emitir Comprovante
                    </button>
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div>
            </div>
        `;
        
        // Criar modal dinâmico
        const modalHtml = `
            <div class="modal fade" id="nibModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${modalContent}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente se houver
        const existingModal = document.getElementById('nibModal');
        if (existingModal) existingModal.remove();
        
        // Adicionar e mostrar modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('nibModal'));
        modal.show();
        
        // Remover ao fechar
        document.getElementById('nibModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
}

function copiarNIB(nib) {
    navigator.clipboard.writeText(nib);
    alert('✅ NIB copiado com sucesso!\n\nNIB: ' + nib + '\n\nUse este NIB para fazer depósitos. O valor será direcionado para a conta da instituição.');
}

function emitirComprovante(id) {
    const estudante = getEstudantePorId(id);
    const instituicao = getInstituicao();
    const curso = getCursos().find(c => c.id == estudante.cursoId);
    
    const comprovante = `
        ========================================
        INSTITUTO DE CIÊNCIAS E TECNOLOGIA
        MENTES LIMPAS (BM²)
        Localização: ${instituicao.localizacao}
        Fundador: ${instituicao.fundador}
        ========================================
        
        COMPROVANTE DE REGISTO DE ESTUDANTE
        
        Nome: ${estudante.nome}
        Matrícula: ${estudante.matricula}
        Email: ${estudante.email}
        Curso: ${curso ? curso.nome : '-'}
        Data de Cadastro: ${new Date(estudante.dataCadastro).toLocaleDateString('pt-BR')}
        
        INFORMAÇÕES BANCÁRIAS:
        NIB do Estudante: ${estudante.nib}
        NIB da Instituição: ${instituicao.nibMae}
        Banco: ${instituicao.banco}
        
        Instruções de Pagamento:
        1. Utilize o NIB do estudante para fazer depósitos
        2. O valor será creditado na conta da instituição
        3. O sistema identifica o estudante pelo NIB
        4. Guarde este comprovante para referência
        
        ========================================
        Documento emitido em: ${new Date().toLocaleString('pt-BR')}
        Assinatura: _____________________
        ========================================
    `;
    
    // Criar blob e download
    const blob = new Blob([comprovante], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comprovante_${estudante.matricula}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    alert('✅ Comprovante gerado com sucesso!');
}

function carregarCursosSelect() {
    const select = document.getElementById('cursoId');
    const cursos = getCursos();
    select.innerHTML = '<option value="">Selecione um curso...</option>' + 
        cursos.map(c => `<option value="${c.id}">${c.nome} - ${c.periodo} (MZN ${c.preco}/mês)</option>`).join('');
}

function validarEstudante() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cursoId = document.getElementById('cursoId').value;
    
    if (!nome) { alert('❌ Nome é obrigatório!'); return false; }
    if (!email) { alert('❌ Email é obrigatório!'); return false; }
    if (!email.includes('@')) { alert('❌ Email inválido!'); return false; }
    if (!cursoId) { alert('❌ Selecione um curso!'); return false; }
    return true;
}

function salvarEstudante() {
    if (!validarEstudante()) return;
    
    const estudante = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cursoId: parseInt(document.getElementById('cursoId').value),
        dataNascimento: document.getElementById('dataNascimento').value,
        endereco: document.getElementById('endereco').value.trim(),
        senha: document.getElementById('senha').value.trim() || Math.random().toString(36).substring(2, 8)
    };
    
    const id = document.getElementById('estudanteId').value;
    if (id) {
        updateEstudante(id, estudante);
        alert('✅ Estudante atualizado com sucesso!');
    } else {
        const novoEstudante = addEstudante(estudante);
        alert(`✅ Estudante cadastrado com sucesso!\n\nMatrícula: ${novoEstudante.matricula}\nNIB: ${novoEstudante.nib}\n\nGuarde estas informações para acesso do estudante.`);
    }
    
    fecharModal();
    carregarEstudantes();
    if (typeof atualizarDashboard === 'function') atualizarDashboard();
}

function editarEstudante(id) {
    const estudante = getEstudantes().find(e => e.id == id);
    if (estudante) {
        document.getElementById('estudanteId').value = estudante.id;
        document.getElementById('nome').value = estudante.nome;
        document.getElementById('email').value = estudante.email;
        document.getElementById('telefone').value = estudante.telefone || '';
        document.getElementById('cursoId').value = estudante.cursoId;
        document.getElementById('dataNascimento').value = estudante.dataNascimento || '';
        document.getElementById('endereco').value = estudante.endereco || '';
        document.getElementById('senha').value = estudante.senha || '';
        document.getElementById('modalTitle').textContent = 'Editar Estudante';
        
        new bootstrap.Modal(document.getElementById('estudanteModal')).show();
    }
}

function excluirEstudante(id) {
    if (confirm('⚠️ Tem certeza que deseja excluir este estudante?')) {
        if (deleteEstudante(id)) {
            carregarEstudantes();
            if (typeof atualizarDashboard === 'function') atualizarDashboard();
            alert('✅ Estudante excluído com sucesso!');
        }
    }
}

function abrirModalCadastro() {
    document.getElementById('estudanteForm').reset();
    document.getElementById('estudanteId').value = '';
    document.getElementById('modalTitle').textContent = 'Cadastrar Estudante';
    carregarCursosSelect();
    
    // Adicionar campo de senha no modal
    const senhaField = document.getElementById('senha');
    if (senhaField) {
        senhaField.value = Math.random().toString(36).substring(2, 8);
    }
}

function fecharModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('estudanteModal'));
    if (modal) modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarEstudantes();
    if (document.getElementById('searchEstudante')) {
        document.getElementById('searchEstudante').addEventListener('keyup', carregarEstudantes);
    }
});