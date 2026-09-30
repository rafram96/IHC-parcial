"use client";

import React, { useEffect } from "react";
import { TabKey, useApp, ViewPerspective } from "@/lib/context";
import { DemoControls } from "./demo-controls";
import { OfficeView } from "./office-view";
import { TabletFrame } from "./tablet-frame";
import { JustificationModal } from "./justification-modal";

interface MainExperienceProps {
  initialTab?: TabKey;
  initialPerspective?: ViewPerspective;
}

export function MainExperience({
  initialTab,
  initialPerspective,
}: MainExperienceProps) {
  const {
    viewPerspective,
    setViewPerspective,
    setActiveTab,
    isJustificationOpen,
    setIsJustificationOpen,
  } = useApp();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (initialPerspective) {
      setViewPerspective(initialPerspective);
    }
  }, [initialTab, initialPerspective, setActiveTab, setViewPerspective]);

  return (
    <div className="relative flex min-h-screen flex-col bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Demo Controls Toolbar: Always outside the judge's interface */}
      <DemoControls />

      {/* Main Experience Viewport */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-x-hidden">
        {viewPerspective === "office" ? (
          <OfficeView />
        ) : (
          <TabletFrame />
        )}
      </div>

      {/* HCI Design Justifications Modal (D1 - D20) */}
      <JustificationModal
        isOpen={isJustificationOpen}
        onClose={() => setIsJustificationOpen(false)}
      />
    </div>
  );
}
