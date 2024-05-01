document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formPessoas');
    function loadRecords() {
        fetch(`http://localhost:8080/pessoas/todos`)
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
            <td>${record.cpf}</td>
            <td>${record.rg}</td>
            <td>${record.genero}</td>
            <td>${record.data}</td>
            <td>${record.email}</td>
            <td>${record.telefone}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        return newRow;
    }

    // Carrega os registros ao carregar a página
    loadRecords();

    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado

        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nomeDoServiço').value;
        const cpfInput = document.getElementById('cpf').value;
        const rgInput = document.getElementById('rg').value;
        const generoInput = document.getElementById('genero').value;
        const dataInput = document.getElementById('data').value;
        const emailInput = document.getElementById('email').value;
        const telefoneInput = document.getElementById('telefone').value;
    
        // Verifique se os campos estão vazios
        if (nomeInput.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Envia os dados para o backend criar um novo registro
        fetch(`http://localhost:8080/pessoas/novo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput,
                CPF: cpfInput,
                rg: rgInput,
                genero: generoInput,
                data: dataInput,
                email: emailInput,
                telefone: telefoneInput
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

    function updateRecord(id, newData) {
        fetch(`http://localhost:8080/pessoas/${id}`, {
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
            const id = row.cells[0].textContent; // Assumindo que o ID está na primeira coluna
    
            const newData = {
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                rg: document.getElementById('rg').value,
                genero: document.getElementById('genero').value,
                data: document.getElementById('data').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value
            };
    
            // Chama a função para atualizar o registro com os novos dados
            updateRecord(id, newData);
    
            // Remove a linha da tabela
            row.remove();
        }
    });

    userList.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_erase')) {
            const row = event.target.closest('tr');
            const id = row.cells[1].textContent; // ID do usuário a ser excluído

            fetch(`http://localhost:8080/pessoas/${id}`, {
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
    
    document.querySelector('.btn_buscar').addEventListener('click', function(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nome');
        const cpfInput = document.getElementById('cpf');
        const rgInput = document.getElementById('rg');
        const generoInput = document.getElementById('genero');
        const dataInput = document.getElementById('data');
        const emailInput = document.getElementById('email');
        const telefoneInput = document.getElementById('telefone');

        const nomeBusca = nomeInput.value.toLowerCase();
        const cpfBusca = cpfInput.value.toLowerCase();
        const rgBusca = rgInput.value.toLowerCase();
        const generoBusca = generoInput.value.toLowerCase();
        const dataBusca = dataInput.value.toLowerCase();
        const emailBusca = emailInput.value.toLowerCase();
        const telefoneBusca = telefoneInput.value.toLowerCase();

        const rows = document.querySelectorAll('#user-list tr');

        rows.forEach(function(row) {
            const nome = row.cells[0].textContent.toLowerCase();
            const cpf = row.cells[1].textContent.toLowerCase();
            const rg = row.cells[2].textContent.toLowerCase();
            const genero = row.cells[3].textContent.toLowerCase();
            const data = row.cells[4].textContent.toLowerCase();
            const email = row.cells[5].textContent.toLowerCase();
            const telefone = row.cells[6].textContent.toLowerCase();

            const match = (!nomeBusca || nome.includes(nomeBusca)) &&
                          (!cpfBusca || cpf.includes(cpfBusca)) &&
                          (!rgBusca || rg.includes(rgBusca)) &&
                          (!generoBusca || genero.includes(generoBusca)) &&
                          (!dataBusca || data.includes(dataBusca)) &&
                          (!emailBusca || email.includes(emailBusca)) &&
                          (!telefoneBusca || telefone.includes(telefoneBusca));

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
                nomeInput.value = '';
                cpfInput.value = '';
                rgInput.value = '';
                generoInput.value = '';
                dataInput.value = '';
                emailInput.value = '';
                telefoneInput.value = '';

                rows.forEach(function(row) {
                    row.style.display = '';
                });
                clearButton.remove();
            });
            filterForm.appendChild(clearButton);
        }
    });
});