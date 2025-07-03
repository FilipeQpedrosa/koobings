import { Calendar, Shield, Lock, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Koobings</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Política de Privacidade
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A sua privacidade é fundamental para nós. Esta política explica como recolhemos, 
            utilizamos e protegemos os seus dados pessoais.
          </p>
          <p className="text-sm text-gray-500 mt-4">Última atualização: Janeiro 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Dados que Recolhemos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Dados de Registo</h4>
                <p className="text-gray-600">Nome, email, telefone e informações da empresa para criar a sua conta.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dados de Utilização</h4>
                <p className="text-gray-600">Informações sobre como utiliza a plataforma para melhorar o serviço.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dados de Clientes</h4>
                <p className="text-gray-600">Informações dos seus clientes que introduz na plataforma para gestão de marcações.</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                Como Utilizamos os Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Fornecer e manter o serviço da plataforma</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Processar marcações e notificações</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Comunicar consigo sobre o serviço</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Melhorar a segurança e performance da plataforma</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Cumprir obrigações legais</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                Proteção dos Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
                os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Medidas de Segurança:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Encriptação de dados em trânsito e em repouso</li>
                  <li>• Controlo de acesso baseado em funções</li>
                  <li>• Monitorização contínua de segurança</li>
                  <li>• Backups regulares e seguros</li>
                  <li>• Conformidade com o RGPD</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Os Seus Direitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Ao abrigo do RGPD, tem os seguintes direitos sobre os seus dados pessoais:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Direito de Acesso</h4>
                  <p className="text-sm text-gray-600">Pode solicitar uma cópia dos seus dados</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Direito de Retificação</h4>
                  <p className="text-sm text-gray-600">Pode corrigir dados inexatos</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Direito ao Apagamento</h4>
                  <p className="text-sm text-gray-600">Pode solicitar a eliminação dos seus dados</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Direito de Portabilidade</h4>
                  <p className="text-sm text-gray-600">Pode exportar os seus dados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Para exercer os seus direitos ou esclarecer dúvidas sobre esta política, 
                contacte-nos através de:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">Email:</p>
                <a href="mailto:privacy@koobings.com" className="text-blue-600 hover:underline">
                  privacy@koobings.com
                </a>
                <p className="font-semibold mt-2">Ou:</p>
                <a href="mailto:admin@koobings.com" className="text-blue-600 hover:underline">
                  admin@koobings.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Link href="/">
            <Button size="lg" className="text-lg px-8 py-3">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 