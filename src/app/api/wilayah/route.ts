import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";
import {
  getRegionOptions,
  RegionInputError,
  RegionServiceError,
  regionLevels,
  type RegionLevel,
} from "@/lib/regions";

export async function GET(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const level = request.nextUrl.searchParams.get("level");
  const parentCode = request.nextUrl.searchParams.get("parentCode") ?? undefined;

  if (!level || !regionLevels.includes(level as RegionLevel)) {
    return NextResponse.json({ error: "Level wilayah tidak valid" }, { status: 400 });
  }

  try {
    const data = await getRegionOptions(level as RegionLevel, parentCode);
    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch (error) {
    if (error instanceof RegionInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof RegionServiceError
        ? error.message
        : "Gagal mengambil data wilayah";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
