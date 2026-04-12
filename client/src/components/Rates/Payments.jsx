import { motion } from "framer-motion";
import { Copy } from "lucide-react";

const PaymentDetails =( ) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <div className="space-y-6">
            <h3 className="text-sm tracking-widest text-[#7c5546] uppercase">
              Payments
            </h3>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Seamless & Secure <span className="text-[#7c5546]">Payments</span>
            </h1>

            <p className="text-gray-500 max-w-md">
              Choose your preferred payment method and complete your booking with ease.
              We offer secure bank transfers and mobile money options tailored for your convenience.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* MOBILE MONEY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-4">Mobile Money</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium">Vodafone Cash</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Account Name</span>
                  <span className="font-medium">Vincentia Ocloo</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">+233209060256</span>
                    <button onClick={() => copyToClipboard('+233209060256')}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BANK DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-4">Bank Transfer</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Name</span>
                  <span className="font-medium">Viola Gem Beauty</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Bank</span>
                  <span className="font-medium">Stanbic Bank Ghana</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">9040009282585</span>
                    <button onClick={() => copyToClipboard('9040009282585')}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Branch</span>
                  <span className="font-medium">East Legon</span>
                </div>
              </div>
            </motion.div>

            {/* CONTACT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-2xl bg-amber-50 border border-amber-100"
            >
              <h2 className="text-lg font-semibold mb-3">Need Help?</h2>
              <p className="text-sm text-gray-600">
                Phone: +233209060256 <br />
                Email: violabeauty@gmail.com
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}


export default PaymentDetails