import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer" id="production">
      <div className="container">
        <div className="footer-card">
          <div className="footer-top">
            <div>
              <span className="eyebrow">Production direction</span>
              <h3>Built to evolve from executive visibility into a full operating system.</h3>
              <p>
                PRISM-GRID is structured to support predictive risk, vendor intelligence,
                explainable recommendations, compliance watch, and decision logs in one
                coordinated workspace.
              </p>
            </div>

            <div className="footer-links">
              <a href="#platform">Platform story</a>
              <a href="#workflow">Workflow map</a>
              <a href="#modules">Feature system</a>
              <a href="#production">Production path</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>(c) 2026 PRISM-GRID. Predictive infrastructure intelligence.</span>
            <span>Phase 1 production frontend | React + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
