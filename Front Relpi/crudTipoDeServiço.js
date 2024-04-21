document.addEventListener('DOMContentLoaded', function() {
    // Variável global para armazenar o contador de código de serviço
    let codigoServico = 1;

    // Adicione um evento de clique ao botão de adicionar
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado

        // Obtenha os valores dos campos do formulário
        const nomeInput = document.getElementById('nomeDoServiço').value;
        const idInput = document.getElementById('id').value;

        // Verifique se os campos nome do serviço e descrição estão vazios
        if (nomeInput.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return; // Saia da função se algum campo estiver vazio
        }

        // Crie uma nova linha na tabela para os novos dados
        const newRow = document.createElement('tr');

        // Adicione células para cada dado do formulário
        newRow.innerHTML = `
            <td>${nomeInput}</td>
            <td>${codigoServico}</td>
            <td>
                <button class="btn_action_pencil"><i class="fa-solid fa-pencil"></i></button>
                <button class="btn_action_erase"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;

        // Incremente o contador de código de serviço
        codigoServico++;

        // Adicione a nova linha à tabela
        document.getElementById('user-list').appendChild(newRow);

        // Limpe os campos do formulário após adicionar os dados
        document.querySelector('.filter-form').reset();
    });

    // Adicione um evento de clique ao botão de busca
    document.querySelector('.btn_buscar').addEventListener('click', function(event) {
        event.preventDefault(); // Evite que o formulário seja enviado

        // Obtenha os campos de entrada do formulário
        const nomeInput = document.getElementById('nomeDoServiço').value.toLowerCase();
        const idInput = document.getElementById('id').value.toLowerCase();

        // Obtenha todas as linhas da tabela
        const rows = document.querySelectorAll('#user-list tr');

        // Itere sobre todas as linhas da tabela
        rows.forEach(function(row) {
            // Obtenha os valores de cada célula da linha
            const nome = row.cells[0].textContent.toLowerCase();
            const id = row.cells[1].textContent.toLowerCase();

            // Verifique se algum dos valores da linha corresponde aos critérios de busca
            const match = (!nomeInput || nome.includes(nomeInput)) &&
                          (!idInput || id.includes(idInput));

            // Oculte ou exiba a linha com base no resultado da correspondência
            row.style.display = match ? '' : 'none';
        });

        // Crie um botão de limpar filtros se ainda não existir
        const clearFiltersButton = document.getElementById('clear-filters-button');
        if (!clearFiltersButton) {
            const filterForm = document.querySelector('.filter-form');
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Limpar Filtros';
            clearButton.id = 'clear-filters-button';
            clearButton.classList.add('btn_clear', 'btn_cadastro');
            clearButton.addEventListener('click', function() {
                // Limpe os campos de entrada
                document.getElementById('nomeDoServiço').value = '';
                document.getElementById('id').value = '';
                // Reaplique os filtros
                rows.forEach(function(row) {
                    row.style.display = '';
                });

                // Remova o botão de limpar filtros
                clearButton.remove();
            });
            filterForm.appendChild(clearButton);
        }
    });

    // Adicione um evento de clique aos botões de lápis na tabela
    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_pencil') || event.target.classList.contains('fa-pencil')) {
            const row = event.target.closest('tr');
            // Preencha os campos do formulário com os dados da linha
            document.getElementById('nomeDoServiço').value = row.cells[0].textContent;
            // Remova a linha da tabela
            row.remove();
        }
    });

    // Adicione um evento de clique aos botões de apagar na tabela
    document.querySelector('#user-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn_action_erase') || event.target.classList.contains('fa-xmark')) {
            const row = event.target.closest('tr');
            // Remove a linha da tabela
            row.remove();
        }
    });
});