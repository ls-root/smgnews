import SetHeader from "@/components/SetHeader";
import { Info } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <SetHeader title="HTTP 404.0 Not Found" subtitle=" " />
      <h1>Was ist passiert?</h1>
      <p>Du hast versucht, eine Anfrage an einen nicht existierenden Endpoint zu senden. Darauf haben wir mit einem 404-HTTP-Response-Code geantwortet.</p>
      <div >
        <h3 className="flex items-center">
          <Info className="mr-2" />
          Hinweis
        </h3>
        <p>Der Server reagiert auf Anfragen zu anderen Assets, wie beispielsweise dem Header- oder dem Wetterbild, mit einer 200-OK-Antwort.</p>
      </div>
      <h1>Lösungs ansatz</h1>
      <p>Sie können unsere <Link href="/" className="text-blue-600 underline">Homepage</Link> oder eine andere seite besuchen um wieder eine normale seite zu erhalten. Falls sie nach einem Aritkel gesucht haben können sie auch unsere such funktion nutzen um den Artikel zu finden. </p>
      <h1>Problem vermeinden</h1>
      <p>Es ist schwierig, dieses Problem zu vermeiden, weil es meistens von unserer Seite kommt. Sie können auch die Ursache sein, wenn Sie selbst versucht haben, einen Link zu erstellen. Wir nutzen in unseren Links Slugs und IDs, die sich ohne Zugriff auf das interne System schlecht erraten lassen. Am besten nutzen Sie unsere UI.</p>
    </>
  )
}
