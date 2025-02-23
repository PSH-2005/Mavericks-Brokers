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
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
      >
        Explore <ArrowRight className="ml-2 h-4 w-4" />
      </motion.button>
    </div>
  </motion.div>
);

const FeaturedEvent = ({ title, date, location, imagePath }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative h-96 rounded-2xl overflow-hidden"
  >
    <img src={imagePath} alt={title} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-white mb-2"
      >
        {title}
      </motion.h2>
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
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
  >
    <input
      type="text"
      placeholder="Search for events, concerts, or hotels..."
      className="w-full py-4 pl-12 pr-4 bg-white/10 backdrop-blur-lg border border-blue-500/20 
      text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all"
    />
  </motion.div>
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
            className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
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
    </div>
  );
};

export default Home;
