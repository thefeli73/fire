import FireCalculatorForm from "./components/FireCalculatorForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[oklch(0.49_0.1326_259.29)] to-[oklch(0.33_0.1316_336.24)] p-4 text-[oklch(0.97_0.0228_95.96)]">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-primary-foreground text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          FIRE Calculator
        </h1>
        <FireCalculatorForm />
      </div>
    </main>
  );
}
