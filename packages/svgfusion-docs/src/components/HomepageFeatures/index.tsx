import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import { Zap, Rocket, Code2 } from 'lucide-react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    icon: <Zap size={48} />,
    description: (
      <>
        Simple CLI commands and library API. Convert SVG files to React and Vue
        components with just one command:{' '}
        <code>svgfusion convert icon.svg</code>
      </>
    ),
  },
  {
    title: 'Production Ready',
    icon: <Rocket size={48} />,
    description: (
      <>
        Generated components include TypeScript support, proper prop types,
        optimization, and follow best practices for both React and Vue 3.
      </>
    ),
  },
  {
    title: 'React & Vue Support',
    icon: <Code2 size={48} />,
    description: (
      <>
        Generate components for both React and Vue 3 with TypeScript support.
        Includes memoization, refs, and proper component structure.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
