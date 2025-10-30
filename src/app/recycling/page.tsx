import Sidebar from '@/components/Sidebar';
import RecyclingModule from '@/components/RecyclingModule';
import AIAssistant from '@/components/AIAssistant';

export default function RecyclingPage() {
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
          <RecyclingModule />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}

