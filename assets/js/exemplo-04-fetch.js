// Exemplo pra gente poder fazer o cadastrar: 

function cadastrarEmpresa(){
    // URL que será chamada do baxk-end
    // https://domínio/api/v1/empresa
    const url = "https://api.franciscosensaulas.com/api/v1/empresa";
    // request body
    const dados = {
        nome: "Francisco LTDA",
        cnpj: "19.783.660/0001-14"
    }
    // fetch é a função que permite fazer requisição do front para o back 
    fetch(url, {
        method: "POST", // POST serve para cadastrar
        headers: {
            // serve para dizer a forma que está sendo enviado o dado
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados) // converte de objeto(dicionário) para string
    })
        .then(response => response.json()) // converte de string para objeto
        .then(dado => {
            // Aqui é quando deu certo
            alert("Empresa foi cadastrada com sucesso")
        })
        .catch(error => {
            // Código executado quando ocorre algum erro
            console.error("Erro: " + error);
            alert("Ocorreu um erro ao tentar cadastrar a empresa");
        })
}

function listarEmpresas(){
    const url = "https://api.franciscosensaulas.com/api/v1/empresa";

    const textarea = document.getElementById("empresas");

    //limpar o textarea
    textarea.value = "";

    fetch(url)
        .then(response => response.json())
        .then(empresas => {
            for(let i = 0; i < empresas.length; i++){
                const empresa = empresas[i];
                const texto = `${empresa.id} | ${empresa.nome} | ${empresa.cnpj}\n`;
                textarea.value = textarea.value + texto;
            }
        })
        .catch(error => {
            // Código executado quando ocorre algum erro
            console.error("Erro: " + error);
            alert("Ocorreu um erro ao tentar cadastrar a empresa");
        })
}

function apagarEmpresa(){
    const idParaApagar = parseInt(prompt("Digite o id para apagar"));
    const url = "https://api.franciscosensaulas.com/api/v1/empresa/" + idParaApagar;

    fetch(url, {
        method: "DELETE"
    })
        .then(response => response)
        .then(dados => {
            alert("Empresa apagada com sucesso");
            listarEmpresas();
        })
        .catch(error => {
            // Código executado quando ocorre algum erro
            console.error("Erro: " + error);
            alert("Ocorreu um erro ao tentar cadastrar a empresa");
        })
}

function consularEmpresaPorId(){
    const idParaConsultar = parseInt(prompt("Digite o id para consultar"));
    const url = "https://api.franciscosensaulas.com/api/v1/empresa/" + idParaConsultar;

    const textarea = document.getElementById("empresas");
    
    //limpar o textarea
    textarea.value = "";

    fetch(url)
    .then(response => response.json())
    .then(empresa => {
        const texto = `ID: ${empresa.id}\nNome: ${empresa.nome}\nCNPJ: ${empresa.cnpj}\n`;
        textarea.value = textarea.value + texto;
    })
    .catch(error => {
        // Código executado quando ocorre algum erro
        console.error("Erro: " + error);
        alert("Ocorreu um erro ao tentar cadastrar a empresa");
    })
}

function editarEmpresa(){
    const idParaEditar = parseInt(prompt("Digite o id para editar"));
    const novoNome = prompt("Digite o novo nome");
    const novoCNPJ = prompt("Digite o novo CNPJ");

    const url = "https://api.franciscosensaulas.com/api/v1/empresa/" + idParaEditar;

    const dados = {
        nome: novoNome,
        cnpj: novoCNPJ
    }

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(response => response)
        .then(empresa => {
            alert("Empresa alterada com sucesso");
            listarEmpresas();
        })
        .catch(error => {
            // Código executado quando ocorre algum erro
            console.error("Erro: " + error);
            alert("Ocorreu um erro ao tentar cadastrar a empresa");
        })
}