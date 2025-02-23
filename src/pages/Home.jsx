import React from "react";
import { motion } from "framer-motion";
import { Calendar, Music, Trophy, Building, Search, ArrowRight } from "lucide-react";
import "./Pages.css";

const EventCard = ({ icon: Icon, title, description, imagePath }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
  >
    <div className="h-48 relative">
      <img 
        src={`/api/placeholder/400/300`} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <Icon className="absolute top-4 left-4 text-blue-400 h-8 w-8" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-blue-200 mb-4">{description}</p>
      <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
        Explore <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const FeaturedEvent = ({ title, date, location, imagePath }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative h-96 rounded-2xl overflow-hidden"
  >
    <img 
      src={`data:image/jpeg;base64,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`}
      alt={title} 
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <div className="flex items-center text-blue-200 space-x-4">
        <Calendar className="h-5 w-5" />
        <span>{date}</span>
        <span>•</span>
        <span>{location}</span>
      </div>
    </div>
  </motion.div>
);

const SearchBar = () => (
  <div className="relative max-w-2xl mx-auto">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
    <input
      type="text"
      placeholder="Search for events, concerts, or hotels..."
      className="w-full py-4 pl-12 pr-4 bg-white/10 backdrop-blur-lg rounded-full border border-blue-500/20 
      text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all"
    />
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
        </div>
        <div className="relative text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Welcome to Mavericks Bookers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-200 mb-12"
          >
            Your gateway to unforgettable experiences - concerts, sports events, and luxurious stays
          </motion.p>
          <SearchBar />
        </div>
      </section>

      {/* Featured Event */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured Event</h2>
        <FeaturedEvent
          title="International Music Festival 2025"
          date="March 15-17, 2025"
          location="Cosmic Arena, Metropolis"
        />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard
            icon={Music}
            title="Concerts & Shows"
            description="Experience live music and performances from top artists around the world"
          />
          <EventCard
            icon={Trophy}
            title="Sports Events"
            description="Get tickets to the biggest games and sporting events of the season"
          />
          <EventCard
            icon={Building}
            title="Hotel Bookings"
            description="Find perfect accommodations for your stay at the best prices"
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-900/30 backdrop-blur-lg rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-200 mb-6">Get notified about upcoming events and exclusive offers</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white/10 rounded-l-lg border border-blue-500/20 
              text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
            />
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-r-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;