function Icon({ name, size = 20, ...props }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  };

  const paths = {
    arrow: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    plane: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /><path d="m11 13 5 5" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    down: <><path d="m6 9 6 6 6-6" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 8.6c0 4.6-8.8 10-8.8 10S3.2 13.2 3.2 8.6a4.4 4.4 0 0 1 8.8-1 4.4 4.4 0 0 1 8.8 1Z" />,
    mountain: <><path d="m3 20 7-13 4 7 2-3 5 9H3Z" /><path d="m8 11 2 2 2-1" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 8-8 8-16Z" /><path d="M4 21c2-5 6-8 11-11" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    facebook: <><circle cx="12" cy="12" r="9" /><path d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.3-1.4 1.5-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.2V13h2.4v7h2.9Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.8" r=".7" fill="currentColor" stroke="none" /></>,
  };

  return <svg {...shared}>{paths[name] || paths.arrow}</svg>;
}

export default Icon;
