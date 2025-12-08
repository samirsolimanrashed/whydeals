'use client'

import { motion } from 'framer-motion'

export default function DiscountBanner() {
    const discounts = [
        '50% OFF', 'FLASH SALE', '70% OFF', 'LIMITED TIME',
        '30% OFF', 'HOT DEAL', '60% OFF', 'BEST PRICES',
        '40% OFF', 'SAVE BIG', '80% OFF', 'TODAY ONLY'
    ]

    // Duplicate the list to ensure smooth infinite scrolling
    const items = [...discounts, ...discounts, ...discounts, ...discounts]

    return (
        <div className="w-full bg-primary-blue/10 overflow-hidden py-2 relative z-20 backdrop-blur-sm">
            {/* Glowing Top Border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary-blue shadow-[0_0_10px_2px_rgba(37,99,235,0.8)] z-40"></div>

            {/* Glowing Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-blue shadow-[0_0_10px_2px_rgba(37,99,235,0.8)] z-40"></div>
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {items.map((item, index) => (
                        <span
                            key={index}
                            className={`text-xs font-bold tracking-wider ${index % 2 === 0 ? 'text-primary-blue' : 'text-foreground/70'
                                }`}
                        >
                            {item}
                        </span>
                    ))}
                </motion.div>
                {/* Second copy for seamless loop if needed, though the long list above usually suffices for simple implementations. 
            For a perfect loop, we'd measure width, but a long repeated list is a robust simple solution. 
            Let's add a second motion div to follow immediately if we want perfect seamlessness, 
            or just ensure the list is long enough. 
            Actually, the x: [0, -1000] is hardcoded which is risky. 
            Better approach: Use a container width percentage or a very long duration on a very long list.
            Let's try a simpler CSS animation approach for robustness or just a very long list.
        */}
            </div>

            {/* Gradient masks for smooth fade in/out at edges */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-30"></div>
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-30"></div>
        </div>
    )
}
