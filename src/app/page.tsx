import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
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
          <Dashboard />
        </main>
      </div>
      <AIAssistant />
    </>
  );
}



