import React from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type { WrapperProps } from '@docusaurus/types';
import StructuredData from '../../components/StructuredData';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.JSX.Element {
  return (
    <>
      <StructuredData type="SoftwareApplication" />
      <Layout {...props} />
    </>
  );
}
