import { Church } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-primary/5 bg-surface-alt/30 py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary/60">
        <div className="flex items-center gap-2">
          <Church className="w-3.5 h-3.5" />
          <span>Oikos &copy; {new Date().getFullYear()}</span>
        </div>
        <span>Construyendo comunidad, una iglesia a la vez</span>
      </div>
    </footer>
  );
}
