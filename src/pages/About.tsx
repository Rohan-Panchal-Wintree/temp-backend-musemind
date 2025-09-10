import { Navbar } from "@/components/Navbar";
import React from "react";

function About() {
  return (
    <>
      <Navbar />
      {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center pt-32 px-6 py-16 space-y-24"> */}
      <div className="min-h-screen bg-black flex flex-col items-center pt-32 px-6 py-16 space-y-24">
        {/* 1. Hero Section */}
        <section className="max-w-5xl text-center text-white">
          <h1 className="text-5xl font-bold mb-6">About Musemind Music</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We transform creativity and technology into sound. Musemind Music is
            a music generation service built to empower artists, brands, and
            creators to craft unique soundscapes with ease. Our mission is to
            make professional-quality music accessible to everyone.
          </p>
        </section>

        {/* 2. Mission & Vision */}
        <section className="max-w-6xl grid md:grid-cols-2 gap-10">
          <div className="bg-white shadow-md rounded-2xl p-10 hover:shadow-lg transition">
            <h3 className="text-3xl font-semibold mb-4 text-blue-600">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide cutting-edge music generation tools that combine
              artistic creativity with advanced technology, helping creators
              bring their visions to life.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-10 hover:shadow-lg transition">
            <h3 className="text-3xl font-semibold mb-4 text-blue-600">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To be the world’s go-to platform for personalized, AI-driven music
              creation that inspires and connects people across cultures.
            </p>
          </div>
        </section>

        {/* 3. Core Values */}
        <section className="max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-10 text-gray-800">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation in Sound",
                desc: "We constantly explore new ways to merge creativity with technology for unique music experiences.",
              },
              {
                title: "Accessibility",
                desc: "Music should be for everyone. Our tools make professional sound creation easy and affordable.",
              },
              {
                title: "Collaboration",
                desc: "We work hand-in-hand with artists and brands to ensure music fits their identity.",
              },
              {
                title: "Adaptability",
                desc: "Trends change, but music lasts forever. We evolve with culture and technology.",
              },
              {
                title: "Excellence",
                desc: "We deliver high-quality sound designed to inspire and engage audiences.",
              },
              {
                title: "Human-Centered Creativity",
                desc: "Behind every note is a person. We keep people at the core of every composition.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-10 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Style",
                desc: "Pick from genres, moods, and instruments.",
              },
              {
                step: "02",
                title: "Customize",
                desc: "Adjust tempo, tone, and layers to fit your vision.",
              },
              {
                step: "03",
                title: "Generate",
                desc: "Our AI blends creativity and algorithms to craft unique music.",
              },
              {
                step: "04",
                title: "Download & Share",
                desc: "Get high-quality audio files ready for projects, streaming, or branding.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="text-blue-600 text-3xl font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section className="max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-10 text-gray-800">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "AI + Human Creativity",
                desc: "Our technology enhances—not replaces—human artistry.",
              },
              {
                title: "Fast & Scalable",
                desc: "Generate music in seconds, whether you need 1 track or 100.",
              },
              {
                title: "Custom for You",
                desc: "From ads to films, gaming to personal projects, we tailor music to your needs.",
              },
            ].map((point, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {point.title}
                </h3>
                <p className="text-gray-600">{point.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Call to Action */}
        <section className="bg-blue-600 text-white rounded-2xl shadow-lg p-12 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            Let’s Compose the Future Together
          </h2>
          <p className="mb-6 text-lg">
            Join thousands of creators already shaping the sound of tomorrow
            with Musemind Music. Whether you’re an artist, filmmaker, or brand —
            the future of music starts here.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
            Get Started
          </button>
        </section>
      </div>
    </>
  );
}

export default About;
