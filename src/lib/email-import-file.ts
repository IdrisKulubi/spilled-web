import * as XLSX from "xlsx";
import mammoth from "mammoth";

const EMAIL_VALID = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
const EMAIL_FIND = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

export interface ParsedEmailRow {
  email: string;
  name?: string;
}

export function parseEmailListFromPlainText(importText: string): ParsedEmailRow[] {
  const lines = importText.split("\n").filter((line) => line.trim());
  return lines
    .map((line) => {
      const parts = line.split(/[,\t]/);
      const email = (parts[0]?.trim() ?? "").replace(/^"|"$/g, "");
      const name = parts[1]?.trim().replace(/^"|"$/g, "");
      return { email, name: name || undefined };
    })
    .filter((item) => item.email);
}

function cellStr(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

function extractEmailsFromFreeText(text: string): ParsedEmailRow[] {
  const matches = text.match(EMAIL_FIND) ?? [];
  const seen = new Set<string>();
  const out: ParsedEmailRow[] = [];
  for (const raw of matches) {
    const email = raw.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    out.push({ email });
  }
  return out;
}

function parseRowsFromSheet(rows: unknown[][]): ParsedEmailRow[] {
  if (!rows.length) return [];

  const first = rows[0].map((c) => cellStr(c).toLowerCase());
  let emailCol = 0;
  let nameCol = -1;
  let startRow = 0;

  const emailHeaderIdx = first.findIndex(
    (h) => h.includes("email") || h === "e-mail" || h === "mail"
  );
  if (emailHeaderIdx >= 0) {
    emailCol = emailHeaderIdx;
    nameCol = first.findIndex(
      (h, i) =>
        i !== emailCol &&
        (h.includes("name") || h === "full name" || h === "display name")
    );
    startRow = 1;
  }

  const out: ParsedEmailRow[] = [];
  const seen = new Set<string>();

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.length) continue;

    let email = cellStr(row[emailCol]);
    let name: string | undefined;

    if (nameCol >= 0) {
      const n = cellStr(row[nameCol]);
      if (n) name = n;
    }

    if (!EMAIL_VALID.test(email)) {
      const joined = row.map((c) => cellStr(c)).join(" ");
      const match = joined.match(EMAIL_FIND);
      if (match?.[0]) email = match[0];
    }

    email = email.toLowerCase().trim();
    if (!EMAIL_VALID.test(email)) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push({ email, name });
  }

  return out;
}

export async function parseEmailsFromFile(file: File): Promise<ParsedEmailRow[]> {
  const lower = file.name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const ext = dot >= 0 ? lower.slice(dot) : "";

  if (ext === ".docx") {
    const buf = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return extractEmailsFromFreeText(value);
  }

  if (ext === ".doc") {
    throw new Error(
      "Legacy Word .doc is not supported. Save as .docx, or export contacts to Excel/CSV."
    );
  }

  if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return [];
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      raw: false,
    }) as unknown[][];
    return parseRowsFromSheet(rows);
  }

  throw new Error("Use .xlsx, .xls, .csv, or .docx.");
}
