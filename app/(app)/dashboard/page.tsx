import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/cards/MetricCard'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Não autenticado</div>
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get fixed costs
  const { data: fixedCosts } = await supabase
    .from('fixed_costs')
    .select('*')
    .eq('user_id', user.id)

  // Get products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)

  const totalFixedCosts = (fixedCosts || []).reduce((sum, cost) => sum + cost.value, 0)
  const totalProducts = (products || []).length
  const breakEvenPoint = totalProducts > 0 ? totalFixedCosts / totalProducts : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-2">{profile?.company_name}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Custos Fixos Mensais"
          value={formatCurrency(totalFixedCosts)}
          icon="💰"
          color="bg-blue-50"
        />
        <MetricCard
          title="Total de Produtos"
          value={totalProducts.toString()}
          icon="📦"
          color="bg-purple-50"
        />
        <MetricCard
          title="Ponto de Equilíbrio"
          value={formatCurrency(breakEvenPoint)}
          icon="🎯"
          color="bg-green-50"
          subtitle="por produto"
        />
      </div>

      {/* Products Overview */}
      <div className="card">
        <h2 className="text-lg font-bold text-black mb-4">Resumo de Produtos</h2>
        {products && products.length > 0 ? (
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-[8px]"
              >
                <div>
                  <p className="font-medium text-black">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-black">
                    {formatCurrency(product.cost_price)}
                  </p>
                  <p className="text-sm text-[#00E676]">
                    {product.desired_margin}% margem
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Nenhum produto cadastrado ainda. Comece adicionando um!
          </p>
        )}
      </div>
    </div>
  )
}
