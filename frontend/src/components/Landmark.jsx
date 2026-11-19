export default function Landmark({ name }) {
  return <svg className="landmark" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'roll' ? <>
      <path d="M27 70V37h26v33M27 37v-7h6v4h5v-4h4v4h5v-4h6v7" />
      <path d="M30 30 40 13l10 17" />
      <path d="M36 70V59a4 4 0 0 1 8 0v11" />
      <path d="M37 44a3 3 0 0 1 6 0v4h-6Z" />
      <path d="M40 13V6M40 4l1.2 2.4 2.6.3-2 1.8.6 2.6-2.4-1.4-2.4 1.4.6-2.6-2-1.8 2.6-.3Z" />
      <path d="M22 70h36" />
    </>
      : name === 'oracle' ? <>
      <path d="M12 68 40 26l28 42Z" />
      <path d="M33 68l7-17 7 17" />
      <path d="M40 26V13l11 4-11 5" />
      <path d="M58 10a6.5 6.5 0 1 1-7.5-7.5A8 8 0 0 0 58 10Z" />
      <path d="M20 14l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.3-2.2 1.3.6-2.4-1.8-1.6 2.4-.3Z" />
      <path d="M8 68h64" />
    </>
        : name === 'group' ? <>
      <ellipse cx="40" cy="46" rx="23" ry="11" />
      <path d="M25 53v13M55 53v13M18 46h-6M68 46h-6" />
      <circle cx="40" cy="24" r="4.5" /><circle cx="40" cy="68" r="4.5" /><circle cx="12" cy="46" r="4.5" /><circle cx="68" cy="46" r="4.5" />
      <path d="M33 42v7h7v-7M40 42v-3h5v3M30 42v-3" />
      <path d="M28 10h24v9H28ZM34 19v5M46 19v5" />
    </>
          : <>
      <path d="M12 22c9-4 18-3 28 2 10-5 19-6 28-2v40c-9-4-18-3-28 2-10-5-19-6-28-2Z" />
      <path d="M40 24v40" />
      <path d="M18 30l10 2M18 38l10 2M18 46l10 2M52 32l10-2M52 40l10-2M52 48l10-2" />
      <path d="M52 20v18l4.5-4 4.5 4V22" />
    </>}
  </svg>
}
