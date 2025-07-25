# 🔑 ACESSO PORTAL ADMIN

## 🚀 PRODUÇÃO (https://koobings.com)
- **URL**: https://koobings.com/auth/admin-signin
- **Email principal**: `f.queirozpedrosa@gmail.com`  
- **Email alternativo**: `admin@koobings.com`
- **Password**: `admin123`
- **Dashboard**: https://koobings.com/admin/dashboard

### ✅ Status Verificado
- ✅ Conexão à base de dados de produção: OK
- ✅ Admin users criados: 2 contas
- ✅ Login testado via API: Funcional
- ✅ Portal acessível: https://koobings.com

### 📊 Estado da Base de Dados - **LIMPA!**
- **Empresas registadas**: 0 ✅
- **Clientes**: 0 ✅
- **Serviços**: 0 ✅
- **Agendamentos**: 0 ✅
- **Staff**: 0 ✅
- **Ambiente**: PRODUÇÃO LIMPA
- **Dados**: ✅ **TODOS OS DADOS DE PRODUÇÃO ELIMINADOS**
- **Admins preservados**: 2 contas funcionais

## 🧪 LOCAL (localhost:3001)
- **URL**: http://localhost:3001/auth/admin-signin
- **Email**: `admin@koobings.com`  
- **Password**: `admin123`
- **Dashboard**: http://localhost:3001/admin/dashboard

### 📊 Estado da Base de Dados Local
- **Empresas**: 0 (base limpa)
- **Ambiente**: Desenvolvimento
- **Dados**: Base de dados limpa para testes

## Login via API (teste)
```bash
# Produção
curl -X POST https://koobings.com/api/simple-admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"f.queirozpedrosa@gmail.com","password":"admin123"}'

# Local
curl -X POST http://localhost:3001/api/simple-admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@koobings.com","password":"admin123"}'
```

## Comandos úteis
```bash
# Verificar health da aplicação
curl https://koobings.com/api/health

# Verificar empresas na BD de produção (deve retornar 0)
curl https://koobings.com/api/admin/businesses

# Criar admin local (se necessário)
node diagnose-admin.js

# Verificar e limpar produção (se necessário)
npx ts-node scripts/verify-and-clean.ts
```

## 🧹 **LIMPEZA CONCLUÍDA**
✅ **22 empresas** removidas  
✅ **63 clientes** removidos  
✅ **30 serviços** removidos  
✅ **58 agendamentos** removidos  
✅ **28 membros do staff** removidos  
✅ **Todos os dados relacionados** eliminados  
✅ **Utilizadores admin preservados** (2 contas)  
✅ **Estrutura da base de dados intacta**  

---
*Última verificação: 25/07/2025 20:45 - PRODUÇÃO TOTALMENTE LIMPA* ✅ 