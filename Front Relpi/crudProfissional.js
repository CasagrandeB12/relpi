document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar os registros da tabela a partir do backend
    function loadRecords() {
        fetch('http://localhost:8080/profissional/todos')
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
            <td>${record.pessoas.nome}</td>
            <td>${record.servico.nome}</td>
            <td>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;

        return newRow;
    }

    

    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault();

        const idServicoInput = document.getElementById('idServiço').value;
        const idPessoaInput = document.getElementById('idPessoa').value;
        const checkboxInput = document.querySelector(".checkboxCrud");
        const value = checkboxInput.checked ? 1 : 0;

        if (nomeInput.trim() === '') {
            alert('Por favor, preencha todos os campos e selecione um tipo de serviço.');
            return;
        }

        fetch('http://localhost:8080/profissional/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idServico: idServicoInput,
                idPessoa: idPessoaInput,
                status: value
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
            const idServico = row.cells[0].textContent;
            fetch(`http://localhost:8080/servico/${idServico}`, {
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
    
            const idServicoInput = document.getElementById('idServiço');
            const idPessoaInput = document.getElementById('idPessoa');
    
            const idServicoBusca = idServicoInput.value.toLowerCase();
            const idPessoaBusca = idPessoaInput.value.toLowerCase();
    
            const rows = document.querySelectorAll('#user-list tr');
    
            rows.forEach(function(row) {
                const idServico = row.cells[0].textContent.toLowerCase();
                const idPessoa = row.cells[1].textContent.toLowerCase();
    
                const match = 
                (!idServicoBusca || idServico.includes(idServicoBusca)) &&
                (!idPessoaBusca || idPessoa.includes(idPessoaBusca));
    
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


        //GET DO SERVICO
        function createUserRowServico(record) {
            const newOption = document.createElement('option');
            newOption.textContent = record.nome;
            return newOption;
        }
    
        function fetchNamesServico() {
            return fetch('http://localhost:8080/servico/todos')
            .then(response => response.json())
            .then(records => {
                const servicoLista = document.getElementById('servico');
                if (servicoLista) {
                    servicoLista.innerHTML = '';
                    records.forEach(record => {
                        const newOption = createUserRowServico(record);
                        servicoLista.appendChild(newOption);
                    });
                } else {
                    console.error(" 'serviços' não encontrado.");
                }
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
        }

        //GET DA PESSOA
        function createUserRowPessoa(record) {
            const newOption = document.createElement('option');
            newOption.textContent = record.nome;
            return newOption;
        }
    
        function fetchNamesPessoa() {
            return fetch('http://localhost:8080/servico/todos')
            .then(response => response.json())
            .then(records => {
                const pessoaLista = document.getElementById('pessoa');
                if (pessoaLista) {
                    pessoaLista.innerHTML = '';
                    records.forEach(record => {
                        const newOption = createUserRowPessoa(record);
                        pessoaLista.appendChild(newOption);
                    });
                } else {
                    console.error(" 'serviços' não encontrado.");
                }
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
        }
        

    loadRecords();
    fetchNamesServico();
});
