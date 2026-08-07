import { expect, test } from "bun:test"
import { expectFootprintRecovery } from "./fixture/jlcpcb-reproduction-utils.js"

const HlAm2835 = () => (
  <chip
    name="D1"
    footprint={
      <footprint>
        <smtpad
          portHints={["pin1"]}
          pcbX={-0.78000225}
          pcbY={0}
          width={2.3299928}
          height={2.3800054}
          shape="rect"
        />
        <smtpad
          portHints={["pin2"]}
          pcbX={1.39499975}
          pcbY={0}
          width={1.0999978}
          height={2.3800054}
          shape="rect"
        />
      </footprint>
    }
  />
)

test("recovers C210314 with measured LED2835 pad parameters", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: HlAm2835,
    sourceHints: ["C210314 HL-AM-2835H489W-S1-08HL-HR3 SMD2835-2P"],
  })

  expect(result.best!.footprinterString).toBe(
    "led2835_p1w2.33mm_p2w1.1mm_ph2.38mm_p1x-0.78mm_p2x1.395mm",
  )
  expect(result.best!.copperIntersectionOverUnion).toBeGreaterThan(0.9999)
})
