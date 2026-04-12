import React from 'react'

const Button = ({text, onClick, className}) => {
  return (
    <div>
      <a
        href="/book-us"
        className={` ${className} hidden md:block bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium transition`}
        onClick={onClick}
      >
        {text}
      </a>
    </div>
  );
}

export default Button