import "./globals.css";
import "./style.css";
import Footer from "./components/footer";

export const metadata = {
  title: "Guess The Picture",
  description: "RF project by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
        <div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
