import Sidebar from '@/components/Sidebar';
import TransportationModule from '@/components/TransportationModule';
import AIAssistant from '@/components/AIAssistant';

export default function TransportationPage() {
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
          <TransportationModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

