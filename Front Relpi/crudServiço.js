document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar os registros da tabela a partir do backend
    function loadRecords() {
        fetch('http://localhost:8080/servico/todos')
            .then(response => response.json())
            .then(records => {
                const userList = document.getElementById('user-list');
                if (userList) {
                    userList.innerHTML = '';
                } else {
                    console.error(" 'user-list' não encontrado.");
                }
                records.forEach(record => {
                    const newRow = createUserRow(record);
                    userList.appendChild(newRow);
                });
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
    }

    function createUserRow(record) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${record.nome}</td>
            <td>${record.descricao}</td>
            <td>${record.tipoServico.nome}</td>
            <td>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;

        return newRow;
    }

    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nomeDoServiço').value;
        const descricaoInput = document.getElementById('descrição').value;
        const idTipoDeServiçoInput = document.getElementById('idTipoDeServiço').value;

        if (nomeInput.trim() === '') {
            alert('Por favor, preencha todos os campos e selecione um tipo de serviço.');
            return;
        }

        fetch('http://localhost:8080/servico/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput,
                descricao: descricaoInput,
                tipoServico: idTipoDeServiçoInput
            })
        })
        .then(response => {
            if (response.ok) {
                loadRecords();
                document.querySelector('.filter-form').reset();
            } else {
                throw new Error('Erro ao adicionar registro');
            }
        })
        .catch(error => console.error(error));
    });

    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_erase') || event.target.classList.contains('fa-xmark')) {
            const row = event.target.closest('tr');
            const nome = row.cells[0].textContent;
            fetch(`http://localhost:8080/servico/${nome}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Se o registro for excluído com sucesso, recarrega os registros na tabela
                    loadRecords();
                } else {
                    throw new Error('Erro ao excluir registro');
                }
            })
            .catch(error => console.error(error));
        }
    });

        // Evento de clique no botão de buscar
        document.querySelector('.btn_buscar').addEventListener('click', function(event) {
            event.preventDefault();
    
            const nomeDoServiçoInput = document.getElementById('nomeDoServiço');
            const descriçãoInput = document.getElementById('descrição');
            const idTipoDeServicoInput = document.getElementById('idTipoDeServiço');
    
            const nomeBusca = nomeDoServiçoInput.value.toLowerCase();
            const descriçãoBusca = descriçãoInput.value.toLowerCase();
            const idTipoDeServicoBusca = idTipoDeServicoInput.value.toLowerCase();


    
            const rows = document.querySelectorAll('#user-list tr');
    
            rows.forEach(function(row) {
                const nome = row.cells[0].textContent.toLowerCase();
                const descricao = row.cells[1].textContent.toLowerCase();
                const idTipoDeServico = row.cells[3].textContent.toLowerCase();
                const id = row.cells[2].textContent.toLowerCase();
    
                const match = (!nomeBusca || nome.includes(nomeBusca)) &&
                              (!descriçãoBusca || descricao.includes(descriçãoBusca)) &&
                              (!idTipoDeServicoBusca || idTipoDeServico.includes(idTipoDeServicoBusca));

    
                row.style.display = match ? '' : 'none';
            });
    
            const clearFiltersButton = document.getElementById('clear-filters-button');
            if (!clearFiltersButton) {
                const filterForm = document.getElementById('formPessoas');
                const clearButton = document.createElement('button');
                clearButton.textContent = 'Limpar Filtros';
                clearButton.id = 'clear-filters-button';
                clearButton.classList.add('btn_clear', 'btn_cadastro');
                clearButton.addEventListener('click', function() {
                    nomeDoServiçoInput.value = '';
                    idInput.value = '';
    
                    rows.forEach(function(row) {
                        row.style.display = '';
                    });
                    clearButton.remove();
                });
                filterForm.appendChild(clearButton);
            }
        });

    loadRecords();
});
