export default function Footer() {
  return (
    <footer className="border-t py-5 text-center text-xs text-[var(--text-muted)]/50">
      Oikos &copy; {new Date().getFullYear()}
    </footer>
  );
}
