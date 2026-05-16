"use client";

import AuthSessionBar from "@/components/AuthSessionBar";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ComponentType } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SvgIconProps>;
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  // {
  //   href: "/",
  //   label: "Тренировка",
  //   icon: QuizRoundedIcon,
  //   isActive: (pathname) => pathname === "/",
  // },
  {
    href: "/mcq",
    label: "Тест",
    icon: FactCheckRoundedIcon,
    isActive: (pathname) => pathname === "/mcq",
  },
  {
    href: "/new",
    label: "Новый",
    icon: AddCardRoundedIcon,
    isActive: (pathname) => pathname === "/new",
  },
  {
    href: "/theory",
    label: "Теория",
    icon: MenuBookRoundedIcon,
    isActive: (pathname) => pathname.startsWith("/theory"),
  },
  {
    href: "/notes",
    label: "Заметки",
    icon: EditNoteRoundedIcon,
    isActive: (pathname) => pathname === "/notes",
  },
];

/** Постоянная навигация: верхнее меню на десктопе, burger + drawer на мобильных. */
export default function SiteNavShell() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  const navLinkSx = (active: boolean) => ({
    textTransform: "none" as const,
    fontWeight: active ? 700 : 500,
    whiteSpace: "nowrap" as const,
    color: active ? "text.primary" : "text.secondary",
    borderRadius: 0,
    px: 1.25,
    py: 1,
    minWidth: "auto",
    borderBottom: 2,
    borderColor: active ? "secondary.light" : "transparent",
    "&:hover": {
      bgcolor: "transparent",
      color: "text.primary",
      borderColor: active ? "secondary.light" : "divider",
    },
  });

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        mb: { xs: 2, sm: 2.5 },
        mx: { xs: -2, sm: 0 },
        py: { xs: 1.25, sm: 3 },
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          minHeight: 48,
        }}
      >
        <IconButton
          aria-label="Открыть меню"
          onClick={() => setDrawerOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            flexShrink: 0,
            color: "text.primary",
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Typography
          component={Link}
          href="/"
          variant="subtitle1"
          sx={{
            flex: { md: "none" },
            flexShrink: 0,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "text.primary",
            textDecoration: "none",
            mr: { md: 1 },
            minWidth: 0,
            "&:hover": { color: "secondary.light" },
          }}
        >
          Quiz
        </Typography>

        <Box
          component="nav"
          aria-label="Основное меню"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "flex-end",
            gap: 0.5,
            flex: 1,
            minWidth: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                variant="text"
                color="inherit"
                size="medium"
                startIcon={<Icon fontSize="small" />}
                sx={navLinkSx(active)}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ flex: { xs: 1, md: "none" }, minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
          <AuthSessionBar />
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              width: "min(100vw - 48px, 320px)",
              bgcolor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            component={Link}
            href="/"
            variant="subtitle1"
            onClick={closeDrawer}
            sx={{
              fontWeight: 800,
              color: "text.primary",
              textDecoration: "none",
            }}
          >
            Quiz
          </Typography>
          <IconButton aria-label="Закрыть меню" onClick={closeDrawer} edge="end">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <List component="nav" aria-label="Мобильное меню" sx={{ py: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={active}
                onClick={closeDrawer}
                sx={{
                  mx: 1,
                  borderRadius: 0,
                  mb: 0.25,
                  borderBottom: 2,
                  borderColor: active ? "secondary.light" : "transparent",
                  bgcolor: "transparent",
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                    borderColor: "secondary.light",
                    "&:hover": { bgcolor: "transparent" },
                  },
                  "&:hover": {
                    bgcolor: "transparent",
                    borderColor: active ? "secondary.light" : "divider",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? "secondary.light" : "text.secondary" }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: active ? 700 : 500,
                        color: active ? "text.primary" : "text.secondary",
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}
