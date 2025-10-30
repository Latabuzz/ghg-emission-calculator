import Sidebar from '@/components/Sidebar';
import ReportsModule from '@/components/ReportsModule';
import AIAssistant from '@/components/AIAssistant';

export default function ReportsPage() {
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
          <ReportsModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

