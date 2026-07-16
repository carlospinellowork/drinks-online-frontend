import { NextResponse } from 'next/server';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '@/lib/db';
import { Order, OrderStatus } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const order = await getOrderById(id);
      if (!order) {
        return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Failed to get orders:', error);
    return NextResponse.json({ error: 'Erro ao buscar pedidos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerPhone, 
      orderType, 
      tableNumber, 
      address, 
      deliveryFee, 
      items, 
      paymentMethod, 
      couponCode, 
      discountValue, 
      subtotal, 
      total 
    } = body;

    // Validation
    if (!customerName || !customerPhone || !orderType || !items || items.length === 0 || !paymentMethod) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const id = `ped-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newOrder: Order = {
      id,
      customerName,
      customerPhone,
      orderType,
      tableNumber: orderType === 'table' ? tableNumber : undefined,
      address: orderType === 'delivery' ? address : undefined,
      deliveryFee: orderType === 'delivery' ? Number(deliveryFee) : 0,
      items,
      paymentMethod,
      couponCode: couponCode || undefined,
      discountValue: Number(discountValue) || 0,
      subtotal: Number(subtotal),
      total: Number(total),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const savedOrder = await createOrder(newOrder);

    return NextResponse.json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Erro ao registrar pedido.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string, status: OrderStatus };

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios.' }, { status: 400 });
    }

    const validStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    }

    await updateOrderStatus(id, status);

    return NextResponse.json({ success: true, message: `Status do pedido atualizado para ${status}.` });
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Erro ao atualizar pedido.' }, { status: 500 });
  }
}
