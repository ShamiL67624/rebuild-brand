export default function Logo() {
  return <a className="brand" href="#home" aria-label="IndianOil home">
    <svg className="brand-emblem" width="55" height="55" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#ED691C" stroke="#142542" strokeWidth="1.6"/>
      <circle cx="32" cy="32" r="26.5" stroke="#FFFDF7" strokeWidth="1"/>
      <path d="M2 24H62V42H2V24Z" fill="#142542"/>
      <path d="M2 24H62M2 42H62" stroke="#FFFDF7" strokeWidth="1.2"/>
      <text x="32" y="37" fill="white" textAnchor="middle" fontSize="11.3" fontWeight="700" fontFamily="Nirmala UI, Noto Sans Devanagari, sans-serif">इंडियनऑयल</text>
    </svg>
    <span className="brand-type">IndianOil<small>THE ENERGY OF INDIA</small></span>
  </a>;
}
