import NavbarLink from "./NavBarLink";
import { Coffee, Map, Leaf, LogOut } from 'lucide-react';

function Navbar () {
    return (
        <nav className="bg-white border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Coffee className="size-6 text-gray-900" />
              <h1 className="text-gray-900">CoffeeOS</h1>
            </div>
            
            <div className="flex items-center gap-1">
                <NavbarLink name="Map" route="map" icon={Coffee}/>
              
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;