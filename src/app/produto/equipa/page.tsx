import { Calendar, Users, Shield, Clock, ArrowRight, UserPlus, Settings, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function EquipaPage() {
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
            👥 Gestão de Equipa
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Organize a sua <span className="text-blue-600">equipa</span> como um profissional
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Horários coordenados, permissões definidas e produtividade medida. 
            Transforme a sua equipa numa máquina bem oleada.
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
            Coordene a sua equipa sem complicações
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calendário Partilhado</h3>
                <p className="text-gray-600">
                  Veja a disponibilidade de toda a equipa numa só vista. Evite conflitos e maximize eficiência.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Permissões e Acessos</h3>
                <p className="text-gray-600">
                  Defina quem pode ver e fazer o quê. Mantenha a privacidade e organize responsabilidades.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance Individual</h3>
                <p className="text-gray-600">
                  Acompanhe o desempenho de cada membro da equipa e identifique oportunidades de melhoria.
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
                  <h3 className="text-xl font-semibold">Adicione a sua equipa</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Convide os membros da equipa por email. Cada pessoa tem o seu próprio perfil e calendário pessoal.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Convites automáticos por email</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Perfis individuais personalizáveis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Horários específicos por pessoa</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Novo Membro</span>
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Nome:</strong> João Santos</div>
                    <div><strong>Função:</strong> Especialista</div>
                    <div><strong>Horário:</strong> Ter-Sex 9h-18h</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <h3 className="text-xl font-semibold">Configure permissões</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Defina o que cada pessoa pode ver e fazer. Desde acesso total até apenas ver o próprio calendário.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Níveis de acesso personalizáveis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Controlo sobre dados de clientes</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Gestão de relatórios e métricas</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:order-1">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Permissões</span>
                    <Settings className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Ver calendário</span>
                      <Badge variant="secondary" className="text-xs">Todos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Editar marcações</span>
                      <Badge variant="secondary" className="text-xs">Próprias</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Ver relatórios</span>
                      <Badge variant="outline" className="text-xs">Não</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <h3 className="text-xl font-semibold">Coordene e acompanhe</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Vista geral da equipa, relatórios de produtividade e ferramentas para uma gestão eficaz.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Dashboard da equipa em tempo real</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Relatórios individuais automáticos</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Comunicação integrada</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium">Performance Semanal</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span>Maria</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span>87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>João</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Benefits */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Benefícios para a sua equipa
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Menos conflitos de horário</h3>
                      <p className="text-gray-600 text-sm">
                        Veja a disponibilidade de todos numa só vista. Evite marcações em sobreposição.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Privacidade garantida</h3>
                      <p className="text-gray-600 text-sm">
                        Cada pessoa vê apenas o que deve ver. Controlo total sobre acessos e dados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Performance transparente</h3>
                      <p className="text-gray-600 text-sm">
                        Relatórios automáticos mostram produtividade individual e de equipa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Trabalho em equipa</h3>
                      <p className="text-gray-600 text-sm">
                        Ferramentas que promovem colaboração e comunicação eficaz entre membros.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial-like section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              "Finalmente conseguimos coordenar os horários de toda a equipa"
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Acabaram-se os conflitos, as confusões e as marcações duplas. 
              Agora cada pessoa sabe exatamente quando está disponível e o que tem de fazer.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Ideal para equipas de 2 a 20+ pessoas</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para organizar a sua equipa?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comece hoje e transforme a forma como a sua equipa trabalha em conjunto.
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