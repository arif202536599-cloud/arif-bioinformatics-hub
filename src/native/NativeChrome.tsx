import { useEffect, useState } from 'react';
import { Home, BookOpen, Dna, Database, ShieldCheck, X } from 'lucide-react';
import { Network } from '@capacitor/network';
import { installNativeLinks } from './runtime';
import './native.css';
export function NativeChrome({ activeTab, navigate }: { activeTab: string; navigate: (tab: string) => void }) {
  const [online, setOnline] = useState(true), [notice, setNotice] = useState('');
  useEffect(() => {
    const cleanup = installNativeLinks();
    Network.getStatus().then(s => setOnline(s.connected)).catch(() => {});
    const listener = Network.addListener('networkStatusChange', s => setOnline(s.connected));
    const message = (e: Event) => setNotice((e as CustomEvent).detail);
    window.addEventListener('biohub-native-notice', message);
    return () => { cleanup(); void listener.then(l => l.remove()); window.removeEventListener('biohub-native-notice', message); };
  }, []);
  const tabs = [{ id: 'home', label: 'Home', icon: Home }, { id: 'learning', label: 'Learn', icon: BookOpen },
    { id: 'central-dogma', label: 'Dogma', icon: Dna }, { id: 'software', label: 'Tools', icon: Database }, { id: 'privacy', label: 'Privacy', icon: ShieldCheck }];
  return <>
    {!online && <div className="native-offline" role="status">Offline · learning tools and the synthetic demo are available. Database searches require internet.</div>}
    {notice && <div className="native-notice" role="alert"><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={18}/></button></div>}
    <nav className="native-tabs" aria-label="Android navigation">{tabs.map(({ id, label, icon: Icon }) => <button key={id} aria-current={activeTab === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={21}/><span>{label}</span></button>)}</nav>
  </>;
}
