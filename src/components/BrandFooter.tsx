import React from "react";
import { Box, Text } from "ink";
import { BRANDING } from "../config/branding.js";
import { osc8Link } from "../ui/ansi.js";
import { theme } from "../ui/theme.js";

export function BrandFooter() {
  const websiteLabel = "ngmb.dev";
  const githubLabel = "GitHub";
  const issuesLabel = "Report issue";

  return (
    <Box marginTop={1} flexDirection="column">
      <Text dimColor>
        {osc8Link(BRANDING.website, `by ${BRANDING.author}`)}
        <Text dimColor> · </Text>
        {osc8Link(BRANDING.website, websiteLabel)}
        <Text dimColor> · </Text>
        {osc8Link(BRANDING.repository, githubLabel)}
        <Text dimColor> · </Text>
        {osc8Link(BRANDING.issues, issuesLabel)}
      </Text>
      <Text dimColor color={theme.colors.muted}>
        {BRANDING.name} v{BRANDING.version}
      </Text>
    </Box>
  );
}
