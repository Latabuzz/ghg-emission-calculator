import Sidebar from '@/components/Sidebar';
import FactorsModule from '@/components/FactorsModule';
import AIAssistant from '@/components/AIAssistant';

export default function FactorsPage() {
  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <Sidebar />
        <main style={{ 
          flex: 1,
          overflowY: 'auto',
          height: '100vh',
          width: '100%'
        }}
        >
          <FactorsModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

