import Tooltip from "@mui/material/Tooltip";
import { TypographyProps } from "@mui/material/Typography";
import { useTextTruncation } from "src/hooks/common/useTextTruncation";
import { TruncatedTextStyled } from "src/styles/customStyledComponent";

interface TruncatedTextProps {
  readonly text: string;
  readonly variant?: TypographyProps["variant"];
}

const TruncatedText = ({ text, variant = "body2" }: TruncatedTextProps) => {
  const { textRef, isTextTruncated } = useTextTruncation(text);

  const content = (
    <TruncatedTextStyled ref={textRef} variant={variant}>
      {text}
    </TruncatedTextStyled>
  );

  if (!isTextTruncated) {
    return content;
  }

  return (
    <Tooltip title={text} placement="top" arrow>
      {content}
    </Tooltip>
  );
};

export default TruncatedText;
