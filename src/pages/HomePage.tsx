import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

/** Home page — shows app info from the Rust backend and a sample command. */
export default function HomePage() {
  const [version, setVersion] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_app_version")
      .then(setVersion)
      .catch(() => setVersion("(running outside Tauri)"));
  }, []);

  const handleGreet = async () => {
    try {
      const msg = await invoke<string>("greet", { name: "world" });
      setGreeting(msg);
    } catch (e) {
      setGreeting(`Error: ${e}`);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Home</Typography>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            App version
          </Typography>
          <Typography variant="h6">{version || "loading..."}</Typography>
        </CardContent>
      </Card>
      <Box>
        <Button variant="contained" onClick={handleGreet}>
          Call greet()
        </Button>
        {greeting && (
          <Typography sx={{ mt: 2 }} variant="body1">
            {greeting}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
