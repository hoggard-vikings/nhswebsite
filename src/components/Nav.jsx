import { useState } from 'react';
import NHSLogo from './NHSLogo';

export const Nav = ({ active, onNavigate }) => {
  const tabs = ['Home', 'About', 'Membership', 'Volunteer', 'Meetings', 'Contact'];
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (t) => {
    onNavigate(t);
    setMobileOpen(false);
  };

  return (
    <header style={{
      background: 'var(--paper)',
      borderBottom: '1px solid var(--rule)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '22px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); handleNav('Home'); }} data-leaves="logo"
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--navy-ink)', flexShrink: 0 }}>
          <NHSLogo size={38} color="var(--navy)" accent="var(--gold)" />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em' }}>Viking Chapter</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 3 }}>National Honor Society</div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {tabs.map((t) => {
            const isActive = active === t;
            return (
              <a key={t} href="#" onClick={(e) => { e.preventDefault(); onNavigate(t); }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive ? 'var(--navy-ink)' : 'var(--muted)',
                  padding: '10px 14px',
                  borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { if (!isActive) e.target.style.color = 'var(--navy)'; }}
                onMouseLeave={(e) => { if (!isActive) e.target.style.color = 'var(--muted)'; }}
              >{t}</a>
            );
          })}
        </nav>

        {/* Hamburger button */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          {mobileOpen ? (
            /* X icon */
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="4" y1="4" x2="18" y2="18" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="4" x2="4" y2="18" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="6"  x2="19" y2="6"  stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="11" x2="19" y2="11" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="16" x2="19" y2="16" stroke="var(--navy)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--rule)',
          background: 'var(--paper)',
          padding: '8px 20px 20px',
        }}>
          {tabs.map((t) => {
            const isActive = active === t;
            return (
              <a key={t} href="#" onClick={(e) => { e.preventDefault(); handleNav(t); }}
                style={{
                  display: 'block',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive ? 'var(--navy-ink)' : 'var(--muted)',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--rule)',
                  borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                  paddingLeft: 12,
                }}>
                {t}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

const FooterCol = ({ title, links, onNavigate }) => (
  <div>
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--gold-bright)',
      marginBottom: 18,
    }}>{title}</div>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {links.map((l) => {
        const linkStyle = { color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 13, transition: 'color 0.15s' };
        const onEnter = (e) => { e.target.style.color = 'var(--gold-bright)'; };
        const onLeave = (e) => { e.target.style.color = 'rgba(255,255,255,0.78)'; };
        if (l.href) {
          const isMail = l.href.startsWith('mailto:');
          return (
            <li key={l.label}>
              <a href={l.href} target={isMail ? undefined : '_blank'} rel="noopener noreferrer"
                style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {l.label}
              </a>
            </li>
          );
        }
        return (
          <li key={l.label}>
            <a href="#"
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(l.label); }}
              style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
              {l.label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

export const Footer = ({ onNavigate }) => (
  <footer style={{
    background: 'var(--navy-ink)',
    color: 'rgba(255,255,255,0.78)',
    padding: '64px 20px 32px',
    marginTop: 80,
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="grid-footer">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <NHSLogo size={44} color="white" accent="var(--gold-bright)" />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'white', fontWeight: 700 }}>
                Viking Chapter
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-bright)', marginTop: 4 }}>
                National Honor Society
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 380, color: 'rgba(255,255,255,0.65)' }}>
            Recognizing and cultivating scholarship, service, leadership, and character among the students of John T. Hoggard High School.
          </p>
        </div>

        <FooterCol title="Chapter" links={[
          { label: 'Home' }, { label: 'About' }, { label: 'Membership' },
          { label: 'Volunteer' }, { label: 'Meetings' }, { label: 'Contact' },
        ]} onNavigate={onNavigate} />

        <FooterCol title="Resources" links={[
          { label: 'New Member Application', href: 'https://docs.google.com/forms/d/e/1FAIpQLSdKP4upRu9vt9dAIlTWX7mMUwR_GlhCT8rmG9WxK411pRIIBw/closedform?pli=1' },
          { label: 'Validation Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLScUIrWWqzVdeAHumUk542qSpsuQGpCcp4OUkuavulrDlzsB7g/viewform?usp=header' },
          { label: 'Unsponsored Hours Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfsqx0a4zJvnvELBqAAWlIgGaGhFw-5yPvpQ_RZ6_0CJjtjvg/viewform?usp=header' },
          { label: 'Individual Project Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLScLo8HwK8lfKq0IcySUL47bRid1J9Wt-naiTiB1ClmEcjVbxw/viewform?usp=header' },
          { label: 'Hoggard NHS Bylaws', href: 'https://docs.google.com/document/d/1vhIGKKLhcIoc7pW50SB5KiyrXypEz_BXvfccOZEg8M4/edit?usp=sharing' },
        ]} />

        <FooterCol title="School & National" links={[
          { label: 'Hoggard High School', href: 'https://hoggard.nhcs.net' },
          { label: 'NHS National', href: 'https://www.nationalhonorsociety.org' },
          { label: 'jthhonorsociety@gmail.com', href: 'mailto:jthhonorsociety@gmail.com' },
          { label: 'hunter.moody@nhcs.net', href: 'mailto:hunter.moody@nhcs.net' },
        ]} />
      </div>

      <div className="footer-bottom">
        <span>© 2026 Hoggard NHS · Viking Chapter · John T. Hoggard High School, Wilmington NC</span>
        <span>Scholarship · Service · Leadership · Character</span>
      </div>
    </div>
  </footer>
);
