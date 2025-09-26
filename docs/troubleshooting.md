# Troubleshooting

## Search Tool Issues

### Ripgrep (rg) Not Found

The system provides multiple fallback mechanisms for ripgrep availability:

1. **Bundled Binaries**: Pre-compiled ripgrep binaries are included in the vendor directory
2. **System PATH**: Checks if `rg` is available in your system PATH
3. **Auto-download**: Downloads appropriate binary for your platform if needed
- Binaries are cached to avoid repeated downloads
- Supports macOS (Intel/Apple Silicon), Windows, and Linux platforms

### Search Performance

For optimal search performance:
- Ensure ripgrep is installed system-wide via your package manager
- The fallback download mechanism provides functionality but may have slower initial setup
