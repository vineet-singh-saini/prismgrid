function PageHeader({ eyebrow, title, subtitle, action, meta = [] }) {
  return (
    <div className="page-header">
      <div className="page-header-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {meta.length ? (
          <div className="page-header-meta">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ) : null}
      </div>

      {action ? <div className="page-header-action">{action}</div> : null}
    </div>
  );
}

export default PageHeader;
