/**
 * Custom types for the package "@svgr/webpack"
 */
declare module '*.svg' {
    import type { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGElement> & { alt?: string }>;
    export default content;
}

declare module '*.svg?url' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

declare module '*.png' {
    import type { StaticImageData } from 'next/image';
    const content: StaticImageData;

    export default content;
}
