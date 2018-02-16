import BarFactory from "../../src/factory/bar-factory";
import * as d3 from "d3";

describe("# Bar Parser", () => {
  describe("## Case 1", () => {
    test("getChildG(g) returns {graph: ..., axis:..., etc.}", () => {
      const bar = new BarFactory();
      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const svg = d3.select(svgElement);
      const gParent = svg.append("g").attr("class", "parent");
      const g0 = gParent.append("g").attr("class", "graph");
      const g1 = gParent.append("g").attr("class", "y axis");
      const g2 = gParent.append("g").attr("class", "x axis");
      const childrenObject = bar.getChildG(gParent);
      expect(Object.keys(childrenObject).length).toBe(2);
      expect(childrenObject.graph.getAttribute("class")).toBe("graph");
      expect(childrenObject["axis"].length).toBe(2);
      expect(childrenObject["axis"][0].getAttribute("class")).toMatch(
        /[xy] axis/
      );
      expect(childrenObject["axis"][1].getAttribute("class")).toMatch(
        /[xy] axis/
      );
    });
  });
});
