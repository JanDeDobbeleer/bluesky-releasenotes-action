# Bluesky Release Notes Action

This action post the latest release notes to Bluesky.

## Inputs

### `title`

**Required** Bluesky post title.

### `github-token`

**Required** A correctly scoped GitHub Token to get the latest release notes.

### `bluesky-identifier`

**Required** Bluesky identifier.

### `bluesky-password`

**Required** Bluesky password.

## Example usage

```yaml
uses: JanDeDobbeleer/bluesky-releasenotes-action@main
with:
  title: 'Something is sprouting 🌱'
  github-token: ${{ secrets.GH_PAT }}
  bluesky-identifier: ${{ secrets.BLUESKY_IDENTIFIER }}
  bluesky-password: ${{ secrets.BLUESKY_PASSWORD }}
```
