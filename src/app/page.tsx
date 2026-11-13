import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BadgeCheck, CakeSlice, ChartNoAxesCombined, ClipboardList, CookingPot, Package, ShieldCheck, Sparkles, Store, UsersRound } from "lucide-react";

const features = [
  { icon: CookingPot, title: "Recetas con costos reales", text: "Calcula ingredientes, rendimiento, costo por porción y un precio sugerido que puedes ajustar." },
  { icon: Package, title: "Inventario que acompaña tu ritmo", text: "Registra compras, prepara recetas, controla porciones y entiende dónde se va cada ingrediente." },
  { icon: Store, title: "Tu tienda de postres", text: "Comparte tu catálogo, recibe pedidos y ofrece encargos personalizados desde tu propio enlace." },
  { icon: ClipboardList, title: "Pedidos bajo control", text: "Consulta cada solicitud, coordina pagos manuales y mantén al cliente al tanto de su pedido." },
  { icon: ChartNoAxesCombined, title: "Un negocio más claro", text: "Mira ventas, costos, gastos, mermas y productos favoritos desde un mismo lugar." },
  { icon: UsersRound, title: "Clientes que vuelven", text: "Conserva el historial de compra para reconocer a tus clientes y atenderlos mejor." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Postre, inicio"><Image src="/brand/logo.png" alt="Postre" width={144} height={42} priority /></Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#funciones">Funciones</a><a href="#como-funciona">Cómo funciona</a><a href="#planes">Planes</a>
        </nav>
        <div className="header-actions"><Link className="login-link" href="/acceso">Iniciar sesión</Link><Link className="button button-primary header-cta" href="/registro">Crear mi cuenta <ArrowRight size={17} /></Link></div>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Hecho para negocios de repostería</div>
          <h1>Tú pones la magia.<br /><span>Nosotros, el orden.</span></h1>
          <p className="hero-description">Recetas, costos, inventario, pedidos y una tienda para tus postres. Todo en un solo lugar, pensado para que tu negocio crezca a tu manera.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/registro">Empieza gratis 7 días <ArrowRight size={18} /></Link><a className="button button-glass" href="#como-funciona"><span className="play-icon"><ArrowDown size={15} /></span> Conoce Postre</a></div>
          <div className="hero-promise"><BadgeCheck size={17} /> Sin tarjeta ni pasarela de pago para empezar</div>
        </div>
        <div className="hero-visual" aria-label="Vista previa del panel de Postre">
          
          <div className="dashboard glass">
            <div className="dash-top"><div><span className="dash-kicker">TU ESPACIO POSTRE</span><strong>Tu negocio, en orden</strong></div><span className="avatar">P</span></div>
            <div className="dash-stats"><div className="stat-card glass"><span>Ventas de hoy</span><strong>US$ 86,50</strong><small className="positive">↑ 12% esta semana</small></div><div className="stat-card glass"><span>Pedidos activos</span><strong>08</strong><small>3 por confirmar</small></div></div>
            <div className="chart-card glass"><div className="chart-head"><div><span>Resumen de ventas</span><strong>Esta semana</strong></div><span className="chart-tag">+18%</span></div><div className="chart-bars" aria-hidden="true">{[35,54,42,78,60,93,68].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><div className="chart-days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div></div>
            <div className="order-card glass"><span className="order-icon"><CakeSlice size={19} /></span><div><strong>Torta de chocolate</strong><small>Pedido #1048 · 12 porciones</small></div><span className="status-pill">En preparación</span></div>
          </div>
          <div className="float-note glass"><span className="note-icon"><ShieldCheck size={17} /></span><div><strong>Porciones actualizadas</strong><small>Quedan 7 disponibles</small></div></div>
          <div className="hero-caption"><span className="caption-dot" /> Una mirada a tu espacio Postre</div>
        </div>
      </section>

      <section className="trust-row section-shell"><span>TODO LO QUE HACE FALTA, EN UNA SOLA APP</span><div><span><CookingPot size={18}/> Recetas</span><span><Package size={18}/> Inventario</span><span><Store size={18}/> Tienda</span><span><ChartNoAxesCombined size={18}/> Reportes</span></div></section>

      <section className="features-section section-shell" id="funciones">
        <div className="section-heading"><div className="eyebrow">Tu cocina y tu negocio, conectados</div><h2>De la receta al pedido.<br /><span>Todo tiene su lugar.</span></h2><p>Postre convierte las tareas de cada día en un proceso simple y claro.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, title, text }, index) => <article className="feature-card glass" key={title}><div className={`feature-icon feature-icon-${index}`}><Icon size={21} strokeWidth={1.8}/></div><h3>{title}</h3><p>{text}</p><span className="feature-arrow"><ArrowRight size={16}/></span></article>)}</div>
      </section>

      <section className="steps-section section-shell" id="como-funciona"><div className="steps-panel glass"><div className="steps-intro"><div className="eyebrow">Empieza a tu ritmo</div><h2>Primero lo conoces.<br /><span>Después, lo haces tuyo.</span></h2><p>Prueba una receta de muestra en un espacio seguro y luego configura tu negocio con tus propios datos.</p><Link href="/registro" className="text-link">Explorar los 7 días gratis <ArrowRight size={17}/></Link></div><div className="step-list"><div className="step-item"><span className="step-number">01</span><div><strong>Arma tu espacio</strong><p>Agrega el nombre, logo y colores de tu negocio.</p></div></div><div className="step-item"><span className="step-number">02</span><div><strong>Prueba con ejemplos</strong><p>Explora recetas, inventario y pedidos de muestra.</p></div></div><div className="step-item"><span className="step-number">03</span><div><strong>Publica tu tienda</strong><p>Cuando estés lista, añade tus productos y comparte tu enlace.</p></div></div></div></div></section>

      <section className="pricing-section section-shell" id="planes"><div className="pricing-copy"><div className="eyebrow">Claro desde el comienzo</div><h2>Empieza sin pagar.<br /><span>Crece a tu manera.</span></h2><p>Tienes siete días para explorar Postre y preparar tu espacio. Después, decides si quieres continuar.</p></div><article className="price-card glass"><div className="price-top"><span className="price-label">Plan para tu negocio</span><span className="price-mark"><Sparkles size={17}/></span></div><div className="price"><strong>$5</strong><span>USD / mes</span></div><p>Todo lo que necesitas para organizar tu negocio de repostería.</p><ul><li><BadgeCheck size={16}/> Un usuario propietario</li><li><BadgeCheck size={16}/> Recetas, costos e inventario</li><li><BadgeCheck size={16}/> Tienda y gestión de pedidos</li><li><BadgeCheck size={16}/> 30 lecturas de facturas al mes</li></ul><Link className="button button-primary price-cta" href="/registro">Probar gratis por 7 días <ArrowRight size={17}/></Link><small>Sin cobros automáticos. Renovación con aprobación manual.</small></article></section>

      <footer className="site-footer section-shell"><Link className="brand" href="/" aria-label="Postre, inicio"><Image src="/brand/logo.png" alt="Postre" width={112} height={33}/></Link><span>Tú pones la magia. Nosotros, el orden.</span><div><Link href="/acceso">Iniciar sesión</Link><a href="#funciones">Funciones</a></div><small>© 2026 Postre. Hecho para quienes crean cosas dulces.</small></footer>
    </main>
  );
}
