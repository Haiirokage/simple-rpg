import styled from "styled-components";

// Denomination ratios (how many of the lower unit make up one of the higher)
const SCRIBBLES_PER_TACK = 100;
const TACKS_PER_NOBLE = 60;
const NOBLES_PER_CROWN = 12;

const SCRIBBLES_PER_NOBLE = SCRIBBLES_PER_TACK * TACKS_PER_NOBLE;
const SCRIBBLES_PER_CROWN = SCRIBBLES_PER_NOBLE * NOBLES_PER_CROWN;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: monospace;
`;

const Denomination = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1px;
`;

const CoinSVG = ({ id, colors }: { id: string; colors: [string, string, string] }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" style={{ verticalAlign: "middle" }}>
    <defs>
      <radialGradient id={id} cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor={colors[0]} />
        <stop offset="60%" stopColor={colors[1]} />
        <stop offset="100%" stopColor={colors[2]} />
      </radialGradient>
    </defs>
    <circle cx="6" cy="6" r="5.5" fill={`url(#${id})`} stroke={colors[2]} strokeWidth="0.5" />
    <circle cx="6" cy="6" r="3.5" fill="none" stroke={colors[2]} strokeWidth="0.3" opacity="0.4" />
  </svg>
);

const GoldCrown = () => <CoinSVG id="gold-grad" colors={["#fff4a3", "#daa520", "#996515"]} />;
const SilverNoble = () => <CoinSVG id="silver-grad" colors={["#e8e8e8", "#b0b0b0", "#787878"]} />;
const CopperTack = () => <CoinSVG id="copper-grad" colors={["#e8a87c", "#b87333", "#8b5a2b"]} />;

const IronScribble = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" style={{ verticalAlign: "middle" }}>
    <defs>
      <radialGradient id="scribble-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#b0b0b0" />
        <stop offset="60%" stopColor="#787878" />
        <stop offset="100%" stopColor="#505050" />
      </radialGradient>
    </defs>
    <path
      d="M2.5 1.5 L9 1 L10 3 L10.5 9.5 L8.5 11 L2 10.5 L1 8 L1.5 2.5Z"
      fill="url(#scribble-grad)"
      stroke="#505050"
      strokeWidth="0.5"
    />
    <path
      d="M4 4 L8 3.5 L8.5 8 L4.5 8.5Z"
      fill="none"
      stroke="#505050"
      strokeWidth="0.3"
      opacity="0.4"
    />
  </svg>
);

const CurrencyDisplay = ({ amount }: { amount: number }) => {
  let remainder = amount;
  const crowns = Math.floor(remainder / SCRIBBLES_PER_CROWN);
  remainder %= SCRIBBLES_PER_CROWN;
  const nobles = Math.floor(remainder / SCRIBBLES_PER_NOBLE);
  remainder %= SCRIBBLES_PER_NOBLE;
  const tacks = Math.floor(remainder / SCRIBBLES_PER_TACK);
  const scribbles = remainder % SCRIBBLES_PER_TACK;

  const hasHigher = crowns > 0 || nobles > 0 || tacks > 0;

  return (
    <Wrapper>
      {crowns > 0 && (
        <Denomination>
          {crowns}
          <GoldCrown />
        </Denomination>
      )}
      {nobles > 0 && (
        <Denomination>
          {nobles}
          <SilverNoble />
        </Denomination>
      )}
      {tacks > 0 && (
        <Denomination>
          {tacks}
          <CopperTack />
        </Denomination>
      )}
      <Denomination>
        {hasHigher ? String(scribbles).padStart(2, "0") : scribbles}
        <IronScribble />
      </Denomination>
    </Wrapper>
  );
};

export default CurrencyDisplay;
