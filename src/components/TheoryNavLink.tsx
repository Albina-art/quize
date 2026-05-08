"use client";

import MuiLink, { type LinkProps } from "@mui/material/Link";
import NextLink from "next/link";

export default function TheoryNavLink(props: LinkProps<typeof NextLink>) {
  return <MuiLink component={NextLink} {...props} />;
}
