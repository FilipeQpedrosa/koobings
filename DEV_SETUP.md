# 🚀 Service Scheduler - Guia de Desenvolvimento Local

## ✅ Projeto A Correr!

O seu projeto **Service Scheduler** está agora a correr localmente! 🎉

### 📍 URLs de Acesso

- **Aplicação Principal**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321

### 🗃️ Base de Dados

- **Tipo**: PostgreSQL (via Supabase local)
- **URL**: `postgresql://postgres:postgres@localhost:54322/postgres`
- **Estado**: ✅ Configurada e a correr

### 🛠️ Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Correr testes
npm test

# Verificar lint
npm run lint

# Gerar cliente Prisma (após mudanças no schema)
npx prisma generate

# Aplicar mudanças na base de dados
npx prisma db push

# Ver base de dados no browser (Prisma Studio)
npx prisma studio
```

### 🏗️ Estrutura do Projeto

```
service-scheduler/
├── src/app/          # Next.js App Router (páginas)
├── src/components/   # Componentes React
├── src/lib/         # Utilitários e serviços
├── prisma/          # Schema da base de dados
└── public/          # Ficheiros estáticos
```

### 🔧 Configuração de Ambiente

O ficheiro `.env.local` foi criado automaticamente com:

- **DATABASE_URL**: Ligação à base de dados local
- **NEXTAUTH_SECRET**: Chave para autenticação
- **NODE_ENV**: development

### 📝 Próximos Passos

1. **Aceder à aplicação**: http://localhost:3000
2. **Explorar o código**: Começar por `src/app/page.tsx`
3. **Ver base de dados**: http://localhost:54323 (Supabase Studio)
4. **Desenvolver features**: Adicionar componentes em `src/components/`

### 🚨 Resolução de Problemas

#### Se o servidor não iniciar:
```bash
# Verificar se a porta 3000 está livre
lsof -ti:3000 | xargs kill -9

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Reiniciar servidor
npm run dev
```

#### Se houver problemas com a base de dados:
```bash
# Regenerar cliente Prisma
npx prisma generate

# Aplicar schema novamente
npx prisma db push
```

### 🎯 Status do Projeto

- ✅ Dependências instaladas
- ✅ Base de dados configurada
- ✅ Servidor a correr
- ✅ Lint sem erros
- ✅ Build funcional

**Está tudo pronto para desenvolvimento!** 🚀

---

**Último update**: $(date)
**Porta do servidor**: 3000
**Base de dados**: Supabase local (porta 54322) 