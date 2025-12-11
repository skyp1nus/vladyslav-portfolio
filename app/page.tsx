import { Header } from "./components/Header";
import { WhoAmI } from "./components/WhoAmI";
import { BeautifulSoftware } from "./components/BeautifulSoftware";
import { Teams } from "./components/Teams";
import { Apps } from "./components/Apps";
import { Blog } from "./components/Blog";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-[1425px] mx-auto">
        <article>
          <WhoAmI />
          <BeautifulSoftware />
          <Teams />
          <Apps />
          <Blog />
          <Contact />
        </article>
      </main>
    </div>
  );
}
