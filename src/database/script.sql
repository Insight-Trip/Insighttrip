CREATE DATABASE InsightTrip;
USE InsightTrip;

CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(45),
    CPF CHAR(14),
    Email VARCHAR(256),
    Senha VARCHAR(45),
    Telefone VARCHAR(14),
    Setor VARCHAR(45),
    fkAdministrador INT,
    CONSTRAINT fkFuncionario FOREIGN KEY (fkAdministrador) 
        REFERENCES Funcionario(idFuncionario)
);

CREATE TABLE Agencia (
    idAgencia INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(45),
    CNPJ CHAR(14), 
    Endereco VARCHAR(45),
    CEP VARCHAR(8), 
    fkAdministrador INT,
    CONSTRAINT fkAdministradorAgencia FOREIGN KEY (fkAdministrador) 
        REFERENCES Funcionario(idFuncionario)
);

CREATE TABLE Pais (
    idPais INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(45),
    Continente VARCHAR(45)
);

CREATE TABLE UF ( 
    CodigoIBGE INT PRIMARY KEY,
    Nome VARCHAR(45),
    Regiao VARCHAR(45)
);

CREATE TABLE Crime (
    idCrime INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(45),
    qtdOcorrencia INT,
    Data DATE,
    fkEstado INT,
    CONSTRAINT fkEstadoCriminalidade FOREIGN KEY (fkEstado) 
        REFERENCES UF(CodigoIBGE) 
);

CREATE TABLE Evento (
    idEvento INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(45),
    DataInicio DATE,
    DataFim DATE
);

CREATE TABLE EstadoHasEvento (
    idEventoEstado INT PRIMARY KEY AUTO_INCREMENT,
    fkEstado INT,
    CONSTRAINT fkEstadoEventos FOREIGN KEY (fkEstado) 
        REFERENCES UF(CodigoIBGE),
    fkEvento INT,
    CONSTRAINT fkEventosEstado FOREIGN KEY (fkEvento) 
        REFERENCES Evento(idEvento)
);

CREATE TABLE Aeroporto (
    idAeroporto INT PRIMARY KEY AUTO_INCREMENT,
    NomeAeroporto VARCHAR(75),
    fkEstado INT,
    fkPais INT,
    CONSTRAINT fkEstadoAeroportos FOREIGN KEY (fkEstado) 
        REFERENCES UF(CodigoIBGE),
	CONSTRAINT fkPaisAeroportos FOREIGN KEY (fkPais) 
        REFERENCES Pais(idPais)
);

CREATE TABLE Viagem (
    idPassagem INT PRIMARY KEY AUTO_INCREMENT,
    dtViagem DATE,
    fkAeroportoOrigem INT, 
    fkAeroportoDestino INT,
    QtdPassageirosPagos INT,
    QtdPassageirosGratis INT,
    CONSTRAINT fkAeroportoOrigem FOREIGN KEY (fkAeroportoOrigem) 
        REFERENCES Aeroporto(idAeroporto),
    CONSTRAINT fkAeroportoDestino FOREIGN KEY (fkAeroportoDestino) 
        REFERENCES Aeroporto(idAeroporto)
);

INSERT INTO Funcionario VALUES
(default, 'Admin', null, 'Admin', md5('Admin'), null, null, null),
(default, 'Usuário Teste', '12345678910', 'teste@email.com', md5('teste123'), '11 912345678', 'Marketing', null);