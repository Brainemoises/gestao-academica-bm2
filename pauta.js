// Desenvolvido por Braine Moisés - Instituto BM²

let notasData = JSON.parse(localStorage.getItem('notas_bm2')) || {};

function carregarCursosPauta() {
    const cursos = getCursos();
    const select = document.getElementById('selectCursoPauta');
    select.innerHTML = '<option value="">Selecione um curso...</option>' + 
        cursos.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

function carregarPauta() {
    const cursoId = document.getElementById('selectCursoPauta').value;
    const disciplina = document.getElementById('selectDisciplina').value;
    const bimestre = document.getElementById('selectBimestre').value;
    
    if (!cursoId) return;
    
    const estudantes = getEstudantes().filter(e => e.cursoId == cursoId && e.status === 'Ativo');
    const tbody = document.getElementById('corpoPauta');
    
    if (estudantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">Nenhum estudante matriculado neste curso</td<tr>';
        return;
    }
    
    const disciplinasLista = disciplina ? [disciplina] : ['Matemática', 'Português', 'Programação', 'Banco de Dados'];
    
    let html = '';
    estudantes.forEach(estudante => {
        disciplinasLista.forEach(disp => {
            const notas = getNotasEstudante(estudante.id, disp);
            const media = ((notas.a1 + notas.a2 + notas.a3 + notas.a4) / 4).toFixed(1);
            const status = media >= 6 ? 'Aprovado' : (media >= 4 ? 'Recuperação' : 'Reprovado');
            const statusClass = media >= 10 ? 'bg-success' : (media >= 7 ? 'bg-warning' : 'bg-danger');
            
            // Ocultar bimestres não selecionados
            const showB1 = trimestre === 'todas' || trimestre === '1';
            const showB2 = trimestre === 'todas' || trimestre === '2';
            const showB3 = trimestre === 'todas' || trimestre === '3';
            const showB4 = trimestre === 'todas' || trimestre === '4';
            
            html += `
                <tr>
                    <td>${estudante.matricula}</td>
                    <td>${estudante.nome}</td>
                    <td>${disp}</td>
                    ${showB1 ? `<td><input type="number" class="form-control form-control-sm nota-input" data-est="${estudante.id}" data-disp="${disp}" data-bim="1" value="${notas.a1}" style="width:70px" onchange="salvarNota(${estudante.id}, '${disp}', 1, this.value)"></td>` : ''}
                    ${showB2 ? `<td><input type="number" class="form-control form-control-sm nota-input" data-est="${estudante.id}" data-disp="${disp}" data-bim="2" value="${notas.a2}" style="width:70px" onchange="salvarNota(${estudante.id}, '${disp}', 2, this.value)"></td>` : ''}
                    ${showB3 ? `<td><input type="number" class="form-control form-control-sm nota-input" data-est="${estudante.id}" data-disp="${disp}" data-bim="3" value="${notas.a3}" style="width:70px" onchange="salvarNota(${estudante.id}, '${disp}', 3, this.value)"></td>` : ''}
                    ${showB4 ? `<td><input type="number" class="form-control form-control-sm nota-input" data-est="${estudante.id}" data-disp="${disp}" data-bim="4" value="${notas.a4}" style="width:70px" onchange="salvarNota(${estudante.id}, '${disp}', 4, this.value)"></td>` : ''}
                    <td><strong>${media}</strong></td>
                    <td><input type="number" class="form-control form-control-sm" value="${notas.faltas || 0}" style="width:60px" onchange="salvarFaltas(${estudante.id}, '${disp}', this.value)"></td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                    <td><button class="btn btn-sm btn-info" onclick="emitirBoletim(${estudante.id}, '${estudante.nome}')"><i class="fas fa-print"></i> Boletim</button></td>
                </tr>
            `;
        });
    });
    
    tbody.innerHTML = html;
}

function getNotasEstudante(estudanteId, disciplina) {
    const key = `${estudanteId}_${disciplina}`;
    return notasData[key] || { a1: 0, a2: 0, a3: 0, a4: 0, faltas: 0 };
}

function salvarNota(estudanteId, disciplina, bimestre, valor) {
    const key = `${estudanteId}_${disciplina}`;
    if (!notasData[key]) notasData[key] = { a1: 0, a2: 0, a3: 0, a4: 0, faltas: 0 };
    notasData[key][`a${bimestre}`] = parseFloat(valor) || 0;
    localStorage.setItem('notas_bm2', JSON.stringify(notasData));
    carregarPauta();
}

function salvarFaltas(estudanteId, disciplina, valor) {
    const key = `${estudanteId}_${disciplina}`;
    if (!notasData[key]) notasData[key] = { a1: 0, a2: 0, a3: 0, a4: 0, faltas: 0 };
    notasData[key].faltas = parseInt(valor) || 0;
    localStorage.setItem('notas_bm2', JSON.stringify(notasData));
}

function emitirBoletim(id, nome) {
    const boletim = gerarBoletimCompleto(id);
    let html = `<div class="text-center mb-4">
        <h3>INSTITUTO DE CIÊNCIAS E TECNOLOGIA - MENTES LIMPAS (BM²)</h3>
        <h4>Manica, Moçambique</h4>
        <h5>BOLETIM ESCOLAR</h5>
        <p><strong>Estudante:</strong> ${nome}</p>
    </div>
    <table class="table table-bordered">
        <thead class="table-dark"><tr><th>Disciplina</th><th>1º Trim</th><th>2º Trim</th><th>3º Trim</th><th>4º Trim</th><th>Média</th><th>Faltas</th><th>Status</th></tr></thead>
        <tbody>`;
    
    for (const [disciplina, dados] of Object.entries(boletim)) {
        html += `<tr>
            <td>${disciplina}</td>
            <td>${dados.a1}</td><td>${dados.a2}</td><td>${dados.a3}</td><td>${dados.a4}</td>
            <td><strong>${dados.media}</strong></td>
            <td>${dados.faltas}</td>
            <td class="${dados.status === 'Aprovado' ? 'text-success' : 'text-danger'}">${dados.status}</td>
        </tr>`;
    }
    
    html += `</tbody></table>
        <div class="alert alert-info mt-3">
            <p><strong>Legenda:</strong> Média ≥ 10 = Aprovado | Média ≥ 7 = Recuperação | Média < 7 = Reprovado</p>
            <p><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="text-center"><button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Imprimir Boletim</button></div>`;
    
    const janela = window.open();
    janela.document.write(`
        <html><head><title>Boletim - ${nome}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head><body><div class="container mt-4">${html}</div></body></html>
    `);
    janela.document.close();
}

function gerarBoletimCompleto(estudanteId) {
    const disciplinas = ['Matemática', 'Português', 'Programação', 'Banco de Dados'];
    const boletim = {};
    disciplinas.forEach(disp => {
        const notas = getNotasEstudante(estudanteId, disp);
        const media = ((notas.a1 + notas.a2 + notas.a3 + notas.a4) / 4).toFixed(1);
        boletim[disp] = { 
            a1: notas.a1, a2: notas.a2, a3: notas.a3, a4: notas.a4,
            media: media, 
            faltas: notas.faltas || 0, 
            status: media >= 10 ? 'Aprovado' : (media >= 7 ? 'Recuperação' : 'Reprovado') 
        };
    });
    return boletim;
}

function exportarPautaExcel() {
    const cursoId = document.getElementById('selectCursoPauta').value;
    const curso = getCursos().find(c => c.id == cursoId);
    if (!curso) return;
    
    alert(`📊 Pauta do curso "${curso.nome}" exportada com sucesso! (Simulação de Excel)`);
}

carregarCursosPauta();