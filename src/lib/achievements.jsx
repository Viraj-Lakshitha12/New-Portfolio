import React from 'react';
import { toast } from "react-hot-toast";

const ACHIEVEMENTS = {
  hacker: { id: "hacker", title: "Hacker Man", description: "Used the developer terminal", icon: "👨‍💻" },
  gamer: { id: "gamer", title: "Retro Gamer", description: "Found the Konami Code", icon: "🎮" },
  explorer: { id: "explorer", title: "Deep Explorer", description: "Reached the bottom of the page", icon: "🗺️" },
  socialite: { id: "socialite", title: "Social Butterfly", description: "Signed the guestbook", icon: "🦋" },
};

export const unlockAchievement = (id) => {
  if (typeof window === "undefined") return;
  
  const key = "vldev_achievements";
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  
  if (!saved.includes(id) && ACHIEVEMENTS[id]) {
    saved.push(id);
    localStorage.setItem(key, JSON.stringify(saved));
    
    const achievement = ACHIEVEMENTS[id];
    toast(
      (t) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{achievement.icon}</span>
            <span className="font-bold text-[var(--accent)]">Achievement Unlocked!</span>
          </div>
          <div>
            <p className="font-semibold text-sm">{achievement.title}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
          </div>
        </div>
      ),
      { duration: 5000, style: { border: "1px solid var(--accent)" } }
    );
    
    // Play a special sound
    try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
        audio.volume = 0.5;
        audio.play();
    } catch(e) {}
  }
};
