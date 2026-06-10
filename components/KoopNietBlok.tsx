type Props = { titel?: string; children: React.ReactNode };

// Voor afraders en waarschuwingen. Producten hier krijgen GEEN link.
export default function KoopNietBlok({ titel = "Let hierop", children }: Props) {
  return (
    <aside className="border-l-2 border-walnoot bg-papier shadow-sm px-6 py-5 my-8 max-w-content">
      <p className="font-display text-lg mb-2">{titel}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </aside>
  );
}
