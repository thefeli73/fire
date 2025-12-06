export default function BlurThing() {
  return (
    <>
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <div className="from-primary/25 to-primary/15 absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-orange-500/25 to-red-500/15 blur-3xl" />
      </div>
    </>
  );
}
