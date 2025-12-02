import { NavLink } from "react-router-dom";

function NavLinkPage({ name, route, icon: Icon }) {
  return (
    <NavLink
      to={`/${route}`}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {Icon && <Icon className="size-4" />}
      <span>{name}</span>
    </NavLink>
  );
}

export default NavLinkPage;
