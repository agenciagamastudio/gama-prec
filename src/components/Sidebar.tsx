'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black">Gama Prec</h1>
        <p className="text-sm text-gray-600 mt-1">Precificação Inteligente</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <NavLink 
          href="/dashboard" 
          label="Dashboard"
          active={isActive('/dashboard')}
          icon="📊"
        />
        <NavLink 
          href="/costs" 
          label="Custos Fixos"
          active={isActive('/costs')}
          icon="💰"
        />
        <NavLink 
          href="/products" 
          label="Produtos"
          active={isActive('/products')}
          icon="📦"
        />
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-gray-200 space-y-3">
        <div className="text-sm">
          <p className="text-gray-600 text-xs">Logado como</p>
          <p className="text-black font-medium truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="btn btn-secondary w-full text-sm"
        >
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </div>
  )
}

interface NavLinkProps {
  href: string
  label: string
  active: boolean
  icon: string
}

function NavLink({ href, label, active, icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-[8px] transition-colors ${
        active
          ? 'bg-[#00E676] text-black font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  )
}
