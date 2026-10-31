import { useState } from 'react';
import PageHero from '../components/PageHero';

const TabBlock = ({ title, body, items, steps, warning, cta }) => (
  <div className="grid-tabblock">
    <div>
      <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', marginBottom: 14 }}>{title}</h2>
      <hr className="gold-rule" />
      <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.65 }}>{body}</p>
      {warning && (
        <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(165,145,95,0.12)', borderLeft: '3px solid var(--gold)', fontSize: 13, color: 'var(--navy-ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
          {warning}
        </div>
      )}
      {cta && (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cta.className || 'btn btn-navy'} style={{ marginTop: 24, ...(cta.style || {}) }}>
          {cta.label}
        </a>
      )}
    </div>
    <div>
      {items && (
        <div>
          {items.map((it, i) => (
            <div key={i} style={{ padding: '20px 0', borderTop: i === 0 ? '1px solid var(--rule)' : 'none', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, alignItems: 'baseline' }}>
              <div className="eyebrow">{it.kicker}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--navy-ink)' }}>{it.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{it.meta}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {steps && (
        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {steps.map((s, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 16, padding: '18px 0', borderBottom: '1px solid var(--rule)', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 26, color: 'var(--gold)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 16, color: 'var(--navy-ink)', lineHeight: 1.6 }}>{s}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);

const Volunteer = ({ onNavigate }) => {
  const [tab, setTab] = useState('Sponsored');

  return (
    <main>
      <PageHero eyebrow="Volunteer & Service" title="Earn your hours."
        lede="Members must complete a minimum of 20 service hours per year. Hours can be earned through chapter-sponsored events, approved unsponsored events, and your own Individual Service Project." />

      {/* Dual CTA cards */}
      <section className="pad-md">
        <div className="grid-volunteer-cta" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-leaves="sponsored-box" style={{ background: 'rgb(14, 26, 54)', color: 'white', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="eyebrow on-dark">Now Open</div>
              <h2 style={{ color: 'white', fontSize: 'clamp(20px, 2vw, 28px)', marginTop: 8 }}>Chapter-Sponsored Events</h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', marginTop: 8, fontSize: 15 }}>
                Browse and reserve your spot for upcoming chapter events. Sponsored hours are pre-approved.
              </p>
            </div>
            <button onClick={() => onNavigate('Events')} className="btn btn-gold" style={{ padding: '14px 24px', alignSelf: 'flex-start' }}>
              View Events &amp; Sign Up →
            </button>
          </div>

          <div style={{ background: 'var(--parchment)', border: '1px solid var(--rule)', borderTop: '3px solid var(--gold)', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="eyebrow">After Every Event</div>
              <h2 style={{ color: 'var(--navy-ink)', fontSize: 'clamp(20px, 2vw, 28px)', marginTop: 8 }}>Submit Your Hours</h2>
              <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 15 }}>
                Submit the electronic validation form within 48 hours of completing any service event. Photo evidence required — no exceptions.
              </p>
            </div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScUIrWWqzVdeAHumUk542qSpsuQGpCcp4OUkuavulrDlzsB7g/viewform?usp=header"
              target="_blank" rel="noopener noreferrer" className="btn btn-navy" style={{ padding: '14px 24px', alignSelf: 'flex-start' }}>
              Open Validation Form →
            </a>
          </div>
        </div>
      </section>

      {/* Tabbed sections */}
      <section className="pad-lg-r">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="tab-scroll" style={{ marginBottom: 40 }}>
            {['Sponsored', 'Unsponsored', 'Individual Project', 'Validation'].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: 'transparent', border: 'none', padding: '14px 22px', whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.16em',
                textTransform: 'uppercase', cursor: 'pointer',
                color: tab === t ? 'var(--navy-ink)' : 'var(--muted)',
                borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: -1,
              }}>{t}</button>
            ))}
          </div>

          {tab === 'Sponsored' && (
            <TabBlock title="Chapter-Sponsored Service"
              body="Sponsored events are organized by the chapter and are pre-approved for service hours. View the full list of upcoming events and reserve your spot — popular events fill quickly."
              steps={[
                'Open the chapter events page to view all currently open opportunities.',
                'Reserve your spot for any event that fits your schedule — sponsored hours are pre-approved.',
                'Attend the event and take a clear photograph of yourself participating.',
                'Submit the electronic Validation Form within 48 hours of completion.',
              ]}
              warning="You must still submit a validation form for every sponsored event you attend — signing up alone does not log your hours."
              cta={{ href: 'https://docs.google.com/forms/d/e/1FAIpQLSfL0ufIuCNC8CKBPYTWfmknIhto9IcHR83bCUWk-SNVtUXY_A/viewform?usp=header', label: 'Event Interest Form ↗', className: 'btn btn-outline', style: { fontSize: 11, padding: '10px 18px' } }} />
          )}

          {tab === 'Unsponsored' && (
            <TabBlock title="Unsponsored Service Opportunities"
              body="Unsponsored events are service activities you find on your own — through other organizations, churches, community groups, or family connections. They must be approved in advance to count toward your hours."
              steps={[
                'Submit the Unsponsored Approval Form at least 48 hours before the event takes place.',
                'Wait for an approval email from jthhonorsociety@gmail.com confirming the event is eligible for hours.',
                'Attend the event and take a clear photograph of yourself participating.',
                'Submit the electronic Validation Form within 48 hours of completion.',
              ]}
              warning="Hours from unapproved events will not be accepted — no exceptions."
              cta={{ href: 'https://docs.google.com/forms/d/e/1FAIpQLSfsqx0a4zJvnvELBqAAWlIgGaGhFw-5yPvpQ_RZ6_0CJjtjvg/viewform?usp=header', label: 'Open Unsponsored Approval Form ↗' }} />
          )}

          {tab === 'Individual Project' && (
            <TabBlock title="Individual Service Project"
              body="The Individual Service Project (ISP) must be your own original idea — not run through another club, organization, or non-profit. ISPs must also be group projects, accessible to all NHS members."
              steps={[
                "Develop your project idea using the Individual Service Project 12 W's template.",
                'If your project involves an outside organization, the organization must email the adviser directly.',
                'Confirm the organization needs volunteers before the project is approved.',
                'Submit the project proposal to the executive committee for review.',
                'Lead the event — and earn additional hours for organizing, where justifiable.',
              ]}
              cta={{ href: 'https://docs.google.com/forms/d/e/1FAIpQLScLo8HwK8lfKq0IcySUL47bRid1J9Wt-naiTiB1ClmEcjVbxw/viewform?usp=header', label: 'Open Individual Service Project Form ↗' }} />
          )}

          {tab === 'Validation' && (
            <TabBlock title="Submitting Your Hours"
              body="This year, all hour validation has moved to electronic forms. Each completed event requires its own validation form, submitted within 48 hours."
              items={[
                { kicker: 'Required', title: 'Electronic Validation Form', meta: 'One submission per event — no exceptions' },
                { kicker: 'Required', title: 'Photo Evidence', meta: 'A clear photo of you at the event' },
                { kicker: 'Recommended', title: 'Digital Backup', meta: 'Take a screenshot of every form submission' },
                { kicker: 'Note', title: 'No Double-Dipping', meta: 'Hours used for NHS cannot be counted toward another club, organization, or honor society' },
              ]}
              warning="If a form is lost and you do not have a digital record, your service hours will not be accepted. It is your responsibility to keep records."
              cta={{ href: 'https://docs.google.com/forms/d/e/1FAIpQLScUIrWWqzVdeAHumUk542qSpsuQGpCcp4OUkuavulrDlzsB7g/viewform?usp=header', label: 'Open Validation Form ↗' }} />
          )}
        </div>
      </section>

      {/* Hour due dates */}
      <section className="pad-sm-top">
        <div style={{ maxWidth: 1100, margin: '0 auto', background: 'var(--navy-ink)', color: 'white', padding: '32px 28px' }}>
          <div className="eyebrow on-dark">Hour Deadlines</div>
          <h3 style={{ fontSize: 22, marginTop: 8, marginBottom: 20, color: 'white' }}>Semester due dates.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderTop: '2px solid var(--gold-bright)', padding: '20px 24px' }}>
              <div className="eyebrow on-dark">Fall Semester</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'white', marginTop: 8, lineHeight: 1.1 }}>January 15, 2027</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>All fall semester hours and validation forms must be submitted by January 15.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderTop: '2px solid var(--gold-bright)', padding: '20px 24px' }}>
              <div className="eyebrow on-dark">Spring Semester</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.1 }}>N/A</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>No spring semester deadline has been set yet.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Check */}
      <section style={{ padding: '32px 32px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: 'var(--parchment)', border: '1px solid var(--rule)', borderTop: '3px solid var(--gold)', padding: '32px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Hour Tracking</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--navy-ink)', marginBottom: 6 }}>Want to know how many hours you have?</div>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>Fill out the status check form and we'll look up your logged hours on file.</div>
          </div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfPfwKGfzWDCmNzUuzzWyvb9x3Eoq23e0bu8XRRgc-zVa1cVw/viewform?usp=header"
            target="_blank" rel="noopener noreferrer" className="btn btn-navy" style={{ padding: '14px 24px', flexShrink: 0 }}>
            Check My Hours →
          </a>
        </div>
      </section>
    </main>
  );
};

export default Volunteer;
