export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const vrn = (body?.vrn ?? body?.registration ?? "").toString().trim().toUpperCase();
    if (!vrn) return NextResponse.json({ ok: false, error: "Missing vrn" }, { status: 400 });

    const dvlaUrl = process.env.DVLA_VES_API_URL;
    const dvlaKey = process.env.DVLA_VES_API_KEY;

    let dvla: any = null, dvlaError: any = null;
    if (dvlaUrl && dvlaKey) {
      const r = await fetch(dvlaUrl, {
        method: "POST",
        headers: { "x-api-key": dvlaKey, "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: vrn })
      });
      dvla = r.ok ? await r.json() : await safeJson(r);
      if (!r.ok) dvlaError = dvla;
    } else {
      dvlaError = "DVLA_VES_API_URL or DVLA_VES_API_KEY missing";
    }

    const mhUrl   = process.env.DVSA_MOT_HISTORY_API_URL;
    const mhPath  = process.env.DVSA_MOT_HISTORY_GET_REG;
    const mhToken = process.env.DVSA_MOT_HISTORY_ACCESS_TOKEN;
    const mhKey   = process.env.DVSA_MOT_HISTORY_API_KEY;

    let dvsa: any = null, dvsaError: any = null;
    if (mhUrl && mhPath && mhToken && mhKey) {
      const url = mhUrl.replace(/\/+$/, "") + "/" + mhPath.replace(/^\/+/, "") + encodeURIComponent(vrn);
      const r2 = await fetch(url, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${mhToken}`,
          "x-api-key": mhKey
        }
      });
      dvsa = r2.ok ? await r2.json() : await safeJson(r2);
      if (!r2.ok) dvsaError = dvsa;
    } else {
      dvsaError = "DVSA envs missing";
    }

    return NextResponse.json({ ok: true, dvla, dvlaError, dvsa, dvsaError });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

async function safeJson(r: Response) {
  try { return await r.json(); } catch { return { status: r.status, statusText: r.statusText }; }
}
