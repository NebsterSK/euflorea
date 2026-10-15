import type { SVGAttributes } from 'react';

/**
 * The dill sprig from the Euflorea logo, used as the compact brand mark in
 * the admin and auth screens.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 20 120 240" xmlns="http://www.w3.org/2000/svg">
            <g
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
            >
                <path d="M60 258C58 200 62 140 58 60" />
                <path d="M58 60l-14-18M58 60l-6-22M58 60l2-23M58 60l10-20M58 60l17-14" />
                <path d="M59 150c10-20 20-36 34-48" />
                <path d="M93 102l-10-12M93 102l-2-15M93 102l6-13M93 102l12-7" />
                <path d="M59 180c-10-16-22-28-36-34" />
                <path d="M23 146l-6-12M23 146l2-14M23 146l9-10M23 146l-12-4" />
            </g>
        </svg>
    );
}
