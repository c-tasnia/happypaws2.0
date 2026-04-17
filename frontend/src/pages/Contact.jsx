import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const Logo = '/LOGO1.png'
const TEAL = '#1a6b5c'

const [showChat, setShowChat] = useState(false);
const [chatMessages, setChatMessages] = useState([
  { role: "assistant", content: "Hi! I'm the HappyPaws assistant 🐾 Ask me about adoptions, donations, or volunteering!" }
]);
const [chatInput, setChatInput] = useState("");
const [chatLoading, setChatLoading] = useState(false);

const Contact = () => {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        form
      );

      console.log("Sent:", res.data);

      alert("Message sent successfully");

      setForm({ name: "", email: "", message: "" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleChatSend = async () => {
  if (!chatInput.trim() || chatLoading) return;

  const userMessage = { role: "user", content: chatInput };
  const updatedMessages = [...chatMessages, userMessage];

  setChatMessages(updatedMessages);
  setChatInput("");
  setChatLoading(true);

  try {
    const res = await axios.post(`${API}/api/chat`, {
      messages: updatedMessages.filter(m => m.role !== "assistant" || updatedMessages.indexOf(m) > 0)
    });

    setChatMessages([...updatedMessages, { role: "assistant", content: res.data.reply }]);
  } catch (err) {
    setChatMessages([...updatedMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again!" }]);
  } finally {
    setChatLoading(false);
  }
};

  return (
    <div className="bg-[#f8f7f4] text-[#2c2b28] font-sans">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-10 flex items-center justify-between h-16">
        <Link to="/" style={{ flexShrink: 0 }}>
          <img src={Logo} alt="HappyPaws" style={{ height: '44px', objectFit: 'contain' }} />
        </Link>

        <ul className="flex gap-8 text-sm text-gray-600">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/pets">Our Pets</Link></li>
          <li><Link to="/donations">Donate</Link></li>
          <li><Link to="/volunteer">Volunteer</Link></li>
          <li><Link to="/blogs">Blog</Link></li>
          <li><Link to="/contact" className="text-[#2c6e5a] font-medium">Contact</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>tc@gmail.com</span>
          <button className="border border-[#2c6e5a] px-4 py-1 rounded-md text-[#2c6e5a] hover:bg-[#2c6e5a] hover:text-white transition">
            Logout
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center py-16 px-6">
        <div className="text-xs tracking-[0.18em] text-[#2c6e5a] uppercase mb-4">
          Get in touch
        </div>
        <h1 className="text-5xl font-serif font-semibold mb-4 leading-tight">
          We'd love to hear <br />
          <em>from you</em>
        </h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          Have a question about adoption, donations, or volunteering? Reach out — our team is happy to help.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto px-6">
        
        {/* Phone */}
        <div className="bg-[#e8f5f0] border border-[#c5e8dc] rounded-2xl p-8 text-center hover:shadow-lg transition">
          <div className="w-12 h-12 bg-[#c5e8dc] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            📞
          </div>
          <h3 className="font-serif font-semibold mb-2">Phone</h3>
          <p className="text-sm text-gray-600 mb-3">
            We're available during office hours for any inquiries.
          </p>
          <a href="tel:+8801700000000" className="text-[#2c6e5a] font-medium">
            +880 1700-000000
          </a>
        </div>

        {/* Email */}
        <div className="bg-[#fef3ec] border border-[#f8d9c1] rounded-2xl p-8 text-center hover:shadow-lg transition">
          <div className="w-12 h-12 bg-[#f8d9c1] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            ✉️
          </div>
          <h3 className="font-serif font-semibold mb-2">Email</h3>
          <p className="text-sm text-gray-600 mb-3">
            Drop us a message and we'll reply within 24 hours.
          </p>

          {/* CHANGED HERE */}
          <button
            onClick={() => setShowModal(true)}
            className="text-[#2c6e5a] font-medium"
          >
            hello@happypaws.org
          </button>
        </div>

        {/* Location */}
        <div className="bg-[#f2f0fb] border border-[#dcd8f5] rounded-2xl p-8 text-center hover:shadow-lg transition">
          <div className="w-12 h-12 bg-[#dcd8f5] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            📍
          </div>
          <h3 className="font-serif font-semibold mb-2">Location</h3>
          <p className="text-sm text-gray-600">
            123 Shelter Lane <br />
            Chattogram 1207, Bangladesh
          </p>
        </div>
      </div>

      {/* EMAIL STRIP */}
      <div className="bg-[#fef8f3] border-y text-center py-6 mt-10">
        <p className="text-sm text-gray-500 mb-2">
          <strong className="text-gray-700">Prefer to write?</strong> Send us an email anytime.
        </p>

        {/* CHANGED HERE */}
        <button
          onClick={() => setShowModal(true)}
          className="text-[#2c6e5a] font-medium border-b border-[#2c6e5a]/30 hover:border-[#2c6e5a]"
        >
          hello@happypaws.org
        </button>
      </div>

      {/* MAP */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="h-48 bg-[#e8f0e8] flex items-center justify-center">
            📍 Happy Paws Shelter
          </div>

          <div className="flex justify-between items-center p-6">
            <div className="text-sm text-gray-700">
              <strong className="block text-black mb-1">
                Happy Paws Animal Shelter
              </strong>
              123 Shelter Lane, Chattogram 1207, Bangladesh
            </div>

            <button className="bg-[#2c6e5a] text-white px-5 py-2 rounded-lg hover:bg-[#245c4b] transition">
              Get directions →
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative shadow-lg">

      {/* Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-4 text-xl text-gray-400 hover:text-black"
      >
        ×
      </button>

      <h2 className="text-xl font-serif font-semibold mb-4">
        Send us a message
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e5a]"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e5a]"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Your Message"
          rows="4"
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e5a]"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="bg-[#2c6e5a] text-white py-2 rounded-lg hover:bg-[#245c4b] transition"
        >
          Send Message
        </button>
      </form>

    </div>
  </div>
)}

{/* Floating Chat Button */}
<button
  onClick={() => setShowChat(!showChat)}
  className="fixed bottom-6 right-6 w-14 h-14 bg-[#2c6e5a] text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
>
  💬
</button>

{/* Chat Window */}
{showChat && (
  <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border z-50 flex flex-col overflow-hidden">

    {/* Header */}
    <div className="bg-[#2c6e5a] text-white px-4 py-3 flex items-center gap-3">
      <span className="text-xl">🐾</span>
      <div>
        <p className="font-semibold text-sm">HappyPaws Assistant</p>
        <p className="text-xs opacity-80">Ask me anything</p>
      </div>
      <button onClick={() => setShowChat(false)} className="ml-auto text-white/70 hover:text-white text-xl">
        ×
      </button>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f8f7f4] max-h-72">
      {chatMessages.map((msg, i) => (
        <div
          key={i}
          className={`text-sm px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${
            msg.role === "assistant"
              ? "bg-white border self-start rounded-tl-sm"
              : "bg-[#2c6e5a] text-white self-end rounded-tr-sm"
          }`}
        >
          {msg.content}
        </div>
      ))}
      {chatLoading && (
        <div className="text-xs text-gray-400 self-start px-3 py-2">Typing...</div>
      )}
    </div>

    {/* Input */}
    <div className="flex gap-2 p-3 border-t bg-white">
      <input
        type="text"
        className="flex-1 text-sm border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c6e5a]"
        placeholder="Type a message..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
      />
      <button
        onClick={handleChatSend}
        disabled={chatLoading}
        className="bg-[#2c6e5a] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#245c4b] disabled:opacity-50"
      >
        →
      </button>
    </div>

  </div>
)}

    </div>
  );
};

export default Contact;