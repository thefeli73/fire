export default function Footer() {
  return (
    <footer className="w-full py-8 text-center text-xs">
      <p className="text-xs">
        © {new Date().getFullYear()} InvestingFIRE. All rights reserved.{" "}
        <a
          href="https://schulze.network"
          target="_blank"
          className="text-primary hover:underline"
        >
          Hosting by Schulze.network
        </a>
      </p>
    </footer>
  );
}
