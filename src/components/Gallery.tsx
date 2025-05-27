
import { useState } from "react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const photos = [
    { id: 1, src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop", category: "team", alt: "Team photo" },
    { id: 2, src: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=400&h=300&fit=crop", category: "match", alt: "Match action" },
    { id: 3, src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=300&fit=crop", category: "training", alt: "Training session" },
    { id: 4, src: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop", category: "events", alt: "Community event" },
    { id: 5, src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop", category: "match", alt: "Goal celebration" },
    { id: 6, src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop", category: "team", alt: "Team huddle" },
  ];

  const categories = [
    { id: "all", name: "All Photos" },
    { id: "team", name: "Team" },
    { id: "match", name: "Match Days" },
    { id: "training", name: "Training" },
    { id: "events", name: "Events" },
  ];

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Gallery</h2>
            <p className="text-rhino-gray text-lg">Capturing the spirit of Nepalese Rhinos FC</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-rhino-red text-white"
                    : "bg-gray-100 text-rhino-gray hover:bg-rhino-blue hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-rhino-gray">
              Want to see more photos? Follow us on social media for the latest updates!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
