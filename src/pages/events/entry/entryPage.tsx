import AppLayout from '@/components/AppLayout';
import AuthRequired from '@/components/AuthRequired';
import { motion } from 'framer-motion';
import EntrySection from '.';
import ResponsiveContainer from '@/components/ResponsiveContainer';

const EntryPage = () => (
  <AuthRequired>
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <h1 className="text-2xl font-bold mb-6">Entrada de Produtos</h1>
          <EntrySection />
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  </AuthRequired>
);

export default EntryPage;
