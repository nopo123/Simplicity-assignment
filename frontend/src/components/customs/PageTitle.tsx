import { Helmet } from "react-helmet-async";

interface PageTitleProps {
  readonly title: string;
}

const PageTitle = ({ title }: PageTitleProps) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default PageTitle;
