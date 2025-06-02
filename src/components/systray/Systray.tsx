import { useState, useEffect } from "react";
import { SystrayOutput } from "zebar";
import { ExpandingCarousel } from "./components/ExpandingCarousel";
import { SystrayItem } from "./components/SystrayItem";

type SystrayProps = {
  systray: SystrayOutput | null;
};

export default function Systray({ systray }: SystrayProps) {
  if (!systray) return;
  const icons = systray.icons;

  const [expanded, setExpanded] = useState(false);
  const [pinnedIcons, setPinnedIcons] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedIcons");
    const defaultPinned = saved ? JSON.parse(saved) : [];
    if (defaultPinned.length === 0 && icons.length > 0) {
      // Pin the first icon by default if no icons are pinned
      defaultPinned.push(icons[0].id);
    }
    return defaultPinned;
  });

  useEffect(() => {
    localStorage.setItem("pinnedIcons", JSON.stringify(pinnedIcons));
  }, [pinnedIcons]);

  const handleClick = (e: React.MouseEvent, iconId: string) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setPinnedIcons((prev) =>
        prev.includes(iconId) ? prev.filter((id) => id !== iconId) : [...prev, iconId]
      );
    } else if (e.shiftKey) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const defaultIconsSet = new Set(pinnedIcons);
  const filteredIcons = expanded
    ? icons
    : icons.filter((icon) => defaultIconsSet.has(icon.id));

  const systrayIcons = filteredIcons.map((item) => (
    <SystrayItem
      key={item.id}
      systray={systray}
      icon={item}
      onClick={(e) => handleClick(e, item.id)}
    />
  ));

  return (
    <div className="flex items-center gap-1.5">
      <ExpandingCarousel
        items={systrayIcons}
        expanded={expanded}
        gap={6}
        itemWidth={16}
        visibleCount={filteredIcons.length}
      />
    </div>
  );
}

