document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formPessoas');
    const userList = document.getElementById('user-list');

    // Função para carregar os registros da tabela a partir do backend
    function loadRecords() {
        fetch('http://localhost:8080/pessoas')
            .then(response => response.json())
            .then(records => {
                userList.innerHTML = ''; // Limpa a tabela antes de adicionar os novos registros

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
            <td>${record.CPF}</td>
            <td>${record.rg}</td>
            <td>${record.genero}</td>
            <td>${record.data}</td>
            <td>${record.email}</td>
            <td>${record.telefone}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase" data-id="${record.id}"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        return newRow;
    }

    // Carrega os registros ao carregar a página
    loadRecords();

    form.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_add')) {
            event.preventDefault();

            if (!form.checkValidity()) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const nameInput = document.getElementById('nome').value;
            const cpfInput = document.getElementById('CPF').value;
            const rgInput = document.getElementById('rg').value;
            const generoInput = document.getElementById('genero').value;
            const dataInput = document.getElementById('data').value;
            const emailInput = document.getElementById('email').value;
            const telefoneInput = document.getElementById('telefone').value;

            fetch('http://localhost:8080/pessoas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nameInput,
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
                    form.reset();
                } else {
                    throw new Error('Erro ao adicionar registro');
                }
            })
            .catch(error => console.error(error));
        }
    });

    userList.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_pencil')) {
            const row = event.target.closest('tr');

            document.getElementById('nome').value = row.cells[0].textContent;
            document.getElementById('CPF').value = row.cells[1].textContent;
            document.getElementById('rg').value = row.cells[2].textContent;
            document.getElementById('genero').value = row.cells[3].textContent;
            document.getElementById('data').value = row.cells[4].textContent;
            document.getElementById('email').value = row.cells[5].textContent;
            document.getElementById('telefone').value = row.cells[6].textContent;

            row.remove();
        }
    });

    userList.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_erase')) {
            const row = event.target.closest('tr');
            const userId = event.target.dataset.id; // ID do usuário a ser excluído

            fetch(`http://localhost:8080/pessoas/${userId}`, {
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
        const cpfInput = document.getElementById('CPF');
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