
import React from 'react';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <ResponsiveContainer>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as opções gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Usuário</CardTitle>
                <CardDescription>
                  Gerencie suas preferências pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure parâmetros do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                  Gerencie configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default Settings;
