import type { ReactNode } from 'react';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export type InfoCardProps = {
  header: string;
  description?: string;
  text?: string;
  children?: ReactNode;
};
const InfoCard = ({ header, description, text, children }: InfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='space-y-2'>
        {text && <MarkdownRenderer value={text} />}
        {children}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
