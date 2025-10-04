import { NextResponse } from "next/server";

export const runtime = "nodejs"; // needs Node for external fetch

type VES = {
  make?: string;
  model?: string;
  fuelType?: string;
  engineCapacity?: number;
  co2Emissions?: number;
  colour?: string;
  bodyType?: string;
  transmission?: string;
  wheelplan?: string;
  euroStatus?: string;
  typeApproval?: string;
  revenueWeight?: number;
  markedForExport?: boolean;
  yearOfManufacture?: number;
  monthOfFirstRegistration?: string; // YYYY-MM
  registrationNumber?: string;
};

export async function POST(req: Request) {
  try {
    const { vrn } = await req.json();
    if (!vrn || typeof vrn !== "string") {
      return NextResponse.json({ error: "vrn is required" }, { status: 400 });
    }
    const key = process.env.DVLA_VES_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "DVLA_VES_API_KEY missing" }, { status: 500 });
    }

    // DVLA Vehicle Enquiry Service
    const vesRes = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ registrationNumber: vrn.toUpperCase() }),
    });

    if (!vesRes.ok) {
      const txt = await vesRes.text();
      return NextResponse.json({ error: "DVLA VES error", details: txt }, { status: 502 });
    }
    const ves = (await vesRes.json()) as VES;

    // Map to our form fields
    const mapped = {
      registration: ves.registrationNumber ?? vrn.toUpperCase(),
      make: ves.make ?? "",
      model: ves.model ?? "",
      fuel_type: ves.fuelType ?? "",
      engine_capacity: ves.engineCapacity ?? null,
      co2_emissions: ves.co2Emissions ?? null,
      colour: ves.colour ?? "",
      body_type: ves.bodyType ?? "",
      transmission: ves.transmission ?? "",
      wheelplan: ves.wheelplan ?? "",
      euro_status: ves.euroStatus ?? "",
      type_approval: ves.typeApproval ?? "",
      revenue_weight: ves.revenueWeight ?? null,
      marked_for_export: ves.markedForExport ?? null,
      year: ves.yearOfManufacture ?? null,
      first_registered: ves.monthOfFirstRegistration ? ves.monthOfFirstRegistration + "-01" : null,
    };

    return NextResponse.json({ ok: true, data: mapped });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "lookup failed" }, { status: 500 });
  }
}
