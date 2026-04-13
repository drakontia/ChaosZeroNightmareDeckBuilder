import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCharacterSelection } from '@/hooks/useCharacterSelection';
import { CHARACTERS } from '@/lib/characters';

describe('useCharacterSelection', () => {
  it('does not reselect a different character when incrementing ego without sync', () => {
    const onSelect = vi.fn();
    const onEgoLevelChange = vi.fn();
    const selectedCharacter = CHARACTERS.find((entry) => entry.id === 'chizuru')!;
    const otherCharacter = CHARACTERS.find((entry) => entry.id !== selectedCharacter.id)!;

    const { result } = renderHook(() =>
      useCharacterSelection({
        character: selectedCharacter,
        onSelect,
        onEgoLevelChange,
      })
    );

    act(() => {
      result.current.handleEgoIncrement(otherCharacter);
    });

    expect(result.current.getEgoLevel(otherCharacter)).toBe((otherCharacter.egoLevel ?? 0) + 1);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onEgoLevelChange).not.toHaveBeenCalled();
  });

  it('updates ego through the dedicated callback for the selected character', () => {
    const onSelect = vi.fn();
    const onEgoLevelChange = vi.fn();
    const selectedCharacter = CHARACTERS.find((entry) => entry.id === 'chizuru')!;

    const { result } = renderHook(() =>
      useCharacterSelection({
        character: selectedCharacter,
        onSelect,
        onEgoLevelChange,
      })
    );

    act(() => {
      result.current.handleEgoIncrement(selectedCharacter);
    });

    expect(onSelect).not.toHaveBeenCalled();
    expect(onEgoLevelChange).toHaveBeenCalledWith((selectedCharacter.egoLevel ?? 0) + 1);
  });

  it('applies the locally adjusted ego level when selecting a candidate', () => {
    const onSelect = vi.fn();
    const selectedCharacter = CHARACTERS.find((entry) => entry.id === 'chizuru')!;
    const otherCharacter = CHARACTERS.find((entry) => entry.id !== selectedCharacter.id)!;

    const { result } = renderHook(() =>
      useCharacterSelection({
        character: selectedCharacter,
        onSelect,
      })
    );

    act(() => {
      result.current.handleEgoIncrement(otherCharacter);
    });

    act(() => {
      result.current.handleSelect(otherCharacter);
    });

    expect(onSelect).toHaveBeenCalledWith({
      ...otherCharacter,
      egoLevel: (otherCharacter.egoLevel ?? 0) + 1,
    });
  });

  it('syncs the selected character ego level when props change', () => {
    const onSelect = vi.fn();
    const selectedCharacter = CHARACTERS.find((entry) => entry.id === 'chizuru')!;

    const { result, rerender } = renderHook(
      ({ character }) =>
        useCharacterSelection({
          character,
          onSelect,
        }),
      {
        initialProps: {
          character: selectedCharacter,
        },
      }
    );

    rerender({
      character: {
        ...selectedCharacter,
        egoLevel: 4,
      },
    });

    expect(result.current.getEgoLevel({
      ...selectedCharacter,
      egoLevel: 4,
    })).toBe(4);
  });

  it('character が null の場合は egoLevels を更新しない', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useCharacterSelection({
        character: null,
        onSelect,
      })
    );
    expect(result.current.egoLevels).toEqual({});
  });
});
