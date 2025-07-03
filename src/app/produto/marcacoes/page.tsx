import { Calendar, Clock, Users, CheckCircle, ArrowRight, Smartphone, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function MarcacoesPage() {
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
              <Button variant="outline">Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            📅 Gestão de Marcações
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Organize as suas <span className="text-blue-600">marcações</span> de forma simples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Calendário inteligente, notificações automáticas e gestão completa dos seus agendamentos. 
            Nunca mais perca uma marcação ou tenha conflitos de horário.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-3">
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tudo o que precisa para gerir marcações
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calendário Inteligente</h3>
                <p className="text-gray-600">
                  Visualize todas as marcações numa interface clara. Arraste e solte para reagendar facilmente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Notificações Automáticas</h3>
                <p className="text-gray-600">
                  Lembretes por email e SMS para si e para os seus clientes. Configure quando enviar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão de Horários</h3>
                <p className="text-gray-600">
                  Defina disponibilidade, pausas e horários especiais. Evite marcações em conflito.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Como funciona
          </h2>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
                  <h3 className="text-xl font-semibold">Configure os seus horários</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Defina quando está disponível, duração dos serviços e intervalos entre marcações. 
                  O sistema previne automaticamente conflitos.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Horários flexíveis por dia da semana</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Pausas e intervalos automáticos</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Horários especiais para feriados</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Segunda-feira</span>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>09:00 - 12:00</div>
                    <div>14:00 - 18:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <h3 className="text-xl font-semibold">Receba marcações</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Os clientes veem apenas os horários disponíveis e fazem marcações instantâneas. 
                  Você recebe notificação imediata.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Formulário simples para o cliente</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Confirmação automática ou manual</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Dados do cliente guardados automaticamente</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:order-1">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Nova Marcação</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Cliente:</strong> Maria Silva</div>
                    <div><strong>Serviço:</strong> Consulta</div>
                    <div><strong>Data:</strong> 15 Jan, 14:30</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <h3 className="text-xl font-semibold">Gerir e acompanhar</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Veja todas as marcações numa vista de calendário. Confirme, reagende ou cancele facilmente. 
                  Notificações automáticas mantêm todos informados.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Vista diária, semanal e mensal</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Reagendar com arrastar e soltar</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Histórico completo de marcações</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Hoje: 5 marcações</div>
                    <div className="text-xs text-gray-500">3 confirmadas, 2 pendentes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso em qualquer lugar
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Interface responsiva que funciona perfeitamente no telemóvel. 
              Gira o seu negócio mesmo quando está fora do escritório.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold mb-1">📱 Mobile First</div>
                <div className="text-gray-600">Desenhado para funcionar no telemóvel</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold mb-1">⚡ Rápido</div>
                <div className="text-gray-600">Carregamento instantâneo</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold mb-1">🔄 Sincronizado</div>
                <div className="text-gray-600">Atualizações em tempo real</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para organizar as suas marcações?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comece gratuitamente hoje e veja como é simples gerir o seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Ver Outras Funcionalidades
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 