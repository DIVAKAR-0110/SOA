export default function JobFooter() {
  const quickLinks = ["Home", "About", "Apply", "Track Application", "Contact"];
  const socialLinks = [
    { name: "Facebook", url: "#", icon: "📘" },
    { name: "Twitter", url: "#", icon: "🐦" },
    { name: "LinkedIn", url: "#", icon: "💼" },
  ];

  return (
    <>
      <style>{`
        .footer {
          background: #1e293b;
          color: #fff;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 40px 60px;
          font-family: 'Segoe UI', sans-serif;
        }

        .footer h3 {
          margin-bottom: 12px;
          font-size: 18px;
          color: #22c55e;
        }

        .footer a {
          display: block;
          color: #fff;
          text-decoration: none;
          margin: 5px 0;
          transition: color 0.3s ease;
        }

        .footer a:hover {
          color: #22c55e;
        }

        .footer .social {
          display: flex;
          gap: 15px;
          font-size: 22px;
        }

        .footer-bottom {
          width: 100%;
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #cbd5e1;
        }

        @media (max-width: 900px) {
          .footer {
            flex-direction: column;
            padding: 30px 20px;
          }
          .footer .social {
            justify-content: center;
            margin-top: 15px;
          }
        }
      `}</style>

      <footer className="footer">
        <div>
          <h3>OCMS Job Portal</h3>
          <p>
            Join our team to make India’s complaint resolution transparent and
            efficient.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>
              {link}
            </a>
          ))}
        </div>

        <div>
          <h3>Follow Us</h3>
          <div className="social">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} title={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} OCMS. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
