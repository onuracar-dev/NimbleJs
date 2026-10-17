import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { actions, getSnapshot, subscribe, type NodeId, type Snapshot } from './demo';
import { Code } from './Code';

const INSTALL = 'npm install @onuracar-dev/nimblejs';
const REPO = 'https://github.com/onuracar-dev/NimbleJs';
const NPM = 'https://www.npmjs.com/package/@onuracar-dev/nimblejs';
const ADR = `${REPO}/blob/main/docs/adr/0001-fluxdom-and-nimblejs-boundary.md`;

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Playground />
        <Ideas />
        <Api />
        <Limits />
      </main>
      <Footer />
    </>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a className="brand" href="#top" aria-label="NimbleJS home">
          <Mark />
          <span>NimbleJS</span>
        </a>
        <nav aria-label="Sections">
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href="#limits">Limits</a>
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
      <circle cx="7" cy="9" r="4" className="mark-sig" />
      <circle cx="7" cy="23" r="4" className="mark-sig" />
      <path d="M11 9 L21 16 M11 23 L21 16" className="mark-edge" />
      <circle cx="25" cy="16" r="5" className="mark-eff" />
    </svg>
  );
}

function Hero() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="eyebrow">v0.2.0 · pre-1.0 · MIT</p>
        <h1>
          Signals and stores for TypeScript,
          <br />
          <em>no renderer attached.</em>
        </h1>
        <p className="lead">
          NimbleJS gives you signals, computed values, effects, batching and small stores with undo/redo and
          persistence. The core has no DOM dependency, so it fits vanilla apps, Web Components, workers or your
          own framework adapter.
        </p>
        <div className="hero-actions">
          <button className="install" onClick={copy} aria-label="Copy install command">
            <span className="prompt">$</span>
            <code>{INSTALL}</code>
            <span className="copy" aria-live="polite">{copied ? 'copied' : 'copy'}</span>
          </button>
          <a className="btn" href="#playground">Try it below ↓</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Playground ---------- */

function useDemo(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function Playground() {
  const s = useDemo();

  return (
    <section className="band" id="playground">
      <div className="wrap">
        <SectionHead
          kicker="01 · Playground"
          title="Watch one effect react."
          text="This runs the actual NimbleJS source. The run counter is incremented inside the effect, so every number below is a real effect run, not an animation."
        />

        <div className="lab">
          <div className="lab-controls">
            <fieldset>
              <legend>Signals</legend>
              <label>
                <span>first</span>
                <input value={s.first} onChange={(e) => actions.setFirst(e.target.value)} spellCheck={false} />
              </label>
              <label>
                <span>last</span>
                <input value={s.last} onChange={(e) => actions.setLast(e.target.value)} spellCheck={false} />
              </label>
              <div className="row">
                <span className="mono">count = {s.count}</span>
                <button className="btn sm" onClick={actions.increment}>count++</button>
              </div>
              <label className="check">
                <input type="checkbox" checked={s.showCount} onChange={actions.toggleCount} />
                <span>effect reads <code>count</code></span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Batching</legend>
              <p className="hint">Both buttons write first, last and count.</p>
              <div className="row">
                <button className="btn sm" onClick={actions.threeWrites}>3 writes</button>
                <button className="btn sm accent" onClick={actions.threeWritesBatched}>3 writes in batch()</button>
              </div>
            </fieldset>

            <fieldset>
              <legend>Store plugins</legend>
              <div className="row">
                <button className="btn sm" onClick={actions.undo} disabled={!s.canUndo}>undo</button>
                <button className="btn sm" onClick={actions.redo} disabled={!s.canRedo}>redo</button>
                <button className="btn sm ghost" onClick={actions.reset}>reset</button>
              </div>
              <p className="hint">
                {s.persisted
                  ? 'persist() saves this store to localStorage. Reload the page and it comes back.'
                  : 'Storage is blocked in this browser, so persist() is off. Everything else works.'}
              </p>
            </fieldset>
          </div>

          <div className="lab-view">
            <Result s={s} />
            <Graph s={s} />
            <Log s={s} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ s }: { s: Snapshot }) {
  const a = s.lastAction;
  return (
    <div className="result" aria-live="polite">
      <div>
        <span className="k">effect runs</span>
        <span className="big">{s.runs}</span>
      </div>
      <div className="result-last">
        {a ? (
          <>
            <code>{a.label}</code>
            <span className={a.runs === 0 ? 'zero' : a.runs === 1 ? 'one' : 'many'}>
              → {a.runs} {a.runs === 1 ? 'run' : 'runs'}
            </span>
          </>
        ) : (
          <span className="muted">Change something on the left.</span>
        )}
      </div>
    </div>
  );
}

const POS: Record<NodeId, { x: number; y: number; label: string; kind: 'sig' | 'comp' | 'eff' }> = {
  first: { x: 70, y: 50, label: 'first', kind: 'sig' },
  last: { x: 70, y: 120, label: 'last', kind: 'sig' },
  count: { x: 70, y: 190, label: 'count', kind: 'sig' },
  fullName: { x: 270, y: 85, label: 'fullName', kind: 'comp' },
  effect: { x: 450, y: 135, label: 'effect', kind: 'eff' },
};

function Graph({ s }: { s: Snapshot }) {
  const readsCount = s.reads.includes('count');
  const edges: Array<[NodeId, NodeId, boolean]> = [
    ['first', 'fullName', true],
    ['last', 'fullName', true],
    ['fullName', 'effect', true],
    ['count', 'effect', readsCount],
  ];

  return (
    <figure className="graph">
      <svg viewBox="0 0 540 240" role="img" aria-label={`Dependency graph. The effect currently depends on fullName${readsCount ? ' and count' : ' only'}.`}>
        {edges.map(([from, to, on]) => {
          const a = POS[from];
          const b = POS[to];
          const mx = (a.x + b.x) / 2;
          return (
            <path
              key={`${from}-${to}`}
              d={`M${a.x + 44} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 48} ${b.y}`}
              className={on ? 'edge on' : 'edge off'}
            />
          );
        })}
        {(Object.keys(POS) as NodeId[]).map((id) => {
          const n = POS[id];
          const w = n.kind === 'sig' ? 88 : 96;
          return (
            <g key={id} className={`node ${n.kind}`} transform={`translate(${n.x} ${n.y})`}>
              <rect key={s.pulse[id]} x={-w / 2} y={-17} width={w} height={34} rx={n.kind === 'eff' ? 17 : 8} className={s.pulse[id] ? 'pulse' : ''} />
              <text textAnchor="middle" dy="5">{n.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        <span><i className="dot sig" /> signal</span>
        <span><i className="dot comp" /> computed</span>
        <span><i className="dot eff" /> effect</span>
        <span><i className="dash" /> not subscribed</span>
      </figcaption>
    </figure>
  );
}

function Log({ s }: { s: Snapshot }) {
  return (
    <ol className="log" aria-label="Recent effect runs">
      {s.log.map((entry) => (
        <li key={entry.run}>
          <span className="n">#{entry.run}</span>
          <span className="out">{entry.output}</span>
          <span className="reads">reads {entry.reads.join(', ')}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Content ---------- */

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: ReactNode }) {
  return (
    <div className="shead">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}

const IDEAS = [
  {
    title: 'Dependencies follow the last run',
    text: 'An effect subscribes to what it read on its latest run. Stop reading a signal and it stops waking you up. Effects can return a cleanup, which runs before the next run and once on stop.',
    code: `const stop = effect(() => {
  console.log(name.value);
  if (verbose.value) console.log(count.value);
  return () => console.log('cleanup');
});

stop(); // final cleanup runs once`,
  },
  {
    title: 'Batches settle before effects run',
    text: 'batch() holds notifications until the outermost callback returns, then runs each affected effect once. Nested batches flush at the outer boundary. Writes that are Object.is equal notify nobody.',
    code: `batch(() => {
  first.value = 'Grace';
  last.value = 'Hopper';
}); // dependent effects run once

effect(render, {
  scheduler: (run) => queueMicrotask(run),
});`,
  },
  {
    title: 'Stores with optional plugins',
    text: 'A store is a named record of signals. persist() goes through any Storage you pass in, withHistory() keeps bounded JSON snapshots for undo and redo.',
    code: `const settings = createStore('settings', {
  theme: 'dark',
  sidebarOpen: true,
});

persist(settings, { storage: localStorage });
const history = withHistory(settings, { maxHistory: 25 });
history.undo();`,
  },
];

function Ideas() {
  return (
    <section className="band alt">
      <div className="wrap">
        <SectionHead kicker="02 · How it works" title="Three ideas, kept small." />
        <div className="ideas">
          {IDEAS.map((idea) => (
            <article key={idea.title} className="idea">
              <h3>{idea.title}</h3>
              <p>{idea.text}</p>
              <Code source={idea.code} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const API: Array<[string, string]> = [
  ['signal', 'Mutable reactive value with Object.is equality'],
  ['computed', 'Derived value, with explicit dispose()'],
  ['effect', 'Dependency-tracked side effect with cleanup and an optional scheduler'],
  ['batch', 'Coalesce notifications across nested synchronous writes'],
  ['createStore', 'Named collection of signals with batched raw-state updates'],
  ['persist', 'Hydrate and save a store through a Storage adapter'],
  ['withHistory', 'Bounded JSON-snapshot undo/redo controller'],
];

function Api() {
  return (
    <section className="band" id="api">
      <div className="wrap">
        <SectionHead kicker="03 · API" title="Seven exports. That is the whole surface." />
        <dl className="api">
          {API.map(([name, desc]) => (
            <div key={name}>
              <dt><code>{name}</code></dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="note">
          Ships as ESM and CommonJS with type declarations. No runtime dependencies. Node 18 or newer.
        </p>
      </div>
    </section>
  );
}

const NOT = [
  'Render components or diff the DOM',
  'Encrypt, validate or migrate persisted state',
  'Synchronize state across tabs or devices',
  'Snapshot circular or non-JSON values in history',
  'Promise a stable API before 1.0',
];

function Limits() {
  return (
    <section className="band alt" id="limits">
      <div className="wrap limits">
        <div>
          <SectionHead
            kicker="04 · Limits"
            title="What it does not do."
            text="NimbleJS is an experiment-grade library. The scope is deliberately narrow, and the edges are written down."
          />
          <a className="link" href={ADR} target="_blank" rel="noreferrer">
            Read the FluxDOM boundary decision ↗
          </a>
        </div>
        <ul className="not">
          {NOT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-row">
        <p>
          NimbleJS by <a href="https://www.onuracar.dev/">Onur Acar</a>. MIT licensed.
        </p>
        <p className="foot-links">
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
          <a href={NPM} target="_blank" rel="noreferrer">npm</a>
          <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">Changelog</a>
        </p>
      </div>
    </footer>
  );
}
