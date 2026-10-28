-- Script do banco db_logistica (estrutura + 3 registros por tabela)
-- CNH, CPF e senha estão criptografados (AES / crypto-js)


CREATE DATABASE /*!32312 IF NOT EXISTS*/ `db_logistica` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `db_logistica`;
CREATE TABLE `cargas` (
  `codCarga` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `peso` float NOT NULL,
  `volume` float NOT NULL,
  `codRastreio` int(11) NOT NULL,
  `idMotorista` int(11) NOT NULL,
  PRIMARY KEY (`codCarga`),
  UNIQUE KEY `codRastreio` (`codRastreio`),
  KEY `idMotorista` (`idMotorista`),
  CONSTRAINT `cargas_ibfk_1` FOREIGN KEY (`idMotorista`) REFERENCES `motoristas` (`codMotorista`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `cargas` WRITE;
INSERT INTO `cargas` VALUES
(1,'Caixas de eletrônicos',250.5,3.2,100001,1),
(2,'Paletes de alimentos',800,10.5,100002,2),
(3,'Material de construção',1500,12,100003,3);
UNLOCK TABLES;
CREATE TABLE `entregas` (
  `codEntrega` int(11) NOT NULL AUTO_INCREMENT,
  `cidade` varchar(100) NOT NULL,
  `status` enum('ENTREGUE','TRANSITO') NOT NULL,
  `data` date NOT NULL,
  `hora` time NOT NULL,
  `idCarga` int(11) NOT NULL,
  PRIMARY KEY (`codEntrega`),
  KEY `idCarga` (`idCarga`),
  CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`idCarga`) REFERENCES `cargas` (`codCarga`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `entregas` WRITE;
INSERT INTO `entregas` VALUES
(1,'Florianópolis','TRANSITO','2026-10-25','14:00:00',1),
(2,'Curitiba','ENTREGUE','2026-10-05','10:30:00',2),
(3,'Porto Alegre','TRANSITO','2026-10-15','16:00:00',3);
UNLOCK TABLES;
CREATE TABLE `funcionarios` (
  `codFuncionario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  PRIMARY KEY (`codFuncionario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `funcionarios` WRITE;
INSERT INTO `funcionarios` VALUES
(1,'Carlos','carlos@logistica.com','U2FsdGVkX19HZMj1ptMGLsrSXJWh6cbvgb5suXHKi5g='),
(2,'Fernanda','fernanda@logistica.com','U2FsdGVkX1+PA4/nd6EFlokmoffTXHcQaO65B4pThpw='),
(3,'Paulo','paulo@logistica.com','U2FsdGVkX1/CZ7J8IkG+qC5LAkBPVNPkCYEGQv0RFl0=');
UNLOCK TABLES;
CREATE TABLE `motoristas` (
  `codMotorista` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cnh` varchar(100) NOT NULL,
  `cpf` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  PRIMARY KEY (`codMotorista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `motoristas` WRITE;
INSERT INTO `motoristas` VALUES
(1,'Marcos','U2FsdGVkX185UAvxonn8wqIsVbSZ4gNFal2TUgPbyko=','U2FsdGVkX18vXwv4GYuvZtPw2P0i3u8v1qq9Hy/NiWk=','48999998888'),
(2,'Ana','U2FsdGVkX19GRLFT5xIC69OWcwBX8//A9kd06EgSl7U=','U2FsdGVkX1/sgC/ytK8i2AOT26dGixIZPL3i+z4hax8=','48988887777'),
(3,'Roberto','U2FsdGVkX1+IAf6e5dbr0yl7RMmqXHIJOADKhdgNAj8=','U2FsdGVkX19krSOl6tsLj21BykAkpibWSreZNv0RtJc=','48977776666');
UNLOCK TABLES;


