import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavItem {
  id: string;
  name: string;
  link: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ navItems = [] }) => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string>("");
  const [currentRoute, setCurrentRoute] = useState<string>("");

  useEffect(() => {
    setActiveLink(currentRoute || location.pathname);
  }, [currentRoute]);

  return (
    <nav className="flex justify-between items-center bg-gray-900 p-4 text-white">
      <h1 className="text-xl font-bold">My Blog</h1>
      <ul className="flex space-x-4">
        {navItems?.map((item) => (
          <li key={item.id}>
            <Link
              href={item.link}
              onClick={() => setCurrentRoute(item.link)}
              className={`${
                activeLink === item.link ? "text-blue-400 font-bold" : ""
              } hover:text-blue-400 transition duration-300`}
            >
              {item.name ?? ""}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
