# db_logistica — Sistema de Gestão e Rastreamento de Encomendas (Logistica Express)

Sistema interno (rede local) com autenticação de funcionários, CRUD de motoristas, cadastro de cargas e controle de entregas.

## 1. Requisitos

### Requisitos Funcionais (RF)
| Código | Descrição |
|---|---|
| RF01 | Cadastrar funcionário (nome, e-mail e senha) |
| RF02 | Autenticar funcionário com e-mail e senha (login) |
| RF03 | Encerrar a sessão do funcionário (logout) |
| RF04 | Exibir na página principal o funcionário logado, o menu de navegação e o logout |
| RF05 | Cadastrar motorista (nome, CNH, CPF e telefone) |
| RF06 | Listar motoristas em tabela |
| RF07 | Consultar motorista por código |
| RF08 | Consultar motorista por nome |
| RF09 | Atualizar dados do motorista |
| RF10 | Excluir motorista |
| RF11 | Cadastrar carga vinculada a um motorista (descrição, peso, volume e código de rastreio) |
| RF12 | Cadastrar entrega vinculada a uma carga (cidade destino, status, data e hora) |
| RF13 | Atualizar a entrega (incluindo o status ENTREGUE / TRANSITO) |
| RF14 | Listar entregas em tabela ordenadas por data |

### Requisitos Não Funcionais (RNF)
| Código | Descrição |
|---|---|
| RNF01 | Senha do funcionário, CNH e CPF do motorista armazenados criptografados (AES) |
| RNF02 | Dados nunca exibidos criptografados nas telas (são descriptografados antes de enviar) |
| RNF03 | Sessão com validade de 180 minutos (token com expiração) |
| RNF04 | Acesso restrito à rede interna (servidor em localhost) |
| RNF05 | Rotas privadas protegidas por middleware de autenticação |
| RNF06 | Interface web simples, com navegação acessível no topo |

### Regras de Negócio (RN)
| Código | Descrição |
|---|---|
| RN01 | Somente funcionários cadastrados e autenticados acessam o sistema |
| RN02 | O CPF do motorista deve ter exatamente 11 dígitos |
| RN03 | Toda carga deve estar associada a um motorista existente |
| RN04 | Toda entrega deve estar associada a uma carga existente |
| RN05 | O status da entrega só pode ser ENTREGUE ou TRANSITO |
| RN06 | O código de rastreio da carga é numérico e único |
| RN07 | E-mail do funcionário é único |
| RN08 | Ao excluir um motorista, suas cargas (e entregas) são excluídas em cascata |

## 2. Infraestrutura
- Banco de dados: MySQL — versão: _(preencher com a sua: `SELECT VERSION();`)_
- Linguagem: JavaScript (Node.js) — versão: _(preencher: `node -v`)_
- Back-end: Express 5, Sequelize 6, mysql2, crypto-js, cors — servidor web local em `http://localhost:3000`
- Front-end: HTML, CSS e JavaScript puro (abrir `frontend/index.html`, ex.: Live Server)
- Ferramenta de teste: REST Client (VS Code) — arquivo `backend/teste.http`
- Navegador: _(preencher: ex. Google Chrome versão X)_

## 3. Modelagem e banco
- Diagrama de classe e modelo lógico: `diagramas_UML/`
- Script do banco (estrutura + 3 registros por tabela): `banco/script_db_logistica.sql`

## 4. Como executar
```
cd backend
npm install
node sync.js     # cria as tabelas (apaga e recria)
node index.js    # sobe a API em http://localhost:3000
```
Depois abra `frontend/index.html`, cadastre um funcionário e faça login. Os testes de integração estão em `backend/teste.http`.

## 5. Rotas da API
| Método | Rota | Acesso |
|---|---|---|
| POST | /funcionario | público |
| POST | /login | público |
| POST | /motorista | privado |
| GET | /motoristas | privado |
| GET | /motorista/:id | privado |
| GET | /motorista/buscarNome/:nome | privado |
| PUT | /motorista/:id | privado |
| DELETE | /motorista/:id | privado |
| POST | /carga | privado |
| POST | /entrega | privado |
| PUT | /entrega/:id | privado |
| GET | /entregas (ordenada por data) | privado |
