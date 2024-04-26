document.addEventListener('DOMContentLoaded', function() {
    const baseURL = 'http://localhost:8080/servico'; // URL base do backend

    // Função para carregar os registros da tabela a partir do backend
    function loadRecords() {
        fetch(`${baseURL}/servico`)
            .then(response => response.json())
            .then(records => {
                const userList = document.getElementById('user-list').querySelector('tbody');
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
        event.preventDefault(); // Evite que o formulário seja enviado

        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nomeDoServiço').value;

        // Verifique se os campos estão vazios
        if (nomeInput.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Envia os dados para o backend criar um novo registro
        fetch(`${baseURL}/servico`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput
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

    // Evento de clique aos botões de lápis na tabela
    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_pencil') || event.target.classList.contains('fa-pencil')) {
            const row = event.target.closest('tr');
            // Preencha os campos do formulário com os dados da linha
            document.getElementById('nomeDoServiço').value = row.cells[0].textContent;
            // Remova a linha da tabela
            row.remove();
        }
    });

    // Evento de clique aos botões de apagar na tabela
    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_erase') || event.target.classList.contains('fa-xmark')) {
            const row = event.target.closest('tr');
            const id = row.cells[1].textContent; // Assumindo que o ID está na segunda coluna
            // Remove a linha da tabela
            fetch(`${baseURL}/servico/${id}`, {
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
