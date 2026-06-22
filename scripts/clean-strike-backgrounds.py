#!/usr/bin/env python3
"""Remove baked checkerboard / flat backgrounds from strike PNG assets."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ASSETS_DIR = Path(__file__).resolve().parents[1] / "src" / "assets" / "images"


def is_background_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True

    # Solid black backgrounds
    if max(r, g, b) < 42:
        return True

    # Near-white studio backgrounds
    if min(r, g, b) > 245:
        return True

    # Checkerboard / light neutral grays
    if max(r, g, b) - min(r, g, b) > 18:
        return False

    return min(r, g, b) >= 182


def flood_from_edges(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def index(x: int, y: int) -> int:
        return y * width + x

    def try_seed(x: int, y: int) -> None:
        idx = index(x, y)
        if visited[idx]:
            return
        r, g, b, a = pixels[x, y]
        if is_background_pixel(r, g, b, a):
            visited[idx] = 1
            queue.append((x, y))

    for x in range(width):
        try_seed(x, 0)
        try_seed(x, height - 1)
    for y in range(height):
        try_seed(0, y)
        try_seed(width - 1, y)

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                idx = index(nx, ny)
                if not visited[idx]:
                    r, g, b, a = pixels[nx, ny]
                    if is_background_pixel(r, g, b, a):
                        visited[idx] = 1
                        queue.append((nx, ny))

    return rgba


def peel_checkerboard_halo(image: Image.Image, passes: int = 40) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()

    for _ in range(passes):
        to_clear: list[tuple[int, int]] = []
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a < 10:
                    continue
                if not is_background_pixel(r, g, b, a):
                    continue

                transparent_neighbors = 0
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < width and 0 <= ny < height and pixels[nx, ny][3] < 10:
                        transparent_neighbors += 1

                if transparent_neighbors >= 1:
                    to_clear.append((x, y))

        if not to_clear:
            break

        for x, y in to_clear:
            pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)

    return rgba


def remove_soft_shadow_ring(image: Image.Image, passes: int = 12) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()

    for _ in range(passes):
        to_clear: list[tuple[int, int]] = []
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a < 10:
                    continue

                if max(r, g, b) - min(r, g, b) > 24:
                    continue

                luminance = (r + g + b) / 3
                if luminance > 210 or luminance < 70:
                    continue

                transparent_neighbors = 0
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < width and 0 <= ny < height and pixels[nx, ny][3] < 10:
                        transparent_neighbors += 1

                if transparent_neighbors >= 2:
                    to_clear.append((x, y))

        if not to_clear:
            break

        for x, y in to_clear:
            pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)

    return rgba


def clean_image(path: Path) -> None:
    image = Image.open(path)
    cleaned = flood_from_edges(image)
    cleaned = peel_checkerboard_halo(cleaned)
    cleaned = remove_soft_shadow_ring(cleaned)
    cleaned.save(path, "PNG")


def main() -> None:
    for path in sorted(ASSETS_DIR.glob("strike_*.png")):
        print(f"Cleaning {path.name}...")
        clean_image(path)


if __name__ == "__main__":
    main()
