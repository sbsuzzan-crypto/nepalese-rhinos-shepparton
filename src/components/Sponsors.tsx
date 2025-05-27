
const Sponsors = () => {
  const sponsors = [
    { name: "Shepparton Sports Store", category: "Major Sponsor" },
    { name: "Nepal Restaurant Shepparton", category: "Gold Sponsor" },
    { name: "Goulburn Valley Immigration", category: "Silver Sponsor" },
    { name: "ABC Plumbing Services", category: "Bronze Sponsor" },
    { name: "Victory Real Estate", category: "Bronze Sponsor" },
    { name: "Shepparton Auto Parts", category: "Community Partner" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Our Sponsors</h2>
            <p className="text-rhino-gray text-lg">
              We're grateful for the support of our local business community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-20 h-20 bg-rhino-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {sponsor.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-rhino-blue mb-2">{sponsor.name}</h3>
                <span className="inline-block bg-rhino-red text-white px-3 py-1 rounded-full text-sm">
                  {sponsor.category}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-rhino-gray mb-4">
              Interested in sponsoring Nepalese Rhinos FC?
            </p>
            <a href="#contact" className="text-rhino-red font-semibold hover:underline text-lg">
              Get in touch with us today!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
