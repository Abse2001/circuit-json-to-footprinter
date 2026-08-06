import { expect, test } from "bun:test"
import { Fragment } from "react"
import { expectFootprintRecovery } from "./fixture/jlcpcb-reproduction-utils.js"

const TS3USB221ARSER = () => {
  const bottomPads = [-0.750062, -0.249936, 0.249936, 0.750062]
  const topPads = [...bottomPads].reverse()

  return (
    <chip
      name="U1"
      footprint={
        <footprint>
          {bottomPads.map((x, index) => (
            <Fragment key={`bottom-${index}`}>
              <smtpad
                portHints={[`pin${index + 1}`]}
                pcbX={x}
                pcbY={-0.675132}
                width={0.2500122}
                height={0.5249926}
                shape="rect"
              />
            </Fragment>
          ))}
          <smtpad
            portHints={["pin5"]}
            pcbX={0.8599932}
            pcbY={0}
            width={0.580009}
            height={0.2999994}
            shape="rect"
          />
          {topPads.map((x, index) => (
            <Fragment key={`top-${index}`}>
              <smtpad
                portHints={[`pin${index + 6}`]}
                pcbX={x}
                pcbY={0.675132}
                width={0.2500122}
                height={0.5249926}
                shape="rect"
              />
            </Fragment>
          ))}
          <smtpad
            portHints={["pin10"]}
            pcbX={-0.8599932}
            pcbY={0}
            width={0.580009}
            height={0.2999994}
            shape="rect"
          />
        </footprint>
      }
    />
  )
}

test("recovers C128396 with its wider left and right UQFN pads", async () => {
  const result = await expectFootprintRecovery({
    FootprintComponent: TS3USB221ARSER,
    sourceHints: ["C128396 TS3USB221ARSER UQFN-10(1.5x2)"],
  })

  expect(result.best?.family).toBe("qfn")
  expect(result.best?.footprinterString).toContain("lrpw0.3mm")
  expect(result.best?.footprinterString).toContain("lrpl0.58mm")
  expect(result.best?.footprinterString).toContain("rounded0")
  expect(result.best?.copperIntersectionOverUnion).toBeGreaterThanOrEqual(0.999)
}, 30_000)
