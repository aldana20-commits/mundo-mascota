export default function Footer() {
  const whatsappMessage = encodeURIComponent("¡Hola! Quisiera consultar por productos de Mundo Mascota.");
  const whatsappUrl = `https://wa.me/5493813428876?text=${whatsappMessage}`;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <span className="footer-paw">🐾</span>
          <div><strong>Mundo Mascota</strong><small>Todo para tu mascota ♥</small></div>
        </div>
        <div className="footer-social">
          <strong>Seguinos en nuestras redes</strong>
          <div className="social-links">
            <a href="https://www.instagram.com/aldu__maidana/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram">◎ <span>Instagram</span></a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp">◉ <span>WhatsApp</span></a>
          </div>
        </div>
        <div className="footer-contact">
          <strong>¿Tenés alguna consulta?</strong>
          <span>¡Estamos para ayudarte!</span>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="footer-whatsapp">☏ Enviar mensaje</a>
        </div>
        <div className="footer-pets" aria-hidden="true">🐕　🐈</div>
      </div>
      <div className="footer-bottom">© 2026 Mundo Mascota. Todos los derechos reservados.</div>
    </footer>
  );
}
