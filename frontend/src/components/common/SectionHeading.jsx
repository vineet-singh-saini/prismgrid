function SectionHeading({ tag, title, subtitle, center = false }) {
  return (
    <div className={center ? "section-heading center" : "section-heading"}>
      {tag ? <span className="section-tag">{tag}</span> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export default SectionHeading;
