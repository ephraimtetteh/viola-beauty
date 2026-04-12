import React, { useRef, useState } from 'react'
import { Phone, Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import emailjs from '@emailjs/browser'

// ─── EmailJS Configuration ────────────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// 2. Create an Email Service (Gmail, Outlook, etc.) → copy the Service ID
// 3. Create an Email Template → copy the Template ID
//    Template variables to use: {{from_name}}, {{from_email}}, {{message}}, {{to_name}}
// 4. Go to Account → API Keys → copy your Public Key
// Then replace the three placeholders below:

const EMAILJS_SERVICE_ID  = 'service_24jf9me'   
const EMAILJS_TEMPLATE_ID = 'template_zm7hgsk'  
const EMAILJS_PUBLIC_KEY  = '7_X7BAG6U_84kyg5T'  

// ─────────────────────────────────────────────────────────────────────────────

const Form = () => {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') 
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      formRef.current.reset()
      // Reset back to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      console.error('EmailJS error:', error)
      setErrorMsg(error?.text || 'Something went wrong. Please try again.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div className='pt-40 pb-20'>
      <section className="px-4 md:px-16 lg:px-24 xl:px-32 w-full">
        <p className="text-center font-medium text-white px-10 py-2 rounded-full bg-slate-950/70 border border-slate-800 w-max mx-auto">
          Contact
        </p>
        <h3 className="text-3xl font-semibold text-slate-600 text-center mx-auto mt-4">
          Reach out to us
        </h3>
        <p className="text-slate-600 text-center mt-2 max-w-md mx-auto">
          Ready to elevate your bridal experience? Let's connect and create something beautiful.
        </p>

        {/* SUPPORT CARDS */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
          {/* WHATSAPP CARD */}
          <a
            href="https://wa.me/233209060256"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">WhatsApp Us</h4>
              <p className="text-sm text-gray-500">Chat instantly with our team</p>
            </div>
          </a>

          {/* EMAIL CARD */}
          <a
            href="mailto:violabeauty@gmail.com"
            className="flex items-center gap-4 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Customer Support</h4>
              <p className="text-sm text-gray-500">violabeauty@gmail.com</p>
            </div>
          </a>
        </div>

        {/* FORM */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-500 mt-16 w-full"
        >
          <div>
            <p className="mb-2 font-medium">Your name</p>
            <div className="flex items-center pl-3 rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500">
              <input
                placeholder="Enter your name"
                className="w-full p-3 bg-transparent outline-none"
                type="text"
                name="name"   
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Email</p>
            <div className="flex items-center pl-3 rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500">
              <input
                placeholder="Enter your email"
                className="w-full p-3 bg-transparent outline-none"
                type="email"
                name="email"  
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Contact</p>
            <div className="flex items-center pl-3 rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500">
              <input
                placeholder="Enter your phone number"
                className="w-full p-3 bg-transparent outline-none"
                type="tel"
                name="phone"  
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 font-medium">Message</p>
            <textarea
              name="message"      
              rows="6"
              placeholder="Tell us about your event..."
              className="focus:border-amber-500 resize-none w-full p-3 bg-transparent outline-none rounded-lg border border-slate-300"
              required
            ></textarea>
          </div>

          {/* STATUS FEEDBACK */}
          {status === 'success' && (
            <div className="sm:col-span-2 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Message sent! We'll get back to you soon.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="sm:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-max flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white px-10 py-3 rounded-full transition"
          >
            {status === 'loading' ? (
              <>
                <Loader size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Form