document.addEventListener('DOMContentLoaded', function() {

    // Função para carregar registros da API
    function loadRecords() {
        fetch("http://localhost:8080/endereco/todos")
            .then(response => response.json())
            .then(records => {
                const userList = document.getElementById('user-list');
                if (userList) {
                    userList.innerHTML = '';
                    records.forEach(record => {
                        const newRow = createUserRow(record);
                        userList.appendChild(newRow);
                    });
                } else {
                    console.error("'user-list' não encontrado.");
                }
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
    }

    // Função para criar uma nova linha na tabela com os dados de um registro
    function createUserRow(record) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${record.pessoas.nome}</td>
            <td>${record.pessoas.cpf}</td>
            <td>${record.pessoas.genero}</td>
            <td>${record.pessoas.dataNascimento}</td>
            <td>${record.pessoas.email}</td>
            <td>${record.pessoas.telefone}</td>
            <td>
                <button class="btn_action_map" data-address="${record.nome}, ${record.numero} - ${record.bairro.nome}"><i class="fa-solid fa-location-dot"></i></button>
                <button class="btn_action_erase" data-id="${record.id}"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
    
        // Adicionar evento de clique para o botão de excluir
        newRow.querySelector('.btn_action_erase').addEventListener('click', function() {
            deleteUser(record.id, newRow);
        });
    
        // Adicionar evento de clique para o botão de mostrar endereço
        newRow.querySelector('.btn_action_map').addEventListener('click', function() {
            const address = this.dataset.address;
            document.getElementById('addressText').textContent = address;
            document.getElementById('addressModal').style.display = 'block';
        });
    
        return newRow;
    }
    
    // Script para o modal
    // Pega o modal
    const modal = document.getElementById('addressModal');
    
    // Pega o <span> que fecha o modal
    const span = document.getElementsByClassName('close')[0];
    
    // Quando o usuário clicar no <span> (x), feche o modal
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Quando o usuário clicar em qualquer lugar fora do modal, feche-o
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Função para deletar um usuário
    function deleteUser(userId, row) {
        fetch(`http://localhost:8080/pessoas/deletar/${userId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    row.remove();
                } else {
                    console.error('Erro ao excluir usuário');
                }
            })
            .catch(error => console.error('Erro ao excluir usuário:', error));
    }

    // Função para adicionar um novo registro
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado
    
        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nome').value;
        const cpfInput = document.getElementById('cpf').value;
        const generoInput = document.getElementById('genero').value;
        const dataInput = document.getElementById('data').value;
        const emailInput = document.getElementById('email').value;
        const telefoneInput = document.getElementById('telefone').value;
        const bairroInput = document.getElementById('bairro').value;
        const ruaInput = document.getElementById('rua').value;
        const numeroInput = document.getElementById('numero').value;
    
        // Verifique se os campos estão vazios
        if (nomeInput.trim() === '' || cpfInput.trim() === '' ||
            generoInput.trim() === '' || dataInput.trim() === '' || emailInput.trim() === '' ||
            telefoneInput.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        // Enviar dados de pessoas para o endpoint 8080/pessoas/novo
        fetch('http://localhost:8080/pessoas/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeInput,
                cpf: cpfInput,
                genero: generoInput,
                dataNascimento: dataInput,
                email: emailInput,
                status: 1,
                rg: 82,
                telefone: telefoneInput
            })
        })
        .then(response => response.json())
        .then(pessoasData => {
            // Após enviar os dados de pessoas, enviar os dados de endereco
            fetch('http://localhost:8080/endereco/novo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bairroFront: bairroInput,
                    status: 1,
                    nome: ruaInput,
                    numero: numeroInput,
                    pessoas: {
                        id: pessoasData.id // Relaciona o endereço com a pessoa recém-criada
                    }
                })
            })
            .then(response => response.json())
            .then(enderecoData => {
                // Certifique-se de que os dados de endereço estão no formato esperado
                if (enderecoData && enderecoData.nome && enderecoData.numero && enderecoData.bairro) {
                    // Adiciona uma nova linha na lista de usuários (se necessário)
                    const newRow = createUserRow({
                        pessoas: pessoasData,
                        nome: enderecoData.nome,
                        numero: enderecoData.numero,
                        bairro: enderecoData.bairro
                    });
                    const userList = document.getElementById('user-list');
                    userList.appendChild(newRow);
                } else {
                    console.error('Dados de endereço incompletos:', enderecoData);
                }
    
                // Reseta o formulário
                document.getElementById('formPessoas').reset();
            })
            .catch(error => console.error('Erro ao salvar endereço:', error));
        })
        .catch(error => console.error('Erro ao salvar pessoas:', error));
    });
    
    // Função para buscar registros com base nos filtros
    document.querySelector('.btn_buscar').addEventListener('click', function(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nome').value.toLowerCase();
        const cpfInput = document.getElementById('cpf').value.toLowerCase();
        const generoInput = document.getElementById('genero').value.toLowerCase();
        const dataInput = document.getElementById('data').value.toLowerCase();
        const emailInput = document.getElementById('email').value.toLowerCase();
        const telefoneInput = document.getElementById('telefone').value.toLowerCase();

        const rows = document.querySelectorAll('#user-list tr');

        rows.forEach(function(row) {
            const nome = row.cells[0].textContent.toLowerCase();
            const cpf = row.cells[1].textContent.toLowerCase();
            const genero = row.cells[2].textContent.toLowerCase();
            const data = row.cells[3].textContent.toLowerCase();
            const email = row.cells[4].textContent.toLowerCase();
            const telefone = row.cells[5].textContent.toLowerCase();

            const match = (!nomeInput || nome.includes(nomeInput)) &&
                          (!cpfInput || cpf.includes(cpfInput)) &&
                          (!generoInput || genero.includes(generoInput)) &&
                          (!dataInput || data.includes(dataInput)) &&
                          (!emailInput || email.includes(emailInput)) &&
                          (!telefoneInput || telefone.includes(telefoneInput));

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
                document.getElementById('formPessoas').reset();
                rows.forEach(function(row) {
                    row.style.display = '';
                });
                clearButton.remove();
            });
            filterForm.appendChild(clearButton);
        }
    });

    //GET DO BAIRRO
    function createUserRowBairro(record) {
        const newOption = document.createElement('option');
        newOption.textContent = record.nome;
        return newOption;
    }

    function fetchNames() {
        return fetch('http://localhost:8080/bairro/todos')
        .then(response => response.json())
        .then(records => {
            const bairroLista = document.getElementById('bairro');
            if (bairroLista) {
                bairroLista.innerHTML = '';
                records.forEach(record => {
                    const newOption = createUserRowBairro(record);
                    bairroLista.appendChild(newOption);
                });
            } else {
                console.error(" 'bairro' não encontrado.");
            }
        })
        .catch(error => console.error('Erro ao carregar registros:', error));
    }

    // Carregar registros e endereços ao carregar a página
    loadRecords();
    fetchNames();
});