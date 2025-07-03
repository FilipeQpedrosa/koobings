import { Calendar, Users, Search, FileText, ArrowRight, Phone, Mail, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ClientesPage() {
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
            👥 Gestão de Clientes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Conheça melhor os seus <span className="text-blue-600">clientes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Base de dados centralizada, histórico completo de serviços e ferramentas para construir relacionamentos duradouros. 
            Os seus clientes são únicos - trate-os como tal.
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
            Tudo sobre os seus clientes num só lugar
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Base de Dados Centralizada</h3>
                <p className="text-gray-600">
                  Todos os dados dos clientes organizados e facilmente acessíveis. Nunca mais perca informações importantes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Histórico Completo</h3>
                <p className="text-gray-600">
                  Veja todos os serviços prestados, preferências e notas importantes de cada cliente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pesquisa Inteligente</h3>
                <p className="text-gray-600">
                  Encontre qualquer cliente rapidamente por nome, telefone, email ou serviço.
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
                  <h3 className="text-xl font-semibold">Registo automático</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Sempre que um cliente faz uma marcação, os seus dados são automaticamente guardados na base de dados. 
                  Sem trabalho extra para si.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Nome, telefone e email guardados automaticamente</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Detecção de clientes existentes</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Campos personalizáveis conforme o seu negócio</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Novo Cliente</span>
                    <Badge variant="secondary">Registado</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Nome:</strong> Ana Costa</div>
                    <div><strong>Email:</strong> ana@email.com</div>
                    <div><strong>Telefone:</strong> 910 123 456</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                  <h3 className="text-xl font-semibold">Histórico detalhado</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Cada cliente tem um perfil completo com histórico de serviços, preferências e notas pessoais. 
                  Construa relacionamentos mais próximos.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Todos os serviços realizados</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Preferências e observações</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Dados de contacto atualizados</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:order-1">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Ana Costa</span>
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div><strong>Última visita:</strong> 10 Jan 2025</div>
                    <div><strong>Total visitas:</strong> 8</div>
                    <div><strong>Preferência:</strong> Manhãs</div>
                    <div><strong>Nota:</strong> Alérgica a perfumes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                  <h3 className="text-xl font-semibold">Comunicação direta</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Contacte os seus clientes diretamente através da plataforma. 
                  Telefone, email ou mensagem - tudo integrado e simples.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Botões de contacto direto</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Histórico de comunicações</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Lembretes de follow-up</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium">Contactar Cliente</div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Porquê gerir bem os seus clientes?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Relacionamentos mais próximos</h3>
                      <p className="text-gray-600 text-sm">
                        Lembre-se das preferências de cada cliente. Proporcione um serviço personalizado que faz a diferença.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Clientes mais fiéis</h3>
                      <p className="text-gray-600 text-sm">
                        Clientes que se sentem especiais voltam mais vezes e recomendam os seus serviços.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Menos tempo perdido</h3>
                      <p className="text-gray-600 text-sm">
                        Encontre rapidamente qualquer informação. Sem procurar em papéis ou cadernos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Decisões informadas</h3>
                      <p className="text-gray-600 text-sm">
                        Dados sobre frequência de visitas e preferências ajudam a melhorar o seu negócio.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para conhecer melhor os seus clientes?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comece hoje e veja como é fácil construir relacionamentos duradouros.
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