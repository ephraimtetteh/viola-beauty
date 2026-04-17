const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-[#e8d9cc] rounded-2xl p-5 ${className}`}
  >
    {children}
  </div>
);

export default Card;
