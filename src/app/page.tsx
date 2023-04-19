import { Roboto } from "next/font/google";
import AppContainer from "@/components/AppContainer";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className={`flex flex-col flex-grow text-white ${roboto.className}`}>
      <AppContainer />
    </main>
  );
}
