const arr0 = [
  [
    "State",
    "Under 5 Years",
    "5 to 13 Years",
    "14 to 17 Years",
    "18 to 24 Years",
    "25 to 44 Years",
    "45 to 64 Years",
    "65 Years and Over"
  ],
  [
    "CA",
    "2704659",
    "4499890",
    "2159981",
    "3853788",
    "10604510",
    "8819342",
    "4114496"
  ],
  [
    "TX",
    "2027307",
    "3277946",
    "1420518",
    "2454721",
    "7017731",
    "5656528",
    "2472223"
  ],
  [
    "NY",
    "1208495",
    "2141490",
    "1058031",
    "1999120",
    "5355235",
    "5120254",
    "2607672"
  ],
  [
    "FL",
    "1140516",
    "1938695",
    "925060",
    "1607297",
    "4782119",
    "4746856",
    "3187797"
  ],
  [
    "IL",
    "894368",
    "1558919",
    "725973",
    "1311479",
    "3596343",
    "3239173",
    "1575308"
  ],
  [
    "PA",
    "737462",
    "1345341",
    "679201",
    "1203944",
    "3157759",
    "3414001",
    "1910571"
  ]
];

const arr1 = [
  ["", "삼성", "SK"],
  ["2014년", "28.4", "10.0"],
  ["2015년", "30.8", "11.8"],
  ["2016년", "36.1", "10.2"],
  ["2017년", "38.3", "10.7"]
];

// const csv0 = `"State","Under 5 Years","5 to 13 Years","14 to 17 Years","18 to 24 Years","25 to 44 Years","45 to 64 Years","65 Years and Over"
// "CA","2704659","4499890","2159981","3853788","10604510","8819342","4114496"
// "TX","2027307","3277946","1420518","2454721","7017731","5656528","2472223"
// "NY","1208495","2141490","1058031","1999120","5355235","5120254","2607672"
// "FL","1140516","1938695","925060","1607297","4782119","4746856","3187797"
// "IL","894368","1558919","725973","1311479","3596343","3239173","1575308"
// "PA","737462","1345341","679201","1203944","3157759","3414001","1910571"`;

const csv0 = `State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over
CA,2704659,4499890,2159981,3853788,10604510,8819342,4114496
TX,2027307,3277946,1420518,2454721,7017731,5656528,2472223
NY,1208495,2141490,1058031,1999120,5355235,5120254,2607672
FL,1140516,1938695,925060,1607297,4782119,4746856,3187797
IL,894368,1558919,725973,1311479,3596343,3239173,1575308
PA,737462,1345341,679201,1203944,3157759,3414001,1910571`;

const csv1 = `,삼성,SK
2014년,28.4,10.0
2015년,30.8,11.8
2016년,36.1,10.2
2017년,38.3,10.7`;

const csv2 = `단지명,전용면적,상승가격,상승률
은평아파트,54.43,2천만원,108.2
혼마아파트,82.5,1천3백만원,111.42
현대아파트,53.06,3천만원,118.3
롯데아파트,73.5,1억원,104.3
`;

const type = "grouped-bar";
const width_svg = 750;
const height_svg = 433;
// const margins = { top: 40, bottom: 40, left: 30, right: 30 };
const focusType = "";
const color = "steelblue";
const colorToFocus = "gold";
const opacity = 1;
const opacityToHide = 0.15;
const duration = 0;
const delay = 0;
const numOfYAxisTicks = 5;
const paddingBtwRects = 0.4;
const colorStripe1 = "";
const colorStripe2 = "";

const fontFamily = "sans-serif";
const title = "Title";
const subtitle = "Subtitle";
const unit = "unit";
const legend = "legend";
const reference = "reference";
const madeBy = "anonymous";

const fontsize_title = "";
const fontsize_subtitle = "";
const fontsize_unit = "";
const fontsize_legend = "";
const fontsize_reference = "";

const fontcolor_title = "";
const fontcolor_subtitle = "";
const fontcolor_unit = "";
const fontcolor_legend = "";
const fontcolor_reference = "";

const fontstyle_title = "";
const fontstyle_unit = "";
const fontstyle_reference = "";

export const gChart0 = {
  type,
  rawData: arr0,
  width_svg,
  height_svg,
  // margins,

  // focusType,
  duration,
  delay,
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks,
  paddingBtwRects
  // color,
  // colorToFocus,
  // opacity,
  // opacityToHide
};

export const gChart1 = {
  type,
  rawData: arr1,
  width_svg,
  height_svg,
  // margins,

  // focusType,
  duration,
  delay,
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks,
  paddingBtwRects
  // color,
  // colorToFocus,
  // opacity,
  // opacityToHide
};
