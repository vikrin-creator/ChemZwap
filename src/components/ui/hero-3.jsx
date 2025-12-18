"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Props interface for the component
// interface AnimatedMarqueeHeroProps {
//   tagline: string;
//   title: React.ReactNode;
//   description: string;
//   ctaText: string;
//   ctaLink?: string;
//   images: string[];
//   className?: string;
// }

// Reusable Button component styled like in the image
const ActionButton = ({ children, onClick, href }) => {
    const ButtonContent = (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-lg transition-all hover:shadow-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
        >
            {children}
        </motion.button>
    );

    if (href) {
        return <a href={href}>{ButtonContent}</a>;
    }

    return ButtonContent;
};

// The main hero component
export const AnimatedMarqueeHero = ({
    tagline,
    title,
    description,
    ctaText,
    ctaLink,
    images,
    className,
}) => {
    // Animation variants for the text content
    const FADE_IN_ANIMATION_VARIANTS = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    // Duplicate images for a seamless loop
    const duplicatedImages = [...images, ...images];

    return (
        <section
            className={cn(
                "relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 flex flex-col items-center justify-center text-center px-4 py-20",
                className
            )}
        >
            <div className="z-10 flex flex-col items-center max-w-5xl mx-auto">
                {/* Tagline */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    className="mb-6 inline-block rounded-full border-2 border-primary-300 bg-white/80 px-6 py-2 text-sm font-medium text-primary-700 backdrop-blur-sm shadow-sm"
                >
                    {tagline}
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 font-['Outfit']"
                >
                    {typeof title === 'string' ? (
                        title.split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                variants={FADE_IN_ANIMATION_VARIANTS}
                                className="inline-block"
                            >
                                {word}&nbsp;
                            </motion.span>
                        ))
                    ) : (
                        title
                    )}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    transition={{ delay: 0.5 }}
                    className="mt-6 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed"
                >
                    {description}
                </motion.p>

                {/* Call to Action Button */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    transition={{ delay: 0.6 }}
                >
                    <ActionButton href={ctaLink}>{ctaText}</ActionButton>
                </motion.div>
            </div>

            {/* Animated Image Marquee */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: ["-50%", "0%"],
                        transition: {
                            ease: "linear",
                            duration: 40,
                            repeat: Infinity,
                        },
                    }}
                >
                    {duplicatedImages.map((src, index) => (
                        <div
                            key={index}
                            className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
                            style={{
                                rotate: `${(index % 2 === 0 ? -2 : 2)}deg`,
                            }}
                        >
                            <img
                                src={src}
                                alt={`Showcase image ${index + 1}`}
                                className="w-full h-full object-cover rounded-2xl shadow-lg"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
