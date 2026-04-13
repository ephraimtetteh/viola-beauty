import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const usePaystack = ({
  email,
  firstName,
  lastName,
  amount,
  publicKey,
  currency,
  reference,
  metadata,
  onSuccess,
  onClose,
}) => {
  return () => {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      currency,
      ref: reference,
      firstname: firstName,
      lastname: lastName,
      metadata,
      callback: (transaction) => {
        onSuccess(transaction);
      },
      onClose,
    });
    handler.openIframe();
  };
};

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { course, email, firstName, lastName } = state || {};

  const reference = useRef(`viola_${course?.id}_${Date.now()}`);

  // ── Send thank you email via backend Nodemailer ──
  const sendThankYouEmail = async (transaction) => {
    try {
      await fetch(`${API}/api/users/course-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          courseName: course.name,
          courseLevel: course.level,
          reference: transaction.reference,
        }),
      });
    } catch (err) {
      console.error("Course email failed:", err);
    }
  };

  const handleSuccess = async (transaction) => {
    await Promise.allSettled([
      // Zapier — Thinkific enrollment
      fetch(course.zapUrl, {
        method: "POST",
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          courseName: course.name,
          courseId: course.id,
          thinkificCourseId: course.thinkificId,
          reference: transaction.reference,
        }),
      }),
      // Nodemailer — thank you email
      sendThankYouEmail(transaction),
    ]);
    navigate("/success", { state: { course, firstName } });
  };

  const initializePayment = usePaystack({
    email,
    firstName,
    lastName,
    amount: course?.price,
    publicKey: "pk_live_53d3cf9af7f266671480f5f4ee22538e8d268aca",
    currency: "GHS",
    reference: reference.current,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${firstName} ${lastName}`,
        },
        {
          display_name: "Course",
          variable_name: "course_name",
          value: course?.name,
        },
      ],
    },
    onSuccess: handleSuccess,
    onClose: () => console.log("Payment closed"),
  });

  if (!course || !email) {
    navigate("/courses");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Order Summary</h2>

        <img
          src={course.image}
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.level}</p>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="text-gray-500">Total</span>
          <span className="text-xl font-bold text-[#7c5546]">
            GH₵ {(course.price / 100).toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          Name:{" "}
          <span className="text-gray-600">
            {firstName} {lastName}
          </span>
        </p>
        <p className="text-sm text-gray-400">
          Paying as: <span className="text-gray-600">{email}</span>
        </p>

        <button
          onClick={initializePayment}
          className="w-full px-6 py-3 rounded-full bg-black text-white font-medium
            hover:bg-gray-800 transition"
        >
          Pay Now
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full px-6 py-2 rounded-full border border-gray-300
            text-gray-500 text-sm hover:bg-gray-50 transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
