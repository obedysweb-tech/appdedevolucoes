import { faker } from '@faker-js/faker';
import { ReturnRequest, User, Sector, ReturnReason } from '@/types';

// Master Data
export const SECTORS: Sector[] = [
  { id: '1', name: 'Vendas' },
  { id: '2', name: 'Qualidade' },
  { id: '3', name: 'Logistica' },
  { id: '4', name: 'Compras' },
  { id: '5', name: 'Exportacoes' },
  { id: '6', name: 'Central Administrativa' },
  { id: '7', name: 'Cliente' },
];

export const REASONS: ReturnReason[] = [
  { id: '1', sector_id: '1', name: 'Acordo Comercial' },
  { id: '2', sector_id: '1', name: 'Avaria' },
  { id: '3', sector_id: '1', name: 'Produto Em Desacordo' },
  { id: '4', sector_id: '2', name: 'Div. Padrao Qualidade' },
  { id: '5', sector_id: '3', name: 'Atraso Na Entrega' },
  { id: '6', sector_id: '3', name: 'Falha No Transporte' },
  { id: '7', sector_id: '7', name: 'Devolucao Indevida' },
];

export const USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@empresa.com', role: 'ADMIN' },
  { id: '2', name: 'Gestor Vendas', email: 'gestor@empresa.com', role: 'GESTOR' },
  { id: '3', name: 'Rep. Comercial', email: 'comercial@empresa.com', role: 'COMERCIAL' },
  { id: '4', name: 'Op. Logística', email: 'logistica@empresa.com', role: 'LOGISTICA' },
];

// Generate Mock Returns
export const generateMockReturns = (count: number): ReturnRequest[] => {
  return Array.from({ length: count }).map(() => {
    const sector = faker.helpers.arrayElement(SECTORS);
    const filteredReasons = REASONS.filter(r => r.sector_id === sector.id);
    const reason = faker.helpers.arrayElement(filteredReasons.length > 0 ? filteredReasons : REASONS);
    
    return {
      id: faker.string.uuid(),
      created_at: faker.date.past().toISOString(),
      date: faker.date.past().toISOString(),
      customer_name: faker.company.name(),
      customer_cnpj: faker.string.numeric(14),
      customer_city: faker.location.city(),
      customer_uf: faker.location.state({ abbreviated: true }),
      seller_name: faker.person.fullName(),
      sector_id: sector.id,
      reason_id: reason.id,
      status: faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED']),
      total_value: parseFloat(faker.finance.amount({ min: 100, max: 10000 })),
      invoice_number: faker.string.numeric(6),
      invoice_date: faker.date.past().toISOString(),
      origin_city: faker.location.city(),
      origin_uf: faker.location.state({ abbreviated: true }),
      items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
        id: faker.string.uuid(),
        description: faker.commerce.productName(),
        unit: 'UN',
        quantity: faker.number.int({ min: 1, max: 100 }),
        unit_value: parseFloat(faker.finance.amount({ min: 10, max: 500 })),
        total_value: 0, 
        item_number: faker.string.numeric(4),
      })),
      // Joined fields for UI
      sectors: sector,
      return_reasons: reason
    };
  });
};

export const MOCK_RETURNS = generateMockReturns(150);
