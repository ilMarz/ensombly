import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/projects");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-2">
          alterum alterius auxilio eget
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          La piattaforma per<br />chi costruisce startup
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
          Founder pubblicano i loro progetti. Collaboratori, advisor e investitori li trovano.
          Costruisci il tuo team, trova il tuo progetto.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8">Inizia ora</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full px-8">Accedi</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-10 text-left">
          <div className="space-y-2">
            <div className="text-2xl">🚀</div>
            <h3 className="font-semibold text-sm">Founder</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Pubblica il tuo progetto, definisci i ruoli che cerchi e costruisci il team dei tuoi sogni.</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🤝</div>
            <h3 className="font-semibold text-sm">Collaboratori</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Trova progetti stimolanti a cui contribuire come developer, designer, marketer e molto altro.</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">💼</div>
            <h3 className="font-semibold text-sm">Investitori</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Scopri progetti early-stage e manifesta il tuo interesse direttamente ai founder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
