import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="min-h-[100vh] flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-center my-6">
        <Outlet />
        <ScrollRestoration />
      </main>
    </div>
  );
}

export default Layout;
