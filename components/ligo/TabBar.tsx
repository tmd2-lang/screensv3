/**
 * Ligo bottom tab bar — web port of MainTabBar.tsx / MainTabs.tsx.
 *
 * Current shipping arrangement (2026-09-13): Explore on the left, the
 * Campus feed in the emphasized centre slot, and Profile on the right.
 *
 *     Explore  ·  Campus  ·  Profile
 *
 * Bar chrome, from MainTabBar's StyleSheet: flush and full-width (not a
 * floating pill), white, hairline top border, 10px vertical padding,
 * 44x44 touch target, 24x24 glyph. Active is orange #f97316 and inactive
 * is #d1d1d1. Current Figma also labels every tab.
 *
 * Icons are the real Figma PNG exports copied from the reference repo
 * into public/ligo-nav. RN tints them with <Image tintColor>; the web
 * equivalent is a CSS mask, so one asset still serves both states.
 *
 * Known limitation inherited from the source: these export at native
 * Figma layout size (~28x28, not @2x/@3x), so they're soft if scaled up.
 * Fine at 24px.
 */
"use client";

import React from "react";

export type LigoTab = "chat" | "events" | "profile";

const ACTIVE = "#f97316";
const INACTIVE = "#d1d1d1";

export type TabDef = {
  id: LigoTab;
  /** Accessible name. Defaults below; override to show Feed in the Chat slot. */
  label: string;
};

export const DEFAULT_TABS: TabDef[] = [
  { id: "events", label: "Explore" },
  { id: "chat", label: "Campus" },
  { id: "profile", label: "Profile" },
];

function TabGlyph({ tab, color }: { tab: LigoTab; color: string }) {
  if (tab === "chat") {
    return <svg className="ligo-tab-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.2586 1.95572C11.2716 1.1269 12.7284 1.1269 13.7414 1.95572L19.9914 7.06936C20.6298 7.59167 21 8.37293 21 9.19774V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V9.19774C3 8.37293 3.37022 7.59167 4.0086 7.06936L10.2586 1.95572Z" fill={color} /></svg>;
  }
  if (tab === "events") {
    return <svg className="ligo-tab-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M19.0625 2.77358C20.3826 2.3964 21.6031 3.61689 21.2259 4.93701L18.0256 16.1379C17.7646 17.0515 17.0505 17.7656 16.1369 18.0266L4.93603 21.2269C3.61592 21.604 2.39543 20.3836 2.7726 19.0634L5.97286 7.86254C6.23388 6.94897 6.94799 6.23485 7.86157 5.97383L19.0625 2.77358ZM9.62425 12C9.62425 10.6883 10.6876 9.625 11.9993 9.625C13.3109 9.625 14.3743 10.6883 14.3743 12C14.3743 13.3117 13.3109 14.375 11.9993 14.375C10.6876 14.375 9.62425 13.3117 9.62425 12Z" fill={color} /></svg>;
  }
  return <svg className="ligo-tab-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7.5C6.5 4.46243 8.96243 2 12 2C15.0376 2 17.5 4.46243 17.5 7.5C17.5 10.5376 15.0376 13 12 13C8.96243 13 6.5 10.5376 6.5 7.5Z" fill={color} /><path d="M3.74416 21C3.32995 21 3 20.6642 3 20.25V18.75C3 16.1266 5.12665 14 7.75 14H16.25C18.8734 14 21 16.1266 21 18.75V20.25C21 20.6642 20.67 21 20.2558 21C17.0815 21 6.91849 21 3.74416 21Z" fill={color} /></svg>;
}

export function LigoTabBar({
  active,
  onChange,
  tabs = DEFAULT_TABS,
}: {
  active: LigoTab;
  onChange?: (tab: LigoTab) => void;
  tabs?: TabDef[];
}) {
  return (
    <nav
      aria-label="Main"
      style={{
        display: "flex",
        background: "#ffffff",
        borderTop: "1px solid #e5e5e0",
        padding: "10px 0",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            className="ligo-pressable"
            onClick={() => onChange?.(tab.id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={tab.label}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                minWidth: 64,
                minHeight: 44,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <TabGlyph tab={tab.id} color={isActive ? ACTIVE : INACTIVE} />
              <span style={{ color: isActive ? ACTIVE : INACTIVE, fontSize: 13, lineHeight: "16px", fontWeight: 500, letterSpacing: "0.1px" }}>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
