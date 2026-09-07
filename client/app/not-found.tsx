export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] p-6 text-center text-white">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#F4A91C]">404</p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-400">
          The requested SocialGuard page does not exist.
        </p>
      </div>
    </main>
  );
}
