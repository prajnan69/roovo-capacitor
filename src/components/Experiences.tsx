"use client";

const experiences = [
  {
    title: 'Historic City Walking Tour',
    category: 'History',
    price: 45,
    rating: 4.9,
    imageUrl: '/placeholder.svg', // Replace with actual image paths
  },
  {
    title: 'Local Cuisine Cooking Class',
    category: 'Food & Drink',
    price: 75,
    rating: 4.8,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Mountain Hiking Adventure',
    category: 'Outdoors',
    price: 90,
    rating: 4.9,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Street Art & Graffiti Workshop',
    category: 'Arts & Culture',
    price: 60,
    rating: 4.7,
    imageUrl: '/placeholder.svg',
  },
];

interface Experience {
  title: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
}

const ExperienceCard = ({ experience }: { experience: Experience }) => (
  <div className="border border-gray-800 bg-gray-900 group cursor-pointer">
    <div className="w-full h-48 bg-gray-700">
      {/* <img src={experience.imageUrl} alt={experience.title} className="w-full h-full object-cover" /> */}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{experience.category}</span>
        <span className="text-sm font-bold">{experience.rating} ★</span>
      </div>
      <h3 className="text-lg font-bold">{experience.title}</h3>
      <p className="mt-2 font-bold">${experience.price} <span className="font-normal text-gray-400">/ person</span></p>
    </div>
  </div>
);

const Experiences = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Experiences</h1>
          <p className="text-gray-400">
            Book unique activities led by local experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
