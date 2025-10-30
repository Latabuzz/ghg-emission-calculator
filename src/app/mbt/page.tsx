import Sidebar from '@/components/Sidebar';
import MBTModule from '@/components/MBTModule';
import AIAssistant from '@/components/AIAssistant';

export default function MBTPage() {
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
          <MBTModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

