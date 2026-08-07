import { expect, test } from "bun:test"
import { Fragment } from "react"
import { expectFootprintRecovery } from "./fixture/jlcpcb-reproduction-utils.js"

const X6511Wvs03h = () => {
  const pads = [
    { pin: 1, x: -2.54, y: -1.799971 },
    { pin: 2, x: 0, y: 1.799971 },
    { pin: 3, x: 2.54, y: -1.799971 },
  ]

  return (
    <chip
      name="J1"
      footprint={
        <footprint>
          {pads.map(({ pin, x, y }) => (
            <Fragment key={pin}>
              <smtpad
                portHints={[`pin${pin}`]}
                pcbX={x}
                pcbY={y}
                width={1.27}
                height={2.1999956}
                shape="rect"
              />
            </Fragment>
          ))}
        </footprint>
      }
    />
  )
}

test("recovers C2883760 with its staggered SMD pin-header row pitch", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: X6511Wvs03h,
    sourceHints: ["C2883760 X6511WVS-03H-C60D48R2", "SMD,P=2.54mm(交错脚)"],
  })

  expect(result.best?.family).toBe("smdpinheader")
  expect(result.best?.footprinterString).toContain("_py3.6mm")
  expect(result.best?.copperIntersectionOverUnion).toBeGreaterThan(0.999)
})
