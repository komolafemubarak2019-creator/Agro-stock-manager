
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Plus, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck,
  Menu,
  X,
  UserCircle,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';

import { UserRole, Product, Sale, AuditLog, StockEntry, Supplier, Warehouse } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_STOCK_ENTRIES, 
  INITIAL_SUPPLIERS, 
  INITIAL_WAREHOUSES 
} from './mockData';
import { getAIReportSummary } from './services/geminiService';

// --- Utility Components ---

// Fix: Make children optional in the Badge component type to resolve TS error where children are incorrectly reported as missing during JSX instantiation.
const Badge = ({ children, variant }: { children?: React.ReactNode, variant: 'success' | 'warning' | 'error' | 'info' }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-rose-100 text-rose-700 border-rose-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main Components ---

export default function App() {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'audit' | 'users' | 'suppliers'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(INITIAL_STOCK_ENTRIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  const [aiSummary, setAiSummary] = useState<string>('Loading AI business insights...');

  useEffect(() => {
    const fetchAI = async () => {
      const summary = await getAIReportSummary(products, sales);
      setAiSummary(summary);
    };
    fetchAI();
  }, [products, sales]);

  const addAuditLog = (action: string, details: string, severity: AuditLog['severity'] = 'INFO') => {
    const newLog: AuditLog = {
      id: `au-${Date.now()}`,
      userId: 'u-current',
      userName: `User (${currentUserRole})`,
      action,
      details,
      timestamp: new Date().toISOString(),
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const lowStockCount = products.filter(p => p.currentStock <= p.lowStockThreshold).length;
    const pendingApprovals = stockEntries.filter(e => e.status === 'PENDING').length;
    return { totalRevenue, lowStockCount, pendingApprovals };
  }, [sales, products, stockEntries]);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STORE_KEEPER, UserRole.AUDITOR] },
    { name: 'Inventory', id: 'inventory', icon: Package, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STORE_KEEPER, UserRole.AUDITOR] },
    { name: 'Sales', id: 'sales', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STORE_KEEPER, UserRole.AUDITOR] },
    { name: 'Auditing', id: 'audit', icon: History, roles: [UserRole.ADMIN, UserRole.AUDITOR] },
    { name: 'Suppliers', id: 'suppliers', icon: Users, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER] },
    { name: 'Security & Users', id: 'users', icon: ShieldCheck, roles: [UserRole.ADMIN] },
  ].filter(item => item.roles.includes(currentUserRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Package size={24} className="text-white" />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-lg tracking-tight leading-tight">Olatunbosun Agro</h1>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle size={16} className="text-emerald-400" />
              {isSidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Role</span>}
            </div>
            <select 
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-slate-900 text-slate-200 text-xs w-full py-2 px-2 rounded border border-slate-700 outline-none cursor-pointer hover:bg-slate-800"
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded-md">
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products, records, or orders..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell size={20} className="text-slate-500 cursor-pointer hover:text-emerald-600 transition-colors" />
              {stats.lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {stats.lowStockCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-tight">Admin Bosun</p>
                <p className="text-xs text-slate-500 capitalize">{currentUserRole.replace('_', ' ').toLowerCase()}</p>
              </div>
              <img src="https://picsum.photos/seed/user/100/100" className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && <Dashboard stats={stats} products={products} sales={sales} aiSummary={aiSummary} />}
          {activeTab === 'inventory' && (
            <Inventory 
              products={products} 
              setProducts={setProducts} 
              stockEntries={stockEntries} 
              setStockEntries={setStockEntries} 
              role={currentUserRole}
              onLog={addAuditLog}
            />
          )}
          {activeTab === 'sales' && (
            <Sales 
              sales={sales} 
              setSales={setSales} 
              products={products} 
              setProducts={setProducts} 
              role={currentUserRole}
              onLog={addAuditLog}
            />
          )}
          {activeTab === 'audit' && <Auditing logs={auditLogs} />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'suppliers' && <SupplierManagement />}
        </div>
      </main>
    </div>
  );
}

// --- Specific View Components ---

function Dashboard({ stats, products, sales, aiSummary }: { stats: any, products: Product[], sales: Sale[], aiSummary: string }) {
  const chartData = useMemo(() => {
    return products.slice(0, 5).map(p => ({
      name: p.name,
      stock: p.currentStock,
    }));
  }, [products]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Management Overview</h2>
          <p className="text-slate-500 mt-1">Real-time status of your agricultural inventory and revenue flows.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <FileText size={18} />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95">
            <Plus size={18} />
            Quick Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="+12.5% vs last month" trendUp={true} color="emerald" />
        <StatCard title="Low Stock Items" value={stats.lowStockCount} icon={AlertTriangle} trend={`${stats.lowStockCount > 0 ? 'Critical Attention Needed' : 'Normal'}`} trendUp={stats.lowStockCount === 0} color={stats.lowStockCount > 0 ? 'rose' : 'emerald'} />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={ArrowUpRight} trend="Stock-in waiting for Manager" trendUp={false} color="amber" />
        <StatCard title="Active Suppliers" value={INITIAL_SUPPLIERS.length} icon={Users} trend="Reliable Network" trendUp={true} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Top Stock Levels</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Available</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl shadow-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <TrendingUp size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">AI Business Analyst</h3>
          </div>
          <div className="flex-1 overflow-y-auto prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {aiSummary}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 italic">Powered by Gemini AI 3.0</span>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline decoration-dotted underline-offset-4">Full Strategic Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function Inventory({ products, setProducts, stockEntries, setStockEntries, role, onLog }: any) {
  const [showForm, setShowForm] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'incoming'>('stock');

  const handleApprove = (id: string) => {
    if (role !== UserRole.ADMIN && role !== UserRole.STORE_MANAGER) {
      alert("Permission denied. Only Managers can approve stock.");
      return;
    }
    
    setStockEntries((prev: StockEntry[]) => prev.map(e => {
      if (e.id === id) {
        // Update product stock too
        setProducts((prods: Product[]) => prods.map(p => 
          p.id === e.productId ? { ...p, currentStock: p.currentStock + e.quantity } : p
        ));
        onLog('STOCK_APPROVAL', `Approved batch ${e.batchNumber} of ${e.quantity} units`, 'INFO');
        return { ...e, status: 'APPROVED' as const };
      }
      return e;
    }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
          <div className="flex gap-4 mt-2">
            <button onClick={() => setActiveSubTab('stock')} className={`text-sm font-medium ${activeSubTab === 'stock' ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'text-slate-500 hover:text-slate-800'}`}>Current Stock</button>
            <button onClick={() => setActiveSubTab('incoming')} className={`text-sm font-medium ${activeSubTab === 'incoming' ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'text-slate-500 hover:text-slate-800'}`}>Incoming Goods</button>
          </div>
        </div>
        {role !== UserRole.AUDITOR && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md">
            <Plus size={18} /> Record New Intake
          </button>
        )}
      </div>

      {activeSubTab === 'stock' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Available Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{p.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700">{p.currentStock}</span>
                    <span className="ml-1 text-slate-400 text-xs italic">{p.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.currentStock <= p.lowStockThreshold ? (
                      <Badge variant="error">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">Healthy</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm font-bold">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch #</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Received</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockEntries.map((e: StockEntry) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">{e.batchNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{e.quantity} units</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={e.status === 'APPROVED' ? 'success' : e.status === 'PENDING' ? 'warning' : 'error'}>
                      {e.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {e.status === 'PENDING' && (role === UserRole.ADMIN || role === UserRole.STORE_MANAGER) && (
                      <button 
                        onClick={() => handleApprove(e.id)}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold hover:bg-emerald-200 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Sales({ sales, setSales, products, setProducts, role, onLog }: any) {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [newSale, setNewSale] = useState({ productId: '', quantity: 0, customerName: '', unitPrice: 0 });

  const handleProcessSale = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p: Product) => p.id === newSale.productId);
    if (!product || product.currentStock < newSale.quantity) {
      alert("Insufficient stock to process this sale!");
      return;
    }

    const total = newSale.quantity * newSale.unitPrice;
    const sale: Sale = {
      id: `sl-${Date.now()}`,
      productId: newSale.productId,
      quantity: newSale.quantity,
      unitPrice: newSale.unitPrice,
      totalAmount: total,
      customerName: newSale.customerName,
      customerPhone: 'N/A',
      processedBy: `User (${role})`,
      date: new Date().toISOString(),
    };

    setSales([sale, ...sales]);
    setProducts((prods: Product[]) => prods.map(p => 
      p.id === newSale.productId ? { ...p, currentStock: p.currentStock - newSale.quantity } : p
    ));
    onLog('NEW_SALE', `Processed sale to ${newSale.customerName} for ₦${total}`, 'INFO');
    setShowSaleForm(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Sales Transactions</h2>
        {role !== UserRole.AUDITOR && role !== UserRole.ADMIN && (
          <button onClick={() => setShowSaleForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition-all">
            <Plus size={18} /> New Receipt
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map((s: Sale) => {
              const product = products.find((p: Product) => p.id === s.productId);
              return (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(s.date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{s.customerName}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{product?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600">{s.quantity} {product?.unit}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₦{s.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors"><FileText size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showSaleForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">New Sale Transaction</h3>
              <button onClick={() => setShowSaleForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleProcessSale} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                  onChange={(e) => setNewSale({...newSale, productId: e.target.value})}
                >
                  <option value="">Select Product</option>
                  {products.map((p: Product) => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                    onChange={(e) => setNewSale({...newSale, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit Price (₦)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                    onChange={(e) => setNewSale({...newSale, unitPrice: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                  onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                />
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-emerald-700 font-medium">Total:</span>
                <span className="text-xl font-black text-emerald-800">₦{(newSale.quantity * newSale.unitPrice).toLocaleString()}</span>
              </div>
              <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
                Complete Sale & Deduct Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Auditing({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Immutable Audit Logs</h2>
          <p className="text-slate-500 text-sm mt-1">Full traceability for every user action in the system.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
          <FileText size={18} /> Download Security Log
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
            <Search size={14} /> Search Logs...
          </div>
          <select className="bg-white border border-slate-200 rounded text-xs px-2 py-1 outline-none">
            <option>All Severities</option>
            <option>Critical</option>
            <option>Warning</option>
          </select>
        </div>
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-6 hover:bg-slate-50/50 transition-colors">
              <div className="w-32 flex-shrink-0 text-xs text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{log.userName}</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase rounded">{log.action}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{log.details}</p>
              </div>
              <div>
                <Badge variant={log.severity === 'CRITICAL' ? 'error' : log.severity === 'WARNING' ? 'warning' : 'info'}>
                  {log.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Security & Role Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={20} className="text-emerald-600" /> Active Users</h3>
          <div className="space-y-4">
            {['Admin Bosun', 'Manager Sarah', 'StoreKeeper John', 'Auditor Mike'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">{name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{name.split(' ')[0]}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-rose-500 transition-colors"><Settings size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-400" /> Security Checklist</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 2FA Enabled for all Admins</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Automatic session timeout: 15 mins</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> IP Whitelisting for Warehouse Silos</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Quarterly Audit scheduled</li>
          </ul>
          <button className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-bold transition-colors">Run Security Scan</button>
        </div>
      </div>
    </div>
  );
}

function SupplierManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Partner Suppliers</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-2"><Plus size={18} /> Register Supplier</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_SUPPLIERS.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-emerald-50 rounded-lg"><Users size={20} className="text-emerald-600" /></div>
               <h3 className="font-bold text-slate-800">{s.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-slate-500">Category:</span> <span className="font-medium text-slate-700">{s.category}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Contact:</span> <span className="font-medium text-slate-700">{s.contact}</span></p>
            </div>
            <button className="w-full mt-4 py-2 text-emerald-600 font-bold border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">View Contract</button>
          </div>
        ))}
      </div>
    </div>
  );
}
