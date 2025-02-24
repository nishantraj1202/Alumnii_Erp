import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Building2, 
  Globe2, 
  Newspaper,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Calendar,
  Trophy,
  Heart,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=600&fit=crop",
      title: "Welcome to NIT Jalandhar Alumni Network",
      subtitle: "Connecting Generations of Excellence"
    },
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=600&fit=crop",
      title: "Building Stronger Connections",
      subtitle: "Join Our Global Community"
    },
    {
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=600&fit=crop",
      title: "Empowering Future Leaders",
      subtitle: "Share Your Success Story"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const achievements = [
    {
      number: "5,000+",
      label: "Students",
      icon: Users
    },
    {
      number: "18+",
      label: "Departments",
      icon: Building2
    },
    {
      number: "1000+",
      label: "Success Stories",
      icon: Trophy
    },
    {
      number: "58",
      label: "NIRF Ranking",
      icon: Globe2
    }
  ];

  const testimonials = [
    {
      name: "Manpreet Sharma",
      batch: "2016",
      role: "UPSC Civil Servent",
      quote: "NITJ gave me the foundation to build a successful career in tech. The alumni network has been invaluable.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxLv5BrzRQa6t8K1vgvu_85nz0Unj5EeJYtw&s"
    },
    {
      name: "Mr. Prince Kumar Singh",
      batch: "2016",
      role: "UPSC Civil Servent",
      quote: "The mentorship from alumni helped me navigate my career path. Forever grateful to the NITJ community.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNShnqxdByyvoxnwQ_uYuDTtx9gBxv8u3nzw&s"
    },
    {
      name: "Mr Preminder Singh",
      batch: "1994",
      role: "Product Engineering @APPLE",
      quote: "NITJ's product development, design validation, and manufacturing processes, ensuring high-quality standards",
      image: "https://nitj.ac.in/files/1727496858488-WhatsApp%20Image%202024-09-27%20at%205.09.53%20PM.jpeg"
    }
  ];

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: 'https://www.nitj.ac.in/admin/index.html' },
    { name: 'Contact', to: '#contact' }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserRole(token);
    }
  }, []);

  const fetchUserRole = async (token: string) => {
    try {
      const response = await fetch("https://alumnii-erp.onrender.com/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch user role");
      
      const data = await response.json();
      
      if (data?.user) {
        if(data.user.role === "admin") {
          navigate("/admin");
        } else {  
          navigate("/dashboard");
        }
      } else {
        setError("Invalid user data received");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError("Session expired. Please log in again.");
      localStorage.removeItem("token");
    }
  };

  return (
    <div>
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/src/nitj_logo.png" alt="NITJ Logo" className="h-10 w-10" />
                <span className="text-xl font-bold text-gray-900">NITJ Alumni</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  //@ts-ignore
                  to={item.path}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  //@ts-ignore
                  to={item.path}
                  className="block py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Add margin-top to account for fixed header */}
        <div className="pt-8">
          {/* Hero Slider */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl mx-4 sm:mx-10 md:mx-20">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="h-full flex flex-col justify-center items-center text-center text-white px-4 sm:px-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-slide-up">{slide.title}</h1>
                  <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 animate-slide-up">{slide.subtitle}</p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
                    <Link
                      to="/login"
                      className="bg-[#1a237e] hover:bg-[#283593] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white hover:bg-gray-100 text-[#1a237e] px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            </div>
            {/* Slide indicators */}
            <div className=" absolute bottom-4 sm:bottom-6 sm:pb-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>  
        </div>
          {/* Achievement Numbers */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-6 px-4 sm:py-10 sm:px-8 max-sm:mx-2 sm:mx-10 md:mx-20 rounded-2xl shadow-xl">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className="text-center text-white p-2 sm:p-6 transform hover:scale-105 transition-transform duration-300"
                  >
                    <achievement.icon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 animate-float" />
                    <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{achievement.number}</div>
                    <div className="text-indigo-200 text-xs sm:text-base">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-20 max-sm:max-w-screen-lg max-sm:w-full max-sm:mx-auto max-sm:px-4">
        {[
            {
              icon: <GraduationCap className="h-6 w-6 text-[#1a237e]" />,
              title: "Digital Certificates",
              description: "Secure and verifiable digital certificates for all alumni"
            },
            {
              icon: <Users className="h-6 w-6 text-[#1a237e]" />,
              title: "Alumni Network",
              description: "Connect with fellow alumni and expand your professional network"
            },
            {
              icon: <Award className="h-6 w-6 text-[#1a237e]" />,
              title: "Achievements",
              description: "Showcase and celebrate alumni achievements and success stories"
            },
            {
              icon: <BookOpen className="h-6 w-6 text-[#1a237e]" />,
              title: "Resources",
              description: "Access exclusive resources and opportunities for alumni"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-[#1a237e]/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-sm:max-w-screen-lg max-sm:w-full max-sm:mx-auto max-sm:px-4 bg-white rounded-2xl shadow-xl p-8 m-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Alumni Success Stories</h2>
          <div className="grid grid-cols-1 max-w-8xl md:grid-cols-3 gap-8 max-w-8xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">Batch of {testimonial.batch}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                <p className="text-sm text-indigo-600 font-medium">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden m-20 max-w-screen-lg w-full mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-[#1a237e]">About NIT Jalandhar</h2>
              <p className="text-gray-600 mb-6">
                Dr B R Ambedkar National Institute of Technology Jalandhar is one of the thirty-one NITs of the country. 
                The institute was established in the year 1987 as Regional Engineering College and was given the status of 
                National Institute of Technology in 2002.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <Building2 className="h-8 w-8 text-[#1a237e] mx-auto mb-2" />
                  <div className="font-bold text-xl text-[#1a237e]">1987</div>
                  <div className="text-sm text-gray-600">Established</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <Building2 className="h-8 w-8 text-[#1a237e] mx-auto mb-2" />
                  <div className="font-bold text-xl text-[#1a237e]">18+</div>
                  <div className="text-sm text-gray-600">Departments</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <Users className="h-8 w-8 text-[#1a237e] mx-auto mb-2" />
                  <div className="font-bold text-xl text-[#1a237e]">5000+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/NITJ_bldg.jpg/800px-NITJ_bldg.jpg"
                alt="Campus"
                className="absolute inset-0 w-full h-full object-cover transform hover:scale-103 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* News & Updates */}
        <div className="max-sm:max-w-screen-lg max-sm:w-full max-sm:mx-auto max-sm:px-4 bg-white rounded-2xl shadow-xl p-8 m-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a237e]">Latest Updates</h2>
            <Link to="#" className="text-[#1a237e] hover:text-[#283593] flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Annual Alumni Meet 2025",
                date: "March 15, 2025",
                description: "Join us for the grand reunion celebrating decades of excellence",
                icon: Calendar
              },
              {
                title: "New Mentorship Program",
                date: "February 28, 2025",
                description: "Connect with current students and share your industry experience",
                icon: Heart
              },
              {
                title: "Global Alumni Awards",
                date: "February 20, 2025",
                description: "Nominations open for outstanding alumni achievements",
                icon: Trophy
              }
            ].map((news, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <news.icon className="h-8 w-8 text-[#1a237e] mb-4" />
                <h3 className="font-semibold mb-2">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                <p className="text-gray-600">{news.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-14" id="contact">
          <div className="container mx-auto px-6" >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* About */}
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <GraduationCap className="h-8 w-8" />
                  <span className="text-xl font-bold">NITJ Alumni</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Connecting and empowering NITJ alumni worldwide through a vibrant and supportive community.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4" >Contact Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-400">G.T Road, Jalandhar, Punjab, India</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-400">+91 181 2690301</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-400">alumni@nitj.ac.in</span>
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button className="bg-indigo-600 px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400">© 2025 NITJ Alumni Cell. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                  <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}