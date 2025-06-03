import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full border-b p-4 bg-white dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h1>
    </header>
  );
};

export default Header;
