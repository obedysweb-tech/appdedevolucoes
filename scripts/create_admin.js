import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ler variáveis de ambiente do arquivo .env manualmente
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Erro: Variáveis de ambiente não encontradas no arquivo .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'obedysweb@gmail.com';
    const password = 'junio2019';
    const name = 'Obedys';

    console.log(`\n🔄 Tentando configurar usuário: ${email}...`);

    // 1. Tentar Login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInData.user) {
        console.log("✅ Usuário já existe e login funcionou!");
        console.log(`🆔 ID: ${signInData.user.id}`);
        console.log("⚠️ IMPORTANTE: Execute o script SQL de migração para garantir que ele seja ADMIN.");
        return;
    }

    // 2. Se falhar login, tentar criar conta
    console.log("👤 Usuário não logado. Tentando criar conta...");
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role: 'ADMIN' // Tenta passar role no metadata
            }
        }
    });

    if (signUpError) {
        console.error("❌ Erro ao criar conta:", signUpError.message);
        if (signUpError.message.includes("already registered")) {
             console.log("ℹ️ O usuário parece existir mas a senha pode estar errada ou o email não confirmado.");
        }
        return;
    }

    if (signUpData.user) {
        console.log("✅ Usuário criado com sucesso!");
        console.log(`🆔 ID: ${signUpData.user.id}`);
        console.log("🚀 O trigger do banco deve criar o perfil de ADMIN automaticamente.");
    }
}

createAdmin();
