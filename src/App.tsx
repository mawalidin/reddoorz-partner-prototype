import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import { DETAILS_PATH, REGISTER_PATH, SUCCESS_PATH, navigate, usePathname } from "./router";

function App() {
  const pathname = usePathname();

  // Section anchors (#how-it-works, #top…) only exist on the home page. When
  // clicked from another screen, go home first, then land on the section.
  useEffect(() => {
    if (pathname === "/") return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(`/${link.getAttribute("href")}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  // A new screen starts at the top (or at the requested section).
  useEffect(() => {
    const target = window.location.hash && document.querySelector(window.location.hash);
    window.scrollTo({
      top: target ? target.getBoundingClientRect().top + window.scrollY : 0,
      behavior: "instant",
    });
  }, [pathname]);

  if (pathname === SUCCESS_PATH) return <RegistrationSuccessPage />;
  if (pathname === DETAILS_PATH) return <PropertyDetailsPage />;
  return pathname === REGISTER_PATH ? <RegisterPage /> : <HomePage />;
}

export default App;
