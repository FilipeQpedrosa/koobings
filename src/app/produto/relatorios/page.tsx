import { Calendar, BarChart3, TrendingUp, PieChart, ArrowRight, Target, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function RelatoriosPage() {
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
            📊 Relatórios e Análises
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Compreenda o seu <span className="text-blue-600">negócio</span> com dados reais
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Relatórios automáticos, métricas importantes e insights que o ajudam a tomar decisões informadas. 
            Veja como o seu negócio está a crescer.
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
            Dados que fazem a diferença
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Relatórios Automáticos</h3>
                <p className="text-gray-600">
                  Relatórios gerados automaticamente com as métricas mais importantes do seu negócio.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tendências de Crescimento</h3>
                <p className="text-gray-600">
                  Acompanhe o crescimento do seu negócio ao longo do tempo com gráficos claros.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Insights Actionáveis</h3>
                <p className="text-gray-600">
                  Sugestões práticas baseadas nos seus dados para melhorar o desempenho.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Que relatórios pode gerar?
          </h2>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Receita e Faturação</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Veja quanto facturou por dia, semana, mês ou ano. Compare períodos e identifique padrões.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Receita total por período</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Comparação ano anterior</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Previsões de crescimento</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold">€3.420</div>
                    <div className="text-sm text-gray-500">Este mês</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>vs mês anterior</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Ocupação e Produtividade</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Analise quantas horas trabalhou, taxa de ocupação e produtividade da equipa.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Horas trabalhadas vs disponíveis</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Performance individual da equipa</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Períodos de maior/menor procura</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:order-1">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold">78%</div>
                    <div className="text-sm text-gray-500">Taxa de ocupação</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span>Manhãs</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span>85%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Tardes</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-12 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span>70%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Clientes e Serviços</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Descubra quais os serviços mais populares, clientes mais fiéis e padrões de consumo.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Serviços mais solicitados</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Clientes com mais marcações</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Frequência de visitas por cliente</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium">Serviços Populares</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Consulta</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tratamento</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reavaliação</span>
                      <span className="font-semibold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Como os relatórios ajudam o seu negócio?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Decisões baseadas em dados</h3>
                      <p className="text-gray-600 text-sm">
                        Pare de adivinhar e comece a decidir com base em factos reais sobre o seu negócio.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Identifique oportunidades</h3>
                      <p className="text-gray-600 text-sm">
                        Descubra horários com maior procura, serviços populares e clientes fiéis.
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
                      <h3 className="font-semibold mb-2">Melhore a eficiência</h3>
                      <p className="text-gray-600 text-sm">
                        Optimize horários, ajuste preços e organize melhor a equipa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Aumente a receita</h3>
                      <p className="text-gray-600 text-sm">
                        Identifique padrões que levam a mais vendas e replique estratégias de sucesso.
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
              "Finalmente percebo como está o meu negócio"
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Antes era só intuição. Agora vejo claramente quais são os meus melhores horários, 
              serviços mais rentáveis e como posso crescer de forma sustentável.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>Relatórios atualizados automaticamente</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para compreender o seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comece hoje e descubra insights valiosos sobre como fazer crescer o seu negócio.
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