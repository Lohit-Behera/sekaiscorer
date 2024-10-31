import { ModeToggle } from "./mode-toggle";
import Logo from "../assets/Logo.svg";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
      <nav className="hidden md:flex justify-between space-x-2">
        <div className="w-full flex justify-between">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <div className="flex space-x-2">
            <NavLink to="/" className=" my-auto">
              {({ isActive }) => (
                <span
                  className={`flex items-center font-semibold hover:text-muted-foreground duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground/80"
                  }`}
                >
                  Home
                </span>
              )}
            </NavLink>
            <NavLink to="/create/quiz" className=" my-auto">
              {({ isActive }) => (
                <span
                  className={`flex items-center font-semibold hover:text-muted-foreground duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground/80"
                  }`}
                >
                  Create Quiz
                </span>
              )}
            </NavLink>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
