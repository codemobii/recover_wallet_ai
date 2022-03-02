import { MantineProvider } from "@mantine/core";
import Main from "./Main";

export default function App() {
  return (
    <MantineProvider
      theme={{
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
      }}
    >
      <Main />
    </MantineProvider>
  );
}
