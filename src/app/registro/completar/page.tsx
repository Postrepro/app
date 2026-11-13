import Link from "next/link";
import { ArrowLeft, CircleHelp } from "lucide-react";
import Image from "next/image";
import RegistrationWizard from "../registration-wizard";

export default function CompleteRegistrationPage() {
  return <main className="signup-page"><header className="signup-header"><Link href="/" className="signup-back"><ArrowLeft size={17}/> Volver a Postre</Link><span className="signup-brand"><Image src="/brand/logo.png" alt="Postre" width={108} height={32}/></span><Link href="/acceso" className="signup-login">¿Ya tienes cuenta? <strong>Inicia sesión</strong></Link></header><RegistrationWizard/><footer className="signup-footer"><span>© 2026 Postre</span><Link href="/ayuda"><CircleHelp size={15}/> ¿Necesitas ayuda?</Link></footer></main>;
}
