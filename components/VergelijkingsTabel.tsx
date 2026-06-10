type Props = {
  kolommen: string[];
  rijen: string[][];
  bijschrift?: string;
};

export default function VergelijkingsTabel({ kolommen, rijen, bijschrift }: Props) {
  return (
    <div className="my-10 overflow-x-auto max-w-3xl">
      <table className="w-full text-sm border-collapse">
        {bijschrift && <caption className="text-left text-klei mb-2">{bijschrift}</caption>}
        <thead>
          <tr className="border-b border-inkt/30 text-left">
            {kolommen.map((k) => (
              <th key={k} className="py-3 pr-6 font-display font-medium text-base">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rijen.map((rij, i) => (
            <tr key={i} className="border-b border-lijn">
              {rij.map((cel, j) => (
                <td key={j} className="py-3 pr-6 align-top">{cel}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
