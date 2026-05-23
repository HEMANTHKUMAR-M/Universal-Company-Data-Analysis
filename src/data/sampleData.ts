// Sample company dataset with realistic business data
export interface OrderData {
  orderId: string;
  date: string;
  customerName: string;
  region: string;
  product: string;
  category: string;
  quantity: number;
  sales: number;
  profit: number;
  discount: number;
  paymentMode: string;
  customerType?: string;
  salesChannel?: string;
}

export const ordersData: OrderData[] = [
  // January Data
  { orderId: 'ORD-001', date: '2024-01-05', customerName: 'Acme Corp', region: 'North America', product: 'Laptop Pro', category: 'Electronics', quantity: 2, sales: 3000, profit: 900, discount: 5, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-002', date: '2024-01-10', customerName: 'Tech Solutions', region: 'Europe', product: 'Monitor 4K', category: 'Electronics', quantity: 5, sales: 2500, profit: 750, discount: 10, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-003', date: '2024-01-15', customerName: 'Global Industries', region: 'Asia Pacific', product: 'Keyboard', category: 'Accessories', quantity: 10, sales: 500, profit: 150, discount: 0, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Online' },
  { orderId: 'ORD-004', date: '2024-01-20', customerName: 'Business Plus', region: 'North America', product: 'Mouse Wireless', category: 'Accessories', quantity: 25, sales: 750, profit: 225, discount: 5, paymentMode: 'Cash', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-005', date: '2024-01-25', customerName: 'Digital Ventures', region: 'Europe', product: 'USB Hub', category: 'Accessories', quantity: 15, sales: 450, profit: 135, discount: 8, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Partner' },

  // February Data
  { orderId: 'ORD-006', date: '2024-02-03', customerName: 'Smart Tech', region: 'Asia Pacific', product: 'Laptop Pro', category: 'Electronics', quantity: 3, sales: 4500, profit: 1350, discount: 3, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Direct' },
  { orderId: 'ORD-007', date: '2024-02-08', customerName: 'Enterprise Labs', region: 'North America', product: 'Desktop PC', category: 'Electronics', quantity: 4, sales: 5000, profit: 1500, discount: 7, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-008', date: '2024-02-12', customerName: 'Innovation Hub', region: 'Europe', product: 'Monitor 4K', category: 'Electronics', quantity: 8, sales: 4000, profit: 1200, discount: 5, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-009', date: '2024-02-18', customerName: 'Cloud Nine', region: 'Asia Pacific', product: 'Headphones Pro', category: 'Accessories', quantity: 20, sales: 1500, profit: 450, discount: 10, paymentMode: 'Credit Card', customerType: 'consumer', salesChannel: 'Online' },
  { orderId: 'ORD-010', date: '2024-02-28', customerName: 'NextGen Corp', region: 'North America', product: 'Webcam 4K', category: 'Accessories', quantity: 12, sales: 1200, profit: 360, discount: 0, paymentMode: 'Cash', customerType: 'enterprise', salesChannel: 'Partner' },

  // March Data
  { orderId: 'ORD-011', date: '2024-03-05', customerName: 'Quantum Systems', region: 'Europe', product: 'Laptop Pro', category: 'Electronics', quantity: 5, sales: 7500, profit: 2250, discount: 2, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-012', date: '2024-03-10', customerName: 'Future Tech', region: 'Asia Pacific', product: 'Desktop PC', category: 'Electronics', quantity: 6, sales: 7500, profit: 2250, discount: 6, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-013', date: '2024-03-15', customerName: 'Vision Corp', region: 'North America', product: 'Monitor 4K', category: 'Electronics', quantity: 10, sales: 5000, profit: 1500, discount: 8, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Partner' },
  { orderId: 'ORD-014', date: '2024-03-22', customerName: 'Apex Solutions', region: 'Europe', product: 'Gaming Chair', category: 'Furniture', quantity: 8, sales: 2400, profit: 720, discount: 5, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-015', date: '2024-03-28', customerName: 'Prime Industries', region: 'Asia Pacific', product: 'Standing Desk', category: 'Furniture', quantity: 6, sales: 2400, profit: 720, discount: 10, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Direct' },

  // April Data
  { orderId: 'ORD-016', date: '2024-04-04', customerName: 'Zenith Group', region: 'North America', product: 'Laptop Pro', category: 'Electronics', quantity: 4, sales: 6000, profit: 1800, discount: 4, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-017', date: '2024-04-09', customerName: 'Elite Partners', region: 'Europe', product: 'Desktop PC', category: 'Electronics', quantity: 5, sales: 6250, profit: 1875, discount: 5, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-018', date: '2024-04-14', customerName: 'Harmony Inc', region: 'Asia Pacific', product: 'Monitor 4K', category: 'Electronics', quantity: 12, sales: 6000, profit: 1800, discount: 8, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-019', date: '2024-04-20', customerName: 'Catalyst Tech', region: 'North America', product: 'Keyboard', category: 'Accessories', quantity: 20, sales: 800, profit: 240, discount: 5, paymentMode: 'Cash', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-020', date: '2024-04-26', customerName: 'Vertex Solutions', region: 'Europe', product: 'Mouse Wireless', category: 'Accessories', quantity: 30, sales: 900, profit: 270, discount: 6, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Partner' },

  // May Data
  { orderId: 'ORD-021', date: '2024-05-02', customerName: 'Summit Corp', region: 'Asia Pacific', product: 'Laptop Pro', category: 'Electronics', quantity: 6, sales: 9000, profit: 2700, discount: 3, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-022', date: '2024-05-07', customerName: 'Pinnacle Tech', region: 'North America', product: 'Desktop PC', category: 'Electronics', quantity: 7, sales: 8750, profit: 2625, discount: 4, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-023', date: '2024-05-13', customerName: 'Nexus Group', region: 'Europe', product: 'Gaming Chair', category: 'Furniture', quantity: 12, sales: 3600, profit: 1080, discount: 7, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-024', date: '2024-05-19', customerName: 'Pulse Systems', region: 'Asia Pacific', product: 'Standing Desk', category: 'Furniture', quantity: 10, sales: 4000, profit: 1200, discount: 5, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-025', date: '2024-05-25', customerName: 'Stellar Tech', region: 'North America', product: 'Monitor 4K', category: 'Electronics', quantity: 8, sales: 4000, profit: 1200, discount: 10, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Partner' },

  // June Data
  { orderId: 'ORD-026', date: '2024-06-03', customerName: 'Radiant Corp', region: 'Europe', product: 'Laptop Pro', category: 'Electronics', quantity: 5, sales: 7500, profit: 2250, discount: 5, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-027', date: '2024-06-08', customerName: 'Dynamic Tech', region: 'Asia Pacific', product: 'Monitor 4K', category: 'Electronics', quantity: 9, sales: 4500, profit: 1350, discount: 6, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-028', date: '2024-06-14', customerName: 'Force Industries', region: 'North America', product: 'Desktop PC', category: 'Electronics', quantity: 6, sales: 7500, profit: 2250, discount: 8, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Partner' },
  { orderId: 'ORD-029', date: '2024-06-20', customerName: 'Marvel Solutions', region: 'Europe', product: 'Keyboard', category: 'Accessories', quantity: 25, sales: 1000, profit: 300, discount: 4, paymentMode: 'Cash', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-030', date: '2024-06-27', customerName: 'Wonder Tech', region: 'Asia Pacific', product: 'Headphones Pro', category: 'Accessories', quantity: 18, sales: 1350, profit: 405, discount: 7, paymentMode: 'Credit Card', customerType: 'consumer', salesChannel: 'Online' },

  // July Data
  { orderId: 'ORD-031', date: '2024-07-05', customerName: 'Nova Corp', region: 'North America', product: 'Laptop Pro', category: 'Electronics', quantity: 8, sales: 12000, profit: 3600, discount: 2, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Direct' },
  { orderId: 'ORD-032', date: '2024-07-11', customerName: 'Phoenix Tech', region: 'Europe', product: 'Desktop PC', category: 'Electronics', quantity: 9, sales: 11250, profit: 3375, discount: 5, paymentMode: 'Credit Card', customerType: 'small', salesChannel: 'Partner' },
  { orderId: 'ORD-033', date: '2024-07-17', customerName: 'Aurora Industries', region: 'Asia Pacific', product: 'Gaming Chair', category: 'Furniture', quantity: 15, sales: 4500, profit: 1350, discount: 8, paymentMode: 'Bank Transfer', customerType: 'small', salesChannel: 'Online' },
  { orderId: 'ORD-034', date: '2024-07-23', customerName: 'Eclipse Solutions', region: 'North America', product: 'Monitor 4K', category: 'Electronics', quantity: 11, sales: 5500, profit: 1650, discount: 6, paymentMode: 'Credit Card', customerType: 'enterprise', salesChannel: 'Partner' },
  { orderId: 'ORD-035', date: '2024-07-29', customerName: 'Cosmos Tech', region: 'Europe', product: 'Standing Desk', category: 'Furniture', quantity: 12, sales: 4800, profit: 1440, discount: 9, paymentMode: 'Bank Transfer', customerType: 'enterprise', salesChannel: 'Direct' },
];
// Apply filters to orders
export const filterOrders = (filters?: { dateRange?: { start?: string; end?: string }; region?: string; category?: string; customerType?: string; salesChannel?: string }) => {
  let data = [...ordersData];
  if (!filters) return data;

  const { dateRange, region, category, customerType, salesChannel } = filters;
  const start = dateRange?.start;
  const end = dateRange?.end;

  if (start) {
    data = data.filter(o => o.date >= start);
  }
  if (end) {
    data = data.filter(o => o.date <= end);
  }
  if (region && region !== 'all') {
    data = data.filter(o => o.region === region);
  }
  if (category && category !== 'all') {
    data = data.filter(o => o.category === category);
  }
  if (customerType && customerType !== 'all') {
    data = data.filter(o => o.customerType === customerType);
  }
  if (salesChannel && salesChannel !== 'all') {
    data = data.filter(o => o.salesChannel === salesChannel);
  }

  return data;
};

// Utility function to get monthly sales data for charts (computed from orders)
export const getMonthlyData = (filters?: any) => {
  const data = filterOrders(filters);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map: Record<string, { month: string; sales: number; profit: number; orders: number }> = {};

  data.forEach(o => {
    const m = months[new Date(o.date).getMonth()];
    if (!map[m]) map[m] = { month: m, sales: 0, profit: 0, orders: 0 };
    map[m].sales += o.sales;
    map[m].profit += o.profit;
    map[m].orders += 1;
  });

  // return months in chronological order limited to present entries
  return Object.values(map).sort((a,b) => months.indexOf(a.month) - months.indexOf(b.month));
};

// Get regional sales data computed from orders
export const getRegionalData = (filters?: any) => {
  const data = filterOrders(filters);
  const groups: Record<string, { region: string; sales: number; profit: number; orders: number }> = {};
  data.forEach(o => {
    if (!groups[o.region]) groups[o.region] = { region: o.region, sales: 0, profit: 0, orders: 0 };
    groups[o.region].sales += o.sales;
    groups[o.region].profit += o.profit;
    groups[o.region].orders += 1;
  });
  return Object.values(groups);
};

// Get product performance data computed from orders
export const getProductData = (filters?: any) => {
  const data = filterOrders(filters);
  const groups: Record<string, { product: string; sales: number; profit: number; quantity: number }> = {};
  data.forEach(o => {
    if (!groups[o.product]) groups[o.product] = { product: o.product, sales: 0, profit: 0, quantity: 0 };
    groups[o.product].sales += o.sales;
    groups[o.product].profit += o.profit;
    groups[o.product].quantity += o.quantity;
  });
  return Object.values(groups).sort((a,b) => b.sales - a.sales);
};

// Get category data computed from orders
export const getCategoryData = (filters?: any) => {
  const data = filterOrders(filters);
  const groups: Record<string, { category: string; value: number }> = {};
  data.forEach(o => {
    if (!groups[o.category]) groups[o.category] = { category: o.category, value: 0 };
    groups[o.category].value += o.sales;
  });
  const arr = Object.values(groups);
  const total = arr.reduce((s, r) => s + r.value, 0) || 1;
  return arr.map(a => ({ ...a, percentage: Math.round((a.value / total) * 100) }));
};

// Get customer growth data (month-based) computed from orders
export const getCustomerGrowthData = (filters?: any) => {
  const data = filterOrders(filters);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map: Record<string, { month: string; customers: number; newCustomers: number }> = {};
  const seenByMonth: Record<string, Set<string>> = {};
  data.forEach(o => {
    const m = months[new Date(o.date).getMonth()];
    if (!map[m]) map[m] = { month: m, customers: 0, newCustomers: 0 };
    if (!seenByMonth[m]) seenByMonth[m] = new Set();
    if (!seenByMonth[m].has(o.customerName)) {
      seenByMonth[m].add(o.customerName);
      map[m].customers += 1;
      map[m].newCustomers += 1; // simplistic
    }
  });
  return Object.values(map).sort((a,b) => months.indexOf(a.month) - months.indexOf(b.month));
};

// KPI Calculations
export const calculateKPIs = (filters?: any) => {
  const data = filterOrders(filters);
  const totalSales = data.reduce((sum, order) => sum + order.sales, 0);
  const totalProfit = data.reduce((sum, order) => sum + order.profit, 0);
  const totalOrders = data.length;
  const uniqueCustomers = new Set(data.map(order => order.customerName)).size;
  const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
  const profitMargin = totalSales ? (totalProfit / totalSales) * 100 : 0;

  return {
    totalSales: Math.round(totalSales),
    totalProfit: Math.round(totalProfit),
    totalOrders,
    totalCustomers: uniqueCustomers,
    avgOrderValue: Math.round(avgOrderValue),
    profitMargin: Math.round(profitMargin * 100) / 100,
    growthPercentage: 22.5, // placeholder YoY growth
  };
};
