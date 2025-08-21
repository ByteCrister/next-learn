"use client";
import React from "react";
import { Twitter, Linkedin, Facebook, AtSign, Instagram } from "lucide-react";

function Footer() {
  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Solution", href: "#" },
    { name: "Customers", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Help", href: "#" },
    { name: "About", href: "#" },
  ];

  const socialIcons = [
    {
      name: "X",
      href: "#",
      svg: <Twitter className="size-6 transition-transform duration-200 hover:scale-110" />,
    },
    {
      name: "LinkedIn",
      href: "#",
      svg: <Linkedin className="size-6 transition-transform duration-200 hover:scale-110" />,
    },
    {
      name: "Facebook",
      href: "#",
      svg: <Facebook className="size-6 transition-transform duration-200 hover:scale-110" />,
    },
    {
      name: "Threads",
      href: "#",
      svg: <AtSign className="size-6 transition-transform duration-200 hover:scale-110" />,
    },
    {
      name: "Instagram",
      href: "#",
      svg: <Instagram className="size-6 transition-transform duration-200 hover:scale-110" />,
    },
    {
      name: "TikTok",
      href: "#",
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 font-inter relative overflow-hidden ">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 200 200"
            width="48"
            height="48"
            className="coolshapes flower-3 mr-3 drop-shadow-lg"
          >
            <g clipPath="url(#cs_clip_1_flower-3)">
              <mask
                id="cs_mask_1_flower-3"
                style={{ maskType: "alpha" }}
                width="200"
                height="200"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
              >
                <path
                  fill="#fff"
                  d="M200 50c0-27.614-22.386-50-50-50s-50 22.386-50 50c0-27.614-22.386-50-50-50S0 22.386 0 50s22.386 50 50 50c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50c0 27.614 22.386 50 50 50s50-22.386 50-50c0-27.608-22.375-49.989-49.98-50C177.625 99.99 200 77.608 200 50z"
                ></path>
              </mask>
              <g mask="url(#cs_mask_1_flower-3)">
                <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                <path
                  fill="url(#paint0_linear_748_4691)"
                  fillOpacity="0.55"
                  d="M200 0H0v200h200V0z"
                ></path>
                <g filter="url(#filter0_f_748_4691)">
                  <path fill="#18A0FB" d="M131 3H-12v108h143V3z"></path>
                  <path fill="#FF58E4" d="M190 109H0v116h190V109z"></path>
                  <ellipse
                    cx="153.682"
                    cy="64.587"
                    fill="#FFD749"
                    rx="83"
                    ry="57"
                    transform="rotate(-33.875 153.682 64.587)"
                  ></ellipse>
                </g>
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_748_4691"
                width="361.583"
                height="346.593"
                x="-72"
                y="-61.593"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_748_4691"
                  stdDeviation="30"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                id="paint0_linear_748_4691"
                x1="200"
                x2="0"
                y1="0"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF1F00"></stop>
                <stop offset="1" stopColor="#FFD600"></stop>
              </linearGradient>
              <clipPath id="cs_clip_1_flower-3">
                <path fill="#fff" d="M0 0H200V200H0z"></path>
              </clipPath>
            </defs>
            <g
              style={{ mixBlendMode: "overlay" }}
              mask="url(#cs_mask_1_flower-3)"
            >
              <path
                fill="gray"
                stroke="transparent"
                d="M200 0H0v200h200V0z"
                filter="url(#cs_noise_1_flower-3)"
              ></path>
            </g>
            <defs>
              <filter
                id="cs_noise_1_flower-3"
                width="100%"
                height="100%"
                x="0%"
                y="0%"
                filterUnits="objectBoundingBox"
              >
                <feTurbulence
                  baseFrequency="0.6"
                  numOctaves="5"
                  result="out1"
                  seed="4"
                ></feTurbulence>
                <feComposite
                  in="out1"
                  in2="SourceGraphic"
                  operator="in"
                  result="out2"
                ></feComposite>
                <feBlend
                  in="SourceGraphic"
                  in2="out2"
                  mode="overlay"
                  result="out3"
                ></feBlend>
              </filter>
            </defs>
          </svg>
          <span className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-wide">
            Next Learn
          </span>
        </div>

        <nav className="mb-6 w-full">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-gray-900 dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="my-6 flex flex-wrap justify-center gap-4 text-sm">
          {socialIcons.map((icon) => (
            <a
              key={icon.name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              href={icon.href}
            >
              {icon.svg}
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} next-learn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
