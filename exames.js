// Desenvolvido por Braine Moisés - Instituto BM²

let questoesTemp = [];

function carregarExames() {
    const exames = getExames();
    const cursos = getCursos();
    const container = document.getElementById('listaExames');
    
    if (exames.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum exame criado ainda.</div></div>';
        return;
    }
    
    container.innerHTML = exames.map(e => {
        const curso = cursos.find(c => c.id == e.cursoId);
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-header bg-primary text-white">
                        <i class="fas fa-tasks"></i> ${e.titulo}
                    </div>
                    <div class="card-body">
                        ${curso ? `<p class="text-muted"><i class="fas fa-book"></i> ${curso.nome}</p>` : ''}
                        <p>${e.descricao || 'Sem descrição'}</p>
                        <p><strong>Questões:</strong> ${e.questoes ? e.questoes.length : 0}</p>
                        <p><strong>Nota Máxima:</strong> ${e.notaMaxima}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-sm" onclick="realizarExame(${e.id})"><i class="fas fa-play"></i> Realizar</button>
                        ${!isEstudante() ? `<button class="btn btn-warning btn-sm" onclick="editarExame(${e.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="excluirExame(${e.id})"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function carregarCursosExame() {
    const cursos = getCursos();
    const select = document.getElementById('cursoExameId');
    select.innerHTML = '<option value="">Selecione um curso...</option>' + 
        cursos.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

function adicionarQuestao() {
    const questaoDiv = document.createElement('div');
    questaoDiv.className = 'card mb-2 p-3';
    questaoDiv.innerHTML = `
        <div class="row">
            <div class="col-12">
                <input type="text" class="form-control mb-2" placeholder="Enunciado da questão" id="questaoEnunciado_${questoesTemp.length}">
            </div>
            <div class="col-6">
                <input type="text" class="form-control mb-1" placeholder="Opção A" id="questaoOpcaoA_${questoesTemp.length}">
            </div>
            <div class="col-6">
                <input type="text" class="form-control mb-1" placeholder="Opção B" id="questaoOpcaoB_${questoesTemp.length}">
            </div>
            <div class="col-6">
                <input type="text" class="form-control mb-1" placeholder="Opção C" id="questaoOpcaoC_${questoesTemp.length}">
            </div>
            <div class="col-6">
                <input type="text" class="form-control mb-1" placeholder="Opção D" id="questaoOpcaoD_${questoesTemp.length}">
            </div>
            <div class="col-12 mt-2">
                <label>Resposta Correta:</label>
                <select class="form-control" id="questaoCorreta_${questoesTemp.length}">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>
            </div>
            <div class="col-12 mt-2">
                <label>Valor da Questão:</label>
                <input type="number" class="form-control" id="questaoValor_${questoesTemp.length}" value="1" step="0.5">
            </div>
        </div>
    `;
    document.getElementById('listaQuestoes').appendChild(questaoDiv);
    questoesTemp.push({ id: questoesTemp.length });
}

function salvarExame() {
    const titulo = document.getElementById('tituloExame').value.trim();
    const cursoId = document.getElementById('cursoExameId').value;
    const descricao = document.getElementById('descricaoExame').value.trim();
    const notaMaxima = parseFloat(document.getElementById('notaMaxima').value);
    
    if (!titulo) { alert('❌ Título do exame é obrigatório!'); return; }
    if (!cursoId) { alert('❌ Selecione um curso!'); return; }
    
    const questoes = [];
    for (let i = 0; i < questoesTemp.length; i++) {
        const enunciado = document.getElementById(`questaoEnunciado_${i}`)?.value;
        if (enunciado) {
            questoes.push({
                enunciado: enunciado,
                opcoes: {
                    A: document.getElementById(`questaoOpcaoA_${i}`)?.value || '',
                    B: document.getElementById(`questaoOpcaoB_${i}`)?.value || '',
                    C: document.getElementById(`questaoOpcaoC_${i}`)?.value || '',
                    D: document.getElementById(`questaoOpcaoD_${i}`)?.value || ''
                },
                correta: document.getElementById(`questaoCorreta_${i}`)?.value || 'A',
                valor: parseFloat(document.getElementById(`questaoValor_${i}`)?.value) || 1
            });
        }
    }
    
    const exame = {
        titulo: titulo,
        cursoId: parseInt(cursoId),
        descricao: descricao,
        notaMaxima: notaMaxima,
        questoes: questoes,
        dataCriacao: new Date().toISOString()
    };
    
    const id = document.getElementById('exameId').value;
    if (id) {
        updateExame(id, exame);
        alert('✅ Exame atualizado com sucesso!');
    } else {
        addExame(exame);
        alert('✅ Exame criado com sucesso!');
    }
    
    fecharModalExame();
    carregarExames();
}

function realizarExame(id) {
    const exame = getExames().find(e => e.id == id);
    if (!exame) return;
    
    let html = `<h4>${exame.titulo}</h4><p>${exame.descricao || ''}</p><hr>`;
    exame.questoes.forEach((q, idx) => {
        html += `
            <div class="card mb-3 p-3">
                <p><strong>Questão ${idx + 1}:</strong> ${q.enunciado}</p>
                <div class="form-check"><input class="form-check-input" type="radio" name="q${idx}" value="A" id="q${idx}A"><label class="form-check-label">A) ${q.opcoes.A}</label></div>
                <div class="form-check"><input class="form-check-input" type="radio" name="q${idx}" value="B" id="q${idx}B"><label class="form-check-label">B) ${q.opcoes.B}</label></div>
                <div class="form-check"><input class="form-check-input" type="radio" name="q${idx}" value="C" id="q${idx}C"><label class="form-check-label">C) ${q.opcoes.C}</label></div>
                <div class="form-check"><input class="form-check-input" type="radio" name="q${idx}" value="D" id="q${idx}D"><label class="form-check-label">D) ${q.opcoes.D}</label></div>
                <p class="mt-2 text-muted">Valor: ${q.valor} ponto(s)</p>
            </div>
        `;
    });
    
    document.getElementById('realizarExameBody').innerHTML = html;
    window.exameAtual = exame;
    new bootstrap.Modal(document.getElementById('realizarExameModal')).show();
}

function corrigirExame() {
    const exame = window.exameAtual;
    let nota = 0;
    const respostas = [];
    
    exame.questoes.forEach((q, idx) => {
        const resposta = document.querySelector(`input[name="q${idx}"]:checked`)?.value;
        const acertou = resposta === q.correta;
        if (acertou) nota += q.valor;
        respostas.push({ questao: q.enunciado, resposta: resposta || 'Não respondida', correta: q.correta, acertou });
    });
    
    const percentual = (nota / exame.notaMaxima) * 100;
    const status = percentual >= 60 ? 'APROVADO' : (percentual >= 40 ? 'RECUPERAÇÃO' : 'REPROVADO');
    
    let resultHtml = `<h4>Resultado: ${exame.titulo}</h4>
        <div class="alert alert-info">Nota: ${nota.toFixed(1)} / ${exame.notaMaxima}</div>
        <div class="alert ${percentual >= 60 ? 'alert-success' : 'alert-danger'}">Status: ${status}</div>
        <hr><h5>Respostas:</h5>`;
    
    respostas.forEach((r, idx) => {
        resultHtml += `<div class="mb-2 p-2 border rounded ${r.acertou ? 'bg-success-light' : 'bg-danger-light'}">
            <strong>Q${idx + 1}:</strong> ${r.questao.substring(0, 100)}<br>
            Sua resposta: ${r.resposta} | Correta: ${r.correta} | ${r.acertou ? '✅ Correta' : '❌ Errada'}
        </div>`;
    });
    
    document.getElementById('resultadoBody').innerHTML = resultHtml;
    bootstrap.Modal.getInstance(document.getElementById('realizarExameModal')).hide();
    new bootstrap.Modal(document.getElementById('resultadoModal')).show();
}

function excluirExame(id) {
    if (confirm('⚠️ Tem certeza que deseja excluir este exame?')) {
        deleteExame(id);
        carregarExames();
        alert('✅ Exame excluído com sucesso!');
    }
}

function abrirModalCadastroExame() {
    document.getElementById('exameForm').reset();
    document.getElementById('exameId').value = '';
    document.getElementById('listaQuestoes').innerHTML = '';
    questoesTemp = [];
    carregarCursosExame();
}

function fecharModalExame() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('exameModal'));
    if (modal) modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarExames();
});