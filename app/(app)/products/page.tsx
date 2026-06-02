'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product, VariableCost, FixedCost } from '@/types'
import { calculatePricing, formatCurrency } from '@/lib/pricing'
import { formatCurrency as formatCur } from '@/lib/utils'
import Link from 'next/link'

export default function ProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data: costsData } = await supabase
        .from('fixed_costs')
        .select('*')
      
      setProducts(productsData || [])
      setFixedCosts(costsData || [])
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deletar produto?')) return
    try {
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const getProductPricing = (product: Product) => {
    try {
      const pricing = calculatePricing(
        product,
        [],
        fixedCosts,
        products.length
      )
      return pricing
    } catch {
      return null
    }
  }

  const getMarginColor = (margin: number) => {
    if (margin < 0) return 'text-red-600'
    if (margin < 10) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Produtos</h1>
        <Link href="/products/new" className="btn btn-primary">
          + Novo Produto
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Carregando...</p>
      ) : products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Nenhum produto cadastrado</p>
          <Link href="/products/new" className="btn btn-primary inline-block">
            Criar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-black">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-black">SKU</th>
                <th className="text-right py-3 px-4 font-medium text-black">Custo</th>
                <th className="text-right py-3 px-4 font-medium text-black">Preço</th>
                <th className="text-right py-3 px-4 font-medium text-black">Margem</th>
                <th className="text-center py-3 px-4 font-medium text-black">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const pricing = getProductPricing(product)
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-black font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{product.sku || '—'}</td>
                    <td className="py-3 px-4 text-right text-black">
                      {formatCur(product.cost_price)}
                    </td>
                    <td className="py-3 px-4 text-right text-black font-medium">
                      {pricing ? formatCur(pricing.suggestedSellingPrice) : '—'}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      pricing ? getMarginColor(pricing.realMarginPercent) : ''
                    }`}>
                      {pricing ? `${pricing.realMarginPercent}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Ver
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
