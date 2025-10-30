import Sidebar from '@/components/Sidebar';
import CompostingModule from '@/components/CompostingModule';
import AIAssistant from '@/components/AIAssistant';

export default function CompostingPage() {
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
          <CompostingModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

