
import { UserRole, Product, Supplier, Warehouse, StockEntry, Sale, AuditLog } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Maize Seeds', category: 'Cereals', unit: 'kg', currentStock: 1250, lowStockThreshold: 500 },
  { id: 'p2', name: 'NPK Fertilizer', category: 'Chemicals', unit: 'Bags', currentStock: 45, lowStockThreshold: 100 },
  { id: 'p3', name: 'Cocoa Beans', category: 'Cash Crop', unit: 'Tons', currentStock: 12, lowStockThreshold: 5 },
  { id: 'p4', name: 'Cassava Stems', category: 'Tubers', unit: 'Bundles', currentStock: 800, lowStockThreshold: 200 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'GreenEarth Agro', contact: '+234 801 234 5678', category: 'Seeds' },
  { id: 's2', name: 'Global Chemicals Ltd', contact: '+234 902 333 4444', category: 'Fertilizers' },
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'w1', name: 'Main Warehouse A', location: 'Lagos' },
  { id: 'w2', name: 'Silo Complex B', location: 'Ibadan' },
];

export const INITIAL_STOCK_ENTRIES: StockEntry[] = [
  {
    id: 'st1',
    productId: 'p1',
    supplierId: 's1',
    warehouseId: 'w1',
    quantity: 1000,
    weight: 1000,
    batchNumber: 'BT-001',
    expiryDate: '2025-12-01',
    receivedBy: 'StoreKeeper John',
    status: 'APPROVED',
    date: '2024-05-15T10:00:00Z',
  },
  {
    id: 'st2',
    productId: 'p2',
    supplierId: 's2',
    warehouseId: 'w2',
    quantity: 50,
    weight: 2500,
    batchNumber: 'F-NPK-99',
    expiryDate: '2026-01-20',
    receivedBy: 'StoreKeeper John',
    status: 'PENDING',
    date: '2024-05-20T14:30:00Z',
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sl1',
    productId: 'p1',
    quantity: 50,
    unitPrice: 500,
    totalAmount: 25000,
    customerName: 'Abeokuta Farms Co.',
    customerPhone: '08122334455',
    processedBy: 'StoreKeeper John',
    date: '2024-05-21T09:15:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'au1',
    userId: 'u1',
    userName: 'Admin Bosun',
    action: 'USER_LOGIN',
    details: 'Admin logged into the system from IP 192.168.1.1',
    timestamp: '2024-05-21T08:00:00Z',
    severity: 'INFO',
  },
  {
    id: 'au2',
    userId: 'u2',
    userName: 'Manager Sarah',
    action: 'STOCK_ADJUSTMENT',
    details: 'Authorized manual adjustment of Maize Seeds stock (-5kg wastage)',
    timestamp: '2024-05-21T11:45:00Z',
    severity: 'WARNING',
  }
];
