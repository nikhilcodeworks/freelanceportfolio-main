"use client";

import { projects } from "@/data/projects";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "Full Stack", "Frontend", "AI / ML", "Python"];

const categoryColors: Record<string, string> = {
  "Full Stack": "from-blue-500 to-indigo-500",
  "Frontend": "from-pink-500 to-rose-500",
  "AI / ML": "from-purple-500 to-violet-500",
  "Python": "from-green-500 to-teal-500",
};

const categoryBadge: Record<string, string> = {
  "Full Stack": "bg-blue-100 text-blue-700",
  "Frontend": "bg-pink-100 text-pink-700",
  "AI / ML": "bg-purple-100 text-purple-700",
  "Python": "bg-green-100 text-green-700",
};

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const INITIAL_VISIBLE = 6;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate cards when filter changes
  useEffect(() => {
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
      }
    );
  }, [activeCategory, showAll]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-40 right-40 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-64 h-64 bg-indigo-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="projects-title text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            My Projects
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {projects.length} projects across full-stack, frontend, AI, and more
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const count = cat === "All"
              ? projects.length
              : projects.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:scale-105"
                  }`}
              >
                {cat}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeCategory === cat
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project, index) => {
            const gradient = categoryColors[project.category] ?? "from-gray-400 to-gray-600";
            const badge = categoryBadge[project.category] ?? "bg-gray-100 text-gray-700";
            return (
              <div
                key={`${project.github}-${index}`}
                className="project-card group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-400 hover:-translate-y-1 flex flex-col relative overflow-hidden"
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-2xl`} />

                {/* Category badge */}
                <div className="flex items-center justify-between mb-4 mt-1">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge}`}>
                    {project.category}
                  </span>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                      title="View on GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.split(", ").slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-auto">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2 bg-gradient-to-r ${gradient} text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-sm`}
                    >
                      Live Demo →
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-700 hover:bg-gray-700 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    View Code
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less */}
        {filtered.length > INITIAL_VISIBLE && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-200"
            >
              {showAll
                ? "Show Less ↑"
                : `Show All ${filtered.length} Projects ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
