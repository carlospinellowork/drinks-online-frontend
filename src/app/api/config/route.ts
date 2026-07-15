import { NextResponse } from 'next/server';
import { getRestaurantConfig, saveRestaurantConfig } from '@/lib/db';
import { RestaurantConfig } from '@/types';

export async function GET() {
  const config = await getRestaurantConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const newConfig: RestaurantConfig = await request.json();
    
    // Basic validation
    if (!newConfig.name || !newConfig.theme || !newConfig.categories) {
      return NextResponse.json({ error: 'Configuração inválida. Campos obrigatórios ausentes.' }, { status: 400 });
    }

    await saveRestaurantConfig(newConfig);
    return NextResponse.json({ success: true, config: newConfig });
  } catch (error) {
    console.error('Failed to update config:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar configurações.' }, { status: 500 });
  }
}
