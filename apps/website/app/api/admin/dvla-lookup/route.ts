import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { vrn } = await req.json();
    if (!vrn) return NextResponse.json({ ok: false, error: "Missing vrn" }, { status: 400 });

    const dvlaUrl = process.env.DVLA_VES_API_URL;
    const dvlaKey = process.env.DVLA_VES_API_KEY;
    if (!dvlaUrl || !dvlaKey) {
      return NextResponse.json({ ok: false, error: "DVLA_VES_API_URL or DVLA_VES_API_KEY missing" }, { status: 400 });
    }

    const [dvlaRes, dvsaRes] = await Promise.all([
      fetch(dvlaUrl, {
        method: "POST",
        headers: { "x-api-key": dvlaKey, "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: vrn.replace(/\s+/g, "").toUpperCase() }),
        cache: "no-store",
      }),
      (async () => {
        const base = process.env.DVSA_MOT_HISTORY_API_URL;
        const path = process.env.DVSA_MOT_HISTORY_GET_REG;
        const token = process.env.DVSA_MOT_HISTORY_ACCESS_TOKEN;
        const apiKey = process.env.DVSA_MOT_HISTORY_API_KEY;
        if (!base || !path || !token || !apiKey) return null; // not configured
        return fetch(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}${encodeURIComponent(vrn)}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
      })(),
    ]);

    const dvla = dvlaRes.ok ? await dvlaRes.json() : { error: await dvlaRes.text(), status: dvlaRes.status };
    let dvsa: any = null;
    if (dvsaRes) {
      dvsa = dvsaRes.ok ? await dvsaRes.json() : { error: await dvsaRes.json().catch(() => dvsaRes.text()), status: dvsaRes.status };
    }

    return NextResponse.json({ ok: true, dvla, dvsa });
  } catch (e: any) {
    console.error("DVLA/DVSA lookup failed:", e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
