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

    /* Função para carregar os tipos de serviço disponíveis
    function loadServiceTypes() {
        fetch('http://localhost:8080/tipo_servico/todos')
            .then(response => response.json())
            .then(serviceTypes => {
                const selectServiceType = document.getElementById('tipoDeServico');
                if (selectServiceType) {
                    // Limpa as opções existentes no campo de seleção
                    selectServiceType.innerHTML = '';
                    // Adiciona uma opção em branco para ser selecionada por padrão
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecione um tipo de serviço';
                    selectServiceType.appendChild(defaultOption);
                    // Adiciona as opções de tipo de serviço obtidas do backend
                    serviceTypes.forEach(serviceType => {
                        const option = document.createElement('option');
                        option.value = serviceType.id; // Assumindo que o ID do tipo de serviço é único e apropriado
                        option.textContent = serviceType.nome;
                        selectServiceType.appendChild(option);
                    });
                } else {
                    console.error(" 'tipoDeServico' não encontrado.");
                }
            })
            .catch(error => console.error('Erro ao carregar tipos de serviço:', error));
    }*/

    // Função para criar uma nova linha na tabela com os dados de um registro
    function createUserRow(record) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${record.nome}</td>
            <td>${record.descricao}</td>
            <td>${record.id}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        return newRow;
    }

    // Evento de clique no botão de adicionar
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado

        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nomeDoServiço').value;
        const descricaoInput = document.getElementById('descrição').value;
        //const tipoServicoInput = document.getElementById('idTipoDeServiço').value; // Obtenha o tipo de serviço selecionado
        const idInput = document.getElementById('id').value;

        // Verifique se os campos estão vazios
        if (nomeInput.trim() === '' || tipoServicoInput.trim() === '') {
            alert('Por favor, preencha todos os campos e selecione um tipo de serviço.');
            return;
        }

        // Envia os dados para o backend criar um novo registro
        fetch('http://localhost:8080/servico/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput,
                descricao: descricaoInput,
                id: idInput
                //tipoServicoId: tipoServicoInput // Envie o ID do tipo de serviço selecionado
            })
        })
        .then(response => {
            if (response.ok) {
                // Se o registro for criado com sucesso, recarrega os registros na tabela
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
            const id = row.cells[1].textContent; // Assumindo que o ID está na segunda coluna
            // Remove a linha da tabela
            fetch(`http://localhost:8080/servico/${id}`, {
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
            //const idTipoDeServicoInput = document.getElementById('idTipoDeServiço');
            const idInput = document.getElementById('id');
    
            const nomeBusca = nomeDoServiçoInput.value.toLowerCase();
            const descriçãoBusca = descriçãoInput.value.toLowerCase();
            //const idTipoDeServicoBusca = idTipoDeServicoInput.value.toLowerCase();
            const idBusca = idInput.value.toLowerCase();

    
            const rows = document.querySelectorAll('#user-list tr');
    
            rows.forEach(function(row) {
                const nome = row.cells[0].textContent.toLowerCase();
                const descricao = row.cells[1].textContent.toLowerCase();
                //const idTipoDeServico = row.cells[2].textContent.toLowerCase();
                const id = row.cells[2].textContent.toLowerCase();
    
                const match = (!nomeBusca || nome.includes(nomeBusca)) &&
                              (!descriçãoBusca || descricao.includes(descriçãoBusca)) &&
                              //(!idTipoDeServicoBusca || idTipoDeServico.includes(idTipoDeServicoBusca)) &&
                              (!idBusca || id.includes(idBusca));

    
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

        function updateRecord(id, newData) {
            fetch(`http://localhost:8080/servico/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            })
            .then(response => {
                if (response.ok) {
                    // Se o registro for atualizado com sucesso, recarrega os registros na tabela
                    loadRecords();
                } else {
                    throw new Error('Erro ao atualizar registro');
                }
            })
            .catch(error => console.error(error));
        }
        
        // Evento de clique nos botões de lápis na tabela
        document.getElementById('user-list').addEventListener('click', function(event) {
            if (event.target.classList.contains('btn_action_pencil')) {
                const row = event.target.closest('tr');
                const id = row.cells[2].textContent; // Assumindo que o ID está na primeira coluna
        
                const newData = {
                    nomeDoServico: document.getElementById('nomeDoServiço').value,
                    descricao: document.getElementById('descrição').value,
                    id: document.getElementById('id').value,
                    //idTipoDeServico: document.getElementById('idTipoDeServiço').value
                    
                };
        
                // Chama a função para atualizar o registro com os novos dados
                updateRecord(id, newData);
        
                // Remove a linha da tabela
                row.remove();
            }
        });

    // Carrega os registros ao carregar a página
    loadRecords();

    // Carrega os tipos de serviço disponíveis ao carregar a página
    //loadServiceTypes();
});
