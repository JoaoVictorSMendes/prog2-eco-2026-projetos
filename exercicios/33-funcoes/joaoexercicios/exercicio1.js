// Criando a função (Arrow Function)
const apresentar = (nome, curso, semestre = 1) => `${nome} - ${curso} - ${semestre}º semestre`;

// Testando a função e imprimindo o resultado no terminal
console.log(apresentar("Ana", "Eng. Computação", 3));
console.log(apresentar("João", "Eng. Computação"));
