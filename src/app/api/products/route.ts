import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';
import { Product } from '@/types';

// Helper to generate safe IDs
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // trim leading hyphen
    .replace(/-+$/, ''); // trim trailing hyphen
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  let products = await getProducts();
  
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }
  
  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  try {
    const newProduct: Omit<Product, 'id'> & { id?: string } = await request.json();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes (nome, preço ou categoria).' }, { status: 400 });
    }

    const products = await getProducts();
    const id = newProduct.id || `${slugify(newProduct.name)}-${Date.now()}`;

    const createdProduct: Product = {
      ...newProduct,
      id,
      description: newProduct.description || null,
      isActive: newProduct.isActive !== undefined ? newProduct.isActive : true
    };

    products.push(createdProduct);
    await saveProducts(products);

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Erro interno ao adicionar produto.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct: Product = await request.json();

    if (!updatedProduct.id || !updatedProduct.name || !updatedProduct.price || !updatedProduct.category) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const products = await getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    products[index] = {
      ...updatedProduct,
      description: updatedProduct.description || null
    };
    
    await saveProducts(products);

    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Erro interno ao atualizar produto.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 });
    }

    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    products.splice(index, 1);
    await saveProducts(products);

    return NextResponse.json({ success: true, message: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Erro interno ao excluir produto.' }, { status: 500 });
  }
}
