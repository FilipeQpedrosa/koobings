#!/bin/bash

echo "🧪 Testando URLs do Sistema Dinâmico..."
echo "🌐 Servidor em: http://localhost:3001"

# Admin Portal
echo "1. Abrindo Admin Portal..."
open "http://localhost:3001/admin/businesses"
sleep 2

# Negócios Existentes
echo "2. Testando Barbearia Orlando..."
open "http://localhost:3001/barbearia-orlando/staff/dashboard"
sleep 2

echo "3. Testando Ju-unha..."
open "http://localhost:3001/ju-unha/staff/dashboard"
sleep 2

echo "4. Testando Mari Nails..."
open "http://localhost:3001/mari-nails/staff/dashboard"
sleep 2

echo "5. Testando Admin Test Business..."
open "http://localhost:3001/admin-test-business/staff/dashboard"
sleep 2

echo "6. Abrindo Login de Admin..."
open "http://localhost:3001/auth/admin-signin"
sleep 1

echo "✅ Todos os testes abertos no navegador!"
echo ""
echo "📝 Checklist de Testes:"
echo "□ Admin pode ver lista de negócios"
echo "□ Admin pode criar novo negócio"
echo "□ URLs dinâmicas funcionam"
echo "□ Features por plano estão corretas"
echo "□ Segurança/isolamento funciona"
echo "□ Autenticação está funcionando" 