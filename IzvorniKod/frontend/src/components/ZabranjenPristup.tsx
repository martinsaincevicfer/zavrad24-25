import React from 'react';
import Header from "./Header.tsx";

const ZabranjenPristup: React.FC = () => {
  return (
    <>
      <Header/>
      <div className="container max-w-8xl mx-auto flex flex-col items-center min-h-3/4">
        <div>
          <h2 className="">Zabranjen pristup!</h2>
          <p>Nemate dozvolu pristupa ovoj stranici.</p>
        </div>
      </div>
    </>
  );
};

export default ZabranjenPristup;