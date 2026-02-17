# 🏋️‍♂️ Gym Tracker (MVP)

**AINDA EM DESENVOLVIMENTO**

Este é um aplicativo de anotação e acompanhamento de treinos simples. Desenvolvi este projeto como um Produto Mínimo Viável (MVP) durante as minhas férias da faculdade para gerenciar minha rotina de exercícios na academia, servindo também como uma demonstração de habilidades de desenvolvimento Full-Stack.

## 🎯 Objetivo do Projeto
Criar uma plataforma intuitiva para registro e acompanhamento de treinos diários. A arquitetura foi pensada para ser escalável, utilizando contêineres para facilitar a execução em qualquer ambiente.



## ✍️ Notação: 
**< exercicio >: (peso) < num_execuções >**

### Exemplo

Supino reto: (30Kg) 10 10 10 (25Kg) 12 
Significa que, no exercicio 'Supino reto' foram feitas 3 séries de 10 repetições com 30 Quiligramas, e mais uma série de 12 repetições com 25 Quilogramas.

A estrutura da base de dados permite ainda cadastro de exercicios com outras unidades de medida, como polegadas, quilômetros, unidades abstratas, etc. Basta que um novo registro seja adicionado à relação de unidades da base de dados.


## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

### Frontend
* **React (v19)**: Biblioteca principal para a construção da interface de usuário.
* **TypeScript**: Adiciona tipagem estática ao JavaScript, garantindo maior segurança e facilidade na manutenção do código.
* **Vite**: Ferramenta de build para a aplicação front-end.
* **Chakra UI & Emotion**: Utilizados para a criação de componentes de interface estilizados, responsivos e acessíveis.
* **Zod**: Para validação de dados e formulários.
* **Axios**: Cliente HTTP para realizar a comunicação com a API.
<!-- * **Framer Motion**: Adição de animações fluidas na interface. -->

### Backend
* **Java 21**: Linguagem de programação moderna e performática.
* **Spring Boot (v3.5.10)**: Framework para a criação da API RESTful.
* **Spring Security & JWT (Auth0)**: Implementação de autenticação e autorização seguras baseadas em tokens.
* **Spring Data JPA**: Abstração para o acesso a dados e persistência.
* **Lombok**: Redução de código boilerplate (getters, setters, construtores).

### Banco de Dados e Infraestrutura
* **PostgreSQL 15 (Alpine)**: Banco de dados relacional escolhido pela sua robustez e confiabilidade para armazenamento de dados estruturados sensíveis, como dados de usuário.
* **< ainda não implementado >** **MongoDB**: Banco de dados NoSQL escolhido pela sua flexibilidade e eficiência no armazenamento de dados não estruturados, imutáveis/consolidados e/ou antigos, como treinos e relatórios de treinos consolidados, logs de aplicação, etc.
* **Docker & Docker Compose**: Orquestração dos serviços (Frontend, Backend e Banco de Dados) para garantir que o ambiente de desenvolvimento seja o mesmo em qualquer máquina.

## 🏗️ Estrutura do Projeto

A infraestrutura foi configurada para rodar simultaneamente através do Docker Compose, garantindo a comunicação entre os microsserviços por meio da rede `spring-network`.

O mapeamento de portas padrão, em ambiente de desenvolvimento, é:
* **Frontend**: `http://localhost:5173`.
* **Backend (API)**: `http://localhost:8080`.
* **PostgreSQL**: Porta `5432`.

Todos os serviços tem mapeamento das suas respectivas portas para o host, mitigando a necessidade de build de imagens e containers durante o processo de desenvolvimento. 

