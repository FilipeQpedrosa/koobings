'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function EnvironmentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [environment, setEnvironment] = useState<string | null>(null)

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT || 'production'
    setEnvironment(env)
    
    // Show banner for non-production environments
    if (env !== 'production') {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible || environment === 'production') {
    return null
  }

  const getBannerConfig = () => {
    switch (environment) {
      case 'staging':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-900',
          message: '🧪 AMBIENTE DE TESTES - Esta é uma versão de desenvolvimento. Dados podem ser apagados.',
          url: 'https://koobings.com'
        }
      case 'development':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-900',
          message: '🔧 DESENVOLVIMENTO - Ambiente local de desenvolvimento',
          url: null
        }
      default:
        return {
          bg: 'bg-red-500',
          text: 'text-red-900',
          message: `⚠️ AMBIENTE: ${(environment || 'UNKNOWN').toUpperCase()} - Não é o ambiente de produção`,
          url: 'https://koobings.com'
        }
    }
  }

  const config = getBannerConfig()

  return (
    <div className={`${config.bg} ${config.text} px-4 py-2 text-sm font-medium relative`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{config.message}</span>
          {config.url && (
            <a 
              href={config.url}
              className="underline hover:no-underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ir para Produção →
            </a>
          )}
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="hover:opacity-70 transition-opacity"
          aria-label="Fechar banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
} 