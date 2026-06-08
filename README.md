# renamix

Rename all files in a folder to short random unique names — extensions preserved, collisions avoided, undo supported.

```txt
IMG_001.jpg       →  a8f31c90d2ab.jpg
photo final.png   →  77bc92ee19fa.png
vacation.webp     →  019acbd98211.webp
```

## Install

```bash
npm install -g renamix
```

[npm package](https://www.npmjs.com/package/renamix)

Requires **Node.js 18+**.

## Quick start

```bash
# Interactive UI (current folder)
renamix

# Specific folder
renamix ./photos

# Preview without changes
renamix --dry-run ./downloads

# Apply without UI
renamix --apply ./downloads
```

## Commands

| Command | Description |
|---------|-------------|
| `renamix [folder]` | Open TUI (default: current directory) |
| `renamix --dry-run` | Print planned renames |
| `renamix --apply` | Rename all files (no TUI) |
| `renamix --recursive` | Include subfolders |
| `renamix --ext jpg,png` | Only these extensions |
| `renamix --prefix photo_` | `photo_a8f31c90d2ab.jpg` |
| `renamix rollback` | Undo last operation |
| `renamix rollback ./path/.renamix-log.json` | Undo from a specific log |

## TUI shortcuts

| Key | Action |
|-----|--------|
| `↑` `↓` | Move selection |
| `Space` | Select / deselect file |
| `P` | Set name prefix |
| `A` | Apply (asks confirmation) |
| `U` | Undo last rename |
| `R` | Refresh list |
| `Q` | Quit |

## Safety

- Preview before applying (TUI)
- Two-phase rename to prevent name collisions
- Rollback log (`.renamix-log.json`) written after each run
- Skips folders, hidden files, symlinks, and renamix logs by default
- Path traversal protection on rollback logs

See [SECURITY.md](SECURITY.md) to report vulnerabilities.

## Links

- [npm](https://www.npmjs.com/package/renamix)
- [GitHub](https://github.com/NicholasMendez11/renamix)
- [Report an issue](https://github.com/NicholasMendez11/renamix/issues/new)
- [Author](https://www.ngmb.dev/)

## License

MIT
