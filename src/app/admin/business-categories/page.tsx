'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Plus, Tag, Palette, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessCategory {
  key: string;
  name: string;
  description: string;
  color: string;
}

interface CategoriesData {
  current: BusinessCategory[];
  suggested: BusinessCategory[];
  total: number;
}

export default function BusinessCategoriesPage() {
  const [categoriesData, setCategoriesData] = useState<CategoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Color palette for new categories
  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
    '#EF4444', '#06B6D4', '#84CC16', '#F472B6', '#A78BFA'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/business-categories');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }

      const result = await response.json();
      if (result.success) {
        setCategoriesData(result.data);
      } else {
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar as categorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "❌ Dados incompletos",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/business-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "✅ Sucesso",
          description: result.message || "Categoria adicionada com sucesso",
        });
        setShowAddDialog(false);
        setNewCategory({ name: '', description: '', color: '#3B82F6' });
        fetchCategories(); // Refresh data
      } else {
        throw new Error(result.message || 'Erro ao adicionar categoria');
      }
    } catch (err) {
      toast({
        title: "❌ Erro",
        description: err instanceof Error ? err.message : "Erro ao adicionar categoria",
        variant: "destructive"
      });
    }
  };

  const toggleCategorySelection = (categoryKey: string) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(categoryKey)) {
      newSelection.delete(categoryKey);
    } else {
      newSelection.add(categoryKey);
    }
    setSelectedCategories(newSelection);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando categorias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Erro ao Carregar
            </CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchCategories} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias de Negócios</h1>
          <p className="text-gray-600 mt-1">
            Gerir categorias para classificar os negócios na plataforma
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Criar uma nova categoria de negócio para a plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Ex: Dentista"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descrição</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="col-span-3"
                  placeholder="Ex: Clínicas dentárias e ortodontia"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">Cor</Label>
                <div className="col-span-3 flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({...newCategory, color})}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategory.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCategory}>
                <Tag className="mr-2 h-4 w-4" />
                Adicionar Categoria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {categoriesData && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
                <div className="text-2xl font-bold">{categoriesData.total}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
                <div className="text-2xl font-bold text-green-600">{categoriesData.current.length}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sugestões</CardTitle>
                <div className="text-2xl font-bold text-blue-600">{categoriesData.suggested.length}</div>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Categorias Ativas</TabsTrigger>
          <TabsTrigger value="suggested">Sugestões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Categorias Ativas
              </CardTitle>
              <CardDescription>
                Categorias atualmente disponíveis na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesData?.current.map((category) => (
                  <Card 
                    key={category.key} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCategories.has(category.key) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => toggleCategorySelection(category.key)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: category.color + '20', color: category.color }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </Badge>
                        {selectedCategories.has(category.key) && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggested" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-blue-600" />
                Categorias Sugeridas
              </CardTitle>
              <CardDescription>
                Novas categorias que podem ser adicionadas à plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesData?.suggested.map((category) => (
                  <Card 
                    key={category.key} 
                    className={`cursor-pointer transition-all hover:shadow-md border-dashed ${
                      selectedCategories.has(category.key) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => toggleCategorySelection(category.key)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: category.color, color: category.color }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </Badge>
                        {selectedCategories.has(category.key) && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCategories.size > 0 && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">
                  {selectedCategories.size} categoria(s) selecionada(s)
                </p>
                <p className="text-sm text-blue-600">
                  Pode aplicar ações em lote ou configurar para negócios específicos
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategories(new Set())}
                >
                  Limpar Seleção
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Aplicar às Empresas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 