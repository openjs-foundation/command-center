# Security MD Tracker

This tool tracks changes to Security.md files across various OpenJS projects. It fetches the content from specified URLs, compares it with previously stored versions, and reports any changes.

## How It Works

The tracker:
1. Fetches content from URLs defined in `data.json`
2. Compares the content with previously stored hashes
3. Reports any changes
4. Updates the tracking data

## Usage

### Automated Execution

The tracker runs automatically every Monday at midnight via GitHub Actions. If changes are detected, a pull request will be created automatically.

You can also trigger the workflow manually from the GitHub Actions tab in the repository.

## Configuration

### Adding New Sources

To track a new Security.md file, add an entry to the `source` array in `data.json`:

```json
{
  "source": [
    {
      "project": "project-name",
      "url": "https://raw.githubusercontent.com/org/repo/branch/SECURITY.md"
    }
  ]
}
```


### PR Creation

When changes are detected, the pipeline:
1. Creates a new branch named `security-md-update-YYYY-MM-DD`
2. Commits the updated `data.json` file
3. Creates a PR with details of what changed in the description

