import Sidebar from '@/components/Sidebar';
import ScenariosModule from '@/components/ScenariosModule';
import AIAssistant from '@/components/AIAssistant';

export default function ScenariosPage() {
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
          <ScenariosModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

