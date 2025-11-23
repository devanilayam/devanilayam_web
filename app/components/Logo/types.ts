export type LogoOrientation = 'vertical' | 'horizontal';

export type LogoVariant = 'default' | 'emblem' | 'wordmark';

export interface LogoProps {
    /**
     * The height of the logo.
     * 
     * @default 48
     */
    height?: number;

    /**
     * The color of the logo.
     * 
     * @default #EB730C
     */
    color?: string;

    /**
     * The orientation of the logo.
     * 
     * @default 'vertical'
     */
    orientation?: LogoOrientation;

    /**
     * The variant of the logo.
     * 
     * @default 'emblem'
     */
    variant?: LogoVariant;
}
