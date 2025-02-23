import React, { useState, useEffect } from "react";
import { Calendar, Music, Trophy, Building, Search, ArrowRight } from "lucide-react";
import "./Home.css";

const EventCard = ({ icon: Icon, title, description }) => (
  <div className="event-card">
    <Icon className="event-icon" />
    <h3 className="event-title">{title}</h3>
    <p className="event-description">{description}</p>
    <button className="event-btn">
      Explore <ArrowRight className="arrow-icon" />
    </button>
  </div>
);

const Typewriter = ({ texts, speed = 100 }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const currentText = texts[index];

    if (!reverse) {
      if (text.length < currentText.length) {
        setTimeout(() => setText(currentText.substring(0, text.length + 1)), speed);
      } else {
        setTimeout(() => setReverse(true), 2000);
      }
    } else {
      if (text.length > 0) {
        setTimeout(() => setText(text.substring(0, text.length - 1)), speed / 2);
      } else {
        setReverse(false);
        setIndex((index + 1) % texts.length);
      }
    }
  }, [text, reverse, index, texts, speed]);

  return <p className="hero-typed">{text} <span className="cursor">|</span></p>;
};

const SearchBar = () => (
  <div className="flex items-center w-full mt-8">
    <Search className="h-6 w-6 text-blue-400 mr-4" />
    <input
      type="text"
      placeholder="Search for events, concerts, or hotels..."
      className="w-full py-4 px-6 bg-white/10 border border-blue-500/20 text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all rounded-lg"
    />
  </div>
);

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Mavericks Bookers</h1>
        <p className="hero-subtitle">Discover & book your next adventure — from live concerts to exclusive hotel stays!</p>
        <Typewriter texts={["Find concerts near you!", "Book your next hotel!", "Plan your sports experience!"]} />
        <SearchBar />
      </section>

      {/* Categories */}
      <section className="categories">
        <h2 className="section-title">Explore Categories</h2>
        <div className="event-grid">
          <EventCard icon={Music} title="Concerts & Shows" description="Experience live music and performances from top artists." />
          <EventCard icon={Trophy} title="Sports Events" description="Get tickets to the biggest sports events of the season." />
          <EventCard icon={Building} title="Hotel Bookings" description="Find the perfect accommodations at the best prices." />
        </div>
      </section>

      {/* Featured Events Section */}
<section className="featured-events">
  <h2 className="section-title">Upcoming Featured Events</h2>
  <div className="featured-grid">
    <div className="featured-card">
      <h3>Rock Concert - Live Nation</h3>
      <p>Experience an unforgettable night of rock music with top bands!</p>
      <button className="featured-btn">Learn More</button>
    </div>
    <div className="featured-card">
      <h3>Champions League Finals</h3>
      <p>Get your tickets for the biggest football event of the year!</p>
      <button className="featured-btn">Book Now</button>
    </div>
    <div className="featured-card">
      <h3>Luxury Staycation</h3>
      <p>Book your luxury hotel experience at unbeatable prices.</p>
      <button className="featured-btn">Explore Deals</button>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-black text-center py-10 mt-8 w-full">
        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} Mavericks Bookers. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
