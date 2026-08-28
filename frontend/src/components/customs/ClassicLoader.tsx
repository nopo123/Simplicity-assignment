import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { globalStyles } from "src/styles/globalStyles";

const ClassicLoader = () => (
  <Box sx={globalStyles.emptyState}>
    <CircularProgress color="primary" />
  </Box>
);

export default ClassicLoader;
