import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AccessForm from "./access-form";

export default function AccesoPage() {
  return <main className="access-page"><Link href="/" className="signup-back"><ArrowLeft size={17}/> Volver a Postre</Link><AccessForm/></main>;
}
