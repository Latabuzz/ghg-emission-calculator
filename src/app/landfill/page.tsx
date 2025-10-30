import Sidebar from '@/components/Sidebar';
import LandfillModule from '@/components/LandfillModule';
import AIAssistant from '@/components/AIAssistant';

export default function LandfillPage() {
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
          <LandfillModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

