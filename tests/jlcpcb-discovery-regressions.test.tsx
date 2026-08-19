import { expect, test } from "bun:test"
import type { AnyCircuitElement, PcbSilkscreenText } from "circuit-json"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { Fragment } from "react"
import { footprinterStringToFootprint } from "../lib/index.js"
import {
  expectFootprintRecovery,
  renderFootprintToCircuitJson,
} from "./fixture/jlcpcb-reproduction-utils.js"

const Txs0102Dqer = () => (
  <chip
    name="U1"
    footprint={
      <footprint>
        {[
          [-0.525018, 0.479806, 0.5299964, 8],
          [-0.175006, 0.48006, 0.5299964, 7],
          [0.175006, 0.479806, 0.5299964, 6],
          [0.525018, 0.479806, 0.5299964, 5],
          [0.525018, -0.48006, 0.5299964, 4],
          [0.175006, -0.48006, 0.5299964, 3],
          [-0.175006, -0.48006, 0.5299964, 2],
          [-0.525018, -0.445008, 0.5999988, 1],
        ].map(([pcbX, pcbY, height, pin]) => (
          <Fragment key={pin}>
            <smtpad
              portHints={[`pin${pin}`]}
              pcbX={pcbX}
              pcbY={pcbY}
              width={0.175006}
              height={height}
              shape="rect"
            />
          </Fragment>
        ))}
      </footprint>
    }
  />
)

const Ssm3K56Act = () => (
  <chip
    name="Q1"
    footprint={
      <footprint>
        <smtpad
          portHints={["pin1"]}
          pcbX={0.350012}
          pcbY={-0.175006}
          width={0.3999992}
          height={0.1999996}
          shape="rect"
        />
        <smtpad
          portHints={["pin2"]}
          pcbX={0.350012}
          pcbY={0.175006}
          width={0.3999992}
          height={0.1999996}
          shape="rect"
        />
        <smtpad
          portHints={["pin3"]}
          pcbX={-0.350012}
          pcbY={0}
          width={0.3999992}
          height={0.5500116}
          shape="rect"
        />
      </footprint>
    }
  />
)

const Ss41F = () => (
  <chip
    name="U1"
    footprint={
      <footprint>
        {[-1.27, 0, 1.27].map((pcbX, index) => (
          <Fragment key={pcbX}>
            <platedhole
              portHints={[`pin${index + 1}`]}
              pcbX={pcbX}
              pcbY={0}
              holeWidth={0.700024}
              holeHeight={index === 0 ? 1.8200624 : 1.4000226}
              outerWidth={0.8999982}
              outerHeight={1.5999968}
              rectPad={index === 0}
              pcbRotation="0deg"
              shape="pill"
            />
          </Fragment>
        ))}
      </footprint>
    }
  />
)

const BxMx1255Pwz = () => (
  <chip
    name="J1"
    footprint={
      <footprint>
        {[-2.499995, -1.250061, 0.000127, 1.250061, 2.499995].map(
          (pcbX, index) => (
            <Fragment key={pcbX}>
              <platedhole
                portHints={[`pin${index + 1}`]}
                pcbX={pcbX}
                pcbY={0}
                holeWidth={0.700024}
                holeHeight={index === 0 ? 1.8200624 : 1.3240258}
                outerWidth={0.8999982}
                outerHeight={1.524}
                rectPad={index === 0}
                pcbRotation="0deg"
                shape="pill"
              />
            </Fragment>
          ),
        )}
      </footprint>
    }
  />
)

const A3362P1103Lf = () => (
  <chip
    name="RV1"
    footprint={
      <footprint>
        {[
          [-2.54, -1.27, 1],
          [0, 1.27, 2],
          [2.54, -1.27, 3],
        ].map(([pcbX, pcbY, pin]) => (
          <Fragment key={pin}>
            <platedhole
              portHints={[`pin${pin}`]}
              pcbX={pcbX}
              pcbY={pcbY}
              outerDiameter={1.524}
              holeDiameter={0.762}
              shape="circle"
            />
          </Fragment>
        ))}
      </footprint>
    }
  />
)

const Dbt50G7622P = () => (
  <chip
    name="J1"
    footprint={
      <footprint>
        {[-3.81, 3.81].map((pcbX, index) => (
          <Fragment key={pcbX}>
            <platedhole
              portHints={[`pin${index + 1}`]}
              pcbX={pcbX}
              pcbY={0}
              outerDiameter={2.5999948}
              holeDiameter={1.5999968}
              shape="circle"
            />
          </Fragment>
        ))}
      </footprint>
    }
  />
)

const shiftFootprint = (
  elements: AnyCircuitElement[],
  xOffset: number,
): AnyCircuitElement[] =>
  elements.map((element) =>
    "x" in element && typeof element.x === "number"
      ? { ...element, x: element.x + xOffset }
      : element,
  )

const createComparisonLabel = (text: string, x: number): PcbSilkscreenText => ({
  type: "pcb_silkscreen_text",
  pcb_silkscreen_text_id: `comparison_label_${text}`,
  pcb_component_id: "comparison",
  font: "tscircuit2024",
  font_size: 0.8,
  text,
  layer: "top",
  anchor_position: { x, y: 2.5 },
  anchor_alignment: "center",
})

test("keeps 5 um pad precision when recovering C2652935", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: Txs0102Dqer,
    minimumCopperIntersectionOverUnion: 0.95,
    sourceHints: ["C2652935 TXS0102DQER VSSOP-8"],
  })

  expect(result.best!.footprinterString).toContain("_pw0.175mm_")
})

test("seeds the two-lead thermal geometry for C146308", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: Ssm3K56Act,
    minimumCopperIntersectionOverUnion: 0.99,
    sourceHints: ["C146308 SSM3K56ACT,L3F SOT-883"],
  })

  expect(result.best!.footprinterString).toBe(
    "qfn2_thermalpad0.4mmx0.55mm_p0.7mm_w0.6mm_pw0.2mm_pl0.4mm_thermalpadcenteroffsetx-0.7mm",
  )
})

test("recovers the C134475 linear pill-plated row", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: Ss41F,
    minimumCopperIntersectionOverUnion: 0.99,
    sourceHints: ["C134475 SS41F TO-92S"],
  })

  expect(result.best!.footprinterString).toBe(
    "jst3_zh_p1.27mm_pw0.9mm_pl1.6mm_id0.7mm",
  )
})

test("recovers the C18077930 five-pin linear pill-plated row", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: BxMx1255Pwz,
    minimumCopperIntersectionOverUnion: 0.99,
    sourceHints: ["C18077930 BX-MX1.25-5PWZ CONN-TH_5P-P1.25"],
  })

  expect(result.best!.footprinterString).toBe(
    "jst5_zh_p1.2499mm_pw0.9mm_pl1.524mm_id0.7mm",
  )
})

test("recovers C58159 as a measured potentiometer", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: A3362P1103Lf,
    sourceHints: ["C58159 3362P-1-103LF trimmer potentiometer"],
  })

  expect(result.best!.footprinterString).toBe(
    "potentiometer_p2.54mm_h2.54mm_od1.524mm_id0.762mm_pin1location(leftside,bottom)",
  )
})

test("does not classify C496127 barrier terminal as radial", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: Dbt50G7622P,
    sourceHints: [
      "C496127 DBT50G-7.62-2P CONN-TH_2P-P7.62_L15.2-W16.7-EX4.2 Barrier Terminal Blocks",
    ],
  })

  expect(result.best!.family).not.toBe("radial")
  expect(result.candidates.every(({ family }) => family !== "radial")).toBe(
    true,
  )

  const jlcFootprint = await renderFootprintToCircuitJson(Dbt50G7622P)
  const matchedFootprint = footprinterStringToFootprint(
    result.best!.footprinterString,
  )
  const comparison = [
    ...shiftFootprint(jlcFootprint, -7),
    ...shiftFootprint(matchedFootprint.pads, 7),
    createComparisonLabel("JLC C496127", -7),
    createComparisonLabel("Matched", 7),
  ]

  expect(convertCircuitJsonToPcbSvg(comparison)).toMatchSvgSnapshot(
    import.meta.path,
    "C496127-jlc-vs-match",
  )
})
