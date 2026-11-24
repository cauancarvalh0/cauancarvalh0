import { useEffect, useRef, useState } from 'react'
import { SiHtml5, SiJavascript, SiPhp, SiMysql, SiBootstrap, SiGit, SiGithub } from 'react-icons/si'
import { FaDatabase, FaServer, FaArrowsRotate, FaCss3 } from 'react-icons/fa6'

const CONTACT = { whatsapp: 'https://wa.me/5599981502997', email: 'Cauancarvalho004@gmail.com', github: 'https://github.com/Cauancarvalh0' }

/* Código exibido no notebook (PHP + SQL com PDO) */
const FILES = [
  ['config/database.php', `<?php
// conexão segura com o banco
$dsn = 'mysql:host=localhost;dbname=sistema;charset=utf8mb4';

try {
    $pdo = new PDO($dsn, 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    exit('Erro ao conectar ao banco.');
}`],
  ['tarefas.php', `<?php
session_start();
require 'config/database.php';

$sql = 'SELECT id, titulo, concluida
        FROM tarefas
        WHERE usuario_id = :uid';

$stmt = $pdo->prepare($sql);
$stmt->execute(['uid' => $_SESSION['id']]);

header('Content-Type: application/json');
echo json_encode($stmt->fetchAll());`],
  ['login.php', `<?php
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$_POST['email']]);
$user = $stmt->fetch();

if ($user && password_verify($_POST['senha'], $user['senha'])) {
    $_SESSION['id'] = $user['id'];
    header('Location: painel.php');
    exit;
}`],
]

/* Realce de sintaxe simples */
const TOKEN = /(<\?php|\?>)|(\/\/.*)|('[^'\n]*'?|"[^"\n]*"?)|(\$\w+)|(\b(?:function|return|if|else|foreach|as|try|catch|new|require|exit|true|false|null)\b)|(\b\d+\b)|(\b[A-Za-z_]\w*(?=\())/g
const CLS = [null, 't-k', 't-c', 't-s', 't-v', 't-k', 't-n', 't-f']
function highlight(code) {
  const out = []
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const g = m.slice(1).findIndex(Boolean) + 1
    out.push(<span key={m.index} className={CLS[g]}>{m[0]}</span>)
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/* Tecnologias. Preencha "nivel" (0 a 100) para exibir a porcentagem de cada uma */
const SKILLS = [
  { n: 'PHP', I: SiPhp, c: '#777BB4', nivel: null },
  { n: 'JavaScript', I: SiJavascript, c: '#F7DF1E', nivel: null },
  { n: 'HTML5', I: SiHtml5, c: '#E34F26', nivel: null },
  { n: 'CSS3', I: FaCss3, c: '#1572B6', nivel: null },
  { n: 'SQL', I: FaDatabase, c: '#E48E00', nivel: null },
  { n: 'MySQL', I: SiMysql, c: '#4479A1', nivel: null },
  { n: 'PDO', I: FaServer, c: '#777BB4', nivel: null },
  { n: 'Bootstrap', I: SiBootstrap, c: '#7952B3', nivel: null },
  { n: 'AJAX', I: FaArrowsRotate, c: '#0E9AA7', nivel: null },
  { n: 'Git', I: SiGit, c: '#F05032', nivel: null },
  { n: 'GitHub', I: SiGithub, c: 'currentColor', nivel: null },
]
const byName = n => SKILLS.find(s => s.n === n)

const FLOAT = [
  ['PHP', 'top-[6%] left-[0%]', 14, '0s'],
  ['JavaScript', 'top-[2%] right-[0%]', 22, '-1.5s'],
  ['MySQL', 'top-[50%] left-[-2%]', 18, '-3s'],
  ['Git', 'top-[44%] right-[-2%]', 12, '-2s'],
]

const STACK = [
  ['Linguagens', 'PHP, JavaScript, HTML5, CSS3, SQL'],
  ['Banco de dados', 'MySQL, PDO'],
  ['Interface', 'Bootstrap, AJAX'],
  ['Versionamento e deploy', 'Git, GitHub, XAMPP, InfinityFree'],
]
const COURSES = [
  ['Desenvolvimento Web', 'SENAC · 240 horas', 'Bootstrap, HTML, CSS, JavaScript, Git, GitHub, XAMPP, PHP, MySQL, SQL e PDO.'],
  ['Curso de PHP', 'Cursar', ''],
]
const DIFS = [
  [['PHP', 'MySQL'], 'Full Stack', 'Do front-end ao banco de dados.'],
  [['HTML5', 'JavaScript'], 'Organização', 'Código estruturado e lógica de negócio clara.'],
  [['Bootstrap', 'CSS3'], 'Mobile first', 'Funciona bem em qualquer tela.'],
  [['Git', 'GitHub'], 'Git e GitHub', 'Histórico e entregas seguras.'],
]
const PROJECTS = [
  { t: 'HoopMetrics', d: 'Súmula eletrônica e placar de basquete, com área pública e painel administrativo restrito. Controla tempo de jogo, relógio de posse, pontos por atleta, faltas e parciais por período, com tema claro e escuro.' },
  { t: 'Gerenciador de Tarefas', d: 'Aplicação web hospedada na InfinityFree, com autenticação de usuários e conclusão de tarefas via AJAX.', tech: 'PHP, MySQL, AJAX' },
  { t: 'Nexus-OS', d: 'Sistema web responsivo de gestão de ordens de serviço para assistência técnica.', url: 'https://nexus-os.free.je' },
]
const LINKS = [['Sobre', '#sobre'], ['Diferenciais', '#diferenciais'], ['Stack', '#stack'], ['Projetos', '#projetos'], ['Contato', '#contato']]

const ICON = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
}
const Icon = ({ name }) => <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[name]} /></svg>
const SOCIAL = [['github', 'GitHub', CONTACT.github], ['chat', 'WhatsApp', CONTACT.whatsapp], ['mail', 'E-mail', 'mailto:' + CONTACT.email]]
const TechIcon = ({ name, size = 24 }) => { const s = byName(name); return <s.I size={size} color={s.c} aria-hidden="true" /> }

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .1 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Hero3D() {
  const ref = useRef(null)
  const move = e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(2))
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(2))
  }
  const leave = () => { ref.current.style.setProperty('--mx', 0); ref.current.style.setProperty('--my', 0) }
  return (
    <div ref={ref} className="stage" onPointerMove={move} onPointerLeave={leave}>
      <div className="ring ring-1" /><div className="ring ring-2" /><div className="disk" />
      {FLOAT.map(([n, pos, d, delay]) => (
        <div key={n} className={'chip-wrap ' + pos} style={{ '--d': d }}>
          <span className="chip" style={{ '--delay': delay }}><TechIcon name={n} size={20} />{n}</span>
        </div>
      ))}
      <div className="me"><img src="/eu.webp" alt="Cauan Carvalho" width="900" height="1200" fetchPriority="high" /></div>
    </div>
  )
}

function Laptop() {
  const [idx, setIdx] = useState(0)
  const [n, setN] = useState(0)
  const code = FILES[idx][1]
  useEffect(() => {
    if (n < code.length) { const id = setTimeout(() => setN(n + 1), 26); return () => clearTimeout(id) }
    const id = setTimeout(() => { setIdx(i => (i + 1) % FILES.length); setN(0) }, 2600)
    return () => clearTimeout(id)
  }, [n, code])
  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      <img src="/laptop.webp" alt="Notebook com código PHP sendo escrito" className="w-full h-auto block select-none" width="1200" height="800" loading="lazy" draggable="false" />
      <div className="screen">
        <div className="code-bar">{FILES[idx][0]}</div>
        <pre aria-hidden="true">{highlight(code.slice(0, n))}<span className="caret" /></pre>
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
        <section id="inicio" className="pt-[calc(4rem+var(--s-8))] pb-[var(--sec-y)] overflow-hidden">
          <div className="wrap grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <p className="muted font-medium">Olá, eu sou</p>
              <h1 className="mt-2 font-extrabold text-[length:var(--fs-name)]"><span className="block sm:inline">Cauan</span> <span className="block sm:inline name-accent">Carvalho</span></h1>
              <p className="brand mt-5 text-[length:var(--fs-lg)] font-bold sm:text-2xl">Desenvolvedor Full Stack<span className="caret-text" aria-hidden="true" /></p>
              <p className="mt-4 max-w-md muted">Sistemas web com PHP, MySQL e JavaScript, do banco de dados à interface.</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <a href="#contato" className="btn btn-primary">Falar comigo</a>
                <a href="#projetos" className="link font-semibold text-center sm:text-left">Ver projetos</a>
              </div>
              <Social className="mt-8" />
            </div>
            <Hero3D />
          </div>
        </section>

        <section id="sobre" className="band sec">
          <div className="wrap grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
            <div>
              <h2 className={H2}>Sobre mim</h2>
              <p className="reveal mt-6 text-[length:var(--fs-lg)] max-w-xl">Sou estudante de tecnologia e desenvolvo sistemas web completos, do front-end ao back-end, com integração a banco de dados.</p>
              <p className="reveal mt-4 max-w-xl muted">Gosto de construir aplicações funcionais, organizadas e seguras, com a lógica de negócio bem estruturada e deploy em XAMPP e InfinityFree.</p>
            </div>
            <Laptop />
          </div>
        </section>

        <section id="diferenciais" className="sec">
          <div className="wrap">
            <h2 className={H2}>Como eu trabalho</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {DIFS.map(([icons, t, d]) => (
                <div key={t} className="reveal">
                  <div className="flex gap-3">{icons.map(n => <TechIcon key={n} name={n} size={32} />)}</div>
                  <h3 className="text-xl font-bold mt-4">{t}</h3>
                  <p className="mt-1 text-[length:var(--fs-sm)] muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="band sec">
          <div className="wrap"><h2 className={H2}>Stack e formação</h2></div>
          <div className="marquee mt-10" aria-label="Tecnologias">
            <div className="marquee-track">
              {[...SKILLS, ...SKILLS].map((s, i) => (
                <span key={i} className="skill" aria-hidden={i >= SKILLS.length}><s.I size={24} color={s.c} aria-hidden="true" />{s.n}{typeof s.nivel === 'number' && <b className="muted">{s.nivel}%</b>}</span>
              ))}
            </div>
          </div>
          <div className="wrap mt-14 grid lg:grid-cols-2 gap-14 lg:gap-20">
            <div>
              <h3 className="brand text-2xl font-bold reveal">Competências</h3>
              <dl className="mt-8 m-0 space-y-6">
                {STACK.map(([t, items]) => (
                  <div key={t} className="reveal sm:grid sm:grid-cols-[180px_1fr] gap-4"><dt className="font-bold">{t}</dt><dd className="m-0 mt-1 sm:mt-0 muted">{items}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="brand text-2xl font-bold reveal">Formação</h3>
              <ol className="timeline mt-8">
                {COURSES.map(([t, meta, d]) => (
                  <li key={t} className="reveal"><h4 className="text-lg font-bold m-0">{t}</h4><p className="mt-1 font-medium">{meta}</p>{d && <p className="mt-2 text-[length:var(--fs-sm)] muted">{d}</p>}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="projetos" className="sec">
          <div className="wrap">
            <h2 className={H2}>Projetos</h2>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map(p => (
                <article key={p.t} className="reveal card flex flex-col">
                  <h3 className="text-2xl font-bold">{p.t}</h3>
                  <p className="mt-3 muted">{p.d}</p>
                  {p.tech && <p className="mt-4 text-[length:var(--fs-sm)] font-semibold">{p.tech}</p>}
                  {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="link mt-4 font-semibold">Abrir projeto</a>}
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
