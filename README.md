Organizei as informações para destacar a complexidade técnica (Full Stack, Segurança, Integrações) e facilitar a leitura por recrutadores.

🎉 PartyTime
O seu gestor de festas pessoal.

O PartyTime é uma aplicação Full-Stack completa construída para centralizar o planejamento e a gestão de eventos. Desde o controle financeiro até a gestão de convidados com RSVP inteligente, o projeto foi desenvolvido com uma arquitetura moderna, focada em segurança, boas práticas (Clean Code, DTOs) e uma excelente experiência de usuário.

✨ Funcionalidades
A aplicação é dividida entre uma Área Pública (Landing Page) e uma Área Privada (Dashboard de Gestão).

🔐 Autenticação e Segurança
Login Seguro: Sistema de registro e login com criptografia de senha (bcrypt).

Sessão JWT via Cookie: Implementação de JSON Web Tokens armazenados em cookies HttpOnly, protegendo a aplicação contra ataques XSS.

Gestão de Perfil: O usuário pode atualizar dados cadastrais e possui controle total para exclusão de conta.

📋 Gestão de Eventos (Festas)
Criação Detalhada: Formulários robustos com validação front-end (Zod + React Hook Form) e back-end (DTOs + Class Validator).

Dashboard: Visão geral com contagem de festas e resumo orçamentário.

CRUD Completo: Criação, leitura, edição e exclusão de eventos.

💰 Controle Financeiro
Orçamento Dinâmico: Painel em tempo real que calcula automaticamente o Orçamento Total, Total Gasto e Saldo Restante.

Serviços: Adicione custos como DJ, Buffet ou Decoração; o sistema deduz automaticamente do orçamento disponível.

🤵 Convidados & RSVP Inteligente
Integração com WhatsApp: Geração automática de links "Click to Chat" com mensagens de convite personalizadas.

Token Único de Acesso: Cada convite gera um link exclusivo e seguro para confirmação de presença.

Proteção por Senha: (Opcional) Organizadores podem definir uma senha extra para acessar a página de RSVP.

Notificações via E-mail: O organizador recebe um alerta via Resend API sempre que um convidado confirma presença.

🚀 Stack Tecnológica
Backend (API)
Framework: NestJS

Linguagem: TypeScript

Banco de Dados: PostgreSQL (Hospedado na Neon - Serverless)

ORM: Sequelize

Autenticação: Passport.js & JWT (@nestjs/jwt)

Validação: class-validator & class-transformer

Serviços Externos: Resend (E-mail Transactional)

Frontend (Client)
Framework: React (via Vite)

Roteamento: React Router DOM

Formulários: React Hook Form + Zod (Schema Validation)

Estilização: CSS Modules + Variáveis CSS Globais

HTTP Client: Axios

📁 Estrutura do Projeto
O projeto segue uma estrutura monorepo-like para facilitar a organização:

Bash

PartyTime/
├── 📂 backend/         # API NestJS
│   ├── src/
│   ├── .env            # Variáveis de ambiente do servidor
│   └── package.json
│
└── 📂 frontend/        # Aplicação React/Vite
    ├── src/
    └── package.json
🏁 Como Rodar Localmente
Pré-requisitos
Node.js (v18+)

PostgreSQL (Local ou via Docker)

1. Configuração do Backend
Bash

# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz de /backend e preencha:
# DB_HOST=localhost
# DB_USER=seu_usuario
# DB_PASS=sua_senha
# DB_NAME=partytime_db
# JWT_SECRET=segredo_super_seguro
# RESEND_API_KEY=sua_chave_resend

# Rode as migrations (Sequelize)
npx sequelize-cli db:migrate

# Inicie o servidor
npm run start:dev
2. Configuração do Frontend
Bash

# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
Acesse a aplicação em: http://localhost:5173 (ou a porta indicada pelo Vite).

👨‍💻 Autor
Desenvolvido por Cláudio Roberto.
