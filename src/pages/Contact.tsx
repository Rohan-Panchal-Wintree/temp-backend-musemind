import { Navbar } from "@/components/Navbar";
import React from "react";

function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-20 bg-gray-50 flex flex-col items-center px-6 py-16">
        {/* Hero Section */}
        <section className="max-w-4xl text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have a project in mind, questions about our music services, or just
            want to say hello? We’d love to hear from you. Let’s connect and
            create something extraordinary together.
          </p>
        </section>

        {/* Contact Form & Info */}
        <section className="grid md:grid-cols-2 gap-12 max-w-6xl w-full mb-20">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Send Us a Message
            </h2>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Contact Information
            </h2>
            <ul className="space-y-5 text-gray-600">
              <li>
                <strong className="text-gray-800">Email:</strong>{" "}
                contact@musemindmusic.com
              </li>
              <li>
                <strong className="text-gray-800">Phone:</strong> +1 (234)
                567-890
              </li>
              <li>
                <strong className="text-gray-800">Address:</strong> 123 Harmony
                Street, New York, NY
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-600 text-white rounded-2xl shadow-lg p-12 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Let’s Make Music Together</h2>
          <p className="mb-6 text-lg">
            From custom soundtracks to AI-powered music generation, our team is
            ready to bring your vision to life. Reach out today and let’s start
            collaborating.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
            Purchase Now
          </button>
        </section>
      </div>
    </>
  );
}

export default Contact;
