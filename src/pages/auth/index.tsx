
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the return URL from location state or default to '/dashboard'
  const from = location.state?.from?.pathname || '/dashboard';
  
  useEffect(() => {
    // If already authenticated, redirect to the from page
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      console.log('Login successful, redirecting to:', from);
      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o dashboard...",
      });
      // Redirecionamento acontecerá no useEffect quando isAuthenticated mudar
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/50">
          <div className="p-6 md:p-8">
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl">
                <Box className="h-8 w-8 md:h-10 md:w-10" />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-center mb-1 md:mb-2">
              MALLDRE WMS
            </h1>
            <p className="text-gray-500 text-center text-sm md:text-base mb-6 md:mb-8">
              Sistema de Gerenciamento de Armazém
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="********"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 md:mt-8 text-center text-sm text-gray-500">
              <p>
                Usuários para teste (senha: 123456):
              </p>
              <div className="mt-2 space-y-1">
                <p>basic@malldre.com (Usuário básico)</p>
                <p>mid@malldre.com (Intermediário)</p>
                <p>manager@malldre.com (Gerente)</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
