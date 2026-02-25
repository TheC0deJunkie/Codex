import { VectorizerStudio } from "@/components/vectorizer-studio";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>Logo Vectorizer Pro</h1>
        <p>
          Upload a logo image and generate a precise SVG in seconds. Tune color depth, smoothing, corner
          precision, and path detail to match your brand mark as closely as possible.
        </p>
      </section>
      <VectorizerStudio />
    </main>
  );
}
