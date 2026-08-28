import { Helmet } from "react-helmet-async";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default PageTitle;
