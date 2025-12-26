const fs = require('fs');
const path = require('path');

// Ler o arquivo CSV
const csvPath = path.join(__dirname, '../arquivos/clientes_rows (1).csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Processar CSV manualmente (simples, sem biblioteca externa)
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim());

// Função para parsear linha CSV considerando aspas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Processar dados
const data = [];
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = values[idx] || '';
  });
  if (obj.id && obj.nome) {
    data.push(obj);
  }
}

// Função para escapar strings SQL
function escapeSQL(str) {
  if (!str || str === '') return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Gerar SQL INSERT
const sqlStatements = [];
sqlStatements.push('-- Migração para importar clientes do CSV');
sqlStatements.push('-- Gerado automaticamente');
sqlStatements.push('');
sqlStatements.push('BEGIN;');
sqlStatements.push('');

// Limpar tabela antes (opcional - comentado para não perder dados existentes)
// sqlStatements.push('-- TRUNCATE TABLE public.clientes CASCADE;');
// sqlStatements.push('');

data.forEach((row, index) => {
  const id = row.id ? `'${row.id}'` : `gen_random_uuid()`;
  const nome = escapeSQL(row.nome || '');
  const razao_social = escapeSQL(row.razao_social || '');
  const cnpj_cpf = escapeSQL(row.cnpj_cpf || '');
  const municipio = escapeSQL(row.municipio || '');
  const uf = escapeSQL(row.uf || '');
  const rede = escapeSQL(row.rede || '');
  const endereco = escapeSQL(row.endereco || '');
  const bairro = escapeSQL(row.bairro || '');
  const complemento = escapeSQL(row.complemento || '');
  const cep = escapeSQL(row.cep || '');
  const vendedor = escapeSQL(row.vendedor || '');
  const loja = escapeSQL(row.loja || '');
  const regiao = escapeSQL(row.regiao || '');
  const codigo = escapeSQL(row.codigo || '');
  const ins_estadual = escapeSQL(row.ins_estadual || '');
  const codigo_municipio = escapeSQL(row.codigo_municipio || '');
  const pais = escapeSQL(row.pais || '');
  const latitude = row.latitude && row.latitude !== '' ? row.latitude : 'NULL';
  const longitude = row.longitude && row.longitude !== '' ? row.longitude : 'NULL';
  const email = escapeSQL(row.email || '');
  const telefone = escapeSQL(row.telefone || '');
  const observacoes = escapeSQL(row.observacoes || '');
  const created_at = row.created_at ? `'${row.created_at}'` : 'timezone(\'utc\'::text, now())';
  
  const sql = `INSERT INTO public.clientes (
    id, nome, razao_social, cnpj_cpf, municipio, uf, rede, endereco, bairro, 
    complemento, cep, vendedor, loja, regiao, codigo, ins_estadual, 
    codigo_municipio, pais, latitude, longitude, email, telefone, 
    observacoes, ativo, created_at, updated_at
  )
VALUES (
    ${id}::uuid, 
    ${nome}, 
    ${razao_social === 'NULL' ? 'NULL' : razao_social}, 
    ${cnpj_cpf === 'NULL' ? 'NULL' : cnpj_cpf}, 
    ${municipio === 'NULL' ? 'NULL' : municipio}, 
    ${uf === 'NULL' ? 'NULL' : uf}, 
    ${rede === 'NULL' ? 'NULL' : rede}, 
    ${endereco === 'NULL' ? 'NULL' : endereco}, 
    ${bairro === 'NULL' ? 'NULL' : bairro}, 
    ${complemento === 'NULL' ? 'NULL' : complemento}, 
    ${cep === 'NULL' ? 'NULL' : cep}, 
    ${vendedor === 'NULL' ? 'NULL' : vendedor}, 
    ${loja === 'NULL' ? 'NULL' : loja}, 
    ${regiao === 'NULL' ? 'NULL' : regiao}, 
    ${codigo === 'NULL' ? 'NULL' : codigo}, 
    ${ins_estadual === 'NULL' ? 'NULL' : ins_estadual}, 
    ${codigo_municipio === 'NULL' ? 'NULL' : codigo_municipio}, 
    ${pais === 'NULL' ? 'NULL' : pais}, 
    ${latitude === 'NULL' ? 'NULL' : `${latitude}::numeric`}, 
    ${longitude === 'NULL' ? 'NULL' : `${longitude}::numeric`}, 
    ${email === 'NULL' ? 'NULL' : email}, 
    ${telefone === 'NULL' ? 'NULL' : telefone}, 
    ${observacoes === 'NULL' ? 'NULL' : observacoes}, 
    true, 
    ${created_at}, 
    ${created_at}
  )
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  razao_social = EXCLUDED.razao_social,
  cnpj_cpf = EXCLUDED.cnpj_cpf,
  municipio = EXCLUDED.municipio,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  endereco = EXCLUDED.endereco,
  bairro = EXCLUDED.bairro,
  complemento = EXCLUDED.complemento,
  cep = EXCLUDED.cep,
  vendedor = EXCLUDED.vendedor,
  loja = EXCLUDED.loja,
  regiao = EXCLUDED.regiao,
  codigo = EXCLUDED.codigo,
  ins_estadual = EXCLUDED.ins_estadual,
  codigo_municipio = EXCLUDED.codigo_municipio,
  pais = EXCLUDED.pais,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  email = EXCLUDED.email,
  telefone = EXCLUDED.telefone,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());`;
  
  sqlStatements.push(sql);
});

sqlStatements.push('');
sqlStatements.push('COMMIT;');

// Salvar arquivo SQL
const outputPath = path.join(__dirname, '../supabase/migrations/20250226000000_import_clientes.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf8');

console.log(`✅ Migração criada com sucesso!`);
console.log(`📁 Arquivo: ${outputPath}`);
console.log(`📊 Total de registros: ${data.length}`);
