import * as d3 from "d3";

export function setSkeleton(chart) {
  const factor_primary_fontsize = 0.07;
  const factor_secondary_fontsize = 0.045;
  const factor_tertiary_fontsize = 0.035;
  const factor_quaternary_fontsize = 0.029;
  const factor_space_between_lines = 1.7;
  const factor_margin_body = 2;

  chart.width_svg = chart.width_svg || 750;
  chart.height_svg = chart.height_svg || 421.875;
  chart.margins = chart.margins || {
    top: chart.height_svg * 0.07,
    bottom: chart.height_svg * 0.07,
    left: chart.width_svg * 0.053,
    right: chart.width_svg * 0.053
  };
  chart.width_g_total =
    chart.width_svg - chart.margins.left - chart.margins.right;
  chart.width_g_body =
    chart.width_g_total -
    (chart.margins.left + chart.margins.right) * factor_margin_body;

  chart.height_g_total =
    chart.height_svg - chart.margins.top - chart.margins.bottom;

  chart.fontsize_title =
    chart.fontsize_title || chart.height_g_total * factor_primary_fontsize;
  chart.fontsize_subtitle =
    chart.fontsize_subtitle || chart.height_g_total * factor_secondary_fontsize;
  chart.fontsize_unit =
    chart.fontsize_unit || chart.height_g_total * factor_secondary_fontsize;
  chart.fontsize_legend =
    chart.fontsize_legend || chart.height_g_total * factor_secondary_fontsize;
  chart.fontsize_reference =
    chart.fontsize_reference || chart.height_g_total * factor_tertiary_fontsize;
  chart.fontsize_madeBy =
    chart.fontsize_madeBy || chart.height_g_total * factor_tertiary_fontsize;
  chart.fontsize_yAxis =
    chart.fontsize_yAxis || chart.height_g_total * factor_tertiary_fontsize;
  chart.fontsize_xAxis =
    chart.fontsize_xAxis || chart.height_g_total * factor_tertiary_fontsize;
  chart.fontsize_graphText =
    chart.fontsize_graphText ||
    chart.height_g_total * factor_secondary_fontsize;

  // chart.y_g_titleBox = chart.
  chart.y_g_title = chart.fontsize_title;
  chart.y_g_subtitle = chart.fontsize_subtitle * factor_space_between_lines;
  // chart.y_g_title * factor_space_between_lines + chart.fontsize_subtitle;

  chart.height_g_header = chart.y_g_subtitle + chart.fontsize_subtitle * 2;
  chart.height_g_footer = chart.height_g_total / 4.2;
  chart.height_g_body =
    chart.height_g_total - chart.height_g_header - chart.height_g_footer;

  chart.x_g_total = chart.margins.left;
  chart.x_g_body = chart.margins.left * factor_margin_body;
  chart.x_g_legend = chart.width_g_total;

  chart.y_g_total = chart.margins.top;
  // chart.y_g_header = chart.y_g_total;
  chart.y_g_body = chart.height_g_header * 1.3;
  // chart.y_g_body = chart.height_g_header * 1.1;
  chart.y_g_xAxis = chart.height_g_body;
  chart.y_g_footer = chart.y_g_body + chart.height_g_body;
  chart.y_g_referenceBox = chart.fontsize_reference * 3.5;
  chart.y_g_madeBy = chart.fontsize_madeBy * factor_space_between_lines;

  chart.tempTheme = {
    backgroundColor: "#F9F9F9",
    colorPrimary: "#000000",
    colorSecondary: "#4B4949",
    colorTernary: "#7F7F7F",
    colorStripe1: "#e6e7e8",
    colorStripe2: "#f3f4f5",
    colorAxis: "#6d6d6d"
  };
  chart.theme = chart.theme || chart.tempTheme;
  Object.keys(chart.tempTheme).forEach(t => {
    if (chart.theme[t] === undefined) {
      chart.theme[t] = chart.tempTheme[t];
    }
  });
  chart.backgroundColor = chart.backgroundColor || chart.theme.backgroundColor;
  chart.fontFamily = "Spoqa Hans";

  chart.fontcolor_title = chart.fontcolor_title || chart.theme.colorPrimary;
  chart.fontcolor_graphText =
    chart.fontcolor_graphText || chart.theme.colorPrimary;

  chart.fontcolor_subtitle =
    chart.fontcolor_subtitle || chart.theme.colorSecondary;
  chart.fontcolor_unit = chart.fontcolor_unit || chart.theme.colorSecondary;
  chart.fontcolor_legend = chart.fontcolor_legend || chart.theme.colorSecondary;

  chart.fontcolor_reference =
    chart.fontcolor_reference || chart.theme.colorTernary;
  chart.fontcolor_madeBy = chart.fontcolor_madeBy || chart.theme.colorTernary;
  chart.fontcolor_tickText =
    chart.fontcolor_tickText || chart.theme.colorSecondary;

  // chart.colorStripe1 = chart.colorStripe1 || "#F0F0F0";
  // chart.colorStripe2 = chart.colorStripe2 || "#ffffff";
  chart.colorStripe1 = chart.colorStripe1 || chart.theme.colorStripe1;
  chart.colorStripe2 = chart.colorStripe2 || chart.theme.colorStripe2;
  chart.colorBI = chart.colorBI || "#ff4b00";
  // chart.color = chart.color || "#ADADAD";
  // chart.colorToFocus = chart.colorToFocus || "#4AC6AE";

  chart.fontstyle_title = chart.fontstyle_title || "bold";
  chart.fontstyle_unit = chart.fontstyle_unit || "bold";
  chart.fontstyle_reference = chart.fontstyle_reference || "bold";
  chart.fontstyle_madeBy = chart.fontstyle_madeBy || "bold";

  chart.numOfXAxisTicks = chart.numOfXAxisTicks || 5;
  chart.numOfYAxisTicks = chart.numOfYAxisTicks || 5;

  // chart.delayType = chart.delayType || "delayInOrder";
  chart.delayType = chart.delayType || "accumedDelay";
  chart.paddingBtwRects = chart.paddingBtwRects || 0.4;
  chart.opacity = chart.opacity || 1;
  chart.opacityToHide = chart.opacityToHide || 0.55;

  chart.duration = chart.duration === undefined ? 2000 : chart.duration;
  chart.delay = chart.delay === undefined ? 1000 : chart.delay;
  chart.accumedDelay =
    chart.accumedDelay === undefined ? 0 : chart.accumedDelay;
  chart.accumedDelay2 =
    chart.accumedDelay2 === undefined ? 0 : chart.accumedDelay2;
  chart.lastFor = chart.lastFor === undefined ? 2000 : chart.lastFor;

  chart.customizedEaseBackOut = d3.easeBackOut.overshoot(1.3);
  chart.easingType = chart.easingType || "customizedEaseBackOut";
  chart.easing = chart[chart.easingType]
    ? chart[chart.easingType]
    : d3[chart.easingType] ? d3[chart.easingType] : d3.easeBackOut;
}
