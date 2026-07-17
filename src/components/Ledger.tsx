import { useEffect, useRef, useState } from 'react';
import type { LedgerEntry } from '../data/ledger';

type Props = {
  entries: LedgerEntry[];
};

export default function Ledger({ entries }: Props) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <ol className="ledger-list" ref={listRef} data-hydrated={hydrated || undefined}>
      {entries.map((entry, i) => {
        const isOpen = open.has(i);
        const detailId = `ledger-detail-${i}`;
        return (
          <li key={entry.title} className={isOpen ? 'row open' : 'row'}>
            <button
              type="button"
              className="row-head"
              aria-expanded={isOpen}
              aria-controls={detailId}
              onClick={() => toggle(i)}
            >
              <span className="period mono">{entry.period}</span>
              <span className="row-title">{entry.title}</span>
              <span className="value mono">{entry.value ?? ''}</span>
              <span className="indicator mono" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div className="detail" id={detailId}>
              <div className="detail-inner">
                <p>{entry.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
