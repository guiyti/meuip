# MeuIP - Aplicação React com Vite e TypeScript

## 📋 Sobre o Projeto

MeuIP é uma aplicação web moderna desenvolvida com React, TypeScript e Vite, utilizando o framework de componentes Shadcn UI. A aplicação oferece uma interface moderna e responsiva, construída com as melhores práticas de desenvolvimento web.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn UI** - Biblioteca de componentes
- **React Router DOM** - Roteamento
- **React Query** - Gerenciamento de estado e cache
- **Supabase** - Backend as a Service
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas

## 🛠️ Estrutura do Projeto

```
meuip/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── hooks/         # Custom hooks
│   ├── integrations/  # Integrações com serviços externos
│   ├── lib/          # Utilitários e configurações
│   ├── pages/        # Páginas da aplicação
│   └── App.tsx       # Componente principal
├── public/           # Arquivos estáticos
├── supabase/         # Configurações do Supabase
└── ...
```

## ⚙️ Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou bun (gerenciador de pacotes)

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd meuip
```

2. Instale as dependências:
```bash
# Usando npm
npm install

# Ou usando bun
bun install
```

3. Inicie o servidor de desenvolvimento:
```bash
# Usando npm
npm run dev

# Ou usando bun
bun dev
```

4. Acesse a aplicação em `http://localhost:5173`

## 📦 Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento
- `build`: Gera a build de produção
- `build:dev`: Gera a build de desenvolvimento
- `lint`: Executa o linter no código
- `preview`: Visualiza a build localmente

## 🔧 Configuração

Para configurar o projeto, você precisará:

1. Configurar as variáveis de ambiente (crie um arquivo `.env` na raiz do projeto):
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 📚 Documentação Adicional

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

Para questões e sugestões, por favor abra uma issue no repositório.
