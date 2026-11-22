import { NextRequest, NextResponse } from "next/server"
import {
  apiUrl,
  csrfRejected,
  publicBackendError,
  readJson,
  requestFailed,
  sameOriginRequest,
} from "@/lib/server/auth-bff"

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
const MAX_DOCUMENTS = 5
const ALLOWED_DOCUMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"])

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return csrfRejected()

  try {
    const incoming = await request.formData()
    const data = incoming.get("data")
    const documents = incoming.getAll("documents")
    if (typeof data !== "string" || data.length > 32_000) {
      return NextResponse.json({ message: "Thông tin hồ sơ không hợp lệ." }, { status: 400 })
    }
    if (
      documents.length < 1 ||
      documents.length > MAX_DOCUMENTS ||
      documents.some(
        (entry) =>
          !(entry instanceof File) ||
          entry.size === 0 ||
          entry.size > MAX_DOCUMENT_BYTES ||
          !ALLOWED_DOCUMENT_TYPES.has(entry.type),
      )
    ) {
      return NextResponse.json(
        { message: "Đính kèm từ 1 đến 5 tệp PDF, JPG hoặc PNG, tối đa 10 MB mỗi tệp." },
        { status: 400 },
      )
    }

    const outgoing = new FormData()
    outgoing.append("data", data)
    for (const entry of documents) {
      const file = entry as File
      outgoing.append("documents", file, file.name)
    }

    const response = await fetch(apiUrl("/api/v1/public/lab-applications"), {
      method: "POST",
      headers: { accept: "application/json" },
      body: outgoing,
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) return publicBackendError(response, await readJson(response))
    const contentType = response.headers.get("content-type") || "application/json"
    return new NextResponse(response.body, {
      status: response.status,
      headers: { "cache-control": "no-store", "content-type": contentType },
    })
  } catch {
    return requestFailed()
  }
}
