import LoginPage from './pages/LoginPage.jsx';
import AppShell from './components/layout/AppShell.jsx';
import { useApp } from './context/AppContext.jsx';
import { resolvePage } from './utils/pageRouter.jsx';

export default function App() {
  const { currentUser, activePage } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const ActivePage = resolvePage(activePage);

  return (
    <AppShell>
      <ActivePage />
    </AppShell>
  );
}
