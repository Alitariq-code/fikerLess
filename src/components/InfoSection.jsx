function InfoSection() {
  return (
    <section className="bg-blue-900 px-6 py-12">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-2xl lg:text-3xl font-semibold text-white leading-relaxed fade-in">
          Here you can browse our experts and see which Internship best suits your goals.
        </h2>
        <p className="text-xl text-blue-100 fade-in-delay-1">
          To secure a place, contact FikrLess on{' '}
          <a 
            href="mailto:fikrless01@gmail.com" 
            className="text-cyan-300 hover:text-cyan-200 underline transition-colors duration-300"
          >
            fikrless01@gmail.com
          </a>{' '}
          with your details and selected Mentor and Internship Option.
        </p>
      </div>
    </section>
  )
}

export default InfoSection

