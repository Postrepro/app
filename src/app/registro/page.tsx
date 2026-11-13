import Link from "next/link";
import { ArrowLeft, CakeSlice, CircleHelp } from "lucide-react";
import RegistrationWizard from "./registration-wizard";

export default function RegistroPage() {
  return <main className="signup-page"><header className="signup-header"><Link href="/" className="signup-back"><ArrowLeft size={17}/> Volver a Postre</Link><span className="signup-brand"><CakeSlice size={17}/> postre</span><Link href="/acceso" className="signup-login">¿Ya tienes cuenta? <strong>Inicia sesión</strong></Link></header><RegistrationWizard/><footer className="signup-footer"><span>© 2026 Postre</span><Link href="/ayuda"><CircleHelp size={15}/> ¿Necesitas ayuda?</Link></footer></main>;
}
