// Desenvolvido por Braine Moisés - Instituto BM²

function gerarCalendarioAutomatico() {
    const ano = new Date().getFullYear();
    const eventosFixos = [
        { id: 1, title: 'Início das Aulas', date: `${ano}-02-01`, type: 'evento' },
        { id: 2, title: 'Feriado - Carnaval', date: `${ano}-02-12`, type: 'feriado' },
        { id: 3, title: 'Provas 1º Trimestre', date: `${ano}-03-25`, type: 'prova' },
        { id: 4, title: 'Feriado - Tiradentes', date: `${ano}-04-21`, type: 'feriado' },
        { id: 5, title: 'Provas 2º Trimestre', date: `${ano}-05-20`, type: 'prova' },
        { id: 6, title: 'Feriado - Corpus Christi', date: `${ano}-05-30`, type: 'feriado' },
        { id: 7, title: 'Fim do 1º Semestre', date: `${ano}-06-30`, type: 'evento' },
        { id: 8, title: 'Início do 2º Semestre', date: `${ano}-08-01`, type: 'evento' },
        { id: 9, title: 'Feriado - Independência', date: `${ano}-09-07`, type: 'feriado' },
        { id: 10, title: 'Provas 3º Trimestre', date: `${ano}-10-15`, type: 'prova' },
        { id: 11, title: 'Feriado - Finados', date: `${ano}-11-02`, type: 'feriado' },
        { id: 12, title: 'Provas 4º Trimestre', date: `${ano}-11-25`, type: 'prova' },
        { id: 13, title: 'Feriado - Natal', date: `${ano}-12-25`, type: 'feriado' },
        { id: 14, title: `Matrículas ${ano+1}`, date: `${ano}-11-15`, type: 'matricula' }
    ];
    
    if (!localStorage.getItem('eventos_calendario_bm2')) {
        localStorage.setItem('eventos_calendario_bm2', JSON.stringify(eventosFixos));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    gerarCalendarioAutomatico();
    
    // Mostrar data atual
    const hoje = new Date();
    document.getElementById('dataAtual').textContent = hoje.toLocaleDateString('pt-BR', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    // Carregar eventos
    let eventos = JSON.parse(localStorage.getItem('eventos_calendario_bm2')) || [];
    
    function getColorByType(type) {
        const cores = { prova: '#dc3545', feriado: '#ffc107', evento: '#17a2b8', matricula: '#28a745' };
        return cores[type] || '#6c757d';
    }
    
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
        events: eventos.map(e => ({ title: e.title, start: e.date, color: getColorByType(e.type) })),
        eventClick: function(info) { alert(`📅 ${info.event.title}\nData: ${info.event.start.toLocaleDateString('pt-BR')}`); }
    });
    calendar.render();
    
    // Adicionar evento
    document.getElementById('eventoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const novoEvento = {
            id: Date.now(),
            title: document.getElementById('eventoTitulo').value,
            date: document.getElementById('eventoData').value,
            type: document.getElementById('eventoTipo').value
        };
        eventos.push(novoEvento);
        localStorage.setItem('eventos_calendario_bm2', JSON.stringify(eventos));
        calendar.addEvent({ title: novoEvento.title, start: novoEvento.date, color: getColorByType(novoEvento.type) });
        alert('✅ Evento adicionado com sucesso!');
        document.getElementById('eventoForm').reset();
        carregarProximosEventos();
    });
    
    function carregarProximosEventos() {
        const hojeStr = new Date().toISOString().split('T')[0];
        const proximos = eventos.filter(e => e.date >= hojeStr).sort((a,b) => a.date.localeCompare(b.date)).slice(0,5);
        const lista = document.getElementById('listaProximosEventos');
        if (proximos.length === 0) {
            lista.innerHTML = '<p class="text-muted">Nenhum evento próximo</p>';
        } else {
            lista.innerHTML = proximos.map(e => `<div class="alert alert-${e.type === 'prova' ? 'danger' : e.type === 'feriado' ? 'warning' : 'info'} mb-2">
                <i class="fas fa-calendar-day"></i> ${new Date(e.date).toLocaleDateString('pt-BR')}<br>
                <strong>${e.title}</strong>
            </div>`).join('');
        }
    }
    
    carregarProximosEventos();
});