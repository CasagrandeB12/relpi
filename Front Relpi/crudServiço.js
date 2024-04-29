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

    // Função para criar uma nova linha na tabela com os dados de um registro
    function createUserRow(record) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${record.nome}</td>
            <td>${record.descricao}</td>
            <td>${record.codigoServico}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        return newRow;
    }

    // Evento de clique no botão de adicionar
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evita que o formulário seja enviado

        const nomeInput = document.getElementById('nomeDoServiço').value;
        const descricaoInput = document.getElementById('descrição').value;

        // Envia os dados para o backend criar um novo registro
        fetch('http://localhost:8080/servico/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput,
                descricao: descricaoInput
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

    // Evento de clique no botão de buscar
    document.querySelector('.btn_buscar').addEventListener('click', function(event) {
        event.preventDefault();

        const nomeDoServiçoInput = document.getElementById('nomeDoServiço');
        const descricaoInput = document.getElementById('descrição');

        const nomeBusca = nomeDoServiçoInput.value.toLowerCase();
        const descricaoBusca = descricaoInput.value.toLowerCase();


        const rows = document.querySelectorAll('#user-list tr');

        rows.forEach(function(row) {
            const nome = row.cells[0].textContent.toLowerCase();
            const descricao = row.cells[1].textContent.toLowerCase();

            const match = (!nomeBusca || nome.includes(nomeBusca)) &&
                          (!descricaoBusca || descricao.includes(descricaoBusca));

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

    // Evento de clique nos botões de lápis na tabela
    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_pencil') || event.target.classList.contains('fa-pencil')) {
            const row = event.target.closest('tr');
            // Preencha os campos do formulário com os dados da linha
            document.getElementById('nomeDoServiço').value = row.cells[0].textContent;
            document.getElementById('descrição').value = row.cells[1].textContent;
            // Remova a linha da tabela
            row.remove();
        }
    });
    
    //remove
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

    // Carrega os registros ao carregar a página
    loadRecords();
});