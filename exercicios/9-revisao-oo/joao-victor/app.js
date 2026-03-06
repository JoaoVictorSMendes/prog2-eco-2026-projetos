
class Estudante {
  constructor(matricula, nome) {
    this.validarDados(matricula, nome);
    this.matricula = matricula;
    this.nome = nome;
  }

  validarDados(matricula, nome) {
    if (!matricula || typeof matricula !== 'string') {
      throw new Error("Matrícula inválida. Deve ser uma string preenchida.");
    }
    if (!nome || typeof nome !== 'string') {
      throw new Error("Nome do estudante inválido.");
    }
  }
}

class Curso {
  constructor(nome, cargaHoraria) {
    this.validarNome(nome);
    this.validarCargaHoraria(cargaHoraria);
    
    this.nome = nome;
    this.cargaHoraria = cargaHoraria;
  }

  validarNome(nome) {
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      throw new Error("O nome do curso é obrigatório e deve ser um texto válido.");
    }
  }

  validarCargaHoraria(cargaHoraria) {
    if (typeof cargaHoraria !== 'number' || cargaHoraria <= 0) {
      throw new Error("A carga horária deve ser um número maior que zero.");
    }
  }
}

class Turma {
  constructor(curso) {
    this.validarCurso(curso);
    this.curso = curso;
    this.estudantes = [];
  }

  validarCurso(curso) {
    if (!(curso instanceof Curso)) {
      throw new Error("A turma deve ser vinculada a uma instância válida da classe Curso.");
    }
  }

  adicionarEstudante(estudante) {
    if (!(estudante instanceof Estudante)) {
      throw new Error("Apenas instâncias da classe Estudante podem ser adicionadas.");
    }
    const alunoJaExiste = this.estudantes.some(
      (estudanteMatriculado) => estudanteMatriculado.matricula === estudante.matricula
    );
    if (alunoJaExiste) {
      throw new Error(`O estudante com matrícula ${estudante.matricula} já está nesta turma.`);
    }
    this.estudantes.push(estudante);
  }

  // NOVO MÉTODO: Remove o aluno usando a matrícula dele
  removerEstudante(matricula) {
    // A função 'filter' cria uma nova lista contendo apenas os alunos que NÃO têm essa matrícula
    this.estudantes = this.estudantes.filter(estudante => estudante.matricula !== matricula);
  }
}

// Classe Item (Responsável por validar as regras de cada produto)
class Item {
  constructor(descricao, preco, quantidade) {
    this.validarDados(descricao, preco, quantidade);
    
    this.descricao = descricao;
    this.preco = preco;
    this.quantidade = quantidade;
  }

  validarDados(descricao, preco, quantidade) {
    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
      throw new Error("A descrição do item é obrigatória.");
    }
    if (typeof preco !== 'number' || preco < 0) {
      throw new Error("O preço deve ser um número válido e não pode ser negativo.");
    }
    // Regra do exercício: Não aceitar quantidade zero ou negativa
    if (typeof quantidade !== 'number' || quantidade <= 0) {
      throw new Error(`A quantidade do item '${descricao}' deve ser maior que zero.`);
    }
  }
}

// Classe CarrinhoDeCompras
class CarrinhoDeCompras {
  // A cerquilha (#) torna a lista PRIVADA. Ninguém de fora consegue acessar 'carrinho.#itens'
  #itens = [];

  // Método 1: Adicionar
  adicionarItem(item) {
    if (!(item instanceof Item)) {
      throw new Error("Apenas objetos da classe Item podem ser adicionados ao carrinho.");
    }
    this.#itens.push(item);
    console.log(`✅ Adicionado: ${item.quantidade}x ${item.descricao}`);
  }

  // Método 2: Remover (pela descrição do produto)
  removerItem(descricao) {
    const tamanhoAntes = this.#itens.length;
    // Filtra a lista, mantendo apenas os itens que NÃO têm a descrição informada
    this.#itens = this.#itens.filter(item => item.descricao !== descricao);
    
    if (this.#itens.length === tamanhoAntes) {
      throw new Error(`❌ O item '${descricao}' não foi encontrado no carrinho.`);
    } else {
      console.log(`🗑️ Removido: ${descricao}`);
    }
  }

  // Método 3: Calcular Total
  calcularTotal() {
    // Multiplica o preço pela quantidade de cada item e soma tudo
    let total = 0;
    this.#itens.forEach(item => {
      total += item.preco * item.quantidade;
    });
    return total;
  }

  // Método 4: Listar Itens (Expor os dados sem expor a lista original)
  listarItens() {
    // Retornamos uma CÓPIA da lista [...this.#itens] para que quem chamou 
    // a função não consiga modificar a nossa lista original.
    return [...this.#itens];
  }
}

// ==========================================
// 2. INTERAGINDO COM A TELA
// ==========================================

// Capturando os elementos do HTML
const tela = document.getElementById("tela-resultado");
const divErro = document.getElementById("mensagem-erro");
const inputMatricula = document.getElementById("inputMatricula");
const inputNome = document.getElementById("inputNome");
const btnAdicionar = document.getElementById("btnAdicionar");

// Criando a turma base
const cursoJS = new Curso("JavaScript Avançado", 40);
const turmaA = new Turma(cursoJS);

// Função para desenhar a lista na tela
// Função para desenhar a lista na tela (Agora com o botão de Remover)
function atualizarTela() {
  let visualHTML = `
    <h2>Curso: ${turmaA.curso.nome} (${turmaA.curso.cargaHoraria}h)</h2>
    <h3>Total de Alunos: ${turmaA.estudantes.length}</h3>
    <ul>
  `;

  turmaA.estudantes.forEach((estudante) => {
    // Adicionamos um botão <button> dentro de cada item da lista (<li>)
    visualHTML += `
      <li style="margin-bottom: 8px;">
        <strong>${estudante.nome}</strong> - Matrícula: ${estudante.matricula}
        <button onclick="deletarAluno('${estudante.matricula}')" style="margin-left: 10px; color: red; cursor: pointer;">Remover</button>
      </li>
    `;
  });

  visualHTML += `</ul>`;
  tela.innerHTML = visualHTML;
}

// NOVA FUNÇÃO: O que acontece quando clicamos no botão "Remover"
function deletarAluno(matricula) {
  turmaA.removerEstudante(matricula); // Apaga da memória
  atualizarTela(); // Redesenha a tela (agora sem o aluno)
}

// O que acontece quando clica no botão "Matricular"
btnAdicionar.addEventListener("click", () => {
  // Limpa mensagens de erro antigas
  divErro.innerHTML = ""; 

  const matriculaDigitada = inputMatricula.value;
  const nomeDigitado = inputNome.value;

  try {
    // Tenta criar o estudante e adicionar na turma
    const novoAluno = new Estudante(matriculaDigitada, nomeDigitado);
    turmaA.adicionarEstudante(novoAluno);

    // Se deu certo, atualiza a tela e limpa os campos
    atualizarTela();
    inputMatricula.value = "";
    inputNome.value = "";

  } catch (erro) {
    // Se a regra barrar (ex: matrícula repetida), mostra o erro na tela!
    divErro.innerHTML = `Erro: ${erro.message}`;
  }
});

// Mostra a tela vazia (só com os dados do curso) logo que a página carrega
atualizarTela();

try {
  const meuCarrinho = new CarrinhoDeCompras();

  // 1. Criando e adicionando itens válidos
  const teclado = new Item("Teclado Mecânico", 250.00, 1);
  const mouse = new Item("Mouse Gamer", 120.00, 2); // 2 mouses
  
  meuCarrinho.adicionarItem(teclado);
  meuCarrinho.adicionarItem(mouse);

  // 2. Listando os itens e o total
  console.log("--- Resumo do Carrinho ---");
  const itensNoCarrinho = meuCarrinho.listarItens();
  itensNoCarrinho.forEach(item => {
    console.log(`- ${item.descricao}: R$ ${item.preco} (Qtd: ${item.quantidade})`);
  });
  console.log(`💰 Total a pagar: R$ ${meuCarrinho.calcularTotal()}`);

  // 3. Removendo um item
  console.log("--- Removendo Item ---");
  meuCarrinho.removerItem("Teclado Mecânico");
  console.log(`💰 Novo total: R$ ${meuCarrinho.calcularTotal()}`);

  // 4. TESTE DE ENCAPSULAMENTO (Tentando roubar o carrinho)
  // Se você tentar rodar o comando abaixo, ele vai dar undefined ou erro,
  // pois a lista #itens está protegida!
  // console.log(meuCarrinho.#itens); 

  // 5. TESTE DE REGRA (Tentando adicionar quantidade zero)
  console.log("--- Testando Regras ---");
  const foneInvalido = new Item("Fone Bluetooth", 100.00, 0); // Vai dar erro aqui!
  meuCarrinho.adicionarItem(foneInvalido);

} catch (erro) {
  console.error("ALERTA:", erro.message);
}

// ==========================================
// 1. CLASSE PAI (Superclasse)
// ==========================================
class Veiculo {
  constructor(marca, modelo, ano) {
    this.marca = marca;
    this.modelo = modelo;
    this.ano = ano;
  }

  descricao() {
    return `Veículo Genérico: ${this.marca} ${this.modelo} (${this.ano})`;
  }
}

// ==========================================
// 2. CLASSES FILHAS (Subclasses) - HERANÇA
// ==========================================

class Carro extends Veiculo {
  constructor(marca, modelo, ano, portas) {
    // O 'super()' chama o construtor da classe Veiculo (a classe pai)
    // Assim não precisamos repetir a atribuição de marca, modelo e ano!
    super(marca, modelo, ano); 
    this.portas = portas;
  }

  // Sobrescrevendo o método da classe pai
  descricao() {
    return `🚗 Carro: ${this.marca} ${this.modelo} (${this.ano}) - ${this.portas} portas`;
  }
}

class Moto extends Veiculo {
  constructor(marca, modelo, ano, cilindradas) {
    super(marca, modelo, ano); // Reaproveita o construtor do Veiculo
    this.cilindradas = cilindradas;
  }

  // Sobrescrevendo o método da classe pai
  descricao() {
    return `🏍️ Moto: ${this.marca} ${this.modelo} (${this.ano}) - ${this.cilindradas}cc`;
  }
}

// ==========================================
// 3. A MÁGICA DO POLIMORFISMO
// ==========================================

function imprimirDescricao(veiculo) {
  // Garantimos que o objeto passado herdou de Veiculo
  if (!(veiculo instanceof Veiculo)) {
    console.error("❌ Erro: O objeto informado não é um veículo válido.");
    return;
  }
  
  // POLIMORFISMO EM AÇÃO:
  // A função não quer saber se é Carro ou Moto. Ela só diz: "Me dê a sua descrição!".
  // O JavaScript é inteligente o suficiente para executar a versão correta do método.
  console.log(veiculo.descricao());
}

// ==========================================
// 4. TESTANDO NO CONSOLE
// ==========================================

const meuCarro = new Carro("Toyota", "Corolla", 2022, 4);
const minhaMoto = new Moto("Honda", "CB 500", 2021, 500);
const veiculoEstranho = new Veiculo("Marca X", "Modelo Y", 2000); // Veículo genérico

console.log("--- Imprimindo Descrições ---");
imprimirDescricao(meuCarro);
imprimirDescricao(minhaMoto);
imprimirDescricao(veiculoEstranho);

console.log("--- Testando a Proteção ---");
imprimirDescricao("Uma string qualquer tentando se passar por veículo");

// ==========================================
// 1. CLASSES DE DADOS (Modelos)
// ==========================================

class Livro {
  constructor(codigo, titulo, autor) {
    if (!codigo || !titulo) throw new Error("Código e Título do livro são obrigatórios.");
    this.codigo = codigo;
    this.titulo = titulo;
    this.autor = autor;
  }
}

class UsuarioBiblioteca {
  constructor(matricula, nome) {
    if (!matricula || !nome) throw new Error("Matrícula e Nome do usuário são obrigatórios.");
    this.matricula = matricula;
    this.nome = nome;
  }
}

// ==========================================
// 2. CLASSE GERENCIADORA (Regras de Negócio)
// ==========================================

class ControleEmprestimos {
  // ENCAPSULAMENTO: A lista de empréstimos é privada (#)
  #emprestimosAtivos = [];

  // Método para emprestar um livro
  emprestar(usuario, livro) {
    // 1. Validação de segurança (Garantir que recebemos objetos corretos)
    if (!(usuario instanceof UsuarioBiblioteca)) throw new Error("Usuário inválido.");
    if (!(livro instanceof Livro)) throw new Error("Livro inválido.");

    // 2. Regra: Impedir que o mesmo livro seja emprestado duas vezes para o MESMO usuário
    const jaPossuiOLivro = this.#emprestimosAtivos.some(
      (emprestimo) => 
        emprestimo.usuario.matricula === usuario.matricula && 
        emprestimo.livro.codigo === livro.codigo
    );

    if (jaPossuiOLivro) {
      throw new Error(`❌ O usuário ${usuario.nome} já está com o livro '${livro.titulo}' emprestado.`);
    }

    // Se passou pela regra, registramos o empréstimo
    const novoEmprestimo = {
      usuario: usuario,
      livro: livro,
      dataEmprestimo: new Date().toLocaleDateString() // Pega a data de hoje
    };

    this.#emprestimosAtivos.push(novoEmprestimo);
    console.log(`✅ Empréstimo Aprovado: '${livro.titulo}' para ${usuario.nome}.`);
  }

  // Método para listar os empréstimos (Expõe os dados sem expor a lista original)
  listarEmprestimos() {
    if (this.#emprestimosAtivos.length === 0) {
      console.log("📚 Nenhum empréstimo ativo no momento.");
      return [];
    }

    console.log("--- Lista de Empréstimos Ativos ---");
    this.#emprestimosAtivos.forEach((emp) => {
      console.log(`📖 ${emp.livro.titulo} -> 👤 ${emp.usuario.nome} (Desde: ${emp.dataEmprestimo})`);
    });

    // Retorna uma cópia da lista para manter a original protegida
    return [...this.#emprestimosAtivos]; 
  }

  // Bônus: Método para devolver o livro
  devolver(usuario, livro) {
    const tamanhoAntes = this.#emprestimosAtivos.length;
    
    // Filtra a lista mantendo apenas os empréstimos que NÃO são desse usuário com esse livro
    this.#emprestimosAtivos = this.#emprestimosAtivos.filter(
      (emp) => !(emp.usuario.matricula === usuario.matricula && emp.livro.codigo === livro.codigo)
    );

    if (this.#emprestimosAtivos.length === tamanhoAntes) {
      throw new Error(`⚠️ Nenhum empréstimo encontrado do livro '${livro.titulo}' para ${usuario.nome}.`);
    } else {
      console.log(`🔄 Devolução Concluída: '${livro.titulo}' por ${usuario.nome}.`);
    }
  }
}

// ==========================================
// 3. TESTANDO AS REGRAS NO CONSOLE
// ==========================================

try {
  const biblioteca = new ControleEmprestimos();

  // Criando dados
  const livro1 = new Livro("LIV-001", "O Senhor dos Anéis", "J.R.R. Tolkien");
  const livro2 = new Livro("LIV-002", "1984", "George Orwell");
  
  const user1 = new UsuarioBiblioteca("MAT-101", "Ana Silva");
  const user2 = new UsuarioBiblioteca("MAT-102", "Carlos Souza");

  console.log("\n--- Realizando Empréstimos ---");
  biblioteca.emprestar(user1, livro1); // Ana pega o Senhor dos Anéis
  biblioteca.emprestar(user1, livro2); // Ana também pega 1984
  biblioteca.emprestar(user2, livro1); // Carlos pega a outra cópia do Senhor dos Anéis

  console.log("\n");
  biblioteca.listarEmprestimos();

  console.log("\n--- Testando a Regra de Bloqueio ---");
  // TESTE DE FALHA: Ana tenta pegar "O Senhor dos Anéis" de novo
  biblioteca.emprestar(user1, livro1); 

} catch (erro) {
  // O erro da Ana tentando pegar o livro duplicado vai cair aqui!
  console.error(erro.message);
}

// ==========================================
// 1. CLASSE BASE (Superclasse)
// ==========================================
class Pagamento {
  constructor(valor) {
    if (typeof valor !== 'number' || valor <= 0) {
      throw new Error("O valor do pagamento deve ser maior que zero.");
    }
    this.valor = valor;
  }

  // Método genérico que será sobrescrito (substituído) pelas filhas
  processar() {
    console.log(`Processando um pagamento genérico de R$ ${this.valor.toFixed(2)}...`);
  }
}

// ==========================================
// 2. CLASSES FILHAS (Meios de Pagamento Específicos)
// ==========================================
class PagamentoCartao extends Pagamento {
  constructor(valor, numeroCartao, parcelas) {
    super(valor); // Repassa o valor para a classe pai validar e guardar
    this.numeroCartao = numeroCartao;
    this.parcelas = parcelas;
  }

  // Sobrescrevendo o processar() para Cartão
  processar() {
    // Pega só os últimos 4 dígitos do cartão para segurança
    const finalCartao = this.numeroCartao.slice(-4); 
    console.log(`💳 [CARTÃO] Aprovando R$ ${this.valor.toFixed(2)} em ${this.parcelas}x.`);
    console.log(`   └─ Final do cartão: ${finalCartao}`);
  }
}

class PagamentoPix extends Pagamento {
  constructor(valor, chavePix) {
    super(valor);
    this.chavePix = chavePix;
  }

  // Sobrescrevendo o processar() para PIX
  processar() {
    console.log(`💠 [PIX] Gerando QR Code no valor de R$ ${this.valor.toFixed(2)}.`);
    console.log(`   └─ Chave destino: ${this.chavePix}`);
  }
}

class PagamentoBoleto extends Pagamento {
  constructor(valor) {
    super(valor);
    // Cria uma data de vencimento para 3 dias no futuro
    const data = new Date();
    data.setDate(data.getDate() + 3);
    this.vencimento = data.toLocaleDateString();
  }

  // Sobrescrevendo o processar() para Boleto
  processar() {
    console.log(`📄 [BOLETO] Código de barras gerado para R$ ${this.valor.toFixed(2)}.`);
    console.log(`   └─ Vencimento: ${this.vencimento}`);
  }
}

// ==========================================
// 3. O CHECKOUT (A mágica do Polimorfismo)
// ==========================================

// Esta função não sabe (e não liga) se é cartão, pix ou boleto. 
// Ela apenas manda "processar"!
function pagar(pagamento) {
  if (!(pagamento instanceof Pagamento)) {
    console.error("❌ Erro: Forma de pagamento recusada (Não é um objeto de pagamento válido).");
    return;
  }
  
  // Aqui acontece o Polimorfismo!
  pagamento.processar();
  console.log("-------------------------------------------------");
}

// ==========================================
// 4. TESTANDO NO CONSOLE
// ==========================================

try {
  // Criando os pagamentos
  const meuCartao = new PagamentoCartao(250.00, "1234567890124321", 3);
  const meuPix = new PagamentoPix(85.50, "meuemail@email.com");
  const meuBoleto = new PagamentoBoleto(120.00);
  
  const pagamentoEstranho = new Pagamento(50.00); // Pagamento sem tipo definido

  console.log("\n💰 INICIANDO PROCESSAMENTO DE PAGAMENTOS 💰\n");

  // O caixa do supermercado chamando a mesma função para todos:
  pagar(meuCartao);
  pagar(meuPix);
  pagar(meuBoleto);
  pagar(pagamentoEstranho);

  // Testando o bloqueio de segurança
  console.log("\n🔒 Testando sistema de segurança:");
  pagar("Transferência de boca"); // Vai gerar erro, não é objeto Pagamento

  // Testando a regra do valor (Tentando pagar zero reais)
  // const pagamentoInvalido = new PagamentoPix(0, "chave"); // Remova as barras (//) para testar o erro!

} catch (erro) {
  console.error("ALERTA NO SISTEMA:", erro.message);
}

// VARIÁVEIS SOLTAS (Fácil de perder o controle se tivermos 30 alunos)
let nomeAluno = "João Silva";
let notas = [7.5, 8.0, 6.0];

// FUNÇÕES GENÉRICAS
function calcularMedia(arrayNotas) {
  let soma = 0;
  for(let i = 0; i < arrayNotas.length; i++) {
    soma += arrayNotas[i];
  }
  return soma / arrayNotas.length;
}

function verificarAprovacao(media) {
  if (media >= 7.0) {
    return "Aprovado";
  } else {
    return "Reprovado";
  }
}

// EXECUÇÃO (Temos que amarrar tudo na mão)
let mediaFinal = calcularMedia(notas);
let status = verificarAprovacao(mediaFinal);
console.log("Aluno: " + nomeAluno + " - Média: " + mediaFinal.toFixed(1) + " - Status: " + status);

class Aluno {
  // ENCAPSULAMENTO: A lista de notas é privada para evitar notas falsas
  #notas = [];

  constructor(nome) {
    if (!nome) throw new Error("O nome do aluno é obrigatório.");
    this.nome = nome;
  }

  // MÉTODO COM VALIDAÇÃO: Protege as regras de negócio
  adicionarNota(nota) {
    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
      throw new Error(`A nota ${nota} é inválida. Insira um valor entre 0 e 10.`);
    }
    this.#notas.push(nota);
  }

  // RESPONSABILIDADE ÚNICA: O próprio aluno calcula sua média
  calcularMedia() {
    if (this.#notas.length === 0) return 0;
    
    // O 'reduce' é uma forma moderna e limpa de somar os itens do array
    const soma = this.#notas.reduce((acumulador, notaAtual) => acumulador + notaAtual, 0);
    return soma / this.#notas.length;
  }

  // RESPONSABILIDADE ÚNICA: O próprio aluno sabe se passou ou não
  obterStatus() {
    return this.calcularMedia() >= 7.0 ? "Aprovado ✅" : "Reprovado ❌";
  }

  // MÉTODO DE EXIBIÇÃO
  gerarBoletim() {
    const media = this.calcularMedia().toFixed(1);
    console.log(`🎓 Aluno: ${this.nome} | Média: ${media} | Status: ${this.obterStatus()}`);
  }
}

// ==========================================
// TESTANDO O PODER DA POO
// ==========================================

try {
  // 1. Criando alunos (O reuso fica incrivelmente fácil)
  const joao = new Aluno("João Silva");
  const maria = new Aluno("Maria Souza");

  // 2. Adicionando notas
  joao.adicionarNota(7.5);
  joao.adicionarNota(8.0);
  joao.adicionarNota(6.0);

  maria.adicionarNota(9.0);
  maria.adicionarNota(9.5);

  // 3. Exibindo os resultados
  console.log("--- Boletins Escolares ---");
  joao.gerarBoletim();
  maria.gerarBoletim();

  // 4. Testando a proteção (Isso vai gerar um erro e proteger o sistema!)
  console.log("\n--- Testando Invasão de Notas ---");
  joao.adicionarNota(15); // Nota impossível

} catch (erro) {
  console.error("ALERTA DE SEGURANÇA:", erro.message);
}
