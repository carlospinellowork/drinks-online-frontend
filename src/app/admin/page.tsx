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
  X
} from 'lucide-react';
import Link from 'next/link';
import { Product, RestaurantConfig } from '@/types';
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
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

export default function AdminPage() {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback Messages
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Fetch all data
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
          showStatus('error', 'Erro ao carregar os dados do servidor.');
        }
      } catch (err) {
        console.error(err);
        showStatus('error', 'Erro ao conectar ao servidor.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    
    setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showStatus('success', 'Configurações salvas com sucesso!');
        // Refresh local theme variables
        const root = document.documentElement;
        root.style.setProperty('--primary', config.theme.primary);
        root.style.setProperty('--secondary', config.theme.secondary);
        root.style.setProperty('--background', config.theme.background);
        root.style.setProperty('--foreground', config.theme.foreground);
        root.style.setProperty('--radius', config.theme.borderRadius);
      } else {
        showStatus('error', 'Erro ao salvar configurações.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha na requisição para salvar.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Add category helper
  const handleAddCategory = () => {
    if (!config) return;
    const catName = prompt('Digite o nome da nova categoria:');
    if (!catName) return;
    
    const id = catName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    
    if (config.categories.some(c => c.id === id)) {
      alert('Esta categoria já existe!');
      return;
    }

    setConfig({
      ...config,
      categories: [...config.categories, { id, name: catName }]
    });
  };

  // Delete category helper
  const handleDeleteCategory = (catId: string) => {
    if (!config) return;
    if (config.categories.length <= 1) {
      alert('O restaurante deve ter pelo menos uma categoria.');
      return;
    }
    if (!confirm('Tem certeza? Produtos associados a essa categoria não aparecerão corretamente no cardápio.')) {
      return;
    }

    setConfig({
      ...config,
      categories: config.categories.filter(c => c.id !== catId)
    });
  };

  // Open Add Dialog
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: '',
      category: config?.categories[0]?.id || 'drinks',
      isActive: true,
      photo: '',
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

  // Open Edit Dialog
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  // Save Product (Create or Update)
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
          showStatus('success', 'Produto adicionado com sucesso!');
        } else {
          setProducts(products.map(p => p.id === data.product.id ? data.product : p));
          showStatus('success', 'Produto atualizado com sucesso!');
        }
        setIsProductDialogOpen(false);
      } else {
        const data = await res.json();
        showStatus('error', data.error || 'Erro ao processar produto.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha na requisição do produto.');
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        showStatus('success', 'Produto removido com sucesso!');
      } else {
        showStatus('error', 'Erro ao excluir o produto.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Falha na requisição de exclusão.');
    }
  };

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
        <p className="text-sm text-muted-foreground mt-1">Verifique os arquivos do banco de dados local.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl border hover:bg-muted")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Painel Administrativo</h1>
            <p className="text-xs text-muted-foreground">Gerencie o tema, dados do restaurante e o cardápio</p>
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
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted rounded-xl p-1 mb-6">
          <TabsTrigger value="geral" className="rounded-lg gap-2 text-xs font-bold py-2.5">
            <Settings className="h-3.5 w-3.5" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-lg gap-2 text-xs font-bold py-2.5">
            <Palette className="h-3.5 w-3.5" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="cardapio" className="rounded-lg gap-2 text-xs font-bold py-2.5">
            <Layers className="h-3.5 w-3.5" />
            Cardápio
          </TabsTrigger>
        </TabsList>

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
      </Tabs>

      {/* ========================================================================= */}
      {/* PRODUCT DIALOG FOR ADD / EDIT                                             */}
      {/* ========================================================================= */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
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
