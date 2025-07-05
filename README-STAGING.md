# 🧪 Ambiente de Staging/Testes - Koobings

## Configuração de Ambientes

### 🚀 **Produção**
- **URL**: https://koobings.com
- **Branch**: `main`
- **Database**: Produção (Supabase)
- **Deploy**: Automático quando há push para `main`

### 🧪 **Staging/Testes**
- **URL**: https://staging-koobings.vercel.app
- **Branch**: `staging`
- **Database**: Staging (separada da produção)
- **Deploy**: Automático quando há push para `staging`

## Como Usar o Ambiente de Staging

### 1. **Desenvolvimento e Testes**
```bash
# Mudar para branch staging
git checkout staging

# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"

# Push para staging (deploy automático)
git push origin staging
```

### 2. **Verificar Alterações**
- Aceder a https://staging-koobings.vercel.app
- Testar todas as funcionalidades
- Verificar se tudo funciona corretamente

### 3. **Promover para Produção**
```bash
# Quando tudo estiver OK no staging
git checkout main
git merge staging
git push origin main
```

## Diferenças entre Ambientes

### 🧪 **Staging**
- ✅ Banner amarelo a avisar que é ambiente de testes
- ✅ Dados podem ser apagados/reset
- ✅ Configurações de teste (emails, etc.)
- ✅ `X-Robots-Tag: noindex, nofollow` (não indexado no Google)

### 🚀 **Produção**
- ✅ Sem banner de aviso
- ✅ Dados permanentes
- ✅ Configurações reais
- ✅ Indexado no Google

## Configuração de Secrets no GitHub

Para o staging funcionar, precisas de configurar estas secrets no GitHub:

### Secrets Necessários:
```
VERCEL_STAGING_PROJECT_ID=xxx
STAGING_DATABASE_URL=xxx
STAGING_NEXTAUTH_SECRET=xxx
STAGING_NEXTAUTH_URL=https://staging-koobings.vercel.app
STAGING_SENDGRID_API_KEY=xxx
STAGING_EMAIL_FROM=xxx
```

## Vantagens do Ambiente de Staging

### ✅ **Segurança**
- Testar sem afetar utilizadores reais
- Verificar alterações antes de ir para produção
- Evitar bugs em produção

### ✅ **Confiança**
- Testar funcionalidades completas
- Verificar integrações (email, pagamentos, etc.)
- Validar performance

### ✅ **Processo**
- Workflow de desenvolvimento mais profissional
- Possibilidade de mostrar funcionalidades a clientes
- Ambiente para testes de QA

## Comandos Úteis

```bash
# Ver em que branch estás
git branch

# Mudar para staging
git checkout staging

# Criar nova funcionalidade
git checkout -b feature/nova-funcionalidade
git commit -m "feat: nova funcionalidade"

# Merge para staging para testar
git checkout staging
git merge feature/nova-funcionalidade
git push origin staging

# Depois de testar, merge para produção
git checkout main
git merge staging
git push origin main
```

## 🔧 Configuração Inicial

1. **Criar projeto no Vercel para staging**
2. **Configurar secrets no GitHub**
3. **Configurar base de dados separada para staging**
4. **Testar deploy automático**

---

**💡 Dica**: Usa sempre o staging para testar alterações importantes antes de ir para produção! 