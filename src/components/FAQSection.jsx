function FAQSection() {
  const faqs = [
    {
      question: "Are internships online or in-person?",
      answer: "✓ We offer both In-person and Online internships.",
      color: "from-rose-400 to-pink-500",
      textColor: "from-rose-600 to-pink-600",
      borderColor: "border-rose-100",
      delay: "0s"
    },
    {
      question: "Can international students join?",
      answer: "✓ Of course! We welcome all students.",
      color: "from-indigo-400 to-purple-500",
      textColor: "from-indigo-600 to-purple-600",
      borderColor: "border-indigo-100",
      delay: "0.1s"
    },
    {
      question: "Do I get a certificate?",
      answer: "✓ Yes, you will be provided a certificate upon completion.",
      color: "from-cyan-400 to-blue-500",
      textColor: "from-cyan-600 to-blue-600",
      borderColor: "border-cyan-100",
      delay: "0.2s"
    },
    {
      question: "How can I become a mentor?",
      answer: (
        <>
          ✓ Get in contact at{' '}
          <a 
            href="https://wa.me/923290045694" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-600 hover:text-cyan-500 underline font-semibold transition-colors duration-300"
          >
            +92 329 004 5694
          </a>
        </>
      ),
      color: "from-violet-400 to-fuchsia-500",
      textColor: "from-violet-600 to-fuchsia-600",
      borderColor: "border-purple-100",
      delay: "0.3s"
    }
  ]

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 py-16 sm:py-20 lg:py-24" 
      id="faq"
      style={{
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(147, 197, 253, 0.2) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(196, 181, 253, 0.2) 0%, transparent 50%)'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Got questions? We've got answers!
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`card-hover rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-sm shadow-xl animate-slide-up border-2 ${faq.borderColor}`}
              style={{ animationDelay: faq.delay }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${faq.color} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                  <i className="fas fa-question text-white text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${faq.textColor} bg-clip-text text-transparent mb-3`}>
                    {faq.question}
                  </h3>
                  <p className="text-lg text-emerald-700 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection

