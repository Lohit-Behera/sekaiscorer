import { ModeToggle } from "./mode-toggle";
import Logo from "../assets/Logo.svg";

function Header() {
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
      <nav className="hidden md:flex justify-between space-x-2">
        <div className="w-full flex justify-between">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
