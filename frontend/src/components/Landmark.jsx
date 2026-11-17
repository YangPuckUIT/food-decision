export default function Landmark({ name }) {
  return <svg className="landmark" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'roll' ? <><path d="M25 68V35h30v33M22 35h36l-5-8H27ZM29 27V15l11-9 11 9v12M23 68h34M34 68V54a6 6 0 0 1 12 0v14M35 41h10M40 15v7M51 12l7-7M56 17l10-4" /><path d="m62 25 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" /></>
      : name === 'oracle' ? <><path d="M9 63 40 18l31 45H9ZM40 18V8l16 4-16 5M40 24v39M9 63l31-14 31 14M40 49 28 63M40 49l12 14M18 68h44" /><path d="m16 16 2-5 2 5 5 2-5 2-2 5-2-5-5-2ZM65 34l2-4 2 4 4 2-4 2-2 4-2-4-4-2Z" /></>
        : name === 'group' ? <><path d="M13 40a27 13 0 0 1 54 0v7a27 13 0 0 1-54 0v-7ZM13 40a27 13 0 0 0 54 0M21 53v15M59 53v15M20 67h5M55 67h5M28 21v-8h24v8M19 26l-6-8M61 26l6-8M34 39h12M39 35v8" /><path d="M33 22h14M6 48v12h8M74 48v12h-8" /></>
          : <><path d="M12 20c12-5 20-3 28 2 8-5 16-7 28-2v43c-12-5-20-3-28 2-8-5-16-7-28-2ZM40 22v43M7 26v41c12-4 23-3 33 2 10-5 21-6 33-2V26M21 29l11 2M21 38l11 2M21 47l11 2M48 31l11-2M48 40l11-2M48 49l11-2M56 9v10l4-3 4 1V7" /></>}
  </svg>
}
