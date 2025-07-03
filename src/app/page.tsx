'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, ArrowRight, MapPin, Mail, TrendingUp, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'

export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Koobings</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Button onClick={openContactModal}>Fale connosco</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            ✨ Muito mais do que uma ferramenta de agendamentos
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            O seu parceiro digital de 
            <br />
            <span className="text-blue-600">confiança</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ajudamos microempresas de serviços a ganharem eficiência, organização e autonomia. 
            Comece pela gestão do dia a dia e cresça connosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={openContactModal}>
              <Mail className="w-5 h-5 mr-2" />
              Fale connosco
            </Button>
            <Link href="#como-funciona">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Como Funciona
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pensado para a sua realidade
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entendemos os desafios dos pequenos negócios. Por isso criámos uma solução simples, 
              adaptável e que cresce consigo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Parceria e Proximidade</h3>
                <p className="text-gray-600">
                  Não somos apenas uma ferramenta. Somos o seu parceiro digital, 
                  que entende e adapta-se à sua forma de trabalhar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão Descomplicada</h3>
                <p className="text-gray-600">
                  Interface simples e intuitiva. Menos tempo a gerir, 
                  mais tempo a trabalhar com os seus clientes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Visão de Crescimento</h3>
                <p className="text-gray-600">
                  Comece pela organização interna e evolua para ganhar 
                  visibilidade e novas oportunidades de negócio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Como o Koobings o ajuda
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Organize o seu dia a dia</h3>
                  <p className="text-gray-600">Gerir marcações, clientes, horários e equipa numa só plataforma. Simples e eficiente.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ganhe autonomia</h3>
                  <p className="text-gray-600">Adaptamos a plataforma à sua forma de trabalhar. Os seus clientes continuam a ser seus.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cresça connosco</h3>
                  <p className="text-gray-600">No futuro, ajudamos também a ganhar visibilidade e atrair novos clientes.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Dashboard do seu negócio</h4>
                <p className="text-sm text-gray-600">Tudo o que precisa numa interface clara e organizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para simplificar o seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se aos empreendedores que já descobriram como a tecnologia pode ser simples e útil.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={openContactModal}>
            <Mail className="w-5 h-5 mr-2" />
            Comece Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Koobings</span>
              </div>
              <p className="text-gray-400">
                O parceiro digital de confiança das microempresas de serviços.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Gestão de Marcações</li>
                <li>Clientes</li>
                <li>Equipa</li>
                <li>Relatórios</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós</li>
                <li>Contacto</li>
                <li>Privacidade</li>
                <li>Termos</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>admin@koobings.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Portugal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Koobings. Crescemos consigo.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
      />
    </div>
  )
} 