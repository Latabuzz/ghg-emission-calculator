import Sidebar from '@/components/Sidebar';
import OpenBurningModule from '@/components/OpenBurningModule';
import AIAssistant from '@/components/AIAssistant';

export default function OpenBurningPage() {
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
          <OpenBurningModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

