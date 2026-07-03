import { NextResponse } from "next/server";
import { extractText as extractPdfText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  const name = fileName.toLowerCase();

  if (name.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractPdfText(pdf, { mergePages: true });
    return text;
  }

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (name.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("UNSUPPORTED_TYPE");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be logged in." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File is too large — 5MB max." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const text = (await extractText(buffer, file.name)).trim();

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Couldn't find any text in that file — it may be a scanned image without a text layer. Try pasting your resume text directly instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    if (error instanceof Error && error.message === "UNSUPPORTED_TYPE") {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a .pdf, .docx, or .txt file." },
        { status: 400 }
      );
    }
    console.error("Resume parse failed", error);
    return NextResponse.json(
      {
        error:
          "Couldn't read that file — it may be corrupted or password-protected. Try a different file, or paste your resume text directly instead.",
      },
      { status: 422 }
    );
  }
}
