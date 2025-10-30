import Sidebar from '@/components/Sidebar';
import IncinerationModule from '@/components/IncinerationModule';
import AIAssistant from '@/components/AIAssistant';

export default function IncinerationPage() {
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
          <IncinerationModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

