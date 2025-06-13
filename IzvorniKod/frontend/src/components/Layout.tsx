import React from 'react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({children}) => (
  <>
    <Header/>
    <main
      className="max-w-8xl w-8xl min-w-8xl min-h-[calc(100vh-4rem)] mx-auto flex flex-col px-4 pt-16 m-0">{children}</main>
  </>
);

export default Layout;