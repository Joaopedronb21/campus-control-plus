# Campus Control Plus

Sistema de controle acadêmico para gerenciamento de usuários, presenças e notas.

## 🚀 Como executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - A aplicação estará disponível em: `http://localhost:5175` (ou outra porta disponível)

## 👤 Usuários de Teste

Para testar a aplicação, use os seguintes usuários:

### Administrador
- **Email:** `admin@test.com`
- **Senha:** `password`

### Professor
- **Email:** `professor@test.com`
- **Senha:** `password`

### Aluno
- **Email:** `aluno@test.com`
- **Senha:** `password`

## 🔧 Funcionalidades

- **Login/Logout de usuários**
- **Dashboard específico por tipo de usuário:**
  - Administrador: Gerenciamento completo
  - Professor: Gerenciamento de aulas e presenças
  - Aluno: Visualização de notas e presenças

## 📝 Nota

Esta é uma versão de demonstração que usa dados mock para simular o backend. Em produção, seria necessário implementar um backend real com API REST e banco de dados.

## 🛠️ Build para Produção

```bash
npm run build
```

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Faz build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
