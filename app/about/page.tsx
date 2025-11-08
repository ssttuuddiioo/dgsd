"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Mission Section */}
      <MissionSection />
      
      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection />
      
      {/* Spacer */}
      <div className="h-screen" />
    </div>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <div className="text-center px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
        >
          Adaptive<br />Research<br />Projects
        </motion.h1>
      </div>
    </motion.section>
  );
}

function MissionSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="relative min-h-screen bg-black py-32">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Collective Mission */}
        <div className="mb-64">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-16"
          >
            Collective Mission
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl text-xl md:text-3xl leading-relaxed text-gray-300 space-y-8"
          >
            <p>
              We pool resources to move ideas from concept to reality.
              Constraints are design material. We publish process—failures
              teach. We build things that bend instead of break.
            </p>
            <p>
              Local expertise drives design. Client work funds research. We keep
              multiple deployment routes open. We share tools and credit
              collaborators. We choose materials carefully.
            </p>
            <p>
              We measure by shipping, helping, lasting. When blocked, we find
              another way.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HorizontalScrollSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-16 md:gap-32 px-8 md:px-16">
          {thoughts.map((thought, index) => (
            <div
              key={thought.title}
              className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="text-6xl md:text-8xl font-bold mb-8 text-gray-700">
                  0{index + 1}
                </div>
                <h3 className="text-4xl md:text-6xl font-bold mb-6">
                  {thought.title}
                </h3>
                <p className="text-xl md:text-2xl text-gray-400 max-w-lg">
                  {thought.description}
                </p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const thoughts = [
  {
    title: "Real-world first:",
    description: "functional, buildable, maintainable",
  },
  {
    title: "Show the work:",
    description: "including failures",
  },
  {
    title: "Multiple paths:",
    description: "to completion",
  },
  {
    title: "Independent work:",
    description: "shared visions",
  },
  {
    title: "Remove barriers:",
    description: "to access",
  },
  {
    title: "Ship small:",
    description: "ship often",
  },
];
