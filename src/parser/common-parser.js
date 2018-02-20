export function setSkeleton(chart) {
  const factor_primary_fontsize = 0.08;
  const factor_secondary_fontsize = 0.045;
  const factor_tertiary_fontsize = 0.035;
  const factor_space_between_lines = 4 / 3;
  const factor_margin_body = 3;
  chart.margins = chart.margins || {
    top: chart.height_svg * 0.09,
    bottom: chart.height_svg * 0.09,
    left: chart.width_svg * 0.04,
    right: chart.width_svg * 0.04
  };

  chart.width_svg = chart.width_svg || 750;
  chart.height_svg = chart.height_svg || 433;

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
    chart.fontsize_graphText || chart.height_g_total * factor_tertiary_fontsize;

  chart.y_g_title = chart.fontsize_title;
  chart.y_g_subtitle =
    chart.y_g_title * factor_space_between_lines + chart.fontsize_subtitle;

  chart.height_g_header = chart.y_g_subtitle + chart.fontsize_subtitle * 2;
  chart.height_g_footer = chart.height_g_total / 7;
  chart.height_g_body =
    chart.height_g_total - chart.height_g_header - chart.height_g_footer;

  chart.x_g_total = chart.margins.left;
  chart.x_g_body = chart.margins.left * factor_margin_body;
  chart.x_g_legend = chart.width_g_total - chart.margins.right;

  chart.y_g_total = chart.margins.top;
  // chart.y_g_header = chart.y_g_total;
  chart.y_g_body = chart.height_g_header * 1.1;
  chart.y_g_xAxis = chart.height_g_body;
  chart.y_g_footer = chart.y_g_body + chart.height_g_body;
  chart.y_g_referenceBox = chart.fontsize_reference * 3.5;
  chart.y_g_madeBy = chart.fontsize_madeBy * factor_space_between_lines;

  chart.fontcolor_title = chart.fontcolor_title || "#000000";
  chart.fontcolor_subtitle = chart.fontcolor_subtitle || "#4B4949";
  chart.fontcolor_unit = chart.fontcolor_unit || "#4B4949";
  chart.fontcolor_legend = chart.fontcolor_legend || "#4B4949";
  chart.fontcolor_reference = chart.fontcolor_reference || "#7F7F7F";
  chart.fontcolor_madeBy = chart.fontcolor_madeBy || "#7F7F7F";
  chart.fontcolor_graphText = chart.fontcolor_graphText || "#000000";
  chart.fontcolor_tickText = chart.fontcolor_tickText || "#A0A0A0";
  chart.colorStripe1 = chart.colorStripe1 || "#F0F0F0";
  chart.colorStripe2 = chart.colorStripe2 || "#ffffff";
  chart.colorBI = chart.colorBI || "#3182bd";
  chart.color = chart.color || "#ADADAD";
  chart.colorToFocus = chart.colorToFocus || "#4AC6AE";

  chart.fontstyle_title = chart.fontstyle_title || "bold";
  chart.fontstyle_unit = chart.fontstyle_unit || "bold";
  chart.fontstyle_reference = chart.fontstyle_reference || "bold";
  chart.fontstyle_madeBy = chart.fontstyle_madeBy || "bold";

  chart.numOfXAxisTicks = chart.numOfXAxisTicks || 5;
  chart.numOfYAxisTicks = chart.numOfYAxisTicks || 5;
}
