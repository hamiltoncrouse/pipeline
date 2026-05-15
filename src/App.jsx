import { useState, useEffect } from 'react'
import styles from './App.module.css'

const TERMINAL_LINES = [
  '> initializing analysis...',
  '> subject: hamilton_crouse',
  '> face_shape: oval/rectangle',
  '> hair_type: salt_pepper',
  '> generating variants...',
  '> 18 results found.',
  '> recommendation: see below.',
]

const FIGURES = [
  {
    label: 'Fig. 1 — First Contact',
    src: '/analysis-1.png',
    alt: 'Nine hairstyle recommendations with pros and cons',
    caption:
      "The algorithm's initial findings. It recommended, as best bets, the Longer Side Sweep, the Ivy League, and the Soft Pompadour. It had opinions about silver hair. The subject considered the Pompadour for longer than he would like to admit.",
  },
  {
    label: 'Fig. 2 — Second Opinion',
    src: '/analysis-2.png',
    alt: 'Nine more hairstyle options with color ideas',
    caption:
      'The algorithm returned, unprompted, with nine more. This time it mentioned beard balance. It had thoughts on salt spray, matte clay, and light pomade. It said natural gray would look more distinguished than a flat dark dye. The subject put down the flat dark dye.',
  },
]

const VARIANTS = [
  {
    num: '01.',
    name: 'Classic Side Part Hamilton',
    desc: 'Has opinions about infrastructure. Arrives seven minutes early to everything and does not mention it. Drives something sensible and has no strong feelings about it whatsoever. You would trust him with your finances. You would not call him at 2am. He would not expect you to.',
  },
  {
    num: '02.',
    name: 'Soft Pompadour Hamilton',
    desc: 'Fun at parties. Not always invited back. Knows three facts about every topic and delivers them with full confidence. Once described himself as "a connector." The algorithm said this one pairs well with glasses. He wears the glasses like a prop.',
  },
  {
    num: '03.',
    name: 'Long Layers (Flowing) Hamilton',
    desc: 'Still going through it. But creatively. The algorithm flagged that this look requires "proper care," which he interprets as a metaphor and which it was not. Reads a lot. Finishes most of the books. Has a podcast he\'s been meaning to start.',
  },
  {
    num: '04.',
    name: 'Man Bun (Low) Hamilton',
    desc: 'Does not answer emails quickly. Has a sourdough starter he has named. Once turned down a meeting because he had "a lot on." He did not have a lot on. The algorithm noted this style requires length and upkeep. He has both. He is comfortable with both.',
  },
  {
    num: '05.',
    name: 'Highlighted Texture Hamilton',
    desc: 'Requires toning every few months. Is aware of this. Has made peace with it. The algorithm said this look is "modern" and "youthful." He heard "modern" and "youthful" and immediately booked an appointment. This is the version that tries the hardest. You love him for it.',
  },
  {
    num: '06.',
    name: 'Layered Silver Flow Hamilton',
    desc: 'Looks like he makes furniture by hand and he does make furniture by hand. Embraces the gray, as instructed. Can look unruly without shaping, per the algorithm, which understands him better than most people. Full of softness. Requires patience. Has both.',
  },
  {
    num: '07.',
    name: 'Salt & Pepper Natural Gray Hamilton',
    desc: "This is the one who wins. He has made peace with the calendar. He smells like cedar. He does not need to be told he looks distinguished — he knows, and he's moved on to other things. The algorithm gave him the fewest caveats. He earned that.",
  },
]

const QUIZ_QUESTIONS = [
  {
    q: 'It is 9am on a Tuesday. You are:',
    options: [
      { text: 'Already on my second task.', variant: 'Classic Side Part Hamilton' },
      { text: "Being introduced to someone as 'a connector.'", variant: 'Soft Pompadour Hamilton' },
      { text: 'Re-reading the first chapter of something.', variant: 'Long Layers (Flowing) Hamilton' },
      { text: 'Feeding something I have named.', variant: 'Man Bun (Low) Hamilton' },
    ],
  },
  {
    q: 'The algorithm gives you a recommendation. You:',
    options: [
      { text: 'Book the appointment immediately.', variant: 'Highlighted Texture Hamilton' },
      { text: 'Nod. You already knew.', variant: 'Salt & Pepper Natural Gray Hamilton' },
      { text: 'Interpret it as a broader metaphor.', variant: 'Long Layers (Flowing) Hamilton' },
      { text: 'Add it to the list.', variant: 'Layered Silver Flow Hamilton' },
    ],
  },
  {
    q: "Your relationship with the word 'maintenance':",
    options: [
      { text: 'It is a schedule I keep.', variant: 'Classic Side Part Hamilton' },
      { text: 'It is optional and I know it.', variant: 'Man Bun (Low) Hamilton' },
      { text: 'It is a commitment I honor.', variant: 'Highlighted Texture Hamilton' },
      { text: "It is something I've stopped fighting.", variant: 'Salt & Pepper Natural Gray Hamilton' },
    ],
  },
  {
    q: 'At a party, you are the one:',
    options: [
      { text: "Who arrived on time and noticed who didn't.", variant: 'Classic Side Part Hamilton' },
      { text: 'With three slightly embellished stories.', variant: 'Soft Pompadour Hamilton' },
      { text: 'Who made the thing everyone is eating.', variant: 'Layered Silver Flow Hamilton' },
      { text: "Who, honestly, didn't go.", variant: 'Salt & Pepper Natural Gray Hamilton' },
    ],
  },
]

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let step = 0
    const timers = []

    function scheduleNext() {
      if (step >= TERMINAL_LINES.length) {
        timers.push(setTimeout(() => setDone(true), 500))
        return
      }
      const line = TERMINAL_LINES[step++]
      setVisibleLines(prev => [...prev, line])
      timers.push(setTimeout(scheduleNext, 280))
    }

    timers.push(setTimeout(scheduleNext, 500))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={styles.terminal}>
      <div className={styles.termBar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={`mono ${styles.termTitle}`}>analysis.sh</span>
      </div>
      <div className={styles.termBody}>
        {visibleLines.map((line, i) => (
          <p
            key={i}
            className={`mono ${styles.termLine} ${i === visibleLines.length - 1 && !done ? styles.termLineActive : ''}`}
          >
            {line}
          </p>
        ))}
        {!done && <span className={`mono ${styles.termCursor}`}>█</span>}
      </div>
    </div>
  )
}

function TitleBlock() {
  return (
    <header className={styles.titleBlock}>
      <p className={`mono ${styles.eyebrow}`}>Self-Documentation Report · Spring 2026</p>
      <h1 className={styles.title}>
        The Algorithm<br />Made&nbsp;18&nbsp;of&nbsp;Me
      </h1>
      <p className={styles.subtitle}>
        An incomplete record of who I might become,<br />
        depending on the length of my hair.
      </p>
      <AnimatedTerminal />
      <div className={styles.subjectWrap}>
        <img src="/hamilton.jpg" alt="The Subject" className={styles.subjectPhoto} />
        <p className={`mono ${styles.subjectCap}`}>The Subject. Pre-analysis.</p>
      </div>
    </header>
  )
}

function Prose() {
  return (
    <section className={styles.prose}>
      <p>
        In the spring of 2026, I submitted a single photograph of my face to an algorithm.
        The algorithm was optimistic. It returned eighteen portraits.
      </p>
      <p>I had not asked for eighteen portraits. I had asked about hair.</p>
      <p>
        The algorithm did not seem to understand the difference. It identified my face shape as
        Oval/Rectangle — which I have chosen to take as a compliment — assessed my hair type,
        noted my age, and proceeded to generate what it described as a "tailored" set of
        recommendations. Each recommendation came with a portrait. The portrait looked like me.
        The portrait did not look like me. The portrait was me, in another life, with different
        hair, making different choices, probably at a different dinner table somewhere, eating
        something I can't picture.
      </p>
      <p>I stared at them for a while. Then I made this page.</p>
    </section>
  )
}

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <button className={`mono ${styles.lightboxClose}`} onClick={onClose} aria-label="Close">✕ close</button>
      <img
        src={src}
        alt={alt}
        className={styles.lightboxImg}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

function Figure({ label, src, alt, caption }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <section className={styles.figure}>
        <p className={`mono ${styles.figLabel}`}>{label}</p>
        <img
          src={src}
          alt={alt}
          className={`${styles.figImg} ${styles.figClickable}`}
          onClick={() => setOpen(true)}
          title="Click to enlarge"
        />
        <p className={styles.figCaption}>
          {caption}{' '}
          <button className={`mono ${styles.figHint}`} onClick={() => setOpen(true)}>[enlarge]</button>
        </p>
      </section>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

function VariantCard({ v }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`${styles.variant} ${open ? styles.variantOpen : ''}`}
      onClick={() => setOpen(o => !o)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o) }}
    >
      <span className={`mono ${styles.vNum}`}>{v.num}</span>
      <div className={styles.vBody}>
        <h3 className={styles.vName}>{v.name}</h3>
        <div className={styles.vDescWrap}>
          <p className={styles.vDesc}>{v.desc}</p>
        </div>
      </div>
      <span className={`mono ${styles.vToggle}`}>{open ? '−' : '+'}</span>
    </div>
  )
}

function Variants() {
  return (
    <section className={styles.variantsSection}>
      <div className={styles.variantsInner}>
        <h2 className={styles.variantsHeading}>Field Notes on the Eighteen Hamiltons</h2>
        <p className={styles.variantsIntro}>
          What follows is an incomplete taxonomy of who I might have been, given different
          choices at the barbershop earlier in life. All eighteen versions are real. All eighteen
          are living somewhere. I am, apparently, all of them.
        </p>
        <div className={styles.variantList}>
          {VARIANTS.map(v => <VariantCard key={v.num} v={v} />)}
        </div>
      </div>
    </section>
  )
}

function Quiz() {
  const [answers, setAnswers] = useState([])
  const total = QUIZ_QUESTIONS.length
  const step = answers.length
  const isDone = step === total

  function pick(variant) {
    setAnswers(prev => [...prev, variant])
  }

  function restart() {
    setAnswers([])
  }

  const result = isDone
    ? (() => {
        const tally = {}
        answers.forEach(a => { tally[a] = (tally[a] || 0) + 1 })
        const winnerName = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
        return VARIANTS.find(v => v.name === winnerName)
      })()
    : null

  return (
    <section className={styles.quizSection}>
      <div className={styles.quizInner}>
        <div className={styles.quizHeader}>
          <h2 className={styles.quizTitle}>Which Hamilton Are You?</h2>
          <p className={styles.quizSub}>Four questions. Scientifically meaningless. Deeply revealing.</p>
        </div>

        {!isDone ? (
          <div key={step} className={styles.quizCard}>
            <p className={`mono ${styles.quizStep}`}>
              {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <p className={styles.quizQ}>{QUIZ_QUESTIONS[step].q}</p>
            <div className={styles.quizOptions}>
              {QUIZ_QUESTIONS[step].options.map((opt, i) => (
                <button key={i} className={styles.quizBtn} onClick={() => pick(opt.variant)}>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.quizResult}>
            <p className={`mono ${styles.quizResultLabel}`}>You are:</p>
            <h3 className={styles.quizResultName}>{result.name}</h3>
            <p className={styles.quizResultDesc}>{result.desc}</p>
            <button className={`mono ${styles.quizRestart}`} onClick={restart}>
              Run it again →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className={styles.closing}>
      <div className={styles.closingInner}>
        <p className={styles.closingText}>The real Hamilton contains all of them.</p>
        <p className={`${styles.closingText} ${styles.closingMuted}`}>
          The algorithm doesn't know that. The algorithm is still optimizing.
        </p>
        <p className={`mono ${styles.closingSig}`}>
          — Hamilton Crouse<br />
          <a
            href="https://github.com/hamiltoncrouse"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.closingLink}
          >
            github.com/hamiltoncrouse
          </a>
        </p>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <TitleBlock />
      <Prose />
      {FIGURES.map(fig => <Figure key={fig.label} {...fig} />)}
      <Variants />
      <Quiz />
      <Closing />
    </>
  )
}
