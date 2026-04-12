const AuthCard = ({ children }) => (
  <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 py-20">
    <div className="w-full max-w-md">
      {/* Brand mark */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-[5px] uppercase text-[#d4b86a] font-medium mb-3">
          Viola Beauty
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-[#d4b86a]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
          <div className="h-px w-8 bg-[#d4b86a]" />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-8">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthCard;
