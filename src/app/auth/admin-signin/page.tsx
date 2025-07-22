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
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Admin Portal</h1>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
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
        
        function showStatus(message, isError = false) {
            status.textContent = message;
            status.className = 'status ' + (isError ? 'error' : 'success');
            status.classList.remove('hidden');
        }
        
        function hideStatus() {
            status.classList.add('hidden');
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showStatus('Por favor preencha todos os campos', true);
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'A verificar...';
            showStatus('A fazer login...');
            
            try {
                // Clear existing cookies
                document.cookie = 'admin-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.koobings.com';
                document.cookie = 'admin-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
                
                const response = await fetch('/api/simple-admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showStatus('✅ Login realizado! A redirecionar...');
                    setTimeout(() => {
                        window.location.replace('/admin/dashboard');
                    }, 1000);
                } else {
                    showStatus('❌ ' + (result.error || 'Erro no login'), true);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            } catch (error) {
                showStatus('❌ Erro de conexão', true);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        });
    </script>
</body>
</html>
        `
      }}
    />
  );
} 