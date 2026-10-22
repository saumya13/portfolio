// Text with a few letters swapped into the script face (Ingrid Darling). `swap` maps a word to the letters of it to swap
// (case matters). Each letter is scaled so its height lines up with the letters around it.
const SIZE: Record<string, string> = { o: 'text-[1.9em]', g: 'text-[1.65em]', t: 'text-[1.02em]', T: 'text-[1.05em]', W: 'text-[0.93em]' }

export function ScriptText({ text, swap }: { text: string; swap: Record<string, string> }) {
  return (
    <>
      {text.split(' ').map((word, w) => (
        <span key={w}>
          {w > 0 && ' '}
          {[...word].map((ch, k) =>
            swap[word]?.includes(ch) ? (
              <span key={k} className={`font-ingrid leading-[0] ${SIZE[ch] ?? 'text-[1.3em]'}`}>
                {ch}
              </span>
            ) : (
              ch
            ),
          )}
        </span>
      ))}
    </>
  )
}
