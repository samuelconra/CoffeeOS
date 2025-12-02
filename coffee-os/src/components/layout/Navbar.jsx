import { useAuth } from "../../hooks/useAuth";
import NavbarLink from "./NavBarLink";
import { Coffee, Map, Leaf, LogOut } from "lucide-react";

function Navbar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-gray-900" />
            <h1 className="text-gray-900">CoffeeOS</h1>
          </div>

          <div className="flex items-center gap-1">
            <NavbarLink name="Map" route="" icon={Map} />
            <NavbarLink name="Bean Origins" route="bean-origins" icon={Leaf} />
            <div className="ml-2 pl-2 border-l border-gray-200/60">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
