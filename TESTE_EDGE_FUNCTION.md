# Como Testar a Edge Function Diretamente no Supabase

## Método 1: Teste via Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard do Supabase:**
   - Vá para https://supabase.com/dashboard
   - Selecione seu projeto

2. **Navegue até Edge Functions:**
   - No menu lateral, clique em **Edge Functions**
   - Você verá a função `send-validation-email` listada

3. **Teste a Função:**
   - Clique na função `send-validation-email`
   - Vá na aba **"Invoke"** ou **"Test"**
   - Cole o seguinte JSON no corpo da requisição:

```json
{
  "userId": "SEU_USER_ID_AQUI",
  "email": "obedysjunio@gmail.com",
  "vendedorNome": "Nome do Vendedor",
  "data": "2025-01-05T00:00:00.000Z"
}
```

4. **Obter o User ID:**
   - No Dashboard, vá em **Authentication** > **Users**
   - Encontre o usuário VENDEDOR que você quer testar
   - Copie o **User ID** (UUID)

5. **Executar o Teste:**
   - Clique em **"Invoke"** ou **"Run"**
   - Verifique os logs e a resposta

## Método 2: Teste via cURL (Terminal)

### Passo 1: Obter o Access Token

Primeiro, você precisa fazer login e obter o token de acesso. Use o seguinte comando (substitua com suas credenciais):

```bash
curl -X POST 'https://tqelhhitxpahzllngamh.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: SUA_ANON_KEY_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu_email@exemplo.com",
    "password": "sua_senha"
  }'
```

Isso retornará um JSON com o `access_token`. Copie esse token.

### Passo 2: Chamar a Edge Function

```bash
curl -X POST 'https://tqelhhitxpahzllngamh.supabase.co/functions/v1/send-validation-email' \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_ANON_KEY_AQUI" \
  -d '{
    "userId": "SEU_USER_ID_AQUI",
    "email": "obedysjunio@gmail.com",
    "vendedorNome": "Nome do Vendedor",
    "data": "2025-01-05T00:00:00.000Z"
  }'
```

**Substitua:**
- `SEU_ACCESS_TOKEN_AQUI` - Token obtido no Passo 1
- `SUA_ANON_KEY_AQUI` - Sua chave anon do Supabase (encontrada em Settings > API)
- `SEU_USER_ID_AQUI` - ID do usuário VENDEDOR (encontrado em Authentication > Users)

## Método 3: Teste via JavaScript/Node.js

Crie um arquivo `test-email.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqelhhitxpahzllngamh.supabase.co';
const supabaseAnonKey = 'SUA_ANON_KEY_AQUI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmail() {
  // 1. Fazer login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'seu_email@exemplo.com',
    password: 'sua_senha'
  });

  if (authError) {
    console.error('Erro ao fazer login:', authError);
    return;
  }

  console.log('✅ Login realizado com sucesso!');

  // 2. Obter dados do usuário
  const userId = authData.user.id;
  const userEmail = authData.user.email;

  // 3. Buscar perfil para obter nome do vendedor
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, vendedor')
    .eq('id', userId)
    .single();

  const vendedorNome = profile?.vendedor || profile?.name || 'Vendedor';

  // 4. Chamar Edge Function
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const { data, error } = await supabase.functions.invoke('send-validation-email', {
    body: {
      userId: userId,
      email: 'obedysjunio@gmail.com', // Email de destino para teste
      vendedorNome: vendedorNome,
      data: hoje.toISOString()
    }
  });

  if (error) {
    console.error('❌ Erro ao chamar função:', error);
  } else {
    console.log('✅ Função executada com sucesso!', data);
  }
}

testEmail();
```

Execute:
```bash
node test-email.js
```

## Método 4: Teste via Console do Navegador

1. **Abra o Console do Navegador** (F12)
2. **Faça login no sistema** (se ainda não estiver)
3. **Execute no console:**

```javascript
// Obter sessão atual
const { data: { session } } = await supabase.auth.getSession();
console.log('Sessão:', session);

// Chamar função
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

const { data, error } = await supabase.functions.invoke('send-validation-email', {
  body: {
    userId: session.user.id,
    email: 'obedysjunio@gmail.com',
    vendedorNome: 'Nome do Vendedor',
    data: hoje.toISOString()
  },
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
});

if (error) {
  console.error('Erro:', error);
} else {
  console.log('Sucesso:', data);
}
```

## Verificar Logs da Edge Function

1. No Dashboard do Supabase, vá em **Edge Functions**
2. Clique na função `send-validation-email`
3. Vá na aba **"Logs"**
4. Você verá todos os logs de execução, incluindo erros

## Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token de autenticação está sendo passado corretamente
- Certifique-se de que o usuário está logado
- Verifique se o token não expirou (faça login novamente)

### Erro 403 (Forbidden)
- Verifique se o usuário tem role `VENDEDOR`
- Verifique se o `vendedor` está preenchido no perfil

### Erro ao enviar email
- Verifique se a `RESEND_API_KEY` está configurada corretamente
- Verifique os logs da Edge Function para mais detalhes
- Certifique-se de que o domínio está verificado no Resend (ou use `onboarding@resend.dev` para testes)
