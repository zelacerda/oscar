# 🏆 Bolão do Oscar

Aplicação web para criar e gerenciar bolões de apostas do Oscar entre amigos. Cada participante faz seus palpites nas categorias do prêmio e, ao final da cerimônia, o sistema calcula automaticamente quem acertou mais.

Projeto 100% open source, criado por [Zé Lacerda](https://github.com/zelacerda) com ajuda do [Claude Code](https://claude.ai/claude-code).

## Funcionalidades

### Autenticação
- Login com Google (OAuth 2.0) via NextAuth.js v5
- Sistema de papéis (usuário comum e administrador)
- Rotas protegidas com middleware

### Bolões
- Crie bolões personalizados com nome e descrição
- Cada bolão possui um código de convite único para compartilhar com amigos
- Sistema de convite com link direto — funciona tanto pra quem já tem conta quanto pra novos usuários
- Compartilhamento nativo (Web Share API) em dispositivos compatíveis, com fallback de copiar para a área de transferência
- O criador do bolão pode travar/destravar as apostas a qualquer momento

### Apostas
- Selecione seus palpites em cada categoria do Oscar
- Categorias organizadas por tiers: Ouro, Prata, Bronze e Base
- Pontuação customizável por tier em cada bolão (padrão: 10, 5, 3 e 1 ponto)
- Drag-and-drop para reorganizar categorias entre os tiers na criação do bolão
- Apostas bloqueadas automaticamente quando o bolão é travado

### Ranking e Resultados
- Ranking em tempo real com atualização automática a cada 15 segundos
- Pontuação calculada com base nos acertos e pesos de cada tier
- Medalhas para os três primeiros colocados (🥇🥈🥉)
- Destaque visual para o seu próprio nome no ranking
- Animação de confetti dourado na tela de resultado final
- Anúncio do vencedor com avatar, pontuação e mensagem personalizada

### Painel Administrativo
- Dashboard com estatísticas gerais (usuários, bolões, categorias, apostas, resultados)
- Gerenciamento completo (CRUD) de usuários, bolões, categorias, indicados e resultados
- Controle global de trava de apostas (sobrepõe travas individuais)
- Registro dos vencedores reais de cada categoria
- Finalização oficial dos bolões com um clique

### Interface
- Tema escuro com acentos dourados inspirado na estética do Oscar
- Design responsivo e otimizado para celular
- Menu de usuário com avatar do Google (ou iniciais como fallback)
- Estados de carregamento com skeleton loaders
- Página inicial com guia "Como funciona" em 4 passos
- Interface 100% em português brasileiro

## Stack Técnica

- **Framework:** [Next.js](https://nextjs.org) 16 + React 19
- **Autenticação:** NextAuth.js v5 + Prisma Adapter
- **Banco de dados:** PostgreSQL + [Prisma](https://www.prisma.io) ORM
- **Estilização:** [Tailwind CSS](https://tailwindcss.com) v4
- **Drag-and-drop:** dnd-kit
- **Confetti:** canvas-confetti

## Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Credenciais OAuth do Google ([Console do Google Cloud](https://console.cloud.google.com))

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/zelacerda/oscar.git
cd oscar
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/oscar"
AUTH_SECRET="sua-chave-secreta"
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"
```

4. Execute as migrations do banco de dados:

```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco com dados iniciais:

```bash
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Deploy

A forma mais simples de fazer deploy é pela [Vercel](https://vercel.com), que oferece suporte nativo ao Next.js. Basta conectar o repositório e configurar as variáveis de ambiente.

## Licença

Este é um projeto open source. Sinta-se à vontade para usar, modificar e contribuir.
