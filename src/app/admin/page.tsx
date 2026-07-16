'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Loader2,
  X,
  ClipboardList,
  Bike,
  Ticket,
  Bell,
  Check,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Utensils,
  Store,
  Instagram
} from 'lucide-react';
import Link from 'next/link';
import { Product, RestaurantConfig, Order, OrderStatus } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

export default function AdminPage() {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback Messages
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Sound Notification trigger helper
  const playOrderSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.25);
      }, 160);
    } catch (e) {
      console.warn("Could not play alert sound:", e);
    }
  };

  // Fetch initial configuration & products
  useEffect(() => {
    async function loadData() {
      try {
        const [configRes, productsRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/products')
        ]);
        
        if (configRes.ok && productsRes.ok) {
          const configData = await configRes.json();
          const productsData = await productsRes.json();
          setConfig(configData);
          setProducts(productsData.data);
        } else {
          showStatus('error', 'Erro ao carregar dados do restaurante.');
        }
      } catch (err) {
        console.error(err);
        showStatus('error', 'Erro ao se conectar ao servidor.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch orders and run polling
  useEffect(() => {
    let active = true;
    let localOrdersCache: Order[] = [];

    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok && active) {
          const data = await res.json();
          const fetchedOrders: Order[] = data.orders || [];

          // Play alert sound if a new pending order arrived
          if (localOrdersCache.length > 0 && fetchedOrders.length > localOrdersCache.length) {
            const hasNewPending = fetchedOrders.some(
              newOrd => newOrd.status === 'pending' && !localOrdersCache.some(oldOrd => oldOrd.id === newOrd.id)
            );
            if (hasNewPending) {
              playOrderSound();
            }
          }

          setOrders(fetchedOrders);
          localOrdersCache = fetchedOrders;
        }
      } catch (err) {
        console.error('Failed to poll orders:', err);
      }
    }

    loadOrders();
    const interval = setInterval(loadOrders, 8000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4500);
  };

  // Save general configuration (Config & Branding & Delivery/Coupons tabs share the save endpoint)
  const handleSaveConfig = async (e?: React.FormEvent, customConfig?: RestaurantConfig) => {
    if (e) e.preventDefault();
    const targetConfig = customConfig || config;
    if (!targetConfig) return;
    
    setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetConfig),
      });

      if (res.ok) {
        showStatus('success', 'Configurações atualizadas com sucesso!');
        setConfig(targetConfig);
        // Refresh CSS variable tokens
        const root = document.documentElement;
        root.style.setProperty('--primary', targetConfig.theme.primary);
        root.style.setProperty('--secondary', targetConfig.theme.secondary);
        root.style.setProperty('--background', targetConfig.theme.background);
        root.style.setProperty('--foreground', targetConfig.theme.foreground);
        root.style.setProperty('--radius', targetConfig.theme.borderRadius || '0.5rem');
      } else {
        showStatus('error', 'Erro ao salvar configurações.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha na conexão ao salvar.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Add Category Handler
  const handleAddCategory = () => {
    if (!config) return;
    const catName = prompt('Digite o nome da nova categoria:');
    if (!catName) return;
    
    const id = catName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    
    if (config.categories.some(c => c.id === id)) {
      alert('Esta categoria já existe!');
      return;
    }

    const updated = {
      ...config,
      categories: [...config.categories, { id, name: catName }]
    };
    handleSaveConfig(undefined, updated);
  };

  // Delete Category Handler
  const handleDeleteCategory = (catId: string) => {
    if (!config) return;
    if (config.categories.length <= 1) {
      alert('O restaurante deve ter pelo menos uma categoria.');
      return;
    }
    if (!confirm('Deseja realmente remover esta categoria? Drinks nesta categoria não serão mostrados.')) {
      return;
    }

    const updated = {
      ...config,
      categories: config.categories.filter(c => c.id !== catId)
    };
    handleSaveConfig(undefined, updated);
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: '',
      category: config?.categories[0]?.id || 'drinks',
      isActive: true,
      photo: '',
      sweetness: 3,
      citric: 3,
      alcoholStrength: 3,
      alcoholBase: 'sem-alcool',
      availableDays_sunday: true,
      availableDays_monday: true,
      availableDays_tuesday: true,
      availableDays_wednesday: true,
      availableDays_thursday: true,
      availableDays_friday: true,
      availableDays_saturday: true,
    });
    setIsProductDialogOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingProduct(true);
    const isNew = !editingProduct.id;
    const url = '/api/products';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        const data = await res.json();
        if (isNew) {
          setProducts([...products, data.product]);
          showStatus('success', 'Produto criado com sucesso!');
        } else {
          setProducts(products.map(p => p.id === data.product.id ? data.product : p));
          showStatus('success', 'Produto atualizado com sucesso!');
        }
        setIsProductDialogOpen(false);
      } else {
        const data = await res.json();
        showStatus('error', data.error || 'Erro ao salvar produto.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha ao salvar produto.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deseja excluir permanentemente este produto?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        showStatus('success', 'Produto excluído com sucesso.');
      } else {
        showStatus('error', 'Erro ao excluir produto.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha na requisição.');
    }
  };

  // Neighborhood (Taxas de entrega) management helpers
  const handleAddNeighborhood = () => {
    if (!config) return;
    const name = prompt('Digite o nome do Bairro:');
    if (!name) return;
    const feeInput = prompt('Digite a taxa de entrega em R$ (Ex: 5.50):');
    const fee = Number(feeInput);
    
    if (isNaN(fee) || fee < 0) {
      alert('Taxa de entrega inválida.');
      return;
    }

    const neighborhoods = config.deliveryNeighborhoods || [];
    if (neighborhoods.some(n => n.name.toLowerCase() === name.toLowerCase())) {
      alert('Este bairro já está cadastrado!');
      return;
    }

    const updated = {
      ...config,
      deliveryNeighborhoods: [...neighborhoods, { name, fee }]
    };
    handleSaveConfig(undefined, updated);
  };

  const handleDeleteNeighborhood = (name: string) => {
    if (!config) return;
    const neighborhoods = config.deliveryNeighborhoods || [];
    const updated = {
      ...config,
      deliveryNeighborhoods: neighborhoods.filter(n => n.name !== name)
    };
    handleSaveConfig(undefined, updated);
  };

  // Coupon management helpers
  const handleAddCoupon = () => {
    if (!config) return;
    const code = prompt('Digite o código do cupom (Ex: DRINKS10):')?.toUpperCase();
    if (!code) return;
    const type = (confirm('Clique em OK para desconto percentual (%) ou CANCELAR para desconto fixo (R$)') 
      ? 'percentage' 
      : 'fixed') as 'percentage' | 'fixed';
    const valInput = prompt(type === 'percentage' ? 'Digite a porcentagem de desconto (1 a 100):' : 'Digite o valor fixo de desconto (R$):');
    const value = Number(valInput);

    if (isNaN(value) || value <= 0 || (type === 'percentage' && value > 100)) {
      alert('Valor de desconto inválido.');
      return;
    }

    const coupons = config.coupons || [];
    if (coupons.some(c => c.code === code)) {
      alert('Este cupom já existe!');
      return;
    }

    const updated = {
      ...config,
      coupons: [...coupons, { code, type, value, isActive: true }]
    };
    handleSaveConfig(undefined, updated);
  };

  const handleToggleCoupon = (code: string) => {
    if (!config) return;
    const coupons = config.coupons || [];
    const updated = {
      ...config,
      coupons: coupons.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c)
    };
    handleSaveConfig(undefined, updated);
  };

  const handleDeleteCoupon = (code: string) => {
    if (!config) return;
    const coupons = config.coupons || [];
    const updated = {
      ...config,
      coupons: coupons.filter(c => c.code !== code)
    };
    handleSaveConfig(undefined, updated);
  };

  // KDS Status modification handler
  const handleUpdateStatus = async (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: nextStatus })
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        showStatus('success', `Pedido #${orderId} atualizado para ${nextStatus}.`);
      } else {
        showStatus('error', 'Falha ao atualizar status do pedido.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Erro de conexão ao atualizar pedido.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Deseja realmente CANCELAR este pedido?')) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: 'cancelled' })
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
        showStatus('success', `Pedido #${orderId} cancelado.`);
      } else {
        showStatus('error', 'Erro ao cancelar o pedido.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha de requisição.');
    }
  };

  // Metrics calculators
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrderCount = completedOrders.length;
  const averageTicket = totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Carregando painel...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-3" />
        <h2 className="text-lg font-bold">Falha ao carregar as configurações</h2>
        <p className="text-sm text-muted-foreground mt-1">Verifique as variáveis de ambiente e banco Supabase.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl border hover:bg-muted")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Painel Administrativo</h1>
            <p className="text-xs text-muted-foreground">Gerenciador do cardápio online e controle de produção</p>
          </div>
        </div>

        <Link href="/" target="_blank" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl gap-2 font-bold hover:bg-primary/5 hover:text-primary transition-all")}>
          <Eye className="h-4 w-4" />
          Visualizar Loja
        </Link>
      </div>

      {/* Dynamic Action Alerts */}
      {statusMsg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-fade-in ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400' 
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-semibold">{statusMsg.text}</span>
        </div>
      )}

      {/* Main Tabs Container */}
      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full bg-muted rounded-xl p-1 mb-6">
          <TabsTrigger value="pedidos" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <ClipboardList className="h-3.5 w-3.5" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="cardapio" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Layers className="h-3.5 w-3.5" />
            Cardápio
          </TabsTrigger>
          <TabsTrigger value="bairros" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Bike className="h-3.5 w-3.5" />
            Entrega
          </TabsTrigger>
          <TabsTrigger value="cupons" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Ticket className="h-3.5 w-3.5" />
            Cupons
          </TabsTrigger>
          <TabsTrigger value="geral" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Settings className="h-3.5 w-3.5" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Palette className="h-3.5 w-3.5" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="instagram" className="rounded-lg gap-1.5 text-xs font-bold py-2.5">
            <Instagram className="h-3.5 w-3.5" />
            Instagram
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB: PEDIDOS EM TEMPO REAL (KDS + ANALYTICS)                              */}
        {/* ========================================================================= */}
        <TabsContent value="pedidos" className="space-y-6">
          {/* Simple Analytics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-2xl border border-border/40 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-bold">Faturamento (Entregues)</span>
                  <h3 className="text-2xl font-black text-primary mt-1">R$ {totalRevenue.toFixed(2).replace('.', ',')}</h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/40 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-bold">Pedidos Concluídos</span>
                  <h3 className="text-2xl font-black text-primary mt-1">{totalOrderCount}</h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/40 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-bold">Ticket Médio</span>
                  <h3 className="text-2xl font-black text-primary mt-1">R$ {averageTicket.toFixed(2).replace('.', ',')}</h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Orders List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black uppercase flex items-center gap-2">
                  <Bell className="h-4.5 w-4.5 text-primary animate-pulse" />
                  Painel de Produção (KDS)
                </h3>
                <p className="text-xs text-muted-foreground">Pedidos em aberto ordenados cronologicamente.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map((order) => (
                <Card key={order.id} className={cn(
                  "rounded-2xl border transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden",
                  order.status === 'pending' ? "border-amber-400 bg-amber-400/[0.02]" :
                  order.status === 'preparing' ? "border-blue-400 bg-blue-400/[0.02]" :
                  "border-purple-400 bg-purple-400/[0.02]"
                )}>
                  <div>
                    {/* Card status tag */}
                    <div className={cn(
                      "p-2.5 text-center text-xs font-black uppercase border-b tracking-wider flex items-center justify-center gap-1.5",
                      order.status === 'pending' ? "bg-amber-400/10 text-amber-700 border-amber-400/20" :
                      order.status === 'preparing' ? "bg-blue-400/10 text-blue-700 border-blue-400/20" :
                      "bg-purple-400/10 text-purple-700 border-purple-400/20"
                    )}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {order.status === 'pending' ? 'Pendente' : 
                         order.status === 'preparing' ? 'Em Preparo' : 'Pronto / Rota'}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Order info */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-muted-foreground">#{order.id}</span>
                        <span className="text-muted-foreground font-bold">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-foreground">{order.customerName}</h4>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>

                      {/* Delivery / Table info details */}
                      <div className="text-xs bg-muted/40 p-2.5 rounded-xl space-y-1">
                        <p className="font-bold flex items-center gap-1">
                          {order.orderType === 'delivery' ? <Bike className="h-3.5 w-3.5 text-primary" /> : 
                           order.orderType === 'table' ? <Utensils className="h-3.5 w-3.5 text-primary" /> :
                           <Store className="h-3.5 w-3.5 text-primary" />}
                          Tipo: {order.orderType === 'delivery' ? 'Entrega' : 
                                 order.orderType === 'table' ? `Mesa ${order.tableNumber}` : 'Retirada'}
                        </p>
                        {order.orderType === 'delivery' && order.address && (
                          <p className="text-[11px] leading-normal text-muted-foreground mt-1 border-t border-border/25 pt-1">
                            {order.address.street}, {order.address.number} - {order.address.neighborhood}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">Pagamento: {order.paymentMethod}</p>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 py-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Itens do Pedido</span>
                        <ul className="text-xs space-y-1 divide-y divide-border/20">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center py-1 first:pt-0">
                              <span className="font-semibold text-foreground/90 leading-tight">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-mono text-muted-foreground text-[10px]">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom actions */}
                  <div className="p-4 border-t border-border/30 bg-muted/10 flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-xl flex-1 text-xs" 
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      size="sm" 
                      className="rounded-xl flex-1 font-bold text-xs bg-primary hover:bg-primary/95"
                      onClick={() => handleUpdateStatus(order.id, order.status)}
                    >
                      {order.status === 'pending' ? 'Aceitar' :
                       order.status === 'preparing' ? 'Pronto' : 'Entregar'}
                    </Button>
                  </div>
                </Card>
              ))}

              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
                  <Check className="h-8 w-8 mx-auto text-emerald-500 mb-3" />
                  <p className="text-base font-semibold">Tudo pronto por aqui!</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">Nenhum pedido ativo no momento na fila do KDS.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 1: CONFIGURAÇÃO GERAL                                                 */}
        {/* ========================================================================= */}
        <TabsContent value="geral">
          <form onSubmit={handleSaveConfig}>
            <Card className="border-border/40 bg-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-extrabold uppercase">Dados do Restaurante</CardTitle>
                <CardDescription>Informações básicas exibidas no topo do cardápio e nos links sociais.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rest-name" className="text-xs font-bold">Nome do Restaurante</Label>
                    <Input 
                      id="rest-name" 
                      value={config.name} 
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      required
                      className="rounded-xl border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rest-phone" className="text-xs font-bold">WhatsApp do Pedido (com DDI)</Label>
                    <Input 
                      id="rest-phone" 
                      placeholder="Ex: 5511957944402"
                      value={config.whatsappNumber} 
                      onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                      required
                      className="rounded-xl border-border/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rest-desc" className="text-xs font-bold">História / Apresentação</Label>
                  <Input 
                    id="rest-desc" 
                    value={config.description} 
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    className="rounded-xl border-border/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rest-instagram" className="text-xs font-bold">Instagram URL</Label>
                    <Input 
                      id="rest-instagram" 
                      value={config.instagramUrl} 
                      onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                      className="rounded-xl border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rest-email" className="text-xs font-bold">E-mail de Contato</Label>
                    <Input 
                      id="rest-email" 
                      value={config.email} 
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="rounded-xl border-border/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rest-address" className="text-xs font-bold">Endereço Físico</Label>
                  <Input 
                    id="rest-address" 
                    value={config.address} 
                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                    required
                    className="rounded-xl border-border/40"
                  />
                </div>

                <div className="border-t border-border/30 pt-4 mt-2">
                  <h4 className="font-extrabold text-sm mb-3 text-foreground">Horário de Funcionamento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rest-hours-week" className="text-xs font-bold">Dias de semana (Terça a Quinta)</Label>
                      <Input 
                        id="rest-hours-week" 
                        value={config.operatingHours.weekdays} 
                        onChange={(e) => setConfig({
                          ...config,
                          operatingHours: { ...config.operatingHours, weekdays: e.target.value }
                        })}
                        className="rounded-xl border-border/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rest-hours-ends" className="text-xs font-bold">Finais de semana (Sexta a Domingo)</Label>
                      <Input 
                        id="rest-hours-ends" 
                        value={config.operatingHours.weekends} 
                        onChange={(e) => setConfig({
                          ...config,
                          operatingHours: { ...config.operatingHours, weekends: e.target.value }
                        })}
                        className="rounded-xl border-border/40"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 pt-4 flex justify-end">
                <Button type="submit" disabled={savingConfig} className="rounded-xl gap-2 font-bold py-5 px-6 shadow-sm">
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar Dados
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: BRANDING (DESIGN & CUSTOMIZAÇÃO)                                   */}
        {/* ========================================================================= */}
        <TabsContent value="design">
          <form onSubmit={handleSaveConfig}>
            <Card className="border-border/40 bg-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-extrabold uppercase">Cores e Customização Visual</CardTitle>
                <CardDescription>Defina as cores principais do seu restaurante. As cores serão injetadas diretamente nas telas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Color Pickers Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2 p-4 bg-muted/40 rounded-2xl border border-border/20 items-center text-center">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-2">Cor Primária (Botões e Destaques)</Label>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border shadow-md">
                      <input 
                        type="color" 
                        value={config.theme.primary} 
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, primary: e.target.value }
                        })}
                        className="absolute inset-0 w-full h-full cursor-pointer border-0 p-0 scale-125"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold mt-2">{config.theme.primary}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-muted/40 rounded-2xl border border-border/20 items-center text-center">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-2">Cor Secundária (Fundo Banner)</Label>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border shadow-md">
                      <input 
                        type="color" 
                        value={config.theme.secondary} 
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, secondary: e.target.value }
                        })}
                        className="absolute inset-0 w-full h-full cursor-pointer border-0 p-0 scale-125"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold mt-2">{config.theme.secondary}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-muted/40 rounded-2xl border border-border/20 items-center text-center">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-2">Fundo Padrão (Light Mode)</Label>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border shadow-md">
                      <input 
                        type="color" 
                        value={config.theme.background} 
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, background: e.target.value }
                        })}
                        className="absolute inset-0 w-full h-full cursor-pointer border-0 p-0 scale-125"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold mt-2">{config.theme.background}</span>
                  </div>
                </div>

                {/* Categories Management Area */}
                <div className="border-t border-border/30 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">Categorias do Cardápio</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Gerencie os títulos das abas de produtos.</p>
                    </div>
                    <Button type="button" size="sm" onClick={handleAddCategory} className="rounded-xl font-bold gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                      <Plus className="h-3.5 w-3.5" />
                      Nova Categoria
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {config.categories.map((cat) => (
                      <div 
                        key={cat.id} 
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-muted rounded-full border border-border/50 text-xs font-bold"
                      >
                        <span>{cat.name}</span>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
              <CardFooter className="border-t border-border/40 pt-4 flex justify-end">
                <Button type="submit" disabled={savingConfig} className="rounded-xl gap-2 font-bold py-5 px-6 shadow-sm">
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar Identidade Visual
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: CARDÁPIO (CRUD DE PRODUTOS)                                        */}
        {/* ========================================================================= */}
        <TabsContent value="cardapio" className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold uppercase">Gerenciamento de Cardápio</h2>
              <p className="text-xs text-muted-foreground">Cadastre novos produtos e controle a exibição das bebidas.</p>
            </div>
            <Button onClick={handleOpenAddProduct} className="rounded-xl font-bold gap-2 py-5 shadow-sm">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>

          <Card className="border-border/40 bg-card rounded-2xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Produto</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Categoria</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Preço</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-xs font-black uppercase text-muted-foreground tracking-wider pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6">
                      <img 
                        src={product.photo || '/drink-placeholder.png'} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-border/20"
                      />
                    </TableCell>
                    <TableCell className="font-extrabold text-sm text-foreground max-w-[200px] truncate">
                      <div>
                        <p className="truncate">{product.name}</p>
                        <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">
                          {product.description || 'Sem descrição.'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                      {config.categories.find(c => c.id === product.category)?.name || product.category}
                    </TableCell>
                    <TableCell className="font-extrabold text-sm text-primary">
                      R$ {Number(product.price).toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        product.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                          : 'bg-muted text-muted-foreground border border-border/40'
                      }`}>
                        {product.isActive ? 'Ativo' : 'Pausa'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEditProduct(product)}
                          className="h-8.5 w-8.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-8.5 w-8.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Nenhum produto cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: TAXAS DE ENTREGA (BAIRROS)                                         */}
        {/* ========================================================================= */}
        <TabsContent value="bairros" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold uppercase">Taxas de Entrega por Bairro</h2>
              <p className="text-xs text-muted-foreground">Defina os bairros de atendimento e a taxa cobrada para envio de delivery.</p>
            </div>
            <Button onClick={handleAddNeighborhood} className="rounded-xl font-bold gap-2 py-5 shadow-sm">
              <Plus className="h-4 w-4" />
              Adicionar Bairro
            </Button>
          </div>

          <Card className="border-border/40 bg-card rounded-2xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-6">Bairro</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Taxa de Entrega (R$)</TableHead>
                  <TableHead className="text-right text-xs font-black uppercase text-muted-foreground tracking-wider pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.deliveryNeighborhoods?.map((item) => (
                  <TableRow key={item.name} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-extrabold text-sm text-foreground pl-6">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-extrabold text-sm text-primary">
                      R$ {item.fee.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteNeighborhood(item.name)}
                        className="h-8.5 w-8.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {(!config.deliveryNeighborhoods || config.deliveryNeighborhoods.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      Nenhum bairro cadastrado. O delivery operará com taxa grátis por padrão.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: CUPONS DE DESCONTO                                                 */}
        {/* ========================================================================= */}
        <TabsContent value="cupons" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold uppercase">Cupons de Desconto</h2>
              <p className="text-xs text-muted-foreground">Gerencie os cupons promocionais para seus clientes aplicarem no checkout.</p>
            </div>
            <Button onClick={handleAddCoupon} className="rounded-xl font-bold gap-2 py-5 shadow-sm">
              <Plus className="h-4 w-4" />
              Criar Cupom
            </Button>
          </div>

          <Card className="border-border/40 bg-card rounded-2xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider pl-6">Código</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Tipo</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Desconto</TableHead>
                  <TableHead className="text-xs font-black uppercase text-muted-foreground tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-xs font-black uppercase text-muted-foreground tracking-wider pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.coupons?.map((item) => (
                  <TableRow key={item.code} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-extrabold text-sm font-mono text-foreground pl-6 uppercase">
                      {item.code}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                      {item.type === 'percentage' ? 'Percentual (%)' : 'Fixo (R$)'}
                    </TableCell>
                    <TableCell className="font-extrabold text-sm text-primary">
                      {item.type === 'percentage' ? `${item.value}%` : `R$ ${item.value.toFixed(2).replace('.', ',')}`}
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleToggleCoupon(item.code)}
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border transition-all cursor-pointer ${
                          item.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                            : 'bg-muted text-muted-foreground border-border/40'
                        }`}
                      >
                        {item.isActive ? 'Ativo' : 'Inativo'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteCoupon(item.code)}
                        className="h-8.5 w-8.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {(!config.coupons || config.coupons.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      Nenhum cupom de desconto cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 7: INSTAGRAM GALLERY                                                  */}
        {/* ========================================================================= */}
        <TabsContent value="instagram">
          <form onSubmit={handleSaveConfig}>
            <Card className="border-border/40 bg-card rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <CardTitle className="text-lg font-extrabold uppercase">Feed de Fotos do Instagram</CardTitle>
                </div>
                <CardDescription>
                  Cole os links de até 6 fotos (do Instagram ou qualquer URL de imagem pública) para exibir como uma galeria no rodapé do seu cardápio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const currentPhotos = config.instagramPhotos || [];
                    const photoValue = currentPhotos[idx] || '';
                    return (
                      <div key={idx} className="p-4 bg-muted/30 rounded-2xl border border-border/20 space-y-3">
                        <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                          Foto {idx + 1}
                        </Label>
                        <Input
                          placeholder="Cole a URL da imagem (ex: https://images.unsplash.com/photo-...)"
                          value={photoValue}
                          onChange={(e) => {
                            const updatedPhotos = [...currentPhotos];
                            updatedPhotos[idx] = e.target.value;
                            setConfig({
                              ...config,
                              instagramPhotos: updatedPhotos
                            });
                          }}
                          className="rounded-xl border-border/40 bg-background"
                        />
                        {photoValue ? (
                          <div className="h-28 rounded-xl overflow-hidden border border-border/30 relative">
                            <img
                              src={photoValue}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-28 rounded-xl border border-dashed border-border/60 bg-muted/10 flex flex-col items-center justify-center text-[10px] text-muted-foreground font-semibold">
                            <span>Nenhuma foto inserida</span>
                            <span className="font-normal text-[9px] mt-0.5">Exibirá o fallback do sistema</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 pt-4 flex justify-end">
                <Button type="submit" disabled={savingConfig} className="rounded-xl gap-2 font-bold py-5 px-6 shadow-sm">
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar Galeria
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* PRODUCT DIALOG FOR ADD / EDIT                                             */}
      {/* ========================================================================= */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSaveProduct}>
            <DialogHeader>
              <DialogTitle className="text-lg font-black uppercase tracking-tight">
                {editingProduct?.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </DialogTitle>
              <DialogDescription className="text-xs">Entre com os detalhes e a disponibilidade do produto no cardápio.</DialogDescription>
            </DialogHeader>

            {editingProduct && (
              <div className="space-y-4 py-3">
                <div className="space-y-1">
                  <Label htmlFor="prod-name" className="text-xs font-bold">Nome do Produto</Label>
                  <Input 
                    id="prod-name" 
                    value={editingProduct.name || ''} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                    className="rounded-xl border-border/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="prod-price" className="text-xs font-bold">Preço (R$)</Label>
                    <Input 
                      id="prod-price" 
                      placeholder="19.90"
                      value={editingProduct.price || ''} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      required
                      className="rounded-xl border-border/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prod-cat" className="text-xs font-bold">Categoria</Label>
                    <select
                      id="prod-cat"
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-xl border border-border/45 bg-background text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      {config.categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prod-desc" className="text-xs font-bold">Descrição</Label>
                  <Input 
                    id="prod-desc" 
                    value={editingProduct.description || ''} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="rounded-xl border-border/40"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prod-photo" className="text-xs font-bold">URL da Imagem (Opcional)</Label>
                  <Input 
                    id="prod-photo" 
                    placeholder="https://exemplo.com/imagem.png"
                    value={editingProduct.photo || ''} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, photo: e.target.value })}
                    className="rounded-xl border-border/40"
                  />
                </div>

                {/* Flavor Profile parameters for Bartender Virtual Quiz */}
                <div className="border-t border-border/30 pt-4 mt-2">
                  <h4 className="font-extrabold text-sm mb-3 text-foreground">Perfil de Sabor (Bartender Virtual)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="prod-base" className="text-xs font-bold">Base Alcoólica</Label>
                      <select
                        id="prod-base"
                        value={editingProduct.alcoholBase || 'sem-alcool'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, alcoholBase: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-border/45 bg-background text-sm font-semibold focus:outline-none"
                      >
                        <option value="gin">Gin</option>
                        <option value="vodka">Vodka</option>
                        <option value="rum">Rum</option>
                        <option value="whisky">Whisky</option>
                        <option value="cachaça">Cachaça</option>
                        <option value="sem-alcool">Sem Álcool</option>
                        <option value="outro">Outro/Outros</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="prod-sweetness" className="text-xs font-bold">Doçura (1 a 5)</Label>
                      <input 
                        type="number"
                        min="1"
                        max="5"
                        id="prod-sweetness"
                        value={editingProduct.sweetness !== undefined ? editingProduct.sweetness : 3}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sweetness: parseInt(e.target.value) || 3 })}
                        className="w-full h-10 px-3 rounded-xl border border-border/45 bg-background text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="prod-strength" className="text-xs font-bold">Força Alcoólica (1 a 5)</Label>
                      <input 
                        type="number"
                        min="1"
                        max="5"
                        id="prod-strength"
                        value={editingProduct.alcoholStrength !== undefined ? editingProduct.alcoholStrength : 3}
                        onChange={(e) => setEditingProduct({ ...editingProduct, alcoholStrength: parseInt(e.target.value) || 3 })}
                        className="w-full h-10 px-3 rounded-xl border border-border/45 bg-background text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="prod-citric" className="text-xs font-bold">Cítrico (1 a 5)</Label>
                      <input 
                        type="number"
                        min="1"
                        max="5"
                        id="prod-citric"
                        value={editingProduct.citric !== undefined ? editingProduct.citric : 3}
                        onChange={(e) => setEditingProduct({ ...editingProduct, citric: parseInt(e.target.value) || 3 })}
                        className="w-full h-10 px-3 rounded-xl border border-border/45 bg-background text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-border/30">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">Disponibilidade do Produto</Label>
                    <p className="text-[10px] text-muted-foreground">Se desativado, o produto desaparece do cardápio.</p>
                  </div>
                  <Switch 
                    checked={editingProduct.isActive} 
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, isActive: checked })}
                  />
                </div>

                {/* Days of Availability checkboxes */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Dias Disponíveis</Label>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Dom', key: 'availableDays_sunday' },
                      { label: 'Seg', key: 'availableDays_monday' },
                      { label: 'Ter', key: 'availableDays_tuesday' },
                      { label: 'Qua', key: 'availableDays_wednesday' },
                      { label: 'Qui', key: 'availableDays_thursday' },
                      { label: 'Sex', key: 'availableDays_friday' },
                      { label: 'Sáb', key: 'availableDays_saturday' }
                    ].map((day) => {
                      const typedKey = day.key as keyof typeof editingProduct;
                      const isChecked = !!editingProduct[typedKey];
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            [typedKey]: !isChecked
                          })}
                          className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                            isChecked 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'bg-background border-border/40 text-muted-foreground hover:bg-muted/30'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t border-border/30 pt-4">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsProductDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={savingProduct} className="rounded-xl font-bold">
                {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
