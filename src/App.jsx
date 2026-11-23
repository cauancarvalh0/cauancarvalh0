import { useEffect, useRef, useState } from 'react'

// Preencha seus contatos reais aqui
const CONTACT = { whatsapp: 'https://wa.me/5599981502997', email: 'Cauancarvalho004@gmail.com', github: 'https://github.com/Cauancarvalh0' }

const CODE = {
  'PHP + SQL + PDO': `<?php
// config/database.php
$pdo = new PDO(
  'mysql:host=localhost;dbname=tarefas;charset=utf8mb4',
  'root', '',
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$sql  = 'SELECT id, titulo, concluida
         FROM tarefas WHERE usuario_id = :uid';
$stmt = $pdo->prepare($sql);
$stmt->execute(['uid' => $_SESSION['id']]);

echo json_encode($stmt->fetchAll());`,
  'JavaScript + AJAX': `// concluir tarefa sem recarregar a página
async function concluir(id) {
  const res = await fetch('concluir.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();

  if (data.ok) {
    document.querySelector('#t-' + id)
      .classList.add('concluida');
  }
}`,
  'React + Tailwind': `export default function Card({ titulo, texto }) {
  return (
    <article className="rounded-2xl p-6 border
      border-slate-300 hover:-translate-y-1
      transition">
      <h3 className="text-xl font-bold">
        {titulo}
      </h3>
      <p className="mt-2 text-slate-600">{texto}</p>
    </article>
  )
}`
}

const ICON = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
  branch: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
}
const Icon = ({ name }) => <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[name]} /></svg>

const PROJECTS = [
  { t: 'Task', d: 'Gerenciador de tarefas com cadastro e login de usuários. A conclusão das tarefas acontece via AJAX, sem recarregar a página.', tech: 'PHP, MySQL, AJAX' },
  // Preencha a descrição do Rupi Metrics (1 ou 2 frases) no campo "d"
  { t: 'Rupi Metrics', d: '', tech: '' },
]
const STACK = [
  ['Front-end', 'HTML, CSS, JavaScript, AJAX, Bootstrap, Tailwind CSS, React, ReactBits'],
  ['Back-end e dados', 'PHP, MySQL, SQL, PDO'],
  ['Ambiente e deploy', 'XAMPP, Git, GitHub, Vercel'],
]
const COURSES = [
  ['Desenvolvimento Web, SENAC', '240 horas'],
  ['PHP, Cursar', 'Concluído'],
  ['Curso de 6h57min', 'Concluído'],
]
const DIFS = [
  ['layers', 'Full Stack', 'Da interface ao banco de dados.'],
  ['list', 'Organização', 'Código limpo e fácil de manter.'],
  ['phone', 'Mobile primeiro', 'Funciona bem em qualquer tela.'],
  ['branch', 'Git e GitHub', 'Histórico e entregas seguras.'],
]
const LINKS = [['Sobre', '#sobre'], ['Diferenciais', '#diferenciais'], ['Stack', '#stack'], ['Projetos', '#projetos'], ['Contato', '#contato']]
const SOCIAL = [['github', 'GitHub', CONTACT.github], ['chat', 'WhatsApp', CONTACT.whatsapp], ['mail', 'E-mail', 'mailto:' + CONTACT.email]]

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .1 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Laptop() {
  const names = Object.keys(CODE)
  const [tab, setTab] = useState(names[0])
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const full = CODE[tab]
    const id = setInterval(() => setN(v => (v < full.length ? v + 1 : v)), 28)
    return () => clearInterval(id)
  }, [tab])
  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      <img src="/laptop.png" alt="Notebook com editor de código" className="w-full block select-none" draggable="false" />
      <div className="screen">
        <div role="tablist" className="flex bg-[#0b1620] border-b border-[#1c3345] overflow-hidden">
          {names.map(nm => <button key={nm} role="tab" aria-selected={tab === nm} className="tab" onClick={() => setTab(nm)}>{nm}</button>)}
        </div>
        <pre aria-label={`Código ${tab}`}>{CODE[tab].slice(0, n)}<span className="caret" /></pre>
      </div>
    </div>
  )
}

const H2 = 'font-extrabold text-[length:var(--fs-h2)] reveal'

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [form, setForm] = useState({ nome: '', email: '', msg: '' })
  const [status, setStatus] = useState({ kind: 'idle', text: '' })
  useReveal()
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme) } catch {} }, [theme])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    LINKS.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); if (status.kind !== 'idle') setStatus({ kind: 'idle', text: '' }) }
  const sending = status.kind === 'loading'

  const send = e => {
    e.preventDefault()
    if (form.msg.trim().length < 10) { setStatus({ kind: 'err', text: 'Escreva um pouco mais sobre o projeto (mínimo de 10 caracteres).' }); return }
    setStatus({ kind: 'loading', text: 'Abrindo seu app de e-mail…' })
    const body = `Olá, sou ${form.nome} (${form.email}).\n\n${form.msg}`
    setTimeout(() => {
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Contato pelo portfólio')}&body=${encodeURIComponent(body)}`
      setStatus({ kind: 'ok', text: `Mensagem pronta. Se o app não abriu, escreva para ${CONTACT.email}.` })
    }, 700)
  }

  const ThemeBtn = <button onClick={toggle} className="icon-btn" aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
  const Social = ({ className = '' }) => (
    <div className={'flex gap-3 ' + className}>
      {SOCIAL.map(([i, l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer" className="icon-btn" aria-label={l}><Icon name={i} /></a>)}
    </div>
  )

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 88%, transparent)' }}>
        <div className="wrap flex items-center justify-between h-16">
          <a href="#inicio" className="brand text-xl font-extrabold">Cauan Carvalho</a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
            {LINKS.map(([l, h]) => <a key={h} href={h} aria-current={active === h.slice(1)} className="nav-link">{l}</a>)}
            {ThemeBtn}
          </nav>
          <div className="md:hidden flex items-center gap-2">
            {ThemeBtn}
            <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Menu" className="icon-btn" style={{ border: 0 }}>
              <span className="relative block w-6 h-4">
                <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 0, transform: open ? 'rotate(45deg)' : 'none' }} />
                <i className="absolute left-0 top-[7px] w-6 h-0.5 bg-current transition-all" style={{ opacity: open ? 0 : 1 }} />
                <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 14, transform: open ? 'rotate(-45deg)' : 'none' }} />
              </span>
            </button>
          </div>
        </div>
        <div className="md:hidden overflow-hidden transition-all duration-500" style={{ maxHeight: open ? 360 : 0 }}>
          <nav className="wrap flex flex-col pb-5" aria-label="Mobile">
            {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} aria-current={active === h.slice(1)} className="nav-link py-3 text-lg">{l}</a>)}
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="pt-[calc(4rem+var(--s-10))] pb-[var(--sec-y)]">
          <div className="wrap grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="font-extrabold text-[length:var(--fs-name)]">Cauan Carvalho</h1>
              <p className="brand mt-4 text-[length:var(--fs-lg)] font-bold sm:text-2xl">Desenvolvedor Full Stack com PHP, MySQL e React</p>
              <p className="mt-4 max-w-md muted">Sistemas web com banco de dados e interface responsiva.</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <a href="#contato" className="btn btn-primary">Falar comigo</a>
                <a href="#projetos" className="link font-semibold text-center sm:text-left">Ver projetos</a>
              </div>
              <Social className="mt-8" />
            </div>
            <Laptop />
          </div>
        </section>

        <section id="sobre" className="band sec">
          <div className="wrap grid md:grid-cols-[minmax(0,360px)_1fr] gap-10 md:gap-16 items-center">
            <img src="/foto-1.png" alt="Cauan Carvalho" className="reveal w-full max-w-[360px] aspect-[4/5] object-cover object-top rounded-[var(--r-card)]" style={{ background: 'var(--surface)' }} loading="lazy" />
            <div>
              <h2 className={H2}>Sobre</h2>
              <p className="reveal mt-6 text-[length:var(--fs-lg)] max-w-xl">Desenvolvo sistemas web completos, do banco de dados à interface, com PHP, MySQL, JavaScript e React.</p>
              <p className="reveal mt-4 max-w-xl muted">Formado no curso de Desenvolvimento Web do SENAC, com 240 horas de estudo.</p>
            </div>
          </div>
        </section>

        <section id="diferenciais" className="sec">
          <div className="wrap">
            <h2 className={H2}>Como eu trabalho</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
              {DIFS.map(([i, t, d]) => (
                <div key={t} className="reveal flex gap-4 lg:block">
                  <Icon name={i} />
                  <div className="lg:mt-4"><h3 className="text-xl font-bold">{t}</h3><p className="mt-1 text-[length:var(--fs-sm)] muted">{d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="band sec">
          <div className="wrap grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className={H2}>Stack</h2>
              <div className="mt-10 space-y-8">
                {STACK.map(([t, items]) => <div key={t} className="reveal"><h3 className="text-lg font-bold">{t}</h3><p className="mt-2 muted">{items}</p></div>)}
              </div>
            </div>
            <div>
              <h2 className={H2}>Formação</h2>
              <ul className="mt-10 space-y-6 list-none p-0 m-0">
                {COURSES.map(([t, d]) => <li key={t} className="reveal"><h3 className="text-lg font-bold">{t}</h3><p className="mt-1 muted">{d}</p></li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="projetos" className="sec">
          <div className="wrap">
            <h2 className={H2}>Projetos</h2>
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {PROJECTS.map(p => (
                <article key={p.t} className="reveal card">
                  <h3 className="text-2xl font-bold">{p.t}</h3>
                  {p.d && <p className="mt-3 muted">{p.d}</p>}
                  {p.tech && <p className="mt-4 text-[length:var(--fs-sm)] font-semibold">{p.tech}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="band sec">
          <div className="wrap grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
            <div>
              <h2 className={H2}>Vamos conversar sobre o seu projeto</h2>
              <ul className="reveal mt-8 space-y-3 list-none p-0 m-0 break-words">
                <li><a className="link" href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></li>
                <li><a className="link" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp: (99) 98150-2997</a></li>
              </ul>
            </div>
            <form onSubmit={send} className="reveal flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input className="field" required placeholder="Seu nome" value={form.nome} onChange={set('nome')} aria-label="Seu nome" autoComplete="name" disabled={sending} />
                <input className="field" required type="email" placeholder="Seu e-mail" value={form.email} onChange={set('email')} aria-label="Seu e-mail" autoComplete="email" disabled={sending} />
              </div>
              <textarea className="field" required rows={5} placeholder="Sua mensagem" value={form.msg} onChange={set('msg')} aria-label="Sua mensagem" disabled={sending} />
              <button type="submit" className="btn btn-primary w-full sm:w-auto sm:self-start" disabled={sending}>{sending ? <><span className="spin" aria-hidden="true" />Enviando</> : 'Enviar mensagem'}</button>
              <p role="status" aria-live="polite" key={status.kind + status.text} className={status.kind === 'idle' ? '' : 'status'} data-kind={status.kind}>{status.text}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-12">
        <div className="wrap flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="brand text-lg font-bold">Cauan Carvalho</p>
            <p className="mt-1 text-sm muted">© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
          <Social />
        </div>
      </footer>
    </>
  )
}
