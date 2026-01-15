# Timeline Studio

Timeline Studio is a lightweight web app that transforms spreadsheet data into a professional, linear timeline with date markers and connected narrative cards.

## Features
- Upload a CSV export from Excel/Google Sheets.
- Paste CSV data directly.
- Automatic alternating layout with arrows pointing to the timeline date markers.

## Expected CSV format
Use column headers `Date`, `Title`, and `Details`. Additional columns are ignored.

```csv
Date,Title,Details
2024-06-01,Concept kickoff,Define the vision and success metrics.
```

## Run locally
From the repository root:

```bash
cd app
python -m http.server 8000
```

Then visit `http://localhost:8000`.
