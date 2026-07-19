import { useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  CircleDot,
  Copy,
  Database,
  GitBranch,
  Github,
  History,
  Layers3,
  Menu,
  Package,
  Play,
  RotateCcw,
  Sparkles,
  TimerReset,
  X,
  Zap,
} from 'lucide-react';

const installCommand = 'npm install @onuracar-dev/nimblejs';

const code = `import { batch, computed, effect, signal } from '@onuracar-dev/nimblejs';

const first = signal('Ada');
const last = signal('Lovelace');
const fullName = computed(() => \`${'${first.value} ${last.value}'}\`);

const stop = effect(() => {
  render(fullName.value);
  return () => cleanup();
});

batch(() => {
  first.value = 'Grace';
  last.value = 'Hopper';
}); // dependent effect runs once

stop();
fullName.dispose();`;

const api = [
  { name: 'signal', icon: CircleDot, detail: 'Mutable reactive value with Object.is equality.' },
  { name: 'computed', icon: GitBranch, detail: 'Lazy derived value with explicit disposal.' },
  { name: 'effect', icon: Activity, detail: 'Dynamic dependency tracking, cleanup, scheduler.' },
  { name: 'batch', icon: Layers3, detail: 'Coalesce nested synchronous writes.' },
  { name: 'createStore', icon: Boxes, detail: 'Named signals and batched raw state.' },
  { name: 'persist', icon: Database, detail: 'Application-provided Storage adapter.' },
  { name: 'withHistory', icon: History, detail: 'Bounded JSON snapshot undo and redo.' },
];

function NimbleMark() {
  return <span className="nimble-mark" aria-hidden="true"><i /><i /><i /><b>N</b></span>;
}

function ProductSite() {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [renderCount, setRenderCount] = useState(1);
  const [lastRun, setLastRun] = useState<'initial' | 'separate' | 'batch'>('initial');

  const updateSeparately = () => {
    setFirstName('Grace');
    setRenderCount((count) => count + 1);
    setLastName('Hopper');
    setRenderCount((count) => count + 1);
    setLastRun('separate');
  };

  const updateInBatch = () => {
    setFirstName('Katherine');
    setLastName('Johnson');
    setRenderCount((count) => count + 1);
    setLastRun('batch');
  };

  const resetLab = () => {
    setFirstName('Ada');
    setLastName('Lovelace');
    setRenderCount(1);
    setLastRun('initial');
  };

  const copyInstall = async () => {
    await navigator.clipboard?.writeText(installCommand);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="nimble-site">
      <a className="skip" href="#main">Skip to content</a>
      <header onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          event.preventDefault();
          setMenuOpen(false);
          window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        }
      }}>
        <a className="brand" href="#top" aria-label="NimbleJS home"><NimbleMark /><span>Nimble<strong>JS</strong></span></a>
        <button ref={menuButtonRef} className="menu" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav id="primary-navigation" className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Primary navigation">
          <a href="#model" onClick={() => setMenuOpen(false)}>Model</a>
          <a href="#lab" onClick={() => setMenuOpen(false)}>Batch lab</a>
          <a href="#api" onClick={() => setMenuOpen(false)}>API</a>
          <a href="#boundary" onClick={() => setMenuOpen(false)}>Boundaries</a>
          <a className="github-link" href="https://github.com/onuracar-dev/NimbleJs" target="_blank" rel="noreferrer"><Github /> GitHub</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="status"><span /> pre-1.0 · framework agnostic</div>
            <h1>State that only moves<br /><em>what reads it.</em></h1>
            <p>Small TypeScript signals, computed values, effects, batching, stores, persistence, and history—with no renderer and no DOM dependency in the core.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#lab">Run the batch lab <Play /></a>
              <a className="button button--glass" href="https://github.com/onuracar-dev/NimbleJs" target="_blank" rel="noreferrer">Read source <ArrowUpRight /></a>
            </div>
            <button className="install" type="button" onClick={copyInstall}><Package /><code>{installCommand}</code><span>{copied ? <Check /> : <Copy />}</span><span className="sr" aria-live="polite">{copied ? 'Install command copied' : ''}</span></button>
          </div>

          <div className="signal-stage" role="img" aria-label="Reactive dependency graph connecting first and last name signals to a computed full name and render effect">
            <div className="stage-grid" />
            <div className="signal-node signal-node--first"><span>signal</span><strong>first</strong><i>"Ada"</i></div>
            <div className="signal-node signal-node--last"><span>signal</span><strong>last</strong><i>"Lovelace"</i></div>
            <div className="signal-node signal-node--computed"><span>computed</span><strong>fullName</strong><i>"Ada Lovelace"</i></div>
            <div className="signal-node signal-node--effect"><span>effect</span><strong>render</strong><i>1 subscriber</i></div>
            <svg className="connections" viewBox="0 0 600 500" aria-hidden="true">
              <path d="M130 130 C190 190 230 185 300 245" />
              <path d="M475 120 C430 190 380 185 300 245" />
              <path d="M300 270 C300 330 300 350 300 395" />
            </svg>
            <div className="pulse pulse--one" /><div className="pulse pulse--two" /><div className="stage-label"><Zap /> dynamic dependency graph</div>
          </div>
        </section>

        <section className="fact-row" aria-label="Library facts">
          <div><strong>0</strong><span>renderer assumptions</span></div>
          <div><strong>15</strong><span>automated tests</span></div>
          <div><strong>ESM + CJS</strong><span>typed package exports</span></div>
          <div><strong>MIT</strong><span>open source</span></div>
        </section>

        <section className="model" id="model">
          <div className="section-copy"><span className="eyebrow">01 / THE MODEL</span><h2>A small graph.<br />A predictable lifecycle.</h2><p>Dependencies follow the values an effect actually reads on its latest run. Cleanup and disposal are explicit, and host runtimes can bring their own scheduler.</p></div>
          <div className="lifecycle">
            <article><span>01</span><CircleDot /><h3>Read</h3><p>A signal records the currently active observer.</p></article>
            <i><ArrowRight /></i>
            <article><span>02</span><Activity /><h3>React</h3><p>Only subscribed work is scheduled after a change.</p></article>
            <i><ArrowRight /></i>
            <article><span>03</span><TimerReset /><h3>Clean</h3><p>The prior cleanup runs before the next effect.</p></article>
          </div>
        </section>

        <section className="lab" id="lab">
          <div className="section-copy section-copy--lab"><span className="eyebrow">02 / BATCH LAB</span><h2>Two writes.<br />Choose one reaction.</h2><p>Compare separate notifications with one batched transaction. This visual lab models the public batching contract.</p></div>
          <div className="lab-panel">
            <div className="lab-panel__bar"><span /><span /><span /><code>batch-lab.ts</code><b className={`run-badge run-badge--${lastRun}`}>{lastRun === 'initial' ? 'ready' : lastRun}</b></div>
            <div className="lab-grid">
              <div className="lab-controls">
                <label>first signal<input value={firstName} onChange={(event) => { setFirstName(event.target.value); setRenderCount((count) => count + 1); setLastRun('separate'); }} /></label>
                <label>last signal<input value={lastName} onChange={(event) => { setLastName(event.target.value); setRenderCount((count) => count + 1); setLastRun('separate'); }} /></label>
                <button type="button" onClick={updateSeparately}><Activity /> Write separately <small>+2 effects</small></button>
                <button className="batch-button" type="button" onClick={updateInBatch}><Layers3 /> Write in batch <small>+1 effect</small></button>
                <button className="reset" type="button" onClick={resetLab}><RotateCcw /> Reset lab</button>
              </div>
              <div className="lab-output">
                <span className="lab-output__label">computed output</span>
                <strong>{firstName || '∅'}<br />{lastName || '∅'}</strong>
                <div className="render-count"><i>{renderCount}</i><span>modeled effect<br />runs</span></div>
                <div className="run-track"><span style={{ width: `${Math.min(100, renderCount * 9)}%` }} /></div>
                <p aria-live="polite">{lastRun === 'batch' ? 'Batch committed: dependent effect modeled once.' : lastRun === 'separate' ? 'Separate writes modeled independent notifications.' : 'Choose a write strategy to compare notifications.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="api-section" id="api">
          <div className="section-copy"><span className="eyebrow">03 / PUBLIC SURFACE</span><h2>Seven exports.<br />One reactive vocabulary.</h2><p>Use a single signal or combine stores, storage adapters, history, and host scheduling as the application grows.</p></div>
          <div className="api-grid">{api.map(({ name, icon: Icon, detail }, index) => <article key={name}><span>0{index + 1}</span><Icon /><h3>{name}</h3><p>{detail}</p></article>)}</div>
        </section>

        <section className="code-section">
          <div className="code-copy"><span className="eyebrow">04 / QUICK START</span><h2>The lifecycle stays in view.</h2><p>Effects can return cleanup, computed values can be disposed, and batched writes settle before dependent work runs.</p><a href="https://github.com/onuracar-dev/NimbleJs#signals-computed-values-and-cleanup" target="_blank" rel="noreferrer">Open the complete guide <ArrowUpRight /></a></div>
          <div className="code-window"><div><span /><span /><span /><code>state.ts</code><button type="button" aria-label="Copy quick start code" onClick={() => navigator.clipboard?.writeText(code)}><Copy /></button></div><pre role="region" tabIndex={0} aria-label="NimbleJS quick start code"><code>{code}</code></pre></div>
        </section>

        <section className="boundary" id="boundary">
          <div className="boundary-orbit"><NimbleMark /><span>independent<br />core</span></div>
          <div><span className="eyebrow">05 / CLEAR BOUNDARIES</span><h2>Bring any renderer.<br />Or bring none.</h2><p>NimbleJS does not mount components, diff DOM, encrypt persisted data, migrate storage, or synchronize state. It shares tested reactive semantics with FluxDOM, but neither package depends on the other.</p><div className="boundary-links"><a href="https://github.com/onuracar-dev/NimbleJs/blob/main/docs/adr/0001-fluxdom-and-nimblejs-boundary.md" target="_blank" rel="noreferrer">Read the architecture decision <ArrowUpRight /></a><a href="https://github.com/onuracar-dev/NimbleJs#stores-persistence-and-history" target="_blank" rel="noreferrer">Review persistence limits <ArrowUpRight /></a></div></div>
        </section>

        <section className="closing"><div><Sparkles /><span>small graph · explicit cleanup · open source</span></div><h2>Keep state nimble.</h2><a className="button button--primary" href="https://github.com/onuracar-dev/NimbleJs" target="_blank" rel="noreferrer"><Github /> Explore the repository</a></section>
      </main>

      <footer><a className="brand" href="#top"><NimbleMark /><span>Nimble<strong>JS</strong></span></a><p>Framework-agnostic signals for TypeScript by <a href="https://github.com/onuracar-dev">Onur Acar</a>.</p><div><a href="https://www.npmjs.com/package/@onuracar-dev/nimblejs">npm</a><a href="https://github.com/onuracar-dev/NimbleJs">GitHub</a><a href="https://github.com/onuracar-dev/NimbleJs/blob/main/LICENSE">MIT</a></div></footer>
    </div>
  );
}

export default ProductSite;
