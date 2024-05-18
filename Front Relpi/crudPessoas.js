let count = 0;

document.addEventListener('DOMContentLoaded', function() 
{
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
    document.querySelector('.btn_avancar').addEventListener('click', function(event) {
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
    
        // Obtenha os registros existentes do localStorage
        let records = JSON.parse(localStorage.getItem('records')) || [];
    
        // Adicione o novo registro à lista de registros
        records.push(newRecord);
    
        // Salve os registros atualizados no localStorage
        localStorage.setItem('records', JSON.stringify(records));
    });

    //FUNÇÃO DO BOTÃO ADICIONAR
        document.querySelector('.btn_add').addEventListener('click', function(event) {
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
            const cidadeInput = document.getElementById('cidade').value;
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
                    cidade: cidadeInput,
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

    //FUNÇÃO DO BOTÃO DELETE
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
});

//FUNÇÃO DO BOTAO CADASTRO DE ENDEREÇO
    function cadastroEndereco()
    {
        const botaoEndereco = document.querySelector("[data-endereco]");
        const botaoAvancar = document.querySelector(".btn_avancar")

        botaoEndereco.addEventListener("click", mostraCadastroEndereco);
        botaoAvancar.addEventListener("click", mostraCadastroEndereco);
    }

    function mostraCadastroEndereco() {

        if (count == 0)
        {
            const novoFormulario = document.createElement('section');
            novoFormulario.classList.add('formInteiro');
            novoFormulario.innerHTML = `
                <form class="filter-form" id="formPessoas" required>
                    <select id="cidade">
                        <option disabled selected>Cidade<option>
                    </select>
                    <select id="bairro" required>
                        <option disabled selected>Bairro<option>
                    </select>
                    <input id="rua" type="text" placeholder="Rua" required>
                    <input id="numero" type="text" placeholder="Número" required>
                    <button type="submit" class="btn_cadastro btn_add">Adicionar</button>
                    <button class="btn_cadastro btn_buscar">Buscar</button>
                </form>
        
                <table>
                    <thead>
                        <tr>
                            <th>Cidade</th>
                            <th>Bairro</th>
                            <th>Rua</th>
                            <th>Número</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="user-list">
                        <tr>
                            <td>Xaxim</td>
                            <td>Efapi</td>
                            <td>Calamidades</td>
                            <td>131</td>
                            <td>
                                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
            
            const paiDoFormulario = document.querySelector('.formInteiro').parentNode;
            
            document.querySelector('.formInteiro').remove();
            
            paiDoFormulario.appendChild(novoFormulario);

            count = 1;
        }
        
    }

    cadastroEndereco();

//GET DA CIDADE
    function createUserRowCidade(record) {
        const newRow = document.getElementById('cidade')
        newRow.innerHTML = `
            <option>${record.nome}<option>
        `;
        return newRow;
    }



    document.addEventListener('DOMContentLoaded', function() {
        function fetchNames() {
            return fetch('http://localhost:8080/cidade/todos')
            .then(response => response.json())
            .then(records => {
                const cidadeLista = document.getElementById('cidade');
                if (cidadeLista) {
                    cidadeLista.innerHTML = '';
                } else {
                    console.error(" 'cidade-Lista' não encontrado.");
                }
                records.forEach(record => {
                    const newRow = createUserRowCidade(record);
                    cidadeLista.appendChild(newRow);
                });
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
        }

        fetchNames();
    })
 
//GET DO BAIRRO
    function createUserRowBairro(record) {
        const newRow = document.getElementById('bairro')
        newRow.innerHTML = `
            <option>${record.nome}<option>
        `;
        return newRow;
    }

    document.addEventListener('DOMContentLoaded', function() {
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
                    const newRow = createUserRowCidade(record);
                    bairroLista.appendChild(newRow);
                });
            })
            .catch(error => console.error('Erro ao carregar registros:', error));
        }

        fetchNames();
    })


//FUNÇÃO DO BOTAO DE CADASTRO PESSOAS
    function cadastroPessoas()
    {
        const botaoPessoas = document.querySelector("[data-pessoas]");

        botaoPessoas.addEventListener("click", mostraCadastroPessoas);
    }

    function mostraCadastroPessoas() {
        if(count != 0)
        {
            const novoFormulario = document.createElement('section');
            novoFormulario.classList.add('formInteiro');
            novoFormulario.innerHTML = `
            <form class="filter-form" id="formPessoas" required>
                        <input id="nome" type="text" placeholder="Nome" required>
                        <input id="cpf" type="text" placeholder="CPF" required>
                        <input id="rg" type="text" placeholder="RG" required>
                        <input id="genero" type="text" placeholder="Gênero" required>
                        <input id="data" type="date" placeholder="Nascimento (21-02-2000)" required>
                        <input id="email" type="email" placeholder="Email" required>
                        <input id="telefone" type="tel" placeholder="Telefone" required>
                        <input id="status" class="checkboxCrud" type="checkbox" required>
                        <label for="status" class="checkboxCrudLabel">Profissional</label>
                        <button type="submit" class="btn_cadastro btn_avancar">Avançar</button>
                        <button class="btn_cadastro btn_buscar">Buscar</button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>RG</th>
                                <th>Gênero</th>
                                <th>Data de Nascimento</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="user-list">
                            <tr>
                                <td>Exemplo</td>
                                <td>123.456.789-00</td>
                                <td>1234567-8</td>
                                <td>Masculino</td>
                                <td>01-01-1990</td>
                                <td>exemplo@email.com</td>
                                <td>(00) 1234-5678</td>
                                <td>
                                    <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                                    <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
        `;

        count = 0;
        
        const paiDoFormulario = document.querySelector('.formInteiro').parentNode;
        
        document.querySelector('.formInteiro').remove();
        
        paiDoFormulario.appendChild(novoFormulario);
        }
        
    }

    cadastroPessoas();