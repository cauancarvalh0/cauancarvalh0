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
  { t: 'Gerenciador de Tarefas', tag: 'PHP + MySQL', d: 'Aplicação hospedada no infinityfree.io com autenticação de usuários e conclusão de tarefas via AJAX.', g: ['#082E43', '#2c6a8c'] },
  { t: 'Janus', tag: 'Projeto acadêmico em grupo', d: 'Projeto web acadêmico em grupo que conecta ex-alunos, empresas e instituição de ensino utilizando verificação administrativa manual.', g: ['#0d4a6b', '#7fb3cc'] },
  { t: 'Nexus OS', tag: 'nexus-os.free.je', url: 'https://nexus-os.free.je', d: 'Sistema responsivo de gerenciamento de ordens de serviço voltado para assistências técnicas.', g: ['#082E43', '#FF4F31'] },
  { t: 'Placar de Basquete', tag: 'mesa.php', d: 'Aplicação web responsiva de placar de basquete com timer regressivo e temas claro/escuro com paleta em tons de laranja.', g: ['#c2410c', '#fb923c'] },
  { t: 'Sistema para Barbearia DonZé', tag: 'Sistema customizado', d: 'Sistema web customizado para o DonZé com visual dark matte e detalhes em dourado e marrom couro.', g: ['#1a1410', '#b8893b'] },
  { t: 'Planta Baixa 3D', tag: 'planta_baixa_3d.html', d: 'Visualização interativa em 3D de uma residência térrea moderna murada de 470 m², incluindo quadra de basquete (half-court) e quadra de vôlei de praia.', g: ['#164e63', '#a5d4e6'] },
]

const STACK = [
  ['Front-end & UI', 'HTML, CSS, JavaScript, AJAX, Bootstrap, Tailwind CSS, React, ReactBits'],
  ['Back-end & Banco de Dados', 'PHP, MySQL, SQL, PDO'],
  ['Ambiente, Versionamento & Deploy', 'XAMPP, Git, GitHub, Vercel'],
]
const COURSES = [
  ['Desenvolvimento Web — SENAC', '240 horas: Bootstrap, HTML, CSS, JavaScript, Git, GitHub, XAMPP, PHP, MySQL, SQL e PDO.'],
  ['PHP — Cursar', 'Curso concluído.'],
  ['Curso de 6h57min', 'Curso concluído.'],
]
const DIFS = [
  ['Full Stack de ponta a ponta', 'Da interface ao banco de dados, em um só desenvolvedor.'],
  ['Organização', 'Código limpo e projetos fáceis de manter.'],
  ['Mobile primeiro', 'Layouts responsivos que funcionam bem em qualquer tela.'],
  ['Controle de versão', 'Histórico e entregas seguras com Git e GitHub.'],
]
const LINKS = [['Início', '#inicio'], ['Diferenciais', '#diferenciais'], ['Stack', '#stack'], ['Projetos', '#projetos'], ['Contato', '#contato']]
const STATS = [['6', 'Projetos reais'], ['240h', 'Curso SENAC'], ['3', 'Cursos concluídos'], ['3', 'Frentes: front, back e deploy']]
const GLY = ['</>', '{ }', '▦', 'Git']

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

const H2 = 'text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold'

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [open, setOpen] = useState(false)
  const [proj, setProj] = useState(null)
  const [active, setActive] = useState('inicio')
  const [form, setForm] = useState({ nome: '', email: '', msg: '' })
  const closeRef = useRef(null)
  useReveal()
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme) } catch {} }, [theme])
  useEffect(() => { const k = e => e.key === 'Escape' && setProj(null); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])
  useEffect(() => { if (proj) closeRef.current?.focus() }, [proj])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    LINKS.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const send = e => {
    e.preventDefault()
    const body = `Olá, sou ${form.nome} (${form.email}).\n\n${form.msg}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Contato pelo portfólio')}&body=${encodeURIComponent(body)}`
  }
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const Nav = ({ onClick }) => LINKS.map(([l, h]) => (
    <a key={h} href={h} onClick={onClick} className={'side-link' + (active === h.slice(1) ? ' on' : '')}>{l}</a>
  ))
  const Theme = <button onClick={toggle} className="btn btn-ghost w-full" aria-label="Alternar tema claro/escuro">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</button>

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed left-5 top-5 bottom-5 w-[264px] flex-col gap-5 panel p-5 overflow-y-auto">
        <a href="#inicio" className="flex items-center gap-3">
          <img src="/foto-2.png" alt="" className="w-12 h-12 rounded-full object-cover object-top" style={{ background: 'var(--surface)' }} />
          <span><span className="brand block font-extrabold text-lg">Cauan Carvalho<span className="dot">.</span></span><span className="text-sm muted">Desenvolvedor Full Stack</span></span>
        </a>
        <nav className="flex flex-col gap-1" aria-label="Principal"><Nav /></nav>
        <div className="rounded-2xl p-5 mt-auto" style={{ background: 'linear-gradient(145deg,var(--ink),#0d4a6b)', color: '#C9DFEA' }}>
          <p className="brand font-bold text-lg">Vamos construir algo juntos?</p>
          <a href="#contato" className="btn btn-primary w-full mt-4">Falar comigo</a>
        </div>
        {Theme}
        <div className="flex gap-2 flex-wrap">
          {[['GitHub', CONTACT.github], ['WhatsApp', CONTACT.whatsapp], ['E-mail', 'mailto:' + CONTACT.email]].map(([l, h]) => <a key={l} href={h} target="_blank" rel="noreferrer" className="chip">{l}</a>)}
        </div>
      </aside>

      {/* Header mobile */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)', borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-center justify-between h-[64px] px-5">
          <a href="#inicio" className="brand text-xl font-extrabold">Cauan Carvalho<span className="dot">.</span></a>
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
          <section id="inicio" className="px-6 md:px-12 pt-14 pb-20">
            <div className="grid xl:grid-cols-[1fr_1.15fr] gap-12 items-center">
              <div>
                <p className="mb-4 font-medium muted">Olá, eu sou Cauan Carvalho</p>
                <h1 className="text-[clamp(2.6rem,6.5vw,4.8rem)] font-extrabold">Sistemas web que funcionam e convencem<span className="dot">.</span></h1>
                <p className="mt-6 max-w-md text-lg muted">Do banco de dados à interface, com PHP, MySQL, JavaScript e React.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#projetos" className="btn btn-primary">Ver projetos</a>
                  <a href="#contato" className="btn btn-ghost">Falar comigo</a>
                </div>
              </div>
              <Laptop />
            </div>
          </section>

          <section id="diferenciais" className="px-6 md:px-12 py-16" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className={'reveal ' + H2}>Como eu trabalho<span className="dot">.</span></h2>
            <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {DIFS.map(([t, d], i) => (
                <div key={t} className="reveal card p-6 text-center">
                  <div className="ico mx-auto">{GLY[i]}</div>
                  <h3 className="text-xl font-bold mt-5">{t}</h3>
                  <p className="mt-2 text-[15px] muted">{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="stack" className="px-6 md:px-12 py-16" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className={'reveal ' + H2}>Stack e formação<span className="dot">.</span></h2>
            <div className="mt-10 grid xl:grid-cols-2 gap-10">
              <div className="space-y-8">
                {STACK.map(([t, items]) => (
                  <div key={t} className="reveal">
                    <h3 className="text-xl font-bold mb-3">{t}</h3>
                    <div className="flex flex-wrap gap-2">{items.split(', ').map(i => <span key={i} className="chip">{i}</span>)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {COURSES.map(([t, d]) => <div key={t} className="reveal card p-6"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 muted">{d}</p></div>)}
              </div>
            </div>
          </section>

          <section id="projetos" className="px-6 md:px-12 py-16" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className={'reveal ' + H2}>Projetos reais<span className="dot">.</span></h2>
            <div className="mt-10 grid sm:grid-cols-2 2xl:grid-cols-3 gap-5">
              {PROJECTS.map(p => (
                <button key={p.t} onClick={() => setProj(p)} className="reveal card overflow-hidden text-left cursor-pointer flex flex-col" style={{ color: 'inherit', font: 'inherit' }}>
                  <div className="h-36 w-full" style={{ background: `linear-gradient(135deg, ${p.g[0]}, ${p.g[1]})` }} />
                  <div className="p-5">
                    <p className="text-sm font-medium" style={{ color: 'var(--verm)' }}>{p.tag}</p>
                    <h3 className="text-xl font-bold mt-1">{p.t}</h3>
                    <p className="mt-2 text-[15px] muted line-clamp-3">{p.d}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="reveal mt-10 rounded-3xl grid grid-cols-2 lg:grid-cols-4 gap-6 p-8" style={{ background: 'linear-gradient(120deg,var(--ink),#0d4a6b 60%,var(--verm))', color: '#C9DFEA' }}>
              {STATS.map(([n, l]) => <div key={l}><p className="brand text-4xl font-extrabold text-white">{n}</p><p className="text-sm mt-1">{l}</p></div>)}
            </div>
          </section>

          <section id="contato" className="px-6 md:px-12 py-16" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="reveal grid lg:grid-cols-[1fr_1.1fr] gap-10">
              <div>
                <img src="/foto-2.png" alt="Cauan Carvalho" className="w-40 h-40 rounded-full object-cover object-top" style={{ background: 'var(--surface)' }} loading="lazy" />
                <h2 className={'mt-6 ' + H2}>Vamos trabalhar juntos<span className="dot">?</span></h2>
                <p className="mt-4 text-lg muted max-w-md">Conte o que você precisa e eu respondo com um caminho claro.</p>
                <ul className="mt-6 space-y-2 list-none p-0">
                  <li><a className="underline" href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></li>
                  <li><a className="underline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp: (99) 98150-2997</a></li>
                  <li><a className="underline" href={CONTACT.github} target="_blank" rel="noreferrer">github.com/Cauancarvalh0</a></li>
                </ul>
              </div>
              <form onSubmit={send} className="card p-6 flex flex-col gap-4">
                <input className="field" required placeholder="Seu nome" value={form.nome} onChange={set('nome')} aria-label="Seu nome" />
                <input className="field" required type="email" placeholder="Seu e-mail" value={form.email} onChange={set('email')} aria-label="Seu e-mail" />
                <textarea className="field" required rows={5} placeholder="Sua mensagem" value={form.msg} onChange={set('msg')} aria-label="Sua mensagem" />
                <button type="submit" className="btn btn-primary">Enviar mensagem</button>
              </form>
            </div>
          </section>
        </div>
        <footer className="py-8 px-3 flex flex-wrap justify-between gap-3 text-sm muted">
          <span className="brand font-bold" style={{ color: 'var(--fg)' }}>Cauan Carvalho<span className="dot">.</span></span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </footer>
      </main>

      {proj && (
        <div className="modal-bg" onClick={() => setProj(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={proj.t} onClick={e => e.stopPropagation()}>
            <div className="h-28 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, ${proj.g[0]}, ${proj.g[1]})` }} />
            <p className="text-sm font-medium" style={{ color: 'var(--verm)' }}>{proj.tag}</p>
            <h3 className="text-3xl font-extrabold mt-1">{proj.t}</h3>
            <p className="mt-4 text-lg muted">{proj.d}</p>
            <div className="mt-8 flex gap-3 flex-wrap">
              {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="btn btn-primary">Abrir projeto</a>}
              <button ref={closeRef} onClick={() => setProj(null)} className="btn btn-ghost">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
