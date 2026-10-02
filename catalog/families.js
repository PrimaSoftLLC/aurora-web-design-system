export const families=[
 {id:'selection',title:'Выбор',cards:['DsCheck','DsCheckButton','DsSelectBox','DsCheckbox'],aliases:['selection','checkbox','чекбокс']},
 {id:'charts',title:'Графики',cards:['DsCharts','DsChart','DsChartLegend','DsChartTooltip','DsSparkline','DsScoreBar'],aliases:['chart','график']},
 {id:'header',title:'Шапка',cards:['DsHeader','DsAppHeader','DsHeaderChip','DsUserMenu'],aliases:['header','навигация']},
];
export const familyFor=id=>families.find(family=>family.cards.includes(id))??null;
