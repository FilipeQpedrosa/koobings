'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Table, 
  Users, 
  Calendar, 
  Settings, 
  Activity,
  RefreshCw,
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface TableData {
  tableName: string;
  rowCount: number;
  columns: string[];
  sampleData: any[];
}

interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  lastUpdated: string;
}

export default function DatabaseBrowserPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/database/browser', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data.tables || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching database info:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table =>
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTableData = tables.find(t => t.tableName === selectedTable);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações da base de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Database className="h-8 w-8 text-indigo-600" />
                Database Browser
              </h1>
              <p className="text-gray-600 mt-2">
                Visualize e explore todos os dados da base de dados de produção
              </p>
            </div>
            <Button onClick={fetchDatabaseInfo} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tabelas</p>
                    <p className="text-2xl font-bold">{stats.totalTables}</p>
                  </div>
                  <Table className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Registos</p>
                    <p className="text-2xl font-bold">{stats.totalRows.toLocaleString()}</p>
                  </div>
                  <Database className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Última Atualização</p>
                    <p className="text-sm font-bold">{new Date(stats.lastUpdated).toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                  <Settings className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="tables" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tables">Todas as Tabelas</TabsTrigger>
            <TabsTrigger value="data">Dados Detalhados</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Procurar tabelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTables.map((table) => (
                <Card 
                  key={table.tableName} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTable(table.tableName)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        {table.tableName}
                      </span>
                      <Badge variant="secondary">
                        {table.rowCount.toLocaleString()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Colunas:</strong> {table.columns.length}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {table.columns.slice(0, 3).map((column) => (
                          <Badge key={column} variant="outline" className="text-xs">
                            {column}
                          </Badge>
                        ))}
                        {table.columns.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{table.columns.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {selectedTableData ? (
              <div className="space-y-6">
                {/* Table Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Table className="h-6 w-6" />
                    {selectedTableData.tableName}
                  </h2>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {selectedTableData.rowCount.toLocaleString()} registos
                  </Badge>
                </div>

                {/* Columns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Colunas ({selectedTableData.columns.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedTableData.columns.map((column) => (
                        <Badge key={column} variant="outline" className="text-sm">
                          {column}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Dados de Exemplo (Primeiros 10 registos)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {selectedTableData.columns.map((column) => (
                              <th
                                key={column}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedTableData.sampleData.map((row, index) => (
                            <tr key={index}>
                              {selectedTableData.columns.map((column) => (
                                <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {row[column] !== null && row[column] !== undefined 
                                    ? String(row[column]).length > 50 
                                      ? String(row[column]).substring(0, 50) + '...'
                                      : String(row[column])
                                    : <span className="text-gray-400 italic">null</span>
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecione uma tabela
                  </h3>
                  <p className="text-gray-600">
                    Clique numa tabela para ver os dados detalhados
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
