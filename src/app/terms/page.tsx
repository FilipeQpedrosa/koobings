import { Calendar, FileText, Scale, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function TermsPage() {
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
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Termos e Condições
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estes termos regulam a utilização da plataforma Koobings. 
            Ao utilizar o nosso serviço, concorda com estes termos.
          </p>
          <p className="text-sm text-gray-500 mt-4">Última atualização: Janeiro 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Descrição do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                A Koobings é uma plataforma digital que oferece soluções de gestão para microempresas 
                de serviços, incluindo gestão de marcações, clientes, equipa e relatórios.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">O serviço inclui:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Sistema de marcações online</li>
                  <li>• Gestão de base de dados de clientes</li>
                  <li>• Calendário e agenda partilhada</li>
                  <li>• Relatórios e análise de negócio</li>
                  <li>• Notificações automáticas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Obligations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                Obrigações do Utilizador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Ao utilizar a plataforma, compromete-se a:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Fornecer informações verdadeiras e atualizadas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Utilizar o serviço apenas para fins legítimos</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Não partilhar as suas credenciais de acesso</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Respeitar os direitos de propriedade intelectual</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-600">Notificar-nos de qualquer uso não autorizado da sua conta</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                Usos Proibidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                É expressamente proibido utilizar a plataforma para:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Atividades Ilegais</p>
                  <p className="text-sm text-gray-600">Qualquer atividade que viole leis portuguesas ou internacionais</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Spam ou Phishing</p>
                  <p className="text-sm text-gray-600">Envio de mensagens não solicitadas ou tentativas de fraude</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Violação de Dados</p>
                  <p className="text-sm text-gray-600">Tentativas de aceder a dados de outros utilizadores</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Sobrecarga do Sistema</p>
                  <p className="text-sm text-gray-600">Uso excessivo que comprometa a performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment and Billing */}
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos e Faturação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Planos de Subscrição</h4>
                  <p className="text-gray-600">Os preços dos planos estão disponíveis no nosso site e podem ser alterados com aviso prévio de 30 dias.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Faturação</h4>
                  <p className="text-gray-600">A faturação é feita mensalmente ou anualmente, conforme o plano escolhido. O pagamento é debitado automaticamente.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cancelamento</h4>
                  <p className="text-gray-600">Pode cancelar a sua subscrição a qualquer momento. O cancelamento torna-se efetivo no final do período de faturação atual.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Dados e Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                O tratamento dos seus dados pessoais está regulado pela nossa 
                <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Política de Privacidade</Link>.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Propriedade dos Dados:</h4>
                <p className="text-sm text-gray-600">
                  Mantém a propriedade de todos os dados que introduz na plataforma. 
                  Garantimos que pode exportar os seus dados a qualquer momento.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                A Koobings esforça-se por manter o serviço disponível e seguro, mas não podemos garantir:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Disponibilidade ininterrupta do serviço</li>
                <li>• Ausência total de erros ou bugs</li>
                <li>• Compatibilidade com todos os dispositivos</li>
                <li>• Recuperação de dados em caso de falha técnica</li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Recomendamos que mantenha backups dos seus dados importantes. 
                  A nossa responsabilidade está limitada ao valor pago pelo serviço.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Lei Aplicável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Estes termos são regidos pela lei portuguesa. Qualquer litígio será resolvido 
                nos tribunais competentes de Portugal.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Para questões sobre estes termos, contacte-nos através de:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">Email:</p>
                <a href="mailto:legal@koobings.com" className="text-blue-600 hover:underline">
                  legal@koobings.com
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