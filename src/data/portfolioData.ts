export interface PortfolioItemData {
  id: string
  title: string
  description: string
  shortDesc: string
  images: string[]
}

const portfolioData: PortfolioItemData[] = [
  {
    id: 'brand-redesign',
    title: 'Brand Identity Redesign',
    description:
      'A complete brand identity overhaul for a tech startup, encompassing logo design, color palette, typography system, and brand guidelines. The new identity reflects the company’s mission of making complex technology accessible and human-centric.',
    shortDesc: 'Full brand identity overhaul for a tech startup.',
    images: [
      'https://picsum.photos/seed/brand1/1200/800',
      'https://picsum.photos/seed/brand2/1200/800',
      'https://picsum.photos/seed/brand3/1200/800',
    ],
  },
  {
    id: 'dash-platform',
    title: 'Dashboard Platform Redesign',
    description:
      'Redesigned a complex data dashboard used by enterprise clients. Focused on simplifying information architecture, improving data visualization readability, and creating a cohesive component library that sped up development by 40%.',
    shortDesc: 'Enterprise dashboard with enhanced data visualizations.',
    images: [
      'https://picsum.photos/seed/dash1/1200/800',
      'https://picsum.photos/seed/dash2/1200/800',
      'https://picsum.photos/seed/dash3/1200/800',
      'https://picsum.photos/seed/dash4/1200/800',
    ],
  },
  {
    id: 'mobile-app',
    title: 'Wellness Mobile App',
    description:
      'Designed a cross-platform wellness app from concept to high-fidelity prototype. Included user research, wireframing, usability testing, and a polished UI with dark-mode support and accessibility in mind.',
    shortDesc: 'Cross-platform wellness app with dark-mode UI.',
    images: [
      'https://picsum.photos/seed/mobile1/1200/800',
      'https://picsum.photos/seed/mobile2/1200/800',
      'https://picsum.photos/seed/mobile3/1200/800',
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Storefront',
    description:
      'Designed a modern e-commerce storefront with a focus on conversion optimization. Created a seamless shopping experience from product discovery to checkout, including interactive product galleries and a streamlined cart flow.',
    shortDesc: 'Conversion-optimized e-commerce shopping experience.',
    images: [
      'https://picsum.photos/seed/ecom1/1200/800',
      'https://picsum.photos/seed/ecom2/1200/800',
      'https://picsum.photos/seed/ecom3/1200/800',
    ],
  },
  {
    id: 'design-system',
    title: 'Component Design System',
    description:
      'Built a comprehensive design system and component library used across multiple product teams. Included Figma component documentation, design tokens, accessibility guidelines, and a living style guide.',
    shortDesc: 'Scalable design system for multi-team product development.',
    images: [
      'https://picsum.photos/seed/ds1/1200/800',
      'https://picsum.photos/seed/ds2/1200/800',
      'https://picsum.photos/seed/ds3/1200/800',
      'https://picsum.photos/seed/ds4/1200/800',
    ],
  },
  {
    id: 'saas-landing',
    title: 'SaaS Landing Page',
    description:
      'Created a high-converting landing page for a B2B SaaS product. Used A/B testing to refine messaging and layout, resulting in a 35% increase in sign-up conversions. Included animated illustrations and micro-interactions.',
    shortDesc: 'High-converting B2B landing page with micro-interactions.',
    images: [
      'https://picsum.photos/seed/saas1/1200/800',
      'https://picsum.photos/seed/saas2/1200/800',
      'https://picsum.photos/seed/saas3/1200/800',
    ],
  },
]

export default portfolioData