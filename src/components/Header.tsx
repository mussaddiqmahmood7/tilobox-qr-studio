"use client";

import Link from "next/link";
import { clsx } from "clsx";
import React, { useEffect } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { transitionMd, transitionLg } from "@/lib/animations";
import { BrandMark } from "@/components/BrandMark";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Container } from "@/components/Containers";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { usePathname } from "@/navigation";
import { trackEvent, TrackLink } from "@/components/TrackComponents";

const scrollTopAtom = atom(true);
const scrollTitleAtom = atom(true);
const menuOpenAtom = atom(false);

interface HeaderLinkProps {
  name: string;
  href: string;
  target?: string;
  onClick?: () => void;
}

interface HeaderProps {
  links: {
    name: string;
    href: string;
    target?: string;
  }[];
}

function Logo() {
  const setMenuOpen = useSetAtom(menuOpenAtom);
  return (
    <TrackLink
      trackValue={["logo", "header"]}
      href="/"
      className="flex h-14 items-center gap-2.5 transition-opacity hover:opacity-90"
      onClick={() => setMenuOpen(false)}
    >
      <BrandMark className="h-8 w-8 rounded-lg shadow-xs transition-transform hover:scale-105" />
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tight text-foreground">
          Tilo<span className="text-primary">Box</span>
        </span>
        <span className="hidden border-l border-border pl-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
          QR Studio
        </span>
      </div>
    </TrackLink>
  );
}

export function HeroLogo() {
  return (
    <div className="flex items-center gap-3.5">
      <BrandMark className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl shadow-md" />
      <div>
        <div className="text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <span>
            Tilo<span className="text-primary">Box</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full">
            QR Studio
          </span>
        </div>
      </div>
    </div>
  );
}

export function BorderBottom() {
  const isTop = useAtomValue(scrollTopAtom);
  return (
    <motion.div
      initial={{ opacity: isTop ? 0 : 1 }}
      animate={{ opacity: isTop ? 0 : 1 }}
      className="absolute bottom-0 left-0 h-[1px] w-full bg-border/60"
    />
  );
}

function MobileNavItem(props: HeaderLinkProps) {
  return (
    <li>
      <TrackLink
        trackValue={["mobile_nav", props.name]}
        href={props.href}
        target={props.target}
        onClick={props.onClick}
        className="py-2.5 font-bold text-lg flex items-center text-foreground hover:text-primary transition-colors"
      >
        {props.name}
        {props.target && <ArrowTopRightIcon className="w-5 h-5 ml-1.5 opacity-70" />}
      </TrackLink>
    </li>
  );
}

function MobileNavigation(
  props: HeaderProps & React.ComponentPropsWithoutRef<"div">,
) {
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 z-40 w-full bg-background/90 backdrop-blur-md h-14 flex md:hidden items-center justify-between px-4 sm:px-6 border-b border-border/60",
          props.className,
        )}
      >
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg h-9 w-9 text-foreground hover:bg-muted"
            aria-label="Toggle navigation menu"
            onClick={() => {
              trackEvent("toggle_menu", { to: !menuOpen });
              setMenuOpen(!menuOpen);
            }}
          >
            {!menuOpen ? (
              <Bars3Icon className="h-5 w-5 stroke-foreground" />
            ) : (
              <XMarkIcon className="h-5 w-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 border-b border-border/60">
              <Logo />
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg h-9 w-9 text-foreground hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5 text-foreground" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col flex-1 px-6 py-6 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Navigation
              </div>
              <ul className="flex flex-col gap-2">
                {props.links.map((item, index) => (
                  <MobileNavItem
                    key={"mobile_nav_" + index}
                    {...item}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-3">
                <a
                  href="https://tilobox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
                >
                  Visit TiloBox Platform
                  <ArrowTopRightIcon className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-center text-muted-foreground mt-2">
                  TiloBox QR Studio • 100% In-Browser & Private
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem(props: HeaderLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <li>
      <TrackLink
        trackValue={["desktop_nav", props.name]}
        href={props.href}
        target={props.target}
        className={clsx(
          "relative flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors",
          isActive
            ? "text-foreground font-semibold bg-accent/40"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/20",
        )}
      >
        {props.name}
        {props.target && <ArrowTopRightIcon className="w-3.5 h-3.5 ml-1 opacity-70" />}
      </TrackLink>
    </li>
  );
}

function DesktopNavigation(
  props: HeaderProps & React.ComponentPropsWithoutRef<"nav">,
) {
  return (
    <div
      className={clsx(
        "fixed top-0 z-20 w-full bg-background/85 backdrop-blur hidden md:flex border-b border-border/60",
        props.className,
      )}
    >
      <Container>
        <div className="h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <nav>
              <ul className="flex text-sm font-medium items-center gap-1">
                {props.links.map((item, index) => (
                  <NavItem key={index} {...item} />
                ))}
              </ul>
            </nav>
            <div className="h-4 w-[1px] bg-border" />
            <ThemeSwitcher />
            <a
              href="https://tilobox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all px-3 py-1.5"
            >
              tilobox.com
              <ArrowTopRightIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function Header() {
  const headerLinks = [
    {
      name: "TiloBox Ecosystem",
      href: "https://tilobox.com",
      target: "_blank",
    },
    {
      name: "GitHub",
      href: "https://github.com/mussaddiqmahmood7/tilobox-qr-studio",
      target: "_blank",
    },
  ];

  const setIsTop = useSetAtom(scrollTopAtom);
  const setIsTitle = useSetAtom(scrollTitleAtom);

  useEffect(() => {
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsTop(scrollTop <= 0);
      setIsTitle(scrollTop <= 100);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setIsTop, setIsTitle]);

  return (
    <>
      <MobileNavigation links={headerLinks} />
      <DesktopNavigation links={headerLinks} />
    </>
  );
}

export function HeaderPadding() {
  return <div className="h-14" />;
}
