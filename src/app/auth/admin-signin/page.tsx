'use client';

export default function AdminSignInPage() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Koobings</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: #f5f5f5; 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        .container { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            width: 400px; 
            max-width: 90%; 
        }
        h1 { 
            text-align: center; 
            margin-bottom: 30px; 
            color: #333; 
            font-size: 24px; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: bold; 
            color: #333; 
        }
        input { 
            width: 100%; 
            padding: 12px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 16px; 
        }
        button { 
            width: 100%; 
            padding: 12px; 
            background: #007acc; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            cursor: pointer; 
            font-weight: bold; 
        }
        button:disabled { 
            background: #ccc; 
            cursor: not-allowed; 
        }
        .status { 
            padding: 12px; 
            margin-bottom: 20px; 
            border-radius: 4px; 
            font-size: 14px; 
        }
        .status.error { 
            background: #fee; 
            color: #c33; 
        }
        .status.success { 
            background: #efe; 
            color: #060; 
        }
        .back-link { 
            text-align: center; 
            margin-top: 20px; 
        }
        .back-link a { 
            color: #666; 
            text-decoration: none; 
            font-size: 14px; 
        }
        .hidden { 
            display: none; 
        }
        .security-notice {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Admin Portal</h1>
        
        <div class="security-notice">
            🛡️ Sistema Ultra-Seguro: Este portal utiliza autenticação de nível militar com monitorização de ameaças em tempo real.
        </div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required autocomplete="username">
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            
            <div id="status" class="status hidden"></div>
            
            <button type="submit" id="submitBtn">Entrar</button>
        </form>
        
        <div class="back-link">
            <a href="/auth/signin">← Voltar ao login normal</a>
        </div>
    </div>

    <script>
        const form = document.getElementById('loginForm');
        const status = document.getElementById('status');
        const submitBtn = document.getElementById('submitBtn');
        
        // 🚨 SECURITY: Prevent credentials in URL
        if (window.location.search.includes('email') || window.location.search.includes('password')) {
            console.warn('🚨 SECURITY WARNING: Credentials detected in URL - clearing...');
            window.history.replaceState({}, document.title, window.location.pathname);
            showStatus('⚠️ Por segurança, as credenciais foram removidas do URL', true);
        }
        
        function showStatus(message, isError = false) {
            status.textContent = message;
            status.className = 'status ' + (isError ? 'error' : 'success');
            status.classList.remove('hidden');
        }
        
        function hideStatus() {
            status.classList.add('hidden');
        }
        
        // Security: Clear form on page unload
        window.addEventListener('beforeunload', () => {
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Enhanced validation
            if (!email || !password) {
                showStatus('Por favor preencha todos os campos', true);
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatus('Formato de email inválido', true);
                return;
            }
            
            // Password strength check
            if (password.length < 6) {
                showStatus('Password deve ter pelo menos 6 caracteres', true);
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = '🔐 A autenticar...';
            showStatus('🛡️ Verificando segurança...');
            
            try {
                // 🚨 SECURITY: Use POST with JSON body - NEVER GET with URL params
                const response = await fetch('/api/auth/admin-signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        email: email.toLowerCase(), 
                        password 
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showStatus('✅ Autenticação ultra-segura bem-sucedida! A redirecionar...');
                    
                    // Clear form for security
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';
                    
                    // Redirect after short delay
                    setTimeout(() => {
                        window.location.replace('/admin/dashboard');
                    }, 1500);
                } else {
                    const errorMsg = result.message || result.error || 'Erro de autenticação';
                    showStatus('❌ ' + errorMsg, true);
                    
                    // Security: Clear password on failed attempt
                    document.getElementById('password').value = '';
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            } catch (error) {
                console.error('Login error:', error);
                showStatus('❌ Erro de conexão. Tente novamente.', true);
                
                // Security: Clear password on error
                document.getElementById('password').value = '';
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        });
        
        // Security: Auto-clear status messages
        setInterval(() => {
            if (!status.classList.contains('hidden') && status.classList.contains('error')) {
                hideStatus();
            }
        }, 10000);
    </script>
</body>
</html>
        `
      }}
    />
  );
} 