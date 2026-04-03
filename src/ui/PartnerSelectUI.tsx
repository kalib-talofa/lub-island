'use client';

// ---------------------------------------------------------------------------
// PartnerSelectUI — shown before the egg spoon race so the player picks
// their relay partner. Remaining NPCs are auto-paired by GameLoop.
// ---------------------------------------------------------------------------

const NPC_EMOJI: Record<string, string> = {
  rosie:    '\u{1F430}',
  blaze:    '\u{1F98A}',
  pudge:    '\u{1F43B}',
  kiki:     '\u{1F431}',
  sprocket: '\u{1F427}',
  lily:     '\u{1F438}',
};

const NPC_COLORS: Record<string, string> = {
  rosie:    '#F4A6C0',
  blaze:    '#FF8C42',
  pudge:    '#D4A574',
  kiki:     '#C8A8E8',
  sprocket: '#FFD866',
  lily:     '#7ED67E',
};

export interface NpcOption {
  id: string;
  name: string;
  relationship: number;
}

interface PartnerSelectUIProps {
  options: NpcOption[];
  onSelect: (npcId: string) => void;
}

export default function PartnerSelectUI({ options, onSelect }: PartnerSelectUIProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #1a2a3a 0%, #0d1b2a 100%)' }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: 8 }}>
            {'\u{1F95A}'}
          </div>
          <h2
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            Egg Spoon Race
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginTop: 6 }}>
            Choose your relay partner
          </p>
        </div>

        {/* NPC cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {options.map((npc) => {
            const emoji = NPC_EMOJI[npc.id] ?? '\u{1F464}';
            const color = NPC_COLORS[npc.id] ?? '#ffffff';
            const rel = npc.relationship;
            const relLabel = rel > 0 ? `+${rel}` : `${rel}`;
            const relColor =
              rel >= 30 ? '#34d399' : rel >= 0 ? '#fbbf24' : '#f87171';

            return (
              <button
                key={npc.id}
                onClick={() => onSelect(npc.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)',
                  border: `2px solid ${color}55`,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 0.12s',
                }}
                onPointerEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.12)';
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.06)';
                }}
              >
                {/* Avatar */}
                <span style={{ fontSize: '2.2rem', lineHeight: 1, flexShrink: 0 }}>
                  {emoji}
                </span>

                {/* Name + hint */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{ color, fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3 }}
                  >
                    {npc.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.38)',
                      fontSize: '0.7rem',
                      marginTop: 3,
                    }}
                  >
                    Higher bond = fewer egg drops
                  </div>
                </div>

                {/* Relationship */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{ color: relColor, fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    {'\u2665'} {relLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
