# Faustino Drinks App 🍸

Um web app moderno para pedidos de drinks, focado em experiência mobile-first com design premium.

## 🚀 Como Rodar

O projeto usa **Vite** e **React**. Para começar:

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`.

## 🛠️ Tecnologias

- **React** + **Vite**: Performance e DX.
- **TypeScript**: Segurança e tipagem.
- **Styled Components**: Estilização dinâmica e temas.
- **Framer Motion**: Animações fluidas (ex: transições de carrinho).
- **React Query** (`@tanstack/react-query`): Gerenciamento de estado de servidor e cache.

## 📂 Estrutura

- `src/api`: Chamadas diretas ao backend/serviços.
- `src/queries`: Hooks do React Query (ex: `useGetDrinks`).
- `src/context`: Gerenciamento de estado global (Carrinho).
- `src/components`: Componentes divididos por contexto (`mobile`, `desktop`, `common`).
- `src/styles`: Temas (`light`/`dark`) e estilos globais.

## ✨ Destaques de UX

- **Carrinho Bottom-Sheet**: Interface móvel nativa para gestão de pedidos.
- **Modo Escuro**: Suporte completo a temas Light/Dark.
- **Feedback Visual**: Loadings personalizados e micro-interações nos botões.
