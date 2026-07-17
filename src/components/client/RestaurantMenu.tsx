'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Product, RestaurantConfig } from '@/types';
import {
  AlertCircle,
  Bike,
  ChevronRight,
  Clock,
  Info,
  Instagram,
  MapPin,
  Minus,
  Moon,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  Trash2,
  User,
  Utensils
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  sender: 'waiter' | 'user';
  text: string;
  options?: { id: string; name: string; action: string }[];
  products?: Product[];
}

interface RestaurantMenuProps {
  initialConfig: RestaurantConfig;
  initialProducts: Product[];
}

export default function RestaurantMenu({ initialConfig, initialProducts }: RestaurantMenuProps) {
  const { cart, addToCart, removeToCart, finalizeOrder, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI States
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Quiz states (Bartender Virtual)
  const [isBartenderOpen, setIsBartenderOpen] = useState(false);
  const [bartenderStep, setBartenderStep] = useState(0); // 0: intro, 1: base, 2: taste, 3: vibe, 4: results
  const [quizAnswers, setQuizAnswers] = useState({ base: '', taste: '', vibe: '' });
  const [isShaking, setIsShaking] = useState(false);
  const [recommendedDrinks, setRecommendedDrinks] = useState<Product[]>([]);

  // Chat States (Garçom Virtual)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatIsTyping]);

  // Checkout inputs
  const [orderType, setOrderType] = useState<'delivery' | 'table' | 'takeaway'>('table');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<string>('PIX');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Detect theme on mount and check table parameter
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Auto-detect table
    const mesaParam = searchParams.get('mesa') || searchParams.get('table');
    if (mesaParam) {
      setTableNumber(mesaParam);
      setOrderType('table');
    } else {
      setOrderType('delivery');
    }
  }, [searchParams]);

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

  // Totals calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryFee = orderType === 'delivery' && addressNeighborhood
    ? initialConfig.deliveryNeighborhoods?.find(n => n.name === addressNeighborhood)?.fee || 0
    : 0;

  const couponDiscount = activeCoupon
    ? activeCoupon.type === 'percentage'
      ? cartTotal * (activeCoupon.value / 100)
      : activeCoupon.value
    : 0;

  const finalTotal = Math.max(0, cartTotal + deliveryFee - couponDiscount);

  // Apply discount coupon
  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponInput) return;

    const coupon = initialConfig.coupons?.find(
      c => c.code.toUpperCase() === couponInput.toUpperCase() && c.isActive
    );

    if (!coupon) {
      setCouponError('Cupom inválido ou expirado.');
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon(coupon);
  };

  const handleCheckout = async () => {
    if (!customerName) {
      setSubmitError('Por favor, informe seu nome.');
      return;
    }
    if (!customerPhone) {
      setSubmitError('Por favor, informe seu telefone de contato.');
      return;
    }
    if (orderType === 'table' && !tableNumber) {
      setSubmitError('Por favor, informe o número da mesa.');
      return;
    }
    if (orderType === 'delivery') {
      if (!addressStreet || !addressNumber || !addressNeighborhood) {
        setSubmitError('Por favor, preencha rua, número e bairro de entrega.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderId = await finalizeOrder({
        customerName,
        customerPhone,
        orderType,
        tableNumber: orderType === 'table' ? tableNumber : undefined,
        address: orderType === 'delivery' ? {
          street: addressStreet,
          number: addressNumber,
          neighborhood: addressNeighborhood,
          complement: addressComplement || undefined
        } : undefined,
        deliveryFee,
        paymentMethod,
        couponCode: activeCoupon?.code || undefined,
        discountValue: couponDiscount,
        subtotal: cartTotal,
        total: finalTotal
      });

      setIsCheckoutOpen(false);
      setIsCartOpen(false);

      // Redirect to dynamic order tracking page
      router.push(`/order/${orderId}`);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Virtual Bartender core trigger
  const triggerShaking = (answers: typeof quizAnswers) => {
    setBartenderStep(4);
    setIsShaking(true);

    const matches = initialProducts.filter(prod => {
      if (!prod.isActive) return false;

      // Base spirit match
      const baseMatch = !prod.alcoholBase || prod.alcoholBase === answers.base;

      // Taste profile match
      let tasteMatch = true;
      if (answers.taste === 'doce') {
        tasteMatch = prod.sweetness !== undefined && prod.sweetness >= 4;
      } else if (answers.taste === 'citrico') {
        tasteMatch = prod.citric !== undefined && prod.citric >= 4;
      } else if (answers.taste === 'forte') {
        tasteMatch = prod.alcoholStrength !== undefined && prod.alcoholStrength >= 4;
      } else if (answers.taste === 'neutro') {
        tasteMatch = (prod.sweetness || 3) <= 3 && (prod.alcoholStrength || 3) <= 3;
      }

      return baseMatch && tasteMatch;
    });

    // Fallback: match just base spirit if no drinks found with exact flavor match
    const finalMatches = matches.length > 0
      ? matches
      : initialProducts.filter(prod => prod.isActive && prod.alcoholBase === answers.base).slice(0, 3);

    setRecommendedDrinks(finalMatches.slice(0, 3));

    setTimeout(() => {
      setIsShaking(false);
    }, 1500);
  };
  // Virtual Waiter Chat Core Handlers
  const startChatVirtual = () => {
    setIsBartenderOpen(true);
    setChatMessages([
      {
        sender: 'waiter',
        text: 'Olá! Sou o Fred, seu garçom virtual hoje. 🤝 O que você gostaria de explorar no cardápio agora?',
        options: [
          { id: 'drink_start', name: '🍹 Ver Drinks & Bebidas', action: 'drink_start' },
          { id: 'food_start', name: '🍔 Ver Comidas & Petiscos', action: 'food_start' }
        ]
      }
    ]);
  };

  const handleChatOption = (option: { id: string; name: string; action: string }) => {
    // Add user message to history
    const userMsg: ChatMessage = { sender: 'user', text: option.name };

    // Clear options of the last waiter message to keep conversation history clean
    setChatMessages(prev => {
      const history = [...prev];
      if (history.length > 0 && history[history.length - 1].sender === 'waiter') {
        history[history.length - 1] = {
          ...history[history.length - 1],
          options: []
        };
      }
      return [...history, userMsg];
    });

    setChatIsTyping(true);

    // Process option action with a natural typing delay
    setTimeout(() => {
      setChatIsTyping(false);

      if (option.action === 'drink_start') {
        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Excelente escolha! 🍹 Qual tipo de base alcoólica você prefere?',
          options: [
            { id: 'drink_base:gin', name: 'Gin', action: 'drink_base:gin' },
            { id: 'drink_base:vodka', name: 'Vodka', action: 'drink_base:vodka' },
            { id: 'drink_base:rum', name: 'Rum', action: 'drink_base:rum' },
            { id: 'drink_base:whisky', name: 'Whisky', action: 'drink_base:whisky' },
            { id: 'drink_base:cachaça', name: 'Cachaça', action: 'drink_base:cachaça' },
            { id: 'drink_base:sem-alcool', name: 'Sem Álcool', action: 'drink_base:sem-alcool' }
          ]
        }]);
      }
      else if (option.action.startsWith('drink_base:')) {
        const base = option.action.split(':')[1];
        setQuizAnswers(prev => ({ ...prev, base }));

        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Ótimo paladar! E sobre o sabor do drink, qual o seu perfil favorito?',
          options: [
            { id: `drink_taste:doce`, name: '🍬 Adocicado & Suave', action: `drink_taste:doce` },
            { id: `drink_taste:citrico`, name: '🍋 Cítrico & Refrescante', action: `drink_taste:citrico` },
            { id: `drink_taste:forte`, name: '🔥 Forte & Marcante', action: `drink_taste:forte` },
            { id: `drink_taste:neutro`, name: '✨ Equilibrado & Suave', action: `drink_taste:neutro` }
          ]
        }]);
      }
      else if (option.action.startsWith('drink_taste:')) {
        const taste = option.action.split(':')[1];

        // Filter drinks using existing logic
        const matches = initialProducts.filter(prod => {
          if (!prod.isActive || prod.category !== 'drinks') return false;
          const baseMatch = prod.alcoholBase === quizAnswers.base;

          let tasteMatch = true;
          if (taste === 'doce') {
            tasteMatch = prod.sweetness !== undefined && prod.sweetness >= 4;
          } else if (taste === 'citrico') {
            tasteMatch = prod.citric !== undefined && prod.citric >= 4;
          } else if (taste === 'forte') {
            tasteMatch = prod.alcoholStrength !== undefined && prod.alcoholStrength >= 4;
          } else if (taste === 'neutro') {
            tasteMatch = (prod.sweetness || 3) <= 3 && (prod.alcoholStrength || 3) <= 3;
          }
          return baseMatch && tasteMatch;
        });

        const finalMatches = matches.length > 0
          ? matches
          : initialProducts.filter(prod => prod.isActive && prod.category === 'drinks' && prod.alcoholBase === quizAnswers.base).slice(0, 3);

        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Deixe-me ver o que temos de melhor... Encontrei estes drinks que combinam perfeitamente com você!',
          products: finalMatches.slice(0, 3),
          options: [
            { id: 'restart', name: '🔄 Recomeçar Conversa', action: 'restart' },
            { id: 'close', name: '❌ Fechar Chat', action: 'close' }
          ]
        }]);
      }
      else if (option.action === 'food_start') {
        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Bateu aquela fome? 🍔 O que você prefere no momento?',
          options: [
            { id: 'food_cat:comidas', name: '🍔 Burgers & Pratos', action: 'food_cat:comidas' },
            { id: 'food_cat:petiscos', name: '🍟 Petiscos & Porções', action: 'food_cat:petiscos' }
          ]
        }]);
      }
      else if (option.action.startsWith('food_cat:')) {
        const cat = option.action.split(':')[1];
        setQuizAnswers(prev => ({ ...prev, base: cat })); // Re-use base key to store selected category temporarily

        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Perfeito! Que estilo de prato você prefere hoje?',
          options: [
            { id: `food_vibe:classic`, name: '🔥 Clássicos da Casa', action: `food_vibe:classic` },
            { id: `food_vibe:crispy`, name: '🍗 Fritos & Crocantes', action: `food_vibe:crispy` },
            { id: `food_vibe:light`, name: '🥗 Especiais & Leves', action: `food_vibe:light` }
          ]
        }]);
      }
      else if (option.action.startsWith('food_vibe:')) {
        const vibe = option.action.split(':')[1];
        const selectedCat = quizAnswers.base; // Category was temporarily stored in base

        const matches = initialProducts.filter(prod => {
          if (!prod.isActive || prod.category !== selectedCat) return false;

          if (vibe === 'classic') {
            return prod.name.toLowerCase().includes('smash') ||
              prod.name.toLowerCase().includes('gorgonzola') ||
              prod.name.toLowerCase().includes('margherita') ||
              prod.name.toLowerCase().includes('calabresa');
          } else if (vibe === 'crispy') {
            return prod.name.toLowerCase().includes('batata') ||
              prod.name.toLowerCase().includes('coxinha') ||
              prod.name.toLowerCase().includes('anel') ||
              prod.name.toLowerCase().includes('chicken') ||
              prod.description?.toLowerCase().includes('crocante') ||
              prod.description?.toLowerCase().includes('frito');
          } else {
            // Light/special
            return !prod.name.toLowerCase().includes('gorgonzola') &&
              !prod.name.toLowerCase().includes('calabresa') &&
              !prod.description?.toLowerCase().includes('frito');
          }
        });

        const finalMatches = matches.length > 0
          ? matches
          : initialProducts.filter(prod => prod.isActive && prod.category === selectedCat).slice(0, 3);

        setChatMessages(prev => [...prev, {
          sender: 'waiter',
          text: 'Excelente escolha! Separei estes pratos maravilhosos que são os favoritos dos clientes:',
          products: finalMatches.slice(0, 3),
          options: [
            { id: 'restart', name: '🔄 Recomeçar Conversa', action: 'restart' },
            { id: 'close', name: '❌ Fechar Chat', action: 'close' }
          ]
        }]);
      }
      else if (option.action === 'restart') {
        startChatVirtual();
      }
      else if (option.action === 'close') {
        setIsBartenderOpen(false);
      }
    }, 850);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Dynamic shake animation injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.4s infinite;
        }
      `}} />

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
              className={`rounded-full px-5 text-xs font-bold transition-all shadow-sm shrink-0 ${activeCategory === 'all'
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
                className={`rounded-full px-5 text-xs font-bold transition-all shadow-sm shrink-0 ${activeCategory === cat.id
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

          {/* Virtual Waiter Chat Banner */}
          <Card className="mb-6 overflow-hidden relative border-none bg-gradient-to-r from-primary to-secondary text-white shadow-xl rounded-3xl">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            <div className="p-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-300 fill-amber-300 animate-pulse" />
                  Chame nosso Garçom Virtual
                </h3>
                <p className="text-xs text-white/95 max-w-md">
                  Dúvidas sobre o cardápio? Converse com o Fred, nosso assistente digital, e receba as melhores recomendações de comidas e drinks!
                </p>
              </div>
              <Button
                onClick={startChatVirtual}
                className="rounded-2xl bg-white text-primary hover:bg-white/90 font-bold px-5 py-4 shrink-0 shadow-lg active:scale-95 transition-transform"
              >
                Chamar Garçom
              </Button>
            </div>
          </Card>

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

          {/* Instagram Feed Gallery Section */}
          {initialConfig.instagramPhotos && initialConfig.instagramPhotos.length > 0 && (
            <div className="mt-8 border-t border-border/30 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                    Siga-nos no Instagram
                  </h3>
                </div>
                <a
                  href={initialConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  @{initialConfig.instagramUrl.split('/').filter(Boolean).pop() || 'instagram'}
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {initialConfig.instagramPhotos.slice(0, 6).map((photoUrl, idx) => (
                  <a
                    key={idx}
                    href={initialConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden rounded-xl group border border-border/20 shadow-sm block"
                  >
                    <img
                      src={photoUrl}
                      alt={`Instagram Post ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 text-white text-xs font-bold transition-opacity duration-300">
                      <span className="flex items-center gap-1">❤️ {12 + idx * 7}</span>
                      <span className="flex items-center gap-1">💬 {2 + idx}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
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
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {orderType === 'delivery' && deliveryFee > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Taxa de Entrega</span>
                  <span>+ R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              {activeCoupon && (
                <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Desconto ({activeCoupon.code})</span>
                  <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Total:</span>
                <strong className="text-2xl font-black text-primary">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </strong>
              </div>

              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <Button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full rounded-xl py-6 font-bold shadow-md shadow-primary/10"
                >
                  Continuar para Pagamento
                </Button>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl p-6 overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">Finalizar Pedido</DialogTitle>
                    <DialogDescription className="text-xs">Configure os detalhes de envio e a forma de pagamento.</DialogDescription>
                  </DialogHeader>

                  {/* Form fields */}
                  <div className="space-y-4 my-2 text-sm">
                    {/* Select Mode */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-muted-foreground">Modo do Pedido</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'table', name: 'Mesa', icon: Utensils },
                          { id: 'delivery', name: 'Entrega', icon: Bike },
                          { id: 'takeaway', name: 'Balcão', icon: Store }
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setOrderType(mode.id as any)}
                            className={cn(
                              "p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-bold transition-all text-xs",
                              orderType === mode.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border/40 hover:bg-muted text-muted-foreground"
                            )}
                          >
                            <mode.icon className="h-4 w-4" />
                            {mode.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-black uppercase text-muted-foreground">Seu Nome</label>
                        <Input
                          type="text"
                          placeholder="Ex: Carlos"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          className="rounded-xl border-border/40"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-black uppercase text-muted-foreground">Telefone/WhatsApp</label>
                        <Input
                          type="tel"
                          placeholder="Ex: (11) 99999-9999"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="rounded-xl border-border/40"
                        />
                      </div>
                    </div>

                    {/* Conditional Delivery Address */}
                    {orderType === 'delivery' && (
                      <div className="space-y-3 p-3 bg-muted/20 border border-border/40 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">Endereço de Entrega</span>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground">Rua/Logradouro</label>
                            <Input
                              type="text"
                              placeholder="Rua das Palmeiras"
                              value={addressStreet}
                              onChange={e => setAddressStreet(e.target.value)}
                              className="rounded-xl h-9 text-xs border-border/40 bg-background"
                            />
                          </div>
                          <div className="col-span-1 space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground">Número</label>
                            <Input
                              type="text"
                              placeholder="123"
                              value={addressNumber}
                              onChange={e => setAddressNumber(e.target.value)}
                              className="rounded-xl h-9 text-xs border-border/40 bg-background"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground">Bairro (Selecione)</label>
                            <select
                              value={addressNeighborhood}
                              onChange={e => setAddressNeighborhood(e.target.value)}
                              className="w-full rounded-xl h-9 text-xs border border-border/40 bg-background px-2.5 font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="">Selecione...</option>
                              {initialConfig.deliveryNeighborhoods?.map((n) => (
                                <option key={n.name} value={n.name}>{n.name} (+ R$ {n.fee.toFixed(2)})</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground">Complemento (Opcional)</label>
                            <Input
                              type="text"
                              placeholder="Apt 20"
                              value={addressComplement}
                              onChange={e => setAddressComplement(e.target.value)}
                              className="rounded-xl h-9 text-xs border-border/40 bg-background"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conditional Table Number */}
                    {orderType === 'table' && (
                      <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-muted-foreground">Mesa do Cliente</label>
                        <Input
                          type="text"
                          placeholder="Ex: 5"
                          value={tableNumber}
                          onChange={e => setTableNumber(e.target.value)}
                          className="rounded-xl border-border/40"
                        />
                      </div>
                    )}

                    {/* Apply Discount Coupon */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-muted-foreground">Cupom de Desconto</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Insira o código do cupom"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value)}
                          className="rounded-xl border-border/40 uppercase"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCoupon}
                          className="rounded-xl font-bold shrink-0"
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && <p className="text-[10px] text-destructive font-semibold mt-1">{couponError}</p>}
                      {activeCoupon && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          Cupom {activeCoupon.code} ativo!
                          {activeCoupon.type === 'percentage'
                            ? ` (${activeCoupon.value}% de desconto)`
                            : ` (R$ ${activeCoupon.value.toFixed(2)} de desconto)`}
                        </p>
                      )}
                    </div>

                    {/* Select Payment Method */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-muted-foreground">Forma de Pagamento</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map((method) => (
                          <label
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${paymentMethod === method
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border/40 hover:bg-muted/30 text-foreground'
                              }`}
                          >
                            <span>{method}</span>
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === method}
                              onChange={() => { }}
                              className="accent-primary h-3.5 w-3.5"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary Total */}
                  <div className="bg-muted/20 border border-border/30 rounded-2xl p-4 my-2 text-xs space-y-1.5">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Produtos</span>
                      <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {orderType === 'delivery' && deliveryFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Taxa de Entrega</span>
                        <span>+ R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    {activeCoupon && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Desconto</span>
                        <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold border-t border-border/30 pt-2 text-foreground">
                      <span>Total Geral</span>
                      <span className="text-primary font-black">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  {/* Errors display */}
                  {submitError && (
                    <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <DialogFooter className="flex flex-row gap-2 mt-4">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsCheckoutOpen(false)} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 rounded-xl font-bold" onClick={handleCheckout} disabled={isSubmitting}>
                      {isSubmitting ? 'Registrando...' : 'Confirmar Pedido'}
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
            <Button
              onClick={() => setIsCartOpen(true)}
              className="w-full rounded-full py-6 font-bold flex items-center justify-between shadow-xl shadow-primary/20 bg-primary text-white text-base animate-bounce-short"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Ver Sacola</span>
                <span className="h-6 min-w-[24px] rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black px-1.5">
                  {cartItemCount}
                </span>
              </span>
              <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </Button>
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
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {orderType === 'delivery' && deliveryFee > 0 && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Taxa de Entrega</span>
                    <span>+ R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                {activeCoupon && (
                  <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Desconto</span>
                    <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <strong className="text-xl font-black text-primary">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1">
                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <Button 
                      onClick={() => setIsCheckoutOpen(true)}
                      className="col-span-2 rounded-xl py-5 font-bold shadow-md shadow-primary/10"
                    >
                      Ir para o Pagamento
                    </Button>
                    <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl p-6 overflow-y-auto max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-black tracking-tight uppercase">Finalizar Pedido</DialogTitle>
                        <DialogDescription className="text-xs">Insira os dados do envio e forma de pagamento.</DialogDescription>
                      </DialogHeader>

                      {/* Checkout fields inside mobile dialog */}
                      <div className="space-y-4 my-2 text-sm">
                        {/* Select Mode */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase text-muted-foreground">Modo do Pedido</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'table', name: 'Mesa', icon: Utensils },
                              { id: 'delivery', name: 'Entrega', icon: Bike },
                              { id: 'takeaway', name: 'Balcão', icon: Store }
                            ].map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => setOrderType(mode.id as any)}
                                className={cn(
                                  "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold transition-all text-[11px]",
                                  orderType === mode.id
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border/40 hover:bg-muted text-muted-foreground"
                                )}
                              >
                                <mode.icon className="h-3.5 w-3.5" />
                                {mode.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-muted-foreground">Seu Nome</label>
                            <Input
                              type="text"
                              placeholder="Ex: Carlos"
                              value={customerName}
                              onChange={e => setCustomerName(e.target.value)}
                              className="rounded-xl h-10"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-muted-foreground">Telefone/WhatsApp</label>
                            <Input
                              type="tel"
                              placeholder="Ex: (11) 99999-9999"
                              value={customerPhone}
                              onChange={e => setCustomerPhone(e.target.value)}
                              className="rounded-xl h-10"
                            />
                          </div>
                        </div>

                        {/* Conditional Delivery Address */}
                        {orderType === 'delivery' && (
                          <div className="space-y-2.5 p-3 bg-muted/20 border border-border/40 rounded-xl">
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary">Endereço de Entrega</span>

                            <div className="grid grid-cols-4 gap-2">
                              <div className="col-span-3 space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground">Rua/Logradouro</label>
                                <Input
                                  type="text"
                                  placeholder="Rua das Palmeiras"
                                  value={addressStreet}
                                  onChange={e => setAddressStreet(e.target.value)}
                                  className="rounded-xl h-8 text-xs border-border/40 bg-background"
                                />
                              </div>
                              <div className="col-span-1 space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground">Nº</label>
                                <Input
                                  type="text"
                                  placeholder="123"
                                  value={addressNumber}
                                  onChange={e => setAddressNumber(e.target.value)}
                                  className="rounded-xl h-8 text-xs border-border/40 bg-background"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground">Bairro (Selecione)</label>
                                <select
                                  value={addressNeighborhood}
                                  onChange={e => setAddressNeighborhood(e.target.value)}
                                  className="w-full rounded-xl h-8 text-xs border border-border/40 bg-background px-2 font-semibold focus:outline-none"
                                >
                                  <option value="">Selecione...</option>
                                  {initialConfig.deliveryNeighborhoods?.map((n) => (
                                    <option key={n.name} value={n.name}>{n.name} (+ R$ {n.fee.toFixed(2)})</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground">Complemento</label>
                                <Input
                                  type="text"
                                  placeholder="Apt 20"
                                  value={addressComplement}
                                  onChange={e => setAddressComplement(e.target.value)}
                                  className="rounded-xl h-8 text-xs border-border/40 bg-background"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Conditional Table Number */}
                        {orderType === 'table' && (
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-muted-foreground">Mesa do Cliente</label>
                            <Input
                              type="text"
                              placeholder="Ex: 5"
                              value={tableNumber}
                              onChange={e => setTableNumber(e.target.value)}
                              className="rounded-xl h-10"
                            />
                          </div>
                        )}

                        {/* Discount Coupon code */}
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase text-muted-foreground">Cupom de Desconto</label>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Cupom"
                              value={couponInput}
                              onChange={e => setCouponInput(e.target.value)}
                              className="rounded-xl h-10 border-border/40 uppercase"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleApplyCoupon}
                              className="rounded-xl h-10 font-bold shrink-0"
                            >
                              Aplicar
                            </Button>
                          </div>
                          {couponError && <p className="text-[10px] text-destructive font-semibold mt-0.5">{couponError}</p>}
                          {activeCoupon && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                              Cupom ativo: {activeCoupon.code}
                            </p>
                          )}
                        </div>

                        {/* Select Payment Method */}
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-muted-foreground">Forma de Pagamento</label>
                          <div className="flex flex-col gap-1.5">
                            {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map((method) => (
                              <label
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${paymentMethod === method
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border/40 hover:bg-muted/30 text-foreground'
                                  }`}
                              >
                                <span>{method}</span>
                                <input
                                  type="radio"
                                  name="paymentMobile"
                                  checked={paymentMethod === method}
                                  onChange={() => { }}
                                  className="accent-primary h-4.5 w-4.5"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Summary Total */}
                      <div className="bg-muted/20 border border-border/30 rounded-2xl p-4 my-2 text-xs space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Produtos</span>
                          <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {orderType === 'delivery' && deliveryFee > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Taxa de Entrega</span>
                            <span>+ R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        {activeCoupon && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>Desconto</span>
                            <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold border-t border-border/30 pt-2 text-foreground">
                          <span>Total Geral</span>
                          <span className="text-primary font-black">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      {submitError && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <DialogFooter className="flex flex-row gap-2 mt-4">
                        <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs" onClick={() => setIsCheckoutOpen(false)} disabled={isSubmitting}>
                          Voltar
                        </Button>
                        <Button className="flex-1 rounded-xl font-bold h-10 text-xs" onClick={handleCheckout} disabled={isSubmitting}>
                          {isSubmitting ? 'Gravando...' : 'Finalizar'}
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
        <DialogContent className="max-w-sm rounded-2xl p-6">
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

      {/* ========================================================================= */}
      {/* GARÇOM VIRTUAL CHAT DIALOG                                                */}
      {/* ========================================================================= */}
      <Dialog open={isBartenderOpen} onOpenChange={setIsBartenderOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl p-0 overflow-hidden bg-card border border-border/40 flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border/30 bg-primary/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
              👨‍🍳
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-foreground leading-tight">Fred - Garçom Virtual</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Online
              </span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/5 space-y-4">
            <div className="space-y-4 pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2.5 max-w-[85%] items-start",
                    msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {msg.sender === 'waiter' && (
                    <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      F
                    </div>
                  )}
                  <div className="space-y-2">
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
                        msg.sender === 'user'
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-card text-foreground rounded-tl-none border border-border/35"
                      )}
                    >
                      {msg.text}
                    </div>

                    {/* Products recommendation cards in message */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2 mt-2 w-[280px] sm:w-[320px]">
                        {msg.products.map(prod => (
                          <div key={prod.id} className="p-2.5 rounded-xl border border-border/40 bg-card flex gap-2.5 items-center shadow-xs">
                            <img
                              src={prod.photo || '/drink-placeholder.png'}
                              alt={prod.name}
                              className="w-11 h-11 rounded-lg object-cover shrink-0 border border-border/10"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold truncate leading-tight text-foreground">{prod.name}</h4>
                              <span className="text-[10px] font-extrabold text-primary block mt-0.5">
                                R$ {Number(prod.price).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                addToCart({
                                  id: prod.id,
                                  name: prod.name,
                                  price: Number(prod.price),
                                  photo: prod.photo
                                });
                                alert(`${prod.name} adicionado ao pedido!`);
                              }}
                              className="rounded-lg h-7 px-2.5 font-bold text-[10px] shrink-0"
                            >
                              Adicionar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Options inside waiter bubble */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2 w-full min-w-[200px]">
                        {msg.options.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleChatOption(opt)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 transition-all font-bold text-[11px] py-2 px-4 rounded-xl active:scale-95 text-left w-full"
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Blinking Typing indicator */}
              {chatIsTyping && (
                <div className="flex gap-2.5 max-w-[80%] items-start mr-auto">
                  <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    F
                  </div>
                  <div className="p-3 bg-card text-foreground rounded-2xl rounded-tl-none border border-border/35 text-xs flex items-center gap-1.5 py-2.5">
                    <span className="h-1.5 w-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              {/* Dummy div to scroll to */}
              <div ref={chatBottomRef} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
