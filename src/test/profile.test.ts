import { describe, expect, it } from "vitest";
import { OBIECTIVE, profilPentruAI, type Profil } from "@/lib/profile";

describe("obiective din onboarding", () => {
  it("poate fi ales „Nu sunt sigur încă”", () => {
    expect(OBIECTIVE).toContain("Nu sunt sigur încă");
  });
  it("nu mai conține obiective fiscale", () => {
    const interzise = ["CASS", "D212", "Pilonul III", "Taxe"];
    for (const o of OBIECTIVE) {
      expect(interzise.some((t) => o.includes(t))).toBe(false);
    }
  });
});

describe("profilPentruAI", () => {
  const p: Profil = {
    nume: "Ștefan",
    varsta: 25,
    oras: "București",
    situatii: ["Salariat"],
    venit: "3.000 – 5.000 lei",
    obiective: ["Nu sunt sigur încă"],
    creatLa: "2026-10-28T10:00:00.000Z",
  };

  it("nu trimite numele Copilotului", () => {
    expect(profilPentruAI(p)).not.toHaveProperty("nume");
  });
  it("trimite obiectivul ales", () => {
    expect(profilPentruAI(p)?.obiective).toEqual(["Nu sunt sigur încă"]);
  });
});
