const paths = {
  map: <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z" /><path d="M9 3v16M15 5v16" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z" /></>,
  star: <><path d="m13 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2ZM3 3l4 4M2 8l3 3M8 2l3 3" /></>,
  oracle: <><circle cx="12" cy="10" r="6" /><path d="M9 16v3h6v-3M6 21h12M14 6l1 2" /></>,
  group: <><circle cx="9" cy="7" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1" /></>,
  book: <><path d="M12 5C8 2 4 3 2 4v16c3-1.5 6-1 10 1 4-2 7-2.5 10-1V4c-2-1-6-2-10 1ZM12 5v16" /><path d="M5 8h3M16 8h3M5 12h3M16 12h3" /></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
  back: <><path d="M20 12H4m6-6-6 6 6 6" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  bowl: <><path d="M3 11h18a9 9 0 0 1-18 0ZM7 21h10M8 7V4M12 7V2M16 7V4" /></>,
  coin: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 9v6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  warning: <><path d="m12 3 10 18H2ZM12 9v5M12 17v.5" /></>,
  refresh: <><path d="M20 9a8 8 0 0 0-14-4L3 8m0-5v5h5M4 15a8 8 0 0 0 14 4l3-3m0 5v-5h-5" /></>,
  flame: <path d="M12 2c1 5-4 6-2 10 2-1 3-3 3-5 5 4 7 7 5 11a7 7 0 0 1-12-1C3 11 8 7 12 2Z" />,
}

export default function Icon({ name, className = '', ...props }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name] || paths.compass}</svg>
}
