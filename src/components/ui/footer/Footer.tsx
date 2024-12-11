import React from "react";

interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-sm">
          <span>© 2024 My App. All rights reserved.</span>
        </div>
        <div>
          <ul className="flex space-x-6">
            <li>
              <a href="https://twitter.com" className="hover:text-blue-400">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://facebook.com" className="hover:text-blue-600">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" className="hover:text-blue-800">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
