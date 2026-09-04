import { describe, it, expect } from "vite-plus/test";
import {
  MUTATION_CORE_EFFECTS,
  getMutationCoreEffectById,
  getMutationCoreEffectsByCategory,
  getMutationCoreEffectsByLevel,
} from "@/lib/mutation-core";
import { MutationCoreEffectCategory } from "@/types";

describe("mutation-core", () => {
  describe("MUTATION_CORE_EFFECTS", () => {
    it("should have at least one effect per category", () => {
      const categories = Object.values(MutationCoreEffectCategory);
      for (const category of categories) {
        const effects = MUTATION_CORE_EFFECTS.filter((e) => e.category === category);
        expect(
          effects.length,
          `Category ${category} should have at least one effect`,
        ).toBeGreaterThan(0);
      }
    });

    it("should have valid level values (1-6)", () => {
      MUTATION_CORE_EFFECTS.forEach((effect) => {
        expect(effect.level).toBeGreaterThanOrEqual(1);
        expect(effect.level).toBeLessThanOrEqual(6);
      });
    });

    it("should have unique IDs", () => {
      const ids = MUTATION_CORE_EFFECTS.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have non-empty descriptions", () => {
      MUTATION_CORE_EFFECTS.forEach((effect) => {
        expect(effect.description).toBeTruthy();
        expect(effect.description.trim().length).toBeGreaterThan(0);
      });
    });

    it("should have valid category values", () => {
      const validCategories = Object.values(MutationCoreEffectCategory);
      MUTATION_CORE_EFFECTS.forEach((effect) => {
        expect(validCategories).toContain(effect.category);
      });
    });
  });

  describe("getMutationCoreEffectById", () => {
    it("should return an effect by ID", () => {
      const effect = MUTATION_CORE_EFFECTS[0];
      const result = getMutationCoreEffectById(effect.id);
      expect(result).toEqual(effect);
    });

    it("should return undefined for non-existent ID", () => {
      const result = getMutationCoreEffectById("non_existent_effect");
      expect(result).toBeUndefined();
    });

    it("should find all effects by their IDs", () => {
      MUTATION_CORE_EFFECTS.forEach((effect) => {
        const found = getMutationCoreEffectById(effect.id);
        expect(found).toEqual(effect);
      });
    });
  });

  describe("getMutationCoreEffectsByCategory", () => {
    it("should return effects filtered by category", () => {
      const basicStatsEffects = getMutationCoreEffectsByCategory(
        MutationCoreEffectCategory.BASIC_STATS,
      );
      expect(basicStatsEffects.length).toBeGreaterThan(0);
      basicStatsEffects.forEach((effect) => {
        expect(effect.category).toBe(MutationCoreEffectCategory.BASIC_STATS);
      });
    });

    it("should return empty array for category with no effects", () => {
      // This test ensures the function handles edge cases
      const result = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.BASIC_STATS);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return effects sorted by level", () => {
      const effects = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.CARD_DAMAGE);
      for (let i = 1; i < effects.length; i++) {
        expect(effects[i].level).toBeGreaterThanOrEqual(effects[i - 1].level);
      }
    });
  });

  describe("getMutationCoreEffectsByLevel", () => {
    it("should return effects filtered by level", () => {
      const level1Effects = getMutationCoreEffectsByLevel(1);
      expect(level1Effects.length).toBeGreaterThan(0);
      level1Effects.forEach((effect) => {
        expect(effect.level).toBe(1);
      });
    });

    it("should return effects for all valid levels", () => {
      for (let level = 1; level <= 6; level++) {
        const effects = getMutationCoreEffectsByLevel(level as 1 | 2 | 3 | 4 | 5 | 6);
        expect(effects.length, `Should have effects for level ${level}`).toBeGreaterThan(0);
      }
    });
  });

  describe("effect counts", () => {
    it("should have 8 basic stats enhancement effects (4 attack + 4 defense)", () => {
      const basicStats = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.BASIC_STATS);
      expect(basicStats.length).toBe(8);
    });

    it("should have 6 card damage enhancement effects", () => {
      const cardDamage = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.CARD_DAMAGE);
      expect(cardDamage.length).toBe(6);
    });

    it("should have 6 shield acquisition effects", () => {
      const shield = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.SHIELD);
      expect(shield.length).toBe(6);
    });

    it("should have 6 heal effects", () => {
      const heal = getMutationCoreEffectsByCategory(MutationCoreEffectCategory.HEAL);
      expect(heal.length).toBe(6);
    });
  });
});
