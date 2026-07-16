'use client';

import React, { use, useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  HelpCircle, 
  Utensils, 
  Sparkles, 
  ShoppingBag,
  Bike,
  Store,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { Order, RestaurantConfig } from '@/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Order and Config
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [configRes, orderRes] = await Promise.all([
          fetch('/api/config'),
          fetch(`/api/orders?id=${id}`)
        ]);

        if (!active) return;

        if (configRes.ok && orderRes.ok) {
          const configData = await configRes.json();
          const orderData = await orderRes.json();
          setConfig(configData);
          setOrder(orderData.order);
          setError(null);
        } else {
          setError('Pedido ou configurações não encontrados.');
        }
      } catch (err) {
        console.error(err);
        if (active) setError('Erro ao conectar com o servidor.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    // Start polling every 7 seconds
    const interval = setInterval(fetchData, 7000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 bg-background text-foreground">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">Carregando status do pedido...</p>
      </div>
    );
  }

  if (error || !order || !config) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
        <ShoppingBag className="h-16 w-16 text-destructive mb-4 animate-bounce" />
        <h2 className="text-xl font-bold tracking-tight">Ops! Pedido Não Encontrado</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Não conseguimos localizar o seu pedido. Por favor, verifique se o link está correto.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-6 rounded-xl font-bold gap-2 px-6")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Cardápio
        </Link>
      </div>
    );
  }

  // Helper for status details
  const getStatusDetails = () => {
    switch (order.status) {
      case 'pending':
        return {
          title: 'Aguardando Confirmação',
          desc: 'Seu pedido foi recebido e está aguardando confirmação do bar/cozinha.',
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          step: 0,
        };
      case 'preparing':
        return {
          title: 'Em Preparação',
          desc: 'O bartender já está preparando seus drinks e bebidas!',
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
          step: 1,
        };
      case 'ready':
        return {
          title: order.orderType === 'delivery' ? 'Saiu para Entrega' : 'Pronto para Retirada',
          desc: order.orderType === 'delivery' 
            ? 'Seu pedido saiu do estabelecimento e está a caminho!' 
            : order.orderType === 'table'
              ? 'Seu drink está pronto e sendo levado até sua mesa!'
              : 'Seu pedido está pronto para ser retirado no balcão.',
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
          step: 2,
        };
      case 'completed':
        return {
          title: 'Entregue & Concluído',
          desc: 'Pedido entregue com sucesso! Aproveite seus drinks.',
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          step: 3,
        };
      case 'cancelled':
        return {
          title: 'Pedido Cancelado',
          desc: 'Este pedido foi cancelado pelo estabelecimento. Caso tenha dúvidas, entre em contato.',
          color: 'text-destructive bg-destructive/10 border-destructive/20',
          step: -1,
        };
    }
  };

  const statusInfo = getStatusDetails();
  const steps = [
    { title: 'Recebido', icon: Clock },
    { title: 'Preparo', icon: Utensils },
    { title: order.orderType === 'delivery' ? 'Rota' : 'Pronto', icon: order.orderType === 'delivery' ? Bike : Sparkles },
    { title: 'Concluído', icon: CheckCircle2 }
  ];

  // WhatsApp Support Message
  const supportText = `Olá! Gostaria de suporte referente ao meu pedido *#${order.id}*.`;
  const supportLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(supportText)}`;

  return (
    <div className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl border hover:bg-muted")}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-right">
          <span className="text-xs text-muted-foreground font-mono">PEDIDO</span>
          <h1 className="text-sm font-black font-mono text-primary">#{order.id}</h1>
        </div>
      </div>

      {/* Main Status Block */}
      <Card className="rounded-2xl border border-border/40 shadow-xl overflow-hidden">
        <div className={cn("p-5 border-b font-bold text-center flex items-center justify-center gap-2 text-sm", statusInfo.color)}>
          <Clock className="h-4 w-4 animate-pulse" />
          <span>{statusInfo.title}</span>
        </div>
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed max-w-md mx-auto">
            {statusInfo.desc}
          </p>

          {/* Progress Timeline */}
          {statusInfo.step >= 0 && (
            <div className="relative flex items-center justify-between w-full pt-8 pb-4 max-w-xs mx-auto">
              {/* Timeline Connector Line */}
              <div className="absolute top-[50px] left-0 right-0 h-1 bg-muted rounded-full z-0">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(statusInfo.step / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps Icons */}
              {steps.map((st, index) => {
                const IconComponent = st.icon;
                const isCompleted = index < statusInfo.step;
                const isActive = index === statusInfo.step;

                return (
                  <div key={index} className="flex flex-col items-center z-10 relative">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isCompleted ? "bg-primary border-primary text-white shadow-md shadow-primary/20" :
                      isActive ? "bg-background border-primary text-primary scale-110 shadow-lg" :
                      "bg-background border-muted text-muted-foreground"
                    )}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <IconComponent className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold mt-2",
                      isActive ? "text-primary font-black" : "text-muted-foreground"
                    )}>
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Info Summary */}
      <Card className="rounded-2xl border border-border/40 shadow-md">
        <CardHeader className="pb-2 border-b border-border/40">
          <CardTitle className="text-xs font-black tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
            {order.orderType === 'delivery' ? <Bike className="h-4 w-4 text-primary" /> : 
             order.orderType === 'table' ? <Utensils className="h-4 w-4 text-primary" /> :
             <Store className="h-4 w-4 text-primary" />}
            Resumo de Entrega / Mesa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex justify-between items-start gap-4">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-semibold text-right">{order.customerName} ({order.customerPhone})</span>
          </div>

          <div className="flex justify-between items-start gap-4 border-t border-border/30 pt-2">
            <span className="text-muted-foreground">Método:</span>
            <span className="font-semibold capitalize text-right">
              {order.orderType === 'delivery' ? 'Entrega' : 
               order.orderType === 'table' ? `Mesa ${order.tableNumber}` : 'Retirada no Balcão'}
            </span>
          </div>

          {order.orderType === 'delivery' && order.address && (
            <div className="flex justify-between items-start gap-4 border-t border-border/30 pt-2">
              <span className="text-muted-foreground">Endereço:</span>
              <span className="font-semibold text-right flex flex-col text-xs leading-normal">
                <span>{order.address.street}, {order.address.number}</span>
                <span className="text-muted-foreground">{order.address.neighborhood}</span>
                {order.address.complement && <span className="italic text-muted-foreground/80">Comp: {order.address.complement}</span>}
              </span>
            </div>
          )}

          <div className="flex justify-between items-start gap-4 border-t border-border/30 pt-2">
            <span className="text-muted-foreground">Pagamento:</span>
            <span className="font-semibold text-right">{order.paymentMethod}</span>
          </div>
        </CardContent>
      </Card>

      {/* Items Details */}
      <Card className="rounded-2xl border border-border/40 shadow-md">
        <CardHeader className="pb-2 border-b border-border/40">
          <CardTitle className="text-xs font-black tracking-wider uppercase text-muted-foreground">
            Items Comprados ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="divide-y divide-border/30">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.photo && (
                    <img 
                      src={item.photo} 
                      alt={item.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-muted border border-border/30"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold leading-none">{item.name}</h4>
                    <span className="text-xs text-muted-foreground mt-1 block">R$ {item.price.toFixed(2).replace('.', ',')} cada</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-muted-foreground">x{item.quantity}</span>
                  <p className="text-sm font-black text-foreground mt-0.5">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/40 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de Entrega</span>
                <span>+ R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            {order.discountValue > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold dark:text-emerald-400">
                <span>Desconto ({order.couponCode})</span>
                <span>- R$ {order.discountValue.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm border-t border-border/30 pt-3">
              <span className="font-extrabold text-foreground">Total Pago</span>
              <strong className="text-lg font-black text-primary">R$ {order.total.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Action Footer */}
      <div className="flex flex-col gap-2 pt-2">
        <a 
          href={supportLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl py-6 font-semibold gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all")}
        >
          <Phone className="h-4 w-4" />
          Falar com o Suporte
        </a>
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-xl py-6 font-bold text-muted-foreground hover:text-foreground")}
        >
          Voltar para o Início
        </Link>
      </div>

    </div>
  );
}
