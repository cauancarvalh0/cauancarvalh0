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

const PROJECTS = [
  { t: 'Task', d: 'Gerenciador de tarefas com cadastro e login de usuários. A conclusão das tarefas acontece via AJAX, sem recarregar a página.', tech: 'PHP, MySQL, AJAX' },
  // Preencha a descrição do Rupi Metrics (1 ou 2 frases) no campo "d"
  { t: 'Rupi Metrics', d: '', tech: '' },
]

const STACK = [
  ['Front-end e interface', 'HTML, CSS, JavaScript, AJAX, Bootstrap, Tailwind CSS, React, ReactBits'],
  ['Back-end e banco de dados', 'PHP, MySQL, SQL, PDO'],
  ['Ambiente, versionamento e deploy', 'XAMPP, Git, GitHub, Vercel'],
]
const COURSES = [
  ['Desenvolvimento Web, SENAC', '240 horas: Bootstrap, HTML, CSS, JavaScript, Git, GitHub, XAMPP, PHP, MySQL, SQL e PDO.'],
  ['PHP, Cursar', 'Curso concluído.'],
  ['Curso de 6h57min', 'Curso concluído.'],
]
const DIFS = [
  ['Full Stack', 'Da interface ao banco de dados, em um só desenvolvedor.', 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5'],
  ['Organização', 'Código limpo e projetos fáceis de manter.', 'M4 6h16M4 12h10M4 18h6'],
  ['Mobile primeiro', 'Layouts responsivos que funcionam em qualquer tela.', 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2'],
  ['Controle de versão', 'Histórico e entregas seguras com Git e GitHub.', 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9c0 6-12 3-12 6'],
]
const LINKS = [['Início', '#inicio'], ['Diferenciais', '#diferenciais'], ['Stack', '#stack'], ['Projetos', '#projetos'], ['Contato', '#contato']]

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 })
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
    <div className="relative mx-auto w-full max-w-[640px]">
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

const H2 = 'font-extrabold text-[length:var(--fs-h2)]'
const SEC = 'px-6 md:px-12 py-[var(--s-24)]'

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')
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

  const Nav = ({ onClick }) => LINKS.map(([l, h]) => (
    <a key={h} href={h} onClick={onClick} aria-current={active === h.slice(1)} className="side-link">{l}</a>
  ))
  const Theme = <button onClick={toggle} className="btn btn-ghost w-full" aria-label="Alternar tema claro ou escuro">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</button>
  const sending = status.kind === 'loading'

  return (
    <>
      <aside className="hidden lg:flex fixed left-5 top-5 bottom-5 w-[264px] flex-col gap-6 panel p-5 overflow-y-auto">
        <a href="#inicio" className="flex items-center gap-3">
          <img src="/foto-2.png" alt="" className="w-12 h-12 rounded-full object-cover object-top" style={{ background: 'var(--surface)' }} />
          <span><span className="brand block font-extrabold text-lg">Cauan Carvalho</span><span className="text-sm muted">Desenvolvedor Full Stack</span></span>
        </a>
        <nav className="flex flex-col gap-1" aria-label="Principal"><Nav /></nav>
        <div className="mt-auto flex flex-col gap-4">
          {Theme}
          <div className="flex gap-4 text-sm">
            {[['GitHub', CONTACT.github], ['WhatsApp', CONTACT.whatsapp], ['E-mail', 'mailto:' + CONTACT.email]].map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer" className="link">{l}</a>)}
          </div>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 inset-x-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 88%, transparent)' }}>
        <div className="flex items-center justify-between h-[64px] px-5">
          <a href="#inicio" className="brand text-xl font-extrabold">Cauan Carvalho</a>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Menu" className="w-11 h-11 grid place-items-center">
            <span className="relative block w-6 h-4">
              <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 0, transform: open ? 'rotate(45deg)' : 'none' }} />
              <i className="absolute left-0 top-[7px] w-6 h-0.5 bg-current transition-all" style={{ opacity: open ? 0 : 1 }} />
              <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 14, transform: open ? 'rotate(-45deg)' : 'none' }} />
            </span>
          </button>
        </div>
        <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: open ? 460 : 0 }}>
          <nav className="flex flex-col gap-1 px-5 pb-5" aria-label="Mobile"><Nav onClick={() => setOpen(false)} />{Theme}</nav>
        </div>
      </header>

      <main className="lg:ml-[304px] px-5 lg:px-0 lg:pr-5 pt-[84px] lg:pt-5 pb-5">
        <div className="panel overflow-hidden">
          <section id="inicio" className="px-6 md:px-12 pt-[var(--s-16)] pb-[var(--s-24)]">
            <div className="grid xl:grid-cols-[1fr_1.15fr] gap-12 items-center">
              <div>
                <h1 className="font-extrabold text-[length:var(--fs-h1)]">Desenvolvedor Full Stack com PHP, MySQL e React</h1>
                <p className="mt-6 max-w-md text-[length:var(--fs-lg)] muted">Sistemas web com banco de dados, painel e interface responsiva.</p>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <a href="#contato" className="btn btn-primary">Falar comigo</a>
                  <a href="#projetos" className="link font-semibold">Ver projetos</a>
                </div>
              </div>
              <Laptop />
            </div>
          </section>

          <section id="diferenciais" className={SEC}>
            <h2 className={'reveal ' + H2}>Como eu trabalho</h2>
            <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10">
              {DIFS.map(([t, d, p]) => (
                <div key={t} className="reveal">
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={p} /></svg>
                  <h3 className="text-xl font-bold mt-4">{t}</h3>
                  <p className="mt-2 text-[length:var(--fs-sm)] muted">{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="stack" className={SEC}>
            <h2 className={'reveal ' + H2}>Stack e formação</h2>
            <div className="mt-12 grid xl:grid-cols-2 gap-x-16 gap-y-12">
              <div className="space-y-8">
                {STACK.map(([t, items]) => (
                  <div key={t} className="reveal"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 muted">{items}</p></div>
                ))}
              </div>
              <div className="space-y-8">
                {COURSES.map(([t, d]) => <div key={t} className="reveal"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 muted">{d}</p></div>)}
              </div>
            </div>
          </section>

          <section id="projetos" className={SEC}>
            <h2 className={'reveal ' + H2}>Projetos</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {PROJECTS.map(p => (
                <article key={p.t} className="reveal card">
                  <h3 className="text-2xl font-bold">{p.t}</h3>
                  {p.d && <p className="mt-3 muted">{p.d}</p>}
                  {p.tech && <p className="mt-4 text-[length:var(--fs-sm)] font-semibold">{p.tech}</p>}
                </article>
              ))}
            </div>
          </section>

          <section id="contato" className={SEC}>
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16">
              <div className="reveal">
                <img src="/foto-2.png" alt="Cauan Carvalho" className="w-36 h-36 rounded-full object-cover object-top" style={{ background: 'var(--surface)' }} loading="lazy" />
                <h2 className={'mt-8 ' + H2}>Vamos conversar sobre o seu projeto</h2>
                <ul className="mt-8 space-y-2 list-none p-0 m-0">
                  <li><a className="link" href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></li>
                  <li><a className="link" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp: (99) 98150-2997</a></li>
                  <li><a className="link" href={CONTACT.github} target="_blank" rel="noreferrer">github.com/Cauancarvalh0</a></li>
                </ul>
              </div>
              <form onSubmit={send} className="reveal flex flex-col gap-4">
                <input className="field" required placeholder="Seu nome" value={form.nome} onChange={set('nome')} aria-label="Seu nome" disabled={sending} />
                <input className="field" required type="email" placeholder="Seu e-mail" value={form.email} onChange={set('email')} aria-label="Seu e-mail" disabled={sending} />
                <textarea className="field" required rows={5} placeholder="Sua mensagem" value={form.msg} onChange={set('msg')} aria-label="Sua mensagem" disabled={sending} />
                <div className="flex flex-wrap items-center gap-5">
                  <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? <><span className="spin" aria-hidden="true" />Enviando</> : 'Enviar mensagem'}</button>
                  <p role="status" aria-live="polite" key={status.kind + status.text} className={status.kind === 'idle' ? '' : 'status'} data-kind={status.kind}>{status.text}</p>
                </div>
              </form>
            </div>
          </section>
        </div>
        <footer className="py-8 px-3 flex flex-wrap justify-between gap-3 text-sm muted">
          <span className="brand font-bold" style={{ color: 'var(--fg)' }}>Cauan Carvalho</span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </footer>
      </main>
    </>
  )
}
