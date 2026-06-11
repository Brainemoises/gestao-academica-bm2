// Desenvolvido por Braine Moisés - Instituto BM²

function carregarConteudos() {
    let conteudos = getConteudos();
    const searchTerm = document.getElementById('searchConteudo')?.value.toLowerCase() || '';
    const tipoFiltro = document.getElementById('filtroTipo')?.value || '';
    const cursoFiltro = document.getElementById('filtroCurso')?.value || '';
    const cursos = getCursos();
    
    if (searchTerm) {
        conteudos = conteudos.filter(c => c.titulo.toLowerCase().includes(searchTerm));
    }
    if (tipoFiltro) {
        conteudos = conteudos.filter(c => c.tipo === tipoFiltro);
    }
    if (cursoFiltro) {
        conteudos = conteudos.filter(c => c.cursoConteudoId == cursoFiltro);
    }
    
    const container = document.getElementById('listaConteudos');
    if (conteudos.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum conteúdo encontrado.</div></div>';
        return;
    }
    
    container.innerHTML = conteudos.map(c => {
        let icon = '📄';
        if (c.tipo === 'video') icon = '🎥';
        else if (c.tipo === 'aula') icon = '📚';
        else if (c.tipo === 'manual') icon = '📖';
        
        const curso = cursos.find(cur => cur.id == c.cursoConteudoId);
        
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-header bg-${c.tipo === 'video' ? 'danger' : 'primary'} text-white">
                        <i class="fas ${c.tipo === 'video' ? 'fa-video' : 'fa-file-alt'}"></i> ${icon} ${c.tipo.toUpperCase()}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${c.titulo}</h5>
                        ${curso ? `<p class="text-muted"><i class="fas fa-book"></i> ${curso.nome}</p>` : ''}
                        <p class="card-text">${c.descricao.substring(0, 100)}${c.descricao.length > 100 ? '...' : ''}</p>
                        ${c.link ? `<a href="${c.link}" target="_blank" class="btn btn-sm btn-info"><i class="fas fa-external-link-alt"></i> Acessar</a>` : ''}
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Publicado: ${new Date(c.dataPublicacao).toLocaleDateString()}</small>
                        <button class="btn btn-sm btn-warning float-end" onclick="editarConteudo(${c.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger float-end me-1" onclick="excluirConteudo(${c.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function carregarCursosFiltro() {
    const cursos = getCursos();
    const select = document.getElementById('filtroCurso');
    if (select) {
        select.innerHTML = '<option value="">Todos os cursos</option>' + 
            cursos.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    }
    
    const selectCurso = document.getElementById('cursoConteudoId');
    if (selectCurso) {
        selectCurso.innerHTML = '<option value="">Todos os cursos</option>' + 
            cursos.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    }
}

function mostrarCampoLink() {
    const tipo = document.getElementById('tipo').value;
    const campoLink = document.getElementById('campoLink');
    campoLink.style.display = (tipo === 'video') ? 'block' : 'none';
}

function validarConteudo() {
    const titulo = document.getElementById('titulo').value.trim();
    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricaoConteudo').value.trim();
    
    if (!titulo) { alert('❌ Título é obrigatório!'); return false; }
    if (!tipo) { alert('❌ Tipo de conteúdo é obrigatório!'); return false; }
    if (!descricao) { alert('❌ Descrição é obrigatória!'); return false; }
    return true;
}

function salvarConteudo() {
    if (!validarConteudo()) return;
    
    const conteudo = {
        titulo: document.getElementById('titulo').value.trim(),
        tipo: document.getElementById('tipo').value,
        cursoConteudoId: document.getElementById('cursoConteudoId').value || null,
        descricao: document.getElementById('descricaoConteudo').value.trim(),
        link: document.getElementById('linkConteudo').value.trim() || null
    };
    
    const id = document.getElementById('conteudoId').value;
    if (id) {
        updateConteudo(id, conteudo);
        alert('✅ Conteúdo atualizado com sucesso!');
    } else {
        addConteudo(conteudo);
        alert('✅ Conteúdo adicionado com sucesso!');
    }
    
    fecharModal();
    carregarConteudos();
}

function editarConteudo(id) {
    const conteudo = getConteudos().find(c => c.id == id);
    if (conteudo) {
        document.getElementById('conteudoId').value = conteudo.id;
        document.getElementById('titulo').value = conteudo.titulo;
        document.getElementById('tipo').value = conteudo.tipo;
        document.getElementById('cursoConteudoId').value = conteudo.cursoConteudoId || '';
        document.getElementById('descricaoConteudo').value = conteudo.descricao;
        document.getElementById('linkConteudo').value = conteudo.link || '';
        mostrarCampoLink();
        
        new bootstrap.Modal(document.getElementById('conteudoModal')).show();
    }
}

function excluirConteudo(id) {
    if (confirm('⚠️ Tem certeza que deseja excluir este conteúdo?')) {
        deleteConteudo(id);
        carregarConteudos();
        alert('✅ Conteúdo excluído com sucesso!');
    }
}

function abrirModalCadastro() {
    document.getElementById('conteudoForm').reset();
    document.getElementById('conteudoId').value = '';
    document.getElementById('campoLink').style.display = 'none';
    carregarCursosFiltro();
}

function fecharModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('conteudoModal'));
    if (modal) modal.hide();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarConteudos();
    carregarCursosFiltro();
    if (document.getElementById('searchConteudo')) {
        document.getElementById('searchConteudo').addEventListener('keyup', carregarConteudos);
    }
});