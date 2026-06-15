// Reusable Tooltip primitive. Wrap any element to add a rich hover tooltip.
// Usage:
//   <Tooltip content={<><strong>Title</strong><br/>Body…</>}>{children}</Tooltip>

const { useState: useTtS, useRef: useTtR } = React;

function Tooltip({ content, children, side = 'top', delay = 250 }) {
  const [show, setShow] = useTtS(false);
  const [pos, setPos] = useTtS({ x: 0, y: 0 });
  const wrapperRef = useTtR(null);
  const timerRef = useTtR(null);

  function onEnter(e) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const r = wrapperRef.current?.getBoundingClientRect();
      if (!r) return;
      let x = r.left + r.width / 2;
      let y = side === 'top' ? r.top - 8 : r.bottom + 8;
      setPos({ x, y });
      setShow(true);
    }, delay);
  }
  function onLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShow(false);
  }

  return React.createElement(React.Fragment, null,
    React.createElement('span', {
      ref: wrapperRef,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      style: { display: 'inline-block', borderBottom: '1px dotted rgba(255,255,255,0.25)', cursor: 'help' },
    }, children),
    show && ReactDOM.createPortal(
      React.createElement('div', {
        style: {
          position: 'fixed', zIndex: 9999,
          left: pos.x, top: pos.y,
          transform: side === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
          maxWidth: 340,
          background: 'rgba(20, 12, 14, 0.98)',
          border: '1px solid var(--accent-soft)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 12.5,
          lineHeight: 1.5,
          color: 'var(--fg-1)',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 24px rgba(255, 148, 87, 0.18)',
          pointerEvents: 'none',
          backdropFilter: 'blur(6px)',
        },
      }, content),
      document.body
    )
  );
}

window.Tooltip = Tooltip;
