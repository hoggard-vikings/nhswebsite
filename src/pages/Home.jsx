import Gallery from '../components/Gallery';

const QuickCard = ({ kicker, title, body, cta, href, onClick }) => {
  const inner = (
    <div style={{
      background: 'var(--parchment)', border: '1px solid var(--rule)',
      padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column',
      cursor: 'pointer', transition: 'all 0.2s ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>{kicker}</div>
      <h3 style={{ fontSize: 22, marginBottom: 12, lineHeight: 1.25 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{body}</p>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--navy)' }}>{cta} →</div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a>;
  return <div onClick={onClick}>{inner}</div>;
};

const Home = ({ onNavigate, sections }) => (
  <main>
    {/* HERO */}
    <section style={{ background: 'var(--navy-ink)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(165,145,95,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(90,164,223,0.12) 0%, transparent 40%)',
      }} />
      <div className="grid-hero" style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 20px 96px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 84px)', color: 'white', fontWeight: 700, marginBottom: 20 }}>
            Honor.<br />Service.<br />
            <span style={{ color: 'var(--gold-bright)', fontStyle: 'italic' }}>Leadership.</span>
          </h1>
          <hr className="gold-rule" style={{ width: 80, height: 2, background: 'var(--gold-bright)' }} />
          <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', maxWidth: 520, marginBottom: 36 }}>
            The Viking Chapter at John T. Hoggard High School recognizes students who exemplify scholarship, service, leadership, and character, and gives them the means to lead.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('Events')} className="btn btn-gold">
              Sign Up to Serve →
            </button>
            <button onClick={() => onNavigate('Membership')} className="btn btn-outline-light">
              Membership Info
            </button>
          </div>
        </div>

        {/* Hero photo — hidden on mobile via inline responsive handling */}
        <div style={{ position: 'relative', height: 480 }}>
          <img src="https://res.cloudinary.com/dbc9mudek/image/upload/v1778534833/IMG_1237_mxz3sg.jpg"
            alt="Induction ceremony"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: -12, left: -12, width: 80, height: 80, borderTop: '3px solid var(--gold-bright)', borderLeft: '3px solid var(--gold-bright)' }} />
          <div style={{ position: 'absolute', bottom: -12, right: -12, width: 80, height: 80, borderBottom: '3px solid var(--gold-bright)', borderRight: '3px solid var(--gold-bright)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(255,255,255,0.96)', color: 'var(--navy-ink)', padding: '14px 18px', maxWidth: 220 }}>
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>The Class of 2026</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, lineHeight: 1.3 }}>
              126 inducted members serving Wilmington this year.
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PILLARS */}
    {sections.pillars && (
      <section className="pad-xl" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow">The Four Pillars</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', marginTop: 12 }}>What we stand for</h2>
            <hr className="gold-rule center" />
          </div>
          <div className="grid-pillars">
            {[
              { word: 'Scholarship', num: 'I.', body: 'Demonstrated through an unweighted GPA of 3.6 or higher and consistent academic excellence.' },
              { word: 'Service', num: 'II.', body: 'A minimum of 20 volunteer hours each year, devoted to the school and the Wilmington community.' },
              { word: 'Leadership', num: 'III.', body: 'Initiative shown in classrooms, athletics, the arts, and student-led service projects.' },
              { word: 'Character', num: 'IV.', body: 'Integrity, responsibility, and respect — held to the highest expectations on campus and beyond.' },
            ].map((p) => (
              <div key={p.word} style={{ background: 'var(--paper)', padding: '40px 28px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--gold)', fontStyle: 'italic', marginBottom: 18 }}>{p.num}</div>
                <h3 style={{ fontSize: 26, marginBottom: 14 }}>{p.word}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* QUOTE / MISSION */}
    {sections.mission && (
      <section className="pad-xl" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, color: 'var(--gold)', lineHeight: 0.6, marginBottom: 12 }}>"</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, lineHeight: 1.4, color: 'var(--navy-ink)', fontStyle: 'italic', marginBottom: 28 }}>
            The purpose of this organization shall be to create enthusiasm for scholarship, to stimulate a desire to render service, to promote leadership, and to develop character in the students of secondary schools.
          </p>
          <hr className="gold-rule center" />
          <div className="eyebrow" style={{ marginTop: 16 }}>— The National Honor Society Constitution</div>
        </div>
      </section>
    )}

    {/* QUICK LINKS */}
    {sections.quickLinks && (
      <section className="pad-xl" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header-row">
            <div>
              <div className="eyebrow">Member Resources</div>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', marginTop: 12 }}>Get involved this semester</h2>
            </div>
            <button className="btn btn-outline" onClick={() => onNavigate('Volunteer')}>All Resources →</button>
          </div>
          <div className="grid-quick-links">
            <QuickCard kicker="Service Hours" title="Sign up for chapter events"
              body="Browse upcoming chapter-sponsored service opportunities and reserve your spot."
              cta="View Event List" onClick={() => onNavigate('Events')} />
            <QuickCard kicker="Validation" title="Submit completed hours"
              body="Use the electronic validation form within 48 hours of finishing an event. Photo evidence required."
              cta="Volunteer Page" onClick={() => onNavigate('Volunteer')} />
            <QuickCard kicker="Maintaining Membership" title="Read the requirements"
              body="GPA, attendance, hours, and Honor Code expectations for every active member."
              cta="Membership Page" onClick={() => onNavigate('Membership')} />
          </div>
        </div>
      </section>
    )}

    {/* GALLERY STRIP */}
    {sections.gallery && (
      <section className="pad-xl-0" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow">In the Community</div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', marginTop: 12 }}>This year, in pictures</h2>
            <hr className="gold-rule center" />
          </div>
          <Gallery />
        </div>
      </section>
    )}

    {/* CTA BANNER */}
    <section className="pad-cta" style={{ background: 'rgb(14, 26, 54)', color: 'white', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow on-dark">Service Opportunities Open Now</div>
          <h2 style={{ color: 'white', fontSize: 'clamp(24px, 3vw, 36px)', marginTop: 10 }}>
            Reserve your hours for the semester.
          </h2>
        </div>
        <button onClick={() => onNavigate('Events')}
          className="btn btn-gold" style={{ padding: '18px 36px', fontSize: 14 }}>
          Sign Up to Serve →
        </button>
      </div>
    </section>
  </main>
);

export default Home;
