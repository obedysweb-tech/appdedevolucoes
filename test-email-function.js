/**
 * Script de teste para a Edge Function send-validation-email
 * 
 * Como usar:
 * 1. Instale as dependências: npm install @supabase/supabase-js
 * 2. Configure as variáveis abaixo com seus dados
 * 3. Execute: node test-email-function.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

// CONFIGURAÇÕES - ALTERE AQUI
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tqelhhitxpahzllngamh.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'SUA_ANON_KEY_AQUI';
const TEST_EMAIL = 'obedysjunio@gmail.com'; // Email para receber o teste
const USER_EMAIL = 'seu_email@exemplo.com'; // Email do usuário VENDEDOR para fazer login
const USER_PASSWORD = 'sua_senha'; // Senha do usuário VENDEDOR

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testEmailFunction() {
  console.log('🚀 Iniciando teste da Edge Function...\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: USER_PASSWORD
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      return;
    }

    if (!authData.session) {
      console.error('❌ Nenhuma sessão retornada');
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}\n`);

    // 2. Buscar perfil para obter nome do vendedor
    console.log('2️⃣ Buscando perfil do usuário...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role, vendedor')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
      return;
    }

    if (profile.role !== 'VENDEDOR') {
      console.error(`❌ Usuário não é VENDEDOR. Role atual: ${profile.role}`);
      console.log('   ⚠️  A função só funciona para usuários do tipo VENDEDOR');
      return;
    }

    console.log('✅ Perfil encontrado!');
    console.log(`   Nome: ${profile.name}`);
    console.log(`   Role: ${profile.role}`);
    console.log(`   Vendedor: ${profile.vendedor || 'Não definido'}\n`);

    const vendedorNome = profile.vendedor || profile.name || 'Vendedor';

    // 3. Preparar dados
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const requestBody = {
      userId: authData.user.id,
      email: TEST_EMAIL,
      vendedorNome: vendedorNome,
      data: hoje.toISOString()
    };

    console.log('3️⃣ Chamando Edge Function...');
    console.log('   Dados da requisição:', JSON.stringify(requestBody, null, 2));
    console.log('');

    // 4. Chamar Edge Function
    const { data, error } = await supabase.functions.invoke('send-validation-email', {
      body: requestBody,
      headers: {
        Authorization: `Bearer ${authData.session.access_token}`,
      }
    });

    if (error) {
      console.error('❌ Erro ao chamar função:', error);
      console.error('   Detalhes:', JSON.stringify(error, null, 2));
      return;
    }

    console.log('✅ Função executada com sucesso!');
    console.log('   Resposta:', JSON.stringify(data, null, 2));
    console.log('');
    console.log(`📧 Email enviado para: ${TEST_EMAIL}`);
    console.log('   Verifique a caixa de entrada (e spam) do email!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  } finally {
    // Fazer logout
    await supabase.auth.signOut();
    console.log('\n👋 Logout realizado');
  }
}

// Executar teste
testEmailFunction();
