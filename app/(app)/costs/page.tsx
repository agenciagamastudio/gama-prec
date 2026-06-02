'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FixedCost } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function CostsPage() {
  const supabase = createClient()
  const [costs, setCosts] = useState<FixedCost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
  })

  useEffect(() => {
    fetchCosts()
  }, [])

  const fetchCosts = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('fixed_costs')
        .select('*')
        .order('created_at', { ascending: false })
      setCosts(data || [])
    } catch (error) {
      console.error('Erro ao carregar custos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.value) {
      alert('Preencha todos os campos')
      return
    }
    try {
      if (editingId) {
        await supabase
          .from('fixed_costs')
          .update({
            name: formData.name,
            value: parseFloat(formData.value),
            category: formData.category,
          })
          .eq('id', editingId)
        setEditingId(null)
      } else {
        await supabase.from('fixed_costs').insert({
          name: formData.name,
          value: parseFloat(formData.value),
          category: formData.category,
        })
      }
      setFormData({ name: '', value: '', category: '' })
      setShowForm(false)
      fetchCosts()
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleDeleteCost = async (id: string) => {
    if (!confirm('Deletar?')) return
    try {
      await supabase.from('fixed_costs').delete().eq('id', id)
      fetchCosts()
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  const totalCosts = costs.reduce((sum, cost) => sum + cost.value, 0)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Custos Fixos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancelar' : '+ Adicionar'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <form onSubmit={handleAddCost} className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="Nome"
              required
            />
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: e.target.value })}
              className="input w-full"
              placeholder="Valor"
              required
            />
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </form>
        </div>
      )}

      <div className="card mb-8 bg-green-50">
        <p className="text-gray-600">Total Mensal</p>
        <p className="text-3xl font-bold text-black">{formatCurrency(totalCosts)}</p>
      </div>

      <div className="card">
        {costs.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Nenhum custo</p>
        ) : (
          <div className="space-y-3">
            {costs.map(cost => (
              <div key={cost.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-black">{cost.name}</p>
                  <p className="text-sm text-gray-600">{cost.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-black">{formatCurrency(cost.value)}</p>
                  <button
                    onClick={() => handleDeleteCost(cost.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
