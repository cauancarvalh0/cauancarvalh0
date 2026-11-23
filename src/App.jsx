import { useEffect, useRef, useState } from 'react'

// Preencha seus contatos reais aqui
const CONTACT = { whatsapp: 'https://wa.me/5599981502997', email: 'Cauancarvalho004@gmail.com', github: 'https://github.com/cauancarvalh0' }
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
const LINKS = [['Diferenciais', '#diferenciais'], ['Stack', '#stack'], ['Projetos', '#projetos'], ['Contato', '#contato']]

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
    <div className="relative mx-auto w-full max-w-[720px]">
      <img src="/laptop.png" alt="Notebook com editor de código" className="w-full block select-none" draggable="false" />
      <div className="screen">
        <div role="tablist" className="flex bg-[#0b1620] border-b border-[#1c3345]">
          {names.map(nm => <button key={nm} role="tab" aria-selected={tab === nm} className="tab" onClick={() => setTab(nm)}>{nm}</button>)}
        </div>
        <pre aria-label={`Código ${tab}`}>{CODE[tab].slice(0, n)}<span className="caret" /></pre>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [open, setOpen] = useState(false)
  const [proj, setProj] = useState(null)
  const closeRef = useRef(null)
  useReveal()
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme) } catch {} }, [theme])
  useEffect(() => { const k = e => e.key === 'Escape' && setProj(null); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])
  useEffect(() => { if (proj) closeRef.current?.focus() }, [proj])
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const contactLinks = [['WhatsApp', CONTACT.whatsapp], ['E-mail', CONTACT.email && 'mailto:' + CONTACT.email], ['GitHub', CONTACT.github]].filter(l => l[1])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap flex items-center justify-between h-[68px]">
          <a href="#inicio" className="brand text-xl font-extrabold">Cauan Carvalho<span className="dot">.</span></a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
            {LINKS.map(([l, h]) => <a key={h} href={h} className="nav-link">{l}</a>)}
            <button onClick={toggle} className="btn btn-ghost !py-2 !px-4 text-sm" aria-label="Alternar tema claro/escuro">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="btn btn-ghost !py-2 !px-3 text-sm" aria-label="Alternar tema">{theme === 'dark' ? '☀' : '☾'}</button>
            <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Menu" className="w-11 h-11 grid place-items-center">
              <span className="relative block w-6 h-4">
                <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 0, transform: open ? 'rotate(45deg)' : 'none' }} />
                <i className="absolute left-0 top-[7px] w-6 h-0.5 bg-current transition-all" style={{ opacity: open ? 0 : 1 }} />
                <i className="absolute left-0 w-6 h-0.5 bg-current transition-all" style={{ top: open ? 7 : 14, transform: open ? 'rotate(-45deg)' : 'none' }} />
              </span>
            </button>
          </div>
        </div>
        <div className="md:hidden overflow-hidden transition-all duration-500" style={{ maxHeight: open ? 320 : 0 }}>
          <nav className="wrap flex flex-col py-4 gap-1" aria-label="Mobile">
            {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-lg font-medium" style={{ borderBottom: '1px solid var(--line)' }}>{l}</a>)}
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="!pt-36 !pb-24">
          <div className="wrap grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
            <div>
              <p className="mb-5 font-medium" style={{ color: 'var(--muted)' }}>Cauan Carvalho · Desenvolvedor Full Stack</p>
              <h1 className="text-[clamp(2.8rem,8vw,5.6rem)] font-extrabold">Sistemas web que<br />funcionam e<br />convencem<span className="dot">.</span></h1>
              <p className="mt-6 max-w-md text-lg" style={{ color: 'var(--muted)' }}>Do banco de dados à interface, com PHP, MySQL, JavaScript e React.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projetos" className="btn btn-primary">Ver projetos</a>
                <a href="#contato" className="btn btn-ghost">Falar comigo</a>
              </div>
            </div>
            <Laptop />
          </div>
        </section>

        <section id="diferenciais">
          <div className="wrap">
            <h2 className="reveal text-[clamp(2rem,5vw,3.4rem)] font-extrabold max-w-xl">Como eu trabalho<span className="dot">.</span></h2>
            <div className="mt-14 grid sm:grid-cols-2 gap-6">
              {DIFS.map(([t, d]) => (
                <div key={t} className="reveal card p-8"><h3 className="text-2xl font-bold">{t}</h3><p className="mt-3" style={{ color: 'var(--muted)' }}>{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack">
          <div className="wrap">
            <h2 className="reveal text-[clamp(2rem,5vw,3.4rem)] font-extrabold">Stack e formação<span className="dot">.</span></h2>
            <div className="mt-14 grid lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                {STACK.map(([t, items]) => (
                  <div key={t} className="reveal">
                    <h3 className="text-xl font-bold mb-4">{t}</h3>
                    <div className="flex flex-wrap gap-2">{items.split(', ').map(i => <span key={i} className="px-4 py-2 rounded-full text-sm font-medium" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>{i}</span>)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-5">
                {COURSES.map(([t, d]) => <div key={t} className="reveal card p-7"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2" style={{ color: 'var(--muted)' }}>{d}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="projetos">
          <div className="wrap">
            <h2 className="reveal text-[clamp(2rem,5vw,3.4rem)] font-extrabold">Projetos reais<span className="dot">.</span></h2>
            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map(p => (
                <button key={p.t} onClick={() => setProj(p)} className="reveal card overflow-hidden text-left cursor-pointer flex flex-col" style={{ color: 'inherit' }}>
                  <div className="h-36 w-full" style={{ background: `linear-gradient(135deg, ${p.g[0]}, ${p.g[1]})` }} />
                  <div className="p-6">
                    <p className="text-sm font-medium" style={{ color: 'var(--verm)' }}>{p.tag}</p>
                    <h3 className="text-xl font-bold mt-1">{p.t}</h3>
                    <p className="mt-3 text-[15px] line-clamp-3" style={{ color: 'var(--muted)' }}>{p.d}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="contato">
          <div className="wrap grid md:grid-cols-[320px_1fr] gap-12 items-center">
            <img src="/foto-2.png" alt="Cauan Carvalho" className="reveal w-full max-w-[320px] mx-auto rounded-3xl" style={{ background: 'var(--surface)' }} loading="lazy" />
            <div className="reveal">
              <h2 className="text-[clamp(2.2rem,6vw,4rem)] font-extrabold">Vamos construir o seu projeto<span className="dot">?</span></h2>
              <p className="mt-5 text-lg max-w-md" style={{ color: 'var(--muted)' }}>Conte o que você precisa e eu respondo com um caminho claro.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {contactLinks.map(([l, h], i) => <a key={l} href={h} target="_blank" rel="noreferrer" className={'btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost')}>{l}</a>)}
                {!contactLinks.length && <a href="#inicio" className="btn btn-primary">Voltar ao topo</a>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap py-10 flex flex-wrap justify-between gap-3 text-sm" style={{ color: 'var(--muted)' }}>
          <span className="brand font-bold" style={{ color: 'var(--fg)' }}>Cauan Carvalho<span className="dot">.</span></span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
        </div>
      </footer>

      {proj && (
        <div className="modal-bg" onClick={() => setProj(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={proj.t} onClick={e => e.stopPropagation()}>
            <div className="h-28 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, ${proj.g[0]}, ${proj.g[1]})` }} />
            <p className="text-sm font-medium" style={{ color: 'var(--verm)' }}>{proj.tag}</p>
            <h3 className="text-3xl font-extrabold mt-1">{proj.t}</h3>
            <p className="mt-4 text-lg" style={{ color: 'var(--muted)' }}>{proj.d}</p>
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
