"use client"
import { usePathname } from "next/navigation";

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  const pathName = usePathname();
  const bankLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Transactions", path: "/transaction" },
  ];

  return (
    <header className="bg-black text-white p-4">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">
          <a href="/" className="hover:text-gray-300">
            My App
          </a>
        </div>
        <nav>
          <ul className="flex space-x-6">
            {bankLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className={`${
                    pathName === link.path ? "text-yellow-400" : "text-white"
                  } hover:text-yellow-400`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
