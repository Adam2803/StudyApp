import AsyncStorage from "@react-native-async-storage/async-storage";
export function getXPForDuration(minutes: number): number {
  return Math.floor((minutes / 10) * 25);
}

export function calculateLevel(xp: number): number {
  let level = 1;
  let xpNeeded = 100;
  while (xp >= xpNeeded) {
    level++;
    xpNeeded += 150;
  }
  return level;
}

/**
 * Calculate the level based on total XP.
 * Level 1 starts at 0 XP
 * Level 2 = 100 XP
 * Level 3 = 250 XP
 * Level 4 = 400 XP
 * and so on (+150 XP each level)
 */

/**
 * Get XP based on learning duration.
 * Earn 25 XP every 10 minutes (or 50 XP every 20 minutes)
 */

/**
 * Save XP and Level locally (offline support)
 */
export async function saveXPToStorage(xp: number, level: number) {
  try {
    const payload = JSON.stringify({ xp, level });
    await AsyncStorage.setItem("user_xp", payload);
  } catch (err) {
    console.error("Failed to save XP to storage:", err);
  }
}

/**
 * Load XP and Level from local storage
 */
export async function loadXPFromStorage(): Promise<{
  xp: number;
  level: number;
}> {
  try {
    const data = await AsyncStorage.getItem("user_xp");
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load XP from storage:", err);
  }

  return { xp: 0, level: 1 };
}
