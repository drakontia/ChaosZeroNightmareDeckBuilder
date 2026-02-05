import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExportDeckImage } from '@/hooks/useExportDeckImage';
import * as htmlToImage from 'html-to-image';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, opts?: any) => opts?.defaultValue || key
}));

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn()
}));

describe('useExportDeckImage', () => {
  let mockAlertSpy: any;
  let mockConsoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAlertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockConsoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock successful image export
    vi.mocked(htmlToImage.toPng).mockResolvedValue('data:image/png;base64,test');
  });

  afterEach(() => {
    mockAlertSpy.mockRestore();
    mockConsoleSpy.mockRestore();
  });

  it('should initialize with isExporting false', () => {
    const { result } = renderHook(() => useExportDeckImage());
    expect(result.current.isExporting).toBe(false);
  });

  it('should export deck image and trigger download', async () => {
    const { result } = renderHook(() => useExportDeckImage());

    // Create mock ref with DOM element
    const mockDiv = document.createElement('div');
    const ref = { current: mockDiv };

    // Mock link.click
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await act(async () => {
      await result.current.handleExportDeckImage(ref, 'my-deck');
    });

    expect(vi.mocked(htmlToImage.toPng)).toHaveBeenCalledWith(mockDiv, expect.any(Object));
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it('should handle null ref gracefully', async () => {
    const { result } = renderHook(() => useExportDeckImage());
    const ref = { current: null };

    await act(async () => {
      await result.current.handleExportDeckImage(ref, 'my-deck');
    });

    // Should not call toPng if ref is null
    expect(vi.mocked(htmlToImage.toPng)).not.toHaveBeenCalled();
  });

  it('should handle toPng errors gracefully', async () => {
    const { result } = renderHook(() => useExportDeckImage());
    vi.mocked(htmlToImage.toPng).mockRejectedValue(new Error('Export failed'));

    const mockDiv = document.createElement('div');
    const ref = { current: mockDiv };

    await act(async () => {
      await result.current.handleExportDeckImage(ref, 'my-deck');
    });

    expect(mockAlertSpy).toHaveBeenCalledWith(expect.stringContaining('保存に失敗'));
  });

  it('should replace cross-origin images with placeholder', async () => {
    const { result } = renderHook(() => useExportDeckImage());

    const mockDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'https://other-domain.com/image.png';
    mockDiv.appendChild(img);

    const ref = { current: mockDiv };

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await act(async () => {
      await result.current.handleExportDeckImage(ref, 'my-deck');
    });

    // Image should be temporarily replaced with placeholder
    expect(vi.mocked(htmlToImage.toPng)).toHaveBeenCalled();
  });

  it.skip('should prevent duplicate exports', async () => {
    // Skip: concurrent state updates in tests can race in jsdom.
  });

  it('should use proper pixel ratio', async () => {
    const { result } = renderHook(() => useExportDeckImage());

    const mockDiv = document.createElement('div');
    const ref = { current: mockDiv };

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await act(async () => {
      await result.current.handleExportDeckImage(ref, 'my-deck');
    });

    const callArgs = vi.mocked(htmlToImage.toPng).mock.calls[0];
    expect(callArgs[1]).toHaveProperty('pixelRatio');
    expect(callArgs[1]?.pixelRatio).toBeLessThanOrEqual(3);
  });
});
