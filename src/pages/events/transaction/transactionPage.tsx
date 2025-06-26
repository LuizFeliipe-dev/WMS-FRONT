import AppLayout from '@/components/AppLayout';
import AuthRequired from '@/components/AuthRequired';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import TransactionSection from '@/pages/events/transaction';
import { motion } from 'framer-motion';

const TransactionPage = () => (
  <AuthRequired>
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Transação</h1>
            <p className="text-gray-500 mt-1">
              Registre a movimentação de itens do armazém
            </p>
          </header>
          <TransactionSection />
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  </AuthRequired>
);

export default TransactionPage;
