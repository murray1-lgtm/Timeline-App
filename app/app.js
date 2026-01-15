const fileInput = document.getElementById("fileInput");
const csvInput = document.getElementById("csvInput");
const renderTimeline = document.getElementById("renderTimeline");
const loadSample = document.getElementById("loadSample");
const timeline = document.getElementById("timeline");
const status = document.getElementById("status");

const sampleCsv = `Date,Title,Details
2024-01-08,Vision workshop,Align on the goals and create success metrics for the program.
2024-02-02,Design sprint,Storyboard the journey and agree on the look and feel.
2024-03-14,Build phase,Develop the first release and validate with stakeholders.
2024-04-20,Launch,Publish the experience and open feedback channels.
2024-05-18,Optimization,Measure adoption and iterate on the roadmap.`;

const showStatus = (message, isError = false) => {
  status.textContent = message;
  status.style.color = isError ? "#c81e1e" : "";
};

const normalizeHeader = (value) => value.trim().toLowerCase();

const parseCsv = (text) => {
  const rows = [];
  let current = "";
  let inQuotes = false;
  const lines = [];

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "\n" && !inQuotes) {
      lines.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) {
    lines.push(current);
  }

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    const columns = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === "," && !quoted) {
        columns.push(cell);
        cell = "";
      } else {
        cell += char;
      }
    }
    columns.push(cell);
    rows.push(columns.map((value) => value.trim()));
  }

  return rows;
};

const buildTimeline = (entries) => {
  timeline.innerHTML = "";
  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = `timeline-item ${index % 2 === 0 ? "left" : "right"}`;

    const content = document.createElement("div");
    content.className = "timeline-item__content";

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const details = document.createElement("p");
    details.textContent = entry.details;

    content.append(title, details);

    const marker = document.createElement("div");
    marker.className = "timeline-item__marker";

    const date = document.createElement("div");
    date.className = "timeline-item__date";
    date.textContent = entry.date;

    marker.append(date);

    item.append(content, marker);
    timeline.append(item);
  });
};

const extractEntries = (text) => {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);
  const dateIndex = headers.indexOf("date");
  const titleIndex = headers.indexOf("title");
  const detailsIndex = headers.indexOf("details");

  if (dateIndex === -1 || titleIndex === -1 || detailsIndex === -1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
    date: row[dateIndex] || "",
    title: row[titleIndex] || "Untitled milestone",
    details: row[detailsIndex] || "",
  }));
};

const handleRender = (text) => {
  const entries = extractEntries(text);
  if (!entries.length) {
    showStatus(
      "We could not find Date, Title, and Details columns. Please check your CSV headers.",
      true
    );
    return;
  }

  showStatus(`Loaded ${entries.length} timeline entries.`);
  buildTimeline(entries);
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    csvInput.value = text.trim();
    handleRender(text);
  };
  reader.readAsText(file);
});

renderTimeline.addEventListener("click", () => {
  handleRender(csvInput.value.trim());
});

loadSample.addEventListener("click", () => {
  csvInput.value = sampleCsv;
  handleRender(sampleCsv);
});
