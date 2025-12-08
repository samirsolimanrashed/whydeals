import React from 'react'

interface LogoProps {
    className?: string
    showIcon?: boolean
}

export default function Logo({ className = '', showIcon = true }: LogoProps) {
    return (
        <svg
            viewBox="0 0 240 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Why Deals Logo"
        >
            {/* Text: WhyDeals - Bold Rounded Font approximation using SVG paths or text with specific font */}
            {/* Using text element with system rounded font stack */}
            <text
                x="0"
                y="42"
                fontFamily="Diatype, ABCDiatype, Inter, Helvetica Neue, Arial, sans-serif"
                fontWeight="900"
                fontSize="40"
                className="fill-black dark:fill-white transition-colors duration-300"
                style={{ letterSpacing: '-0.5px' }}
            >
                WhyDeals
            </text>

            {/* Icon: Stylized Price Tag */}
            {showIcon && (
                <g transform="translate(190, 10) scale(1.4)">
                    <path
                        d="M21 4H8L3 12L8 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
                        className="stroke-black dark:stroke-white transition-colors duration-300"
                        strokeWidth="2"
                        fill="none"
                    />
                    <circle cx="8" cy="12" r="1.5" className="fill-black dark:fill-white transition-colors duration-300" />
                </g>
            )}
        </svg>
    )
}
