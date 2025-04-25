// e.g. in LandingPage.tsx
import '../styles/globals.css';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="container">
      <section className="landing-hero">
        <div className="landing-cta">
          <h1>“I’m good at this, and I need help with that.”</h1>
          <button>Get Started</button>
        </div>
      </section>
      {/* … */}
    </div>
  );
}
