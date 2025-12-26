const fs = require('fs');
const path = require('path');

// Ler o arquivo SQL completo
const sqlPath = path.join(__dirname, '../supabase/migrations/20250226000000_import_clientes.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('📄 Arquivo SQL carregado');
console.log(`📊 Tamanho: ${(sqlContent.length / 1024).toFixed(2)} KB`);
console.log(`📝 Linhas: ${sqlContent.split('\n').length}`);

// Dividir em lotes menores (cada lote com ~50 INSERTs)
const lines = sqlContent.split('\n');
const batches = [];
let currentBatch = [];
let insertCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  currentBatch.push(line);
  
  if (line.trim().startsWith('INSERT INTO')) {
    insertCount++;
  }
  
  // Criar lote a cada 50 INSERTs ou no COMMIT
  if (insertCount >= 50 || line.trim() === 'COMMIT;') {
    if (currentBatch.length > 0) {
      batches.push(currentBatch.join('\n'));
      currentBatch = [];
      if (line.trim() !== 'COMMIT;') {
        insertCount = 0;
      }
    }
  }
}

// Adicionar último lote se houver
if (currentBatch.length > 0) {
  batches.push(currentBatch.join('\n'));
}

console.log(`\n📦 Total de lotes: ${batches.length}`);
console.log('\n⚠️  IMPORTANTE: Execute manualmente a migração SQL completa no Supabase Dashboard');
console.log('   ou use o arquivo: supabase/migrations/20250226000000_import_clientes.sql');
console.log('\n💡 Alternativa: Use o Supabase CLI para aplicar a migração:');
console.log('   supabase db push');
