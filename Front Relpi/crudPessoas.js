let count = 0;

document.addEventListener('DOMContentLoaded', function() 
{
    function loadRecords() {
        fetch("http://localhost:8080/pessoas/todos")
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
            <td>${record.dataNascimento}</td>
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

    //FUNÇÃO DO BOTÃO AVANÇAR
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado
    
        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nome').value;
        const cpfInput = document.getElementById('cpf').value;
        const rgInput = document.getElementById('rg').value;
        const generoInput = document.getElementById('genero').value;
        const dataInput = document.getElementById('data').value;
        const emailInput = document.getElementById('email').value;
        const telefoneInput = document.getElementById('telefone').value;
    
        // Verifique se os campos estão vazios
        if (nomeInput.trim() === '' || cpfInput.trim() === '' || rgInput.trim() === '' || 
            generoInput.trim() === '' || dataInput.trim() === '' || emailInput.trim() === '' || 
            telefoneInput.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        // Objeto com os dados do formulário
        const newRecord = {
            nome: nomeInput,
            CPF: cpfInput,
            rg: rgInput,
            genero: generoInput,
            data: dataInput,
            email: emailInput,
            telefone: telefoneInput
        };
    
    });

    const botaoAdd = document.querySelector('.btn_add');
    //FUNÇÃO DO BOTÃO ADICIONAR
        botaoAdd.addEventListener('click', function(event) {
            event.preventDefault();

            // Recupere os registros do localStorage
            let records = JSON.parse(localStorage.getItem('records')) || [];

            if (records.length === 0) {
                alert('Não há registros para enviar.');
                return;
            }

            // Envia os dados para o backend
            fetch('http://localhost:8080/pessoas/novo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(records) // Envia todos os registros de uma vez
            })
            .then(response => {
                if (response.ok) {
                    alert('Registros enviados com sucesso.');
                    // Opcional: limpar os registros enviados do localStorage
                    localStorage.removeItem('records');
                    loadRecords(); // Recarregar os registros, que agora estarão vazios
                } else {
                    throw new Error('Erro ao enviar registros');
                }
            })
            .catch(error => console.error(error));


            //ENVIO DO ENDERECO
            const bairroInput = document.getElementById('bairro').value;
            const ruaInput = document.getElementById('rua').value;
            const numeroInput = document.getElementById('numero').value;

            if (nomeInput.trim() === '') {
                alert('Por favor, preencha todos os campos e selecione um tipo de serviço.');
                return;
            }

            fetch('http://localhost:8080/endereco/novo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bairro: bairroInput,
                    rua: ruaInput,
                    numero: numeroInput
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

        //FUNÇÃO DO BOTÃO EDIT
        function updateRecord(newData) {
            fetch("http://localhost:8080/pessoas/${id}", {
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
    
    
        document.querySelector(".fa-pencil").addEventListener('click', function(event) {
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

    //FUNÇÃO DO BOTÃO DELETE
        document.querySelector(".fa-xmark").addEventListener('click', function(event) {
            if (event.target.classList.contains('btn_action_erase')) {
                const row = event.target.closest('tr');
                const id = row.cells[1].textContent; // ID do usuário a ser excluído

                fetch("http://localhost:8080/pessoas/${id}", {
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

        //FUNCAO MAPA

        document.querySelector(".fa-location-dot").addEventListener('click', function(event) {
            if (event.target.classList.contains('btn_action_erase')) {
                const row = event.target.closest('tr');
                const id = row.cells[1].textContent; // ID do usuário a ser excluído

                fetch("http://localhost:8080/pessoas/${id}", {
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

    //FUNÇÃO DO BOTÃO BUSCAR
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

        const enderecoFuncao = document.querySelector(".enderecoFuncao");
        enderecoFuncao.addEventListener('click', chamaFuncaoEndereco())
 
        function chamaFuncaoEndereco() 
        {
            console.log(enderecoFuncao)
            enderecoFuncao.innerHTML = `
            <h1>aaa</h1>
            `
        }
//GET DO BAIRRO
    function createUserRowBairro(record) {
        const newRow = document.getElementById('bairro')
        newRow.innerHTML = `
            <option>${record.nome}<option>
        `;
        return newRow;
    }


        function fetchNames() {
            return fetch('http://localhost:8080/bairro/todos')
            .then(response => response.json())
            .then(records => {
                const bairroLista = document.getElementById('bairro');
                if (bairroLista) {
                    bairroLista.innerHTML = '';
                } else {
                    console.error(" 'cidade-Lista' não encontrado.");
                }
                records.forEach(record => {
                    const newRow = createUserRowBairro(record);
                    bairroLista.appendChild(newRow);
                });
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
        }

        
        fetchNames();
   
});