const form = document.getElementById('formPessoas');
const userList = document.getElementById('user-list');

form.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn_add')) {
        event.preventDefault();

        if (!form.checkValidity()) {
            // Se algum campo obrigatório estiver vazio, mostre uma mensagem de erro ou tome outra ação apropriada
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        // Obtenha os valores dos campos do formulário
        const nameInput = document.getElementById('nome').value;
        const cpfInput = document.getElementById('CPF').value;
        const rgInput = document.getElementById('rg').value;
        const generoInput = document.getElementById('genero').value;
        const dataInput = document.getElementById('data').value;
        const emailInput = document.getElementById('email').value;
        const telefoneInput = document.getElementById('telefone').value;

        // Crie uma nova linha na tabela para os novos dados
        const newRow = document.createElement('tr');

        // Adicione células para cada dado do formulário
        newRow.innerHTML = `
            <td>${nameInput}</td>
            <td>${cpfInput}</td>
            <td>${rgInput}</td>
            <td>${generoInput}</td>
            <td>${dataInput}</td>
            <td>${emailInput}</td>
            <td>${telefoneInput}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;

        // Adicione a nova linha à tabela
        userList.appendChild(newRow);

        // Limpe os campos do formulário após adicionar os dados
        form.reset();
    }
});

// Adicione um evento de clique aos botões de edição e exclusão na tabela
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
        row.remove();
    }
});

// Adicione um evento de clique ao botão de busca na tabela
document.querySelector('.btn_buscar').addEventListener('click', function(event) {
    event.preventDefault(); // Evite que o formulário seja enviado

    // Obtenha os campos de entrada do formulário
    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('CPF');
    const rgInput = document.getElementById('rg');
    const generoInput = document.getElementById('genero');
    const dataInput = document.getElementById('data');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');

    // Salve o estado dos atributos required antes de remover
    const nomeRequired = nomeInput.hasAttribute('required');
    const cpfRequired = cpfInput.hasAttribute('required');
    const rgRequired = rgInput.hasAttribute('required');
    const generoRequired = generoInput.hasAttribute('required');
    const dataRequired = dataInput.hasAttribute('required');
    const emailRequired = emailInput.hasAttribute('required');
    const telefoneRequired = telefoneInput.hasAttribute('required');

    // Remova temporariamente o atributo required dos campos de entrada
    nomeInput.removeAttribute('required');
    cpfInput.removeAttribute('required');
    rgInput.removeAttribute('required');
    generoInput.removeAttribute('required');
    dataInput.removeAttribute('required');
    emailInput.removeAttribute('required');
    telefoneInput.removeAttribute('required');

    // Obtenha os valores de busca de cada campo de entrada
    const nomeBusca = nomeInput.value.toLowerCase();
    const cpfBusca = cpfInput.value.toLowerCase();
    const rgBusca = rgInput.value.toLowerCase();
    const generoBusca = generoInput.value.toLowerCase();
    const dataBusca = dataInput.value.toLowerCase();
    const emailBusca = emailInput.value.toLowerCase();
    const telefoneBusca = telefoneInput.value.toLowerCase();

    // Restaure o atributo required aos campos de entrada
    if (nomeRequired) nomeInput.setAttribute('required', '');
    if (cpfRequired) cpfInput.setAttribute('required', '');
    if (rgRequired) rgInput.setAttribute('required', '');
    if (generoRequired) generoInput.setAttribute('required', '');
    if (dataRequired) dataInput.setAttribute('required', '');
    if (emailRequired) emailInput.setAttribute('required', '');
    if (telefoneRequired) telefoneInput.setAttribute('required', '');

    // Obtenha todas as linhas da tabela
    const rows = document.querySelectorAll('#user-list tr');

    // Itere sobre todas as linhas da tabela
    rows.forEach(function(row) {
        // Obtenha os valores de cada célula da linha
        const nome = row.cells[0].textContent.toLowerCase();
        const cpf = row.cells[1].textContent.toLowerCase();
        const rg = row.cells[2].textContent.toLowerCase();
        const genero = row.cells[3].textContent.toLowerCase();
        const data = row.cells[4].textContent.toLowerCase();
        const email = row.cells[5].textContent.toLowerCase();
        const telefone = row.cells[6].textContent.toLowerCase();

        // Verifique se algum dos valores da linha corresponde aos critérios de busca
        const match = (!nomeBusca || nome.includes(nomeBusca)) &&
                      (!cpfBusca || cpf.includes(cpfBusca)) &&
                      (!rgBusca || rg.includes(rgBusca)) &&
                      (!generoBusca || genero.includes(generoBusca)) &&
                      (!dataBusca || data.includes(dataBusca)) &&
                      (!emailBusca || email.includes(emailBusca)) &&
                      (!telefoneBusca || telefone.includes(telefoneBusca));

        // Oculte ou exiba a linha com base no resultado da correspondência
        row.style.display = match ? '' : 'none';
    });

    // Crie um botão de limpar filtros se ainda não existir
    const clearFiltersButton = document.getElementById('clear-filters-button');
    if (!clearFiltersButton) {
        const filterForm = document.getElementById('formPessoas');
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Limpar Filtros';
        clearButton.id = 'clear-filters-button';
        clearButton.classList.add('btn_clear', 'btn_cadastro');
        clearButton.addEventListener('click', function() {
            // Limpe os campos de entrada
            nomeInput.value = '';
            cpfInput.value = '';
            rgInput.value = '';
            generoInput.value = '';
            dataInput.value = '';
            emailInput.value = '';
            telefoneInput.value = '';

            // Reaplique os filtros
            rows.forEach(function(row) {
                row.style.display = '';
            });
            clearButton.remove();
        });
        filterForm.appendChild(clearButton);
    }
});
