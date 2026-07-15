'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Sun, 
  Moon, 
  ShoppingCart, 
  Trash2, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Minus, 
  User, 
  Instagram, 
  X, 
  ChevronRight, 
  Check, 
  Info 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product, RestaurantConfig } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RestaurantMenuProps {
  initialConfig: RestaurantConfig;
  initialProducts: Product[];
}

export default function RestaurantMenu({ initialConfig, initialProducts }: RestaurantMenuProps) {
  const { cart, addToCart, removeToCart, finalizeOrder, clearCart } = useCart();
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState<string>('drinks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // UI States
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('PIX');

  // Detect theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  // Filter products client-side
  const filteredProducts = initialProducts.filter(product => {
    if (!product.isActive) return false;
    
    // Category match
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    
    // Search query match
    const searchMatch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return categoryMatch && searchMatch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    finalizeOrder(initialConfig.whatsappNumber, initialConfig.name, paymentMethod);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* ========================================================================= */}
      {/* MOBILE HEADER & HERO                                                      */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col">
        {/* Banner area */}
        <div className="h-40 relative bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
          <div className="z-10 text-white font-bold text-2xl tracking-wide uppercase">
            {initialConfig.name}
          </div>
          
          {/* Theme button mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-10 w-10 transition-transform duration-200 active:scale-95"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Brand details mobile */}
        <div className="px-4 py-6 -mt-8 bg-card rounded-t-3xl shadow-xl relative z-10 mx-2 border border-border/40">
          <div className="flex flex-col items-center text-center">
            {initialConfig.logoUrl ? (
              <img 
                src={initialConfig.logoUrl} 
                alt="Logo" 
                className="w-20 h-20 rounded-full border-4 border-card bg-card object-contain shadow-md -mt-16 mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-card bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md -mt-16 mb-2">
                {initialConfig.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <h1 className="text-2xl font-black tracking-tight">{initialConfig.name}</h1>
            
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(initialConfig.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {initialConfig.address}
            </a>

            {/* Social Row */}
            <div className="flex items-center gap-4 mt-4">
              <a 
                href={`https://wa.me/${initialConfig.whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-full gap-2 text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-all")}
              >
                <Phone className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <a 
                href={initialConfig.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-full gap-2 text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-all")}
              >
                <Instagram className="h-3.5 w-3.5" />
                Instagram
              </a>
            </div>

            <p className="text-sm text-muted-foreground/80 mt-4 max-w-sm line-clamp-3 leading-relaxed">
              {initialConfig.description}
            </p>

            <div className="w-full border-t border-border/40 my-4" />

            {/* Info Trigger Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsInfoOpen(true)}
              className="w-full py-5 text-sm font-semibold flex items-center justify-between text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Mais Informações
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR NAVBAR                                                    */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-72 border-r border-border/50 bg-card fixed top-0 bottom-0 left-0 flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {initialConfig.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-extrabold text-lg leading-tight tracking-tight">{initialConfig.name}</h2>
            <span className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">Cardápio Online</span>
          </div>
        </div>

        {/* Desktop search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-5 bg-background border-border/40 focus-visible:ring-primary rounded-xl"
          />
        </div>

        {/* Short details */}
        <div className="space-y-4 text-sm text-muted-foreground/90 mt-2 flex-1">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <a href={`https://maps.google.com/?q=${encodeURIComponent(initialConfig.address)}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-foreground transition-all">
              {initialConfig.address}
            </a>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-medium text-foreground">Horário:</p>
              <p>{initialConfig.operatingHours.weekdays}</p>
              <p>{initialConfig.operatingHours.weekends}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <a href={`https://wa.me/${initialConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
              <Phone className="h-4 w-4" />
            </a>
            <a href={initialConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Desktop bottom buttons (Theme toggler & Account mock) */}
        <div className="border-t border-border/40 pt-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl py-5"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-primary" />
                <span>Modo Escuro</span>
              </>
            )}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl py-5 opacity-70 cursor-default hover:bg-transparent"
          >
            <User className="h-4 w-4" />
            <span>Minha Conta (Desabilitado)</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                            */}
      {/* ========================================================================= */}
      <div className="lg:pl-72 lg:pr-96 flex flex-col flex-1 pb-24 lg:pb-6">
        
        {/* Categories Bar & Search Input on mobile */}
        <div className="sticky top-0 bg-background/90 backdrop-blur-md z-20 py-4 px-4 border-b border-border/30 space-y-4 lg:py-6 lg:px-8">
          
          {/* Mobile search bar inside header */}
          <div className="lg:hidden relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-5 bg-card border-border/40 focus-visible:ring-primary rounded-xl"
            />
          </div>

          {/* Horizontal categories list */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            <Button
              key="all"
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-5 text-xs font-bold transition-all shadow-sm shrink-0 ${
                activeCategory === 'all' 
                  ? 'bg-primary text-white shadow-primary/20' 
                  : 'border-border/40 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              Todos
            </Button>
            {initialConfig.categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 text-xs font-bold transition-all shadow-sm shrink-0 ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white shadow-primary/20' 
                    : 'border-border/40 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRODUCTS GRID / LIST                                                      */}
        {/* ========================================================================= */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="mb-6 hidden lg:block">
            <h2 className="text-3xl font-black tracking-tight uppercase">
              {activeCategory === 'all' 
                ? 'Todos os Produtos' 
                : initialConfig.categories.find(c => c.id === activeCategory)?.name || 'Produtos'}
            </h2>
            <p className="text-sm text-muted-foreground">Escolha os itens que deseja adicionar ao seu pedido.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const cartItem = cart.find(c => c.id === product.id);
              return (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/40 group bg-card"
                >
                  <CardContent className="p-0 flex h-32">
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-extrabold text-base leading-snug tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {product.description || 'Sem descrição.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-primary text-base">
                          R$ {Number(product.price).toFixed(2).replace('.', ',')}
                        </span>

                        <div className="flex items-center">
                          {cartItem ? (
                            <div className="flex items-center bg-primary/10 rounded-full p-1 border border-primary/20">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeToCart({ id: product.id })}
                                className="h-7 w-7 rounded-full text-primary hover:bg-primary/20 hover:text-primary"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2.5 text-xs font-bold text-primary min-w-[20px] text-center">
                                {cartItem.quantity}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: Number(product.price),
                                  photo: product.photo
                                })}
                                className="h-7 w-7 rounded-full text-primary hover:bg-primary/20 hover:text-primary"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                photo: product.photo
                              })}
                              className="rounded-full px-4 text-xs font-bold bg-primary hover:bg-primary/95 text-white active:scale-95 transition-transform"
                            >
                              Adicionar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="w-32 h-full shrink-0 relative bg-muted/30">
                      <img 
                        src={product.photo || '/drink-placeholder.png'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
                <Search className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-base font-semibold">Nenhum produto encontrado</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Experimente buscar por outro termo ou categoria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR CART                                                      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-96 border-l border-border/50 bg-card fixed top-0 bottom-0 right-0 flex-col p-6 z-20">
        <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-2.5 border-b border-border/40 pb-4">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Seu Pedido
        </h2>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground/75 px-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="font-bold text-foreground">Sua sacola está vazia</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Adicione produtos do cardápio para começar.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-4 pr-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-border/30 last:border-b-0 items-start">
                    <img 
                      src={item.photo || '/drink-placeholder.png'} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-foreground leading-tight truncate">{item.name}</h4>
                      <p className="text-xs text-primary font-bold mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between h-14 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeToCart({ id: item.id })}
                        className="h-6 w-6 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      
                      <div className="flex items-center gap-2 border border-border/40 bg-background rounded-md px-1.5 py-0.5">
                        <button onClick={() => removeToCart({ id: item.id })} className="text-muted-foreground hover:text-foreground text-[10px] font-bold">
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-xs font-extrabold text-foreground min-w-[12px] text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="text-muted-foreground hover:text-foreground text-[10px] font-bold">
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border/40 pt-4 mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <strong className="text-2xl font-black text-primary">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </strong>
              </div>

              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger render={<Button className="w-full rounded-xl py-6 font-bold shadow-md shadow-primary/10" />}>
                  Continuar para Pagamento
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">Escolha a Forma de Pagamento</DialogTitle>
                    <DialogDescription className="text-sm">Selecione como deseja efetuar o pagamento quando receber o pedido.</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3 py-4">
                    {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentMethod === method 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-border/40 hover:bg-muted/30 text-foreground'
                        }`}
                      >
                        {paymentMethod === method && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                        {method}
                      </button>
                    ))}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" className="rounded-xl" onClick={() => setIsCheckoutOpen(false)}>
                      Voltar
                    </Button>
                    <Button className="rounded-xl font-bold" onClick={handleCheckout}>
                      Finalizar Pedido
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FLOATING CART DRAWER                                               */}
      {/* ========================================================================= */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-0 right-0 px-4 z-30">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger render={
              <Button 
                className="w-full rounded-full py-6 font-bold flex items-center justify-between shadow-xl shadow-primary/20 bg-primary text-white text-base animate-bounce-short"
              />
            }>
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Ver Sacola</span>
                <span className="h-6 min-w-[24px] rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black px-1.5">
                  {cartItemCount}
                </span>
              </span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] p-6">
              <SheetHeader>
                <SheetTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Resumo do Pedido
                </SheetTitle>
                <SheetDescription className="hidden">Lista de itens na sua sacola de compras</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-64 my-4">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 py-3 border-b border-border/30 last:border-b-0 items-start">
                      <img 
                        src={item.photo || '/drink-placeholder.png'} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm leading-tight text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-primary font-bold mt-1">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border border-border/40 bg-muted/30 rounded-full px-2 py-1">
                        <button onClick={() => removeToCart({ id: item.id })} className="text-muted-foreground hover:text-foreground">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-foreground min-w-[16px] text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="text-muted-foreground hover:text-foreground">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-border/40 pt-4 mt-2 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <strong className="text-xl font-black text-primary">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1">
                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger render={<Button className="col-span-2 rounded-xl py-5 font-bold shadow-md shadow-primary/10" />}>
                      Ir para o Pagamento
                    </DialogTrigger>
                    <DialogContent className="max-w-xs sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-black tracking-tight uppercase">Forma de Pagamento</DialogTitle>
                        <DialogDescription className="text-xs">Selecione o método de pagamento para concluir.</DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col gap-2 py-2">
                        {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map((method) => (
                          <label
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-between cursor-pointer transition-all ${
                              paymentMethod === method 
                                ? 'border-primary bg-primary/5 text-primary' 
                                : 'border-border/40 hover:bg-muted/30 text-foreground'
                            }`}
                          >
                            <span>{method}</span>
                            <input 
                              type="radio" 
                              name="paymentMobile" 
                              checked={paymentMethod === method}
                              onChange={() => {}}
                              className="accent-primary h-4 w-4"
                            />
                          </label>
                        ))}
                      </div>

                      <DialogFooter className="flex flex-row gap-2 mt-4">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsCheckoutOpen(false)}>
                          Voltar
                        </Button>
                        <Button className="flex-1 rounded-xl font-bold" onClick={handleCheckout}>
                          Finalizar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MORE INFO MODAL (MOBILE)                                                  */}
      {/* ========================================================================= */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight uppercase">Sobre nós</DialogTitle>
            <DialogDescription className="hidden">Detalhes de contato e horário de funcionamento</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                Funcionamento
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{initialConfig.operatingHours.weekdays}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{initialConfig.operatingHours.weekends}</p>
            </div>
            
            <div className="border-t border-border/40 pt-3">
              <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                Contato
              </h4>
              <p className="text-xs text-muted-foreground mt-1">E-mail: {initialConfig.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">WhatsApp: {initialConfig.whatsappNumber}</p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                Endereço
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{initialConfig.address}</p>
            </div>
          </div>

          <DialogFooter>
            <Button className="w-full rounded-xl" onClick={() => setIsInfoOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
