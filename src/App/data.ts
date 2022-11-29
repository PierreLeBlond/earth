const currentCountry = "albania";

const countryAvailable: {[code: number]: number} = {
  97: 3,
  150: 3,
  48: 6,
  35: 3,
  67: 6,
  133: 6,
  120: 3,
  111: 3,
  94: 3,
  54: 3,
  112: 3,
  69: 3,
  140: 3,
  37: 3,
  40: 3,
  19: 3,
  91: 6,
  123: 6,
  50: 3,
  107: 3,
  228: 3
};

const country: {[name: string]: string} = {
  germany: "DE",
  canada: "CA",
  usa: "US",
  france: "FR",
  austria: "AT",
  czechia: "CZ",
  slovakia: "SK",
  hungary: "HU",
  serbia: "RS",
  bosnia: "BA",
  croatia: "HR",
  montenegro: "ME",
  albania: "AL",
  greece: "GR",
  turkey: "TR",
  japan: "JP",
  taiwan: "TW",
  vietnam: "VN",
  cambodia: "KH",
  thailand: "TH",
  malaysia: "MY",
  singapore: "SG"
};

const countryName: {[code: string]: string} = {
  "AF":"AFGHANISTAN",
  "AX":"ÅLAND ISLANDS",
  "AL":"ALBANIA",
  "DZ":"ALGERIA",
  "AS":"AMERICAN SAMOA",
  "AD":"ANDORRA",
  "AO":"ANGOLA",
  "AI":"ANGUILLA",
  "AQ":"ANTARCTICA",
  "AG":"ANTIGUA AND BARBUDA",
  "AR":"ARGENTINA",
  "AM":"ARMENIA",
  "AW":"ARUBA",
  "AU":"AUSTRALIA",
  "AT":"AUSTRIA",
  "AZ":"AZERBAIJAN",
  "BS":"BAHAMAS",
  "BH":"BAHRAIN",
  "BD":"BANGLADESH",
  "BB":"BARBADOS",
  "BY":"BELARUS",
  "BE":"BELGIUM",
  "BZ":"BELIZE",
  "BJ":"BENIN",
  "BM":"BERMUDA",
  "BT":"BHUTAN",
  "BO":"BOLIVIA, PLURINATIONAL STATE OF",
  "BQ":"BONAIRE, SINT EUSTATIUS AND SABA",
  "BA":"BOSNIA",
  "BW":"BOTSWANA",
  "BV":"BOUVET ISLAND",
  "BR":"BRAZIL",
  "IO":"BRITISH INDIAN OCEAN TERRITORY",
  "BN":"BRUNEI DARUSSALAM",
  "BG":"BULGARIA",
  "BF":"BURKINA FASO",
  "BI":"BURUNDI",
  "KH":"CAMBODIA",
  "CM":"CAMEROON",
  "CA":"CANADA",
  "CV":"CAPE VERDE",
  "KY":"CAYMAN ISLANDS",
  "CF":"CENTRAL AFRICAN REPUBLIC",
  "TD":"CHAD",
  "CL":"CHILE",
  "CN":"CHINA",
  "CX":"CHRISTMAS ISLAND",
  "CC":"COCOS (KEELING) ISLANDS",
  "CO":"COLOMBIA",
  "KM":"COMOROS",
  "CG":"CONGO",
  "CD":"CONGO, THE DEMOCRATIC REPUBLIC OF THE",
  "CK":"COOK ISLANDS",
  "CR":"COSTA RICA",
  "CI":"CÔTE D'IVOIRE",
  "HR":"CROATIA",
  "CU":"CUBA",
  "CW":"CURAÇAO",
  "CY":"CYPRUS",
  "CZ":"CZECHIA",
  "DK":"DENMARK",
  "DJ":"DJIBOUTI",
  "DM":"DOMINICA",
  "DO":"DOMINICAN REPUBLIC",
  "EC":"ECUADOR",
  "EG":"EGYPT",
  "SV":"EL SALVADOR",
  "GQ":"EQUATORIAL GUINEA",
  "ER":"ERITREA",
  "EE":"ESTONIA",
  "ET":"ETHIOPIA",
  "FK":"FALKLAND ISLANDS (MALVINAS)",
  "FO":"FAROE ISLANDS",
  "FJ":"FIJI",
  "FI":"FINLAND",
  "FR":"FRANCE",
  "GF":"FRENCH GUIANA",
  "PF":"FRENCH POLYNESIA",
  "TF":"FRENCH SOUTHERN TERRITORIES",
  "GA":"GABON",
  "GM":"GAMBIA",
  "GE":"GEORGIA",
  "DE":"GERMANY",
  "GH":"GHANA",
  "GI":"GIBRALTAR",
  "GR":"GREECE",
  "GL":"GREENLAND",
  "GD":"GRENADA",
  "GP":"GUADELOUPE",
  "GU":"GUAM",
  "GT":"GUATEMALA",
  "GG":"GUERNSEY",
  "GN":"GUINEA",
  "GW":"GUINEA-BISSAU",
  "GY":"GUYANA",
  "HT":"HAITI",
  "HM":"HEARD ISLAND AND MCDONALD ISLANDS",
  "VA":"HOLY SEE (VATICAN CITY STATE)",
  "HN":"HONDURAS",
  "HK":"HONG KONG",
  "HU":"HUNGARY",
  "IS":"ICELAND",
  "IN":"INDIA",
  "ID":"INDONESIA",
  "IR":"IRAN, ISLAMIC REPUBLIC OF",
  "IQ":"IRAQ",
  "IE":"IRELAND",
  "IM":"ISLE OF MAN",
  "IL":"ISRAEL",
  "IT":"ITALY",
  "JM":"JAMAICA",
  "JP":"JAPAN",
  "JE":"JERSEY",
  "JO":"JORDAN",
  "KZ":"KAZAKHSTAN",
  "KE":"KENYA",
  "KI":"KIRIBATI",
  "KP":"KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF",
  "KR":"KOREA, REPUBLIC OF",
  "KW":"KUWAIT",
  "KG":"KYRGYZSTAN",
  "LA":"LAO PEOPLE'S DEMOCRATIC REPUBLIC",
  "LV":"LATVIA",
  "LB":"LEBANON",
  "LS":"LESOTHO",
  "LR":"LIBERIA",
  "LY":"LIBYA",
  "LI":"LIECHTENSTEIN",
  "LT":"LITHUANIA",
  "LU":"LUXEMBOURG",
  "MO":"MACAO",
  "MK":"MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF",
  "MG":"MADAGASCAR",
  "MW":"MALAWI",
  "MY":"MALAYSIA",
  "MV":"MALDIVES",
  "ML":"MALI",
  "MT":"MALTA",
  "MH":"MARSHALL ISLANDS",
  "MQ":"MARTINIQUE",
  "MR":"MAURITANIA",
  "MU":"MAURITIUS",
  "YT":"MAYOTTE",
  "MX":"MEXICO",
  "FM":"MICRONESIA, FEDERATED STATES OF",
  "MD":"MOLDOVA, REPUBLIC OF",
  "MC":"MONACO",
  "MN":"MONGOLIA",
  "ME":"MONTENEGRO",
  "MS":"MONTSERRAT",
  "MA":"MOROCCO",
  "MZ":"MOZAMBIQUE",
  "MM":"MYANMAR",
  "NA":"NAMIBIA",
  "NR":"NAURU",
  "NP":"NEPAL",
  "NL":"NETHERLANDS",
  "NC":"NEW CALEDONIA",
  "NZ":"NEW ZEALAND",
  "NI":"NICARAGUA",
  "NE":"NIGER",
  "NG":"NIGERIA",
  "NU":"NIUE",
  "NF":"NORFOLK ISLAND",
  "MP":"NORTHERN MARIANA ISLANDS",
  "NO":"NORWAY",
  "OM":"OMAN",
  "PK":"PAKISTAN",
  "PW":"PALAU",
  "PS":"PALESTINIAN TERRITORY, OCCUPIED",
  "PA":"PANAMA",
  "PG":"PAPUA NEW GUINEA",
  "PY":"PARAGUAY",
  "PE":"PERU",
  "PH":"PHILIPPINES",
  "PN":"PITCAIRN",
  "PL":"POLAND",
  "PT":"PORTUGAL",
  "PR":"PUERTO RICO",
  "QA":"QATAR",
  "RE":"RÉUNION",
  "RO":"ROMANIA",
  "RU":"RUSSIAN FEDERATION",
  "RW":"RWANDA",
  "BL":"SAINT BARTHÉLEMY",
  "SH":"SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA",
  "KN":"SAINT KITTS AND NEVIS",
  "LC":"SAINT LUCIA",
  "MF":"SAINT MARTIN (FRENCH PART)",
  "PM":"SAINT PIERRE AND MIQUELON",
  "VC":"SAINT VINCENT AND THE GRENADINES",
  "WS":"SAMOA",
  "SM":"SAN MARINO",
  "ST":"SAO TOME AND PRINCIPE",
  "SA":"SAUDI ARABIA",
  "SN":"SENEGAL",
  "RS":"SERBIA",
  "SC":"SEYCHELLES",
  "SL":"SIERRA LEONE",
  "SG":"SINGAPORE",
  "SX":"SINT MAARTEN (DUTCH PART)",
  "SK":"SLOVAKIA",
  "SI":"SLOVENIA",
  "SB":"SOLOMON ISLANDS",
  "SO":"SOMALIA",
  "ZA":"SOUTH AFRICA",
  "GS":"SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",
  "SS":"SOUTH SUDAN",
  "ES":"SPAIN",
  "LK":"SRI LANKA",
  "SD":"SUDAN",
  "SR":"SURINAME",
  "SJ":"SVALBARD AND JAN MAYEN",
  "SZ":"SWAZILAND",
  "SE":"SWEDEN",
  "CH":"SWITZERLAND",
  "SY":"SYRIAN ARAB REPUBLIC",
  "TW":"TAIWAN",
  "TJ":"TAJIKISTAN",
  "TZ":"TANZANIA, UNITED REPUBLIC OF",
  "TH":"THAILAND",
  "TL":"TIMOR-LESTE",
  "TG":"TOGO",
  "TK":"TOKELAU",
  "TO":"TONGA",
  "TT":"TRINIDAD AND TOBAGO",
  "TN":"TUNISIA",
  "TR":"TURKEY",
  "TM":"TURKMENISTAN",
  "TC":"TURKS AND CAICOS ISLANDS",
  "TV":"TUVALU",
  "UG":"UGANDA",
  "UA":"UKRAINE",
  "AE":"UNITED ARAB EMIRATES",
  "GB":"UNITED KINGDOM",
  "US":"USA",
  "UM":"UNITED STATES MINOR OUTLYING ISLANDS",
  "UY":"URUGUAY",
  "UZ":"UZBEKISTAN",
  "VU":"VANUATU",
  "VE":"VENEZUELA, BOLIVARIAN REPUBLIC OF",
  "VN":"VIETNAM",
  "VG":"VIRGIN ISLANDS, BRITISH",
  "VI":"VIRGIN ISLANDS, U.S.",
  "WF":"WALLIS AND FUTUNA",
  "EH":"WESTERN SAHARA",
  "YE":"YEMEN",
  "ZM":"ZAMBIA",
  "ZW":"ZIMBABWE"
};


const countryPos: {[code: string]: {lat: string, lon: string}} = {"BD": {"lat": "24", "lon": "90"}, "BE": {"lat": "50.8333", "lon": "4"}, "BF": {"lat": "13", "lon": "-2"}, "BG": {"lat": "43", "lon": "25"}, "BA": {"lat": "44", "lon": "18"}, "BB": {"lat": "13.1667", "lon": "-59.5333"}, "WF": {"lat": "-13.3", "lon": "-176.2"}, "BM": {"lat": "32.3333", "lon": "-64.75"}, "BN": {"lat": "4.5", "lon": "114.6667"}, "BO": {"lat": "-17", "lon": "-65"}, "BH": {"lat": "26", "lon": "50.55"}, "BI": {"lat": "-3.5", "lon": "30"}, "BJ": {"lat": "9.5", "lon": "2.25"}, "BT": {"lat": "27.5", "lon": "90.5"}, "JM": {"lat": "18.25", "lon": "-77.5"}, "BV": {"lat": "-54.4333", "lon": "3.4"}, "BW": {"lat": "-22", "lon": "24"}, "WS": {"lat": "-13.5833", "lon": "-172.3333"}, "BR": {"lat": "-10", "lon": "-55"}, "BS": {"lat": "24.25", "lon": "-76"}, "JE": {"lat": "49.21", "lon": "-2.13"}, "BY": {"lat": "53", "lon": "28"}, "BZ": {"lat": "17.25", "lon": "-88.75"}, "RU": {"lat": "60", "lon": "100"}, "RW": {"lat": "-2", "lon": "30"}, "RS": {"lat": "44", "lon": "21"}, "TL": {"lat": "-8.55", "lon": "125.5167"}, "RE": {"lat": "-21.1", "lon": "55.6"}, "TM": {"lat": "40", "lon": "60"}, "TJ": {"lat": "39", "lon": "71"}, "RO": {"lat": "46", "lon": "25"}, "TK": {"lat": "-9", "lon": "-172"}, "GW": {"lat": "12", "lon": "-15"}, "GU": {"lat": "13.4667", "lon": "144.7833"}, "GT": {"lat": "15.5", "lon": "-90.25"}, "GS": {"lat": "-54.5", "lon": "-37"}, "GR": {"lat": "39", "lon": "22"}, "GQ": {"lat": "2", "lon": "10"}, "GP": {"lat": "16.25", "lon": "-61.5833"}, "JP": {"lat": "36", "lon": "138"}, "GY": {"lat": "5", "lon": "-59"}, "GG": {"lat": "49.5", "lon": "-2.56"}, "GF": {"lat": "4", "lon": "-53"}, "GE": {"lat": "42", "lon": "43.5"}, "GD": {"lat": "12.1167", "lon": "-61.6667"}, "GB": {"lat": "54", "lon": "-2"}, "GA": {"lat": "-1", "lon": "11.75"}, "GN": {"lat": "11", "lon": "-10"}, "GM": {"lat": "13.4667", "lon": "-16.5667"}, "GL": {"lat": "72", "lon": "-40"}, "GI": {"lat": "36.1833", "lon": "-5.3667"}, "GH": {"lat": "8", "lon": "-2"}, "OM": {"lat": "21", "lon": "57"}, "TN": {"lat": "34", "lon": "9"}, "JO": {"lat": "31", "lon": "36"}, "HR": {"lat": "45.1667", "lon": "15.5"}, "HT": {"lat": "19", "lon": "-72.4167"}, "HU": {"lat": "47", "lon": "20"}, "HK": {"lat": "22.25", "lon": "114.1667"}, "HN": {"lat": "15", "lon": "-86.5"}, "HM": {"lat": "-53.1", "lon": "72.5167"}, "VE": {"lat": "8", "lon": "-66"}, "PR": {"lat": "18.25", "lon": "-66.5"}, "PS": {"lat": "32", "lon": "35.25"}, "PW": {"lat": "7.5", "lon": "134.5"}, "PT": {"lat": "39.5", "lon": "-8"}, "KN": {"lat": "17.3333", "lon": "-62.75"}, "PY": {"lat": "-23", "lon": "-58"}, "IQ": {"lat": "33", "lon": "44"}, "PA": {"lat": "9", "lon": "-80"}, "PF": {"lat": "-15", "lon": "-140"}, "PG": {"lat": "-6", "lon": "147"}, "PE": {"lat": "-10", "lon": "-76"}, "PK": {"lat": "30", "lon": "70"}, "PH": {"lat": "13", "lon": "122"}, "PN": {"lat": "-24.7", "lon": "-127.4"}, "PL": {"lat": "52", "lon": "20"}, "PM": {"lat": "46.8333", "lon": "-56.3333"}, "ZM": {"lat": "-15", "lon": "30"}, "EH": {"lat": "24.5", "lon": "-13"}, "EE": {"lat": "59", "lon": "26"}, "EG": {"lat": "27", "lon": "30"}, "ZA": {"lat": "-29", "lon": "24"}, "EC": {"lat": "-2", "lon": "-77.5"}, "IT": {"lat": "42.8333", "lon": "12.8333"}, "VN": {"lat": "16", "lon": "106"}, "SB": {"lat": "-8", "lon": "159"}, "ET": {"lat": "8", "lon": "38"}, "SO": {"lat": "10", "lon": "49"}, "ZW": {"lat": "-20", "lon": "30"}, "SA": {"lat": "25", "lon": "45"}, "ES": {"lat": "40", "lon": "-4"}, "ER": {"lat": "15", "lon": "39"}, "ME": {"lat": "42", "lon": "19"}, "MD": {"lat": "47", "lon": "29"}, "MG": {"lat": "-20", "lon": "47"}, "MA": {"lat": "32", "lon": "-5"}, "MC": {"lat": "43.7333", "lon": "7.4"}, "UZ": {"lat": "41", "lon": "64"}, "MM": {"lat": "22", "lon": "98"}, "ML": {"lat": "17", "lon": "-4"}, "MO": {"lat": "22.1667", "lon": "113.55"}, "MN": {"lat": "46", "lon": "105"}, "MH": {"lat": "9", "lon": "168"}, "MK": {"lat": "41.8333", "lon": "22"}, "MU": {"lat": "-20.2833", "lon": "57.55"}, "MT": {"lat": "35.8333", "lon": "14.5833"}, "MW": {"lat": "-13.5", "lon": "34"}, "MV": {"lat": "3.25", "lon": "73"}, "MQ": {"lat": "14.6667", "lon": "-61"}, "MP": {"lat": "15.2", "lon": "145.75"}, "MS": {"lat": "16.75", "lon": "-62.2"}, "MR": {"lat": "20", "lon": "-12"}, "IM": {"lat": "54.23", "lon": "-4.55"}, "UG": {"lat": "1", "lon": "32"}, "MY": {"lat": "2.5", "lon": "112.5"}, "MX": {"lat": "23", "lon": "-102"}, "IL": {"lat": "31.5", "lon": "34.75"}, "FR": {"lat": "46", "lon": "2"}, "AW": {"lat": "12.5", "lon": "-69.9667"}, "SH": {"lat": "-15.9333", "lon": "-5.7"}, "SJ": {"lat": "78", "lon": "20"}, "FI": {"lat": "64", "lon": "26"}, "FJ": {"lat": "-18", "lon": "175"}, "FK": {"lat": "-51.75", "lon": "-59"}, "FM": {"lat": "6.9167", "lon": "158.25"}, "FO": {"lat": "62", "lon": "-7"}, "NI": {"lat": "13", "lon": "-85"}, "NL": {"lat": "52.5", "lon": "5.75"}, "NO": {"lat": "62", "lon": "10"}, "NA": {"lat": "-22", "lon": "17"}, "VU": {"lat": "-16", "lon": "167"}, "NC": {"lat": "-21.5", "lon": "165.5"}, "NE": {"lat": "16", "lon": "8"}, "NF": {"lat": "-29.0333", "lon": "167.95"}, "NG": {"lat": "10", "lon": "8"}, "NZ": {"lat": "-41", "lon": "174"}, "NP": {"lat": "28", "lon": "84"}, "NR": {"lat": "-0.5333", "lon": "166.9167"}, "NU": {"lat": "-19.0333", "lon": "-169.8667"}, "CK": {"lat": "-21.2333", "lon": "-159.7667"}, "CI": {"lat": "8", "lon": "-5"}, "CH": {"lat": "47", "lon": "8"}, "CO": {"lat": "4", "lon": "-72"}, "CN": {"lat": "35", "lon": "105"}, "CM": {"lat": "6", "lon": "12"}, "CL": {"lat": "-30", "lon": "-71"}, "CC": {"lat": "-12.5", "lon": "96.8333"}, "CA": {"lat": "60", "lon": "-95"}, "CG": {"lat": "-1", "lon": "15"}, "CF": {"lat": "7", "lon": "21"}, "CD": {"lat": "0", "lon": "25"}, "CZ": {"lat": "49.75", "lon": "15.5"}, "CY": {"lat": "35", "lon": "33"}, "CX": {"lat": "-10.5", "lon": "105.6667"}, "CR": {"lat": "10", "lon": "-84"}, "CV": {"lat": "16", "lon": "-24"}, "CU": {"lat": "21.5", "lon": "-80"}, "SZ": {"lat": "-26.5", "lon": "31.5"}, "SY": {"lat": "35", "lon": "38"}, "KG": {"lat": "41", "lon": "75"}, "KE": {"lat": "1", "lon": "38"}, "SR": {"lat": "4", "lon": "-56"}, "KI": {"lat": "1.4167", "lon": "173"}, "KH": {"lat": "13", "lon": "105"}, "SV": {"lat": "13.8333", "lon": "-88.9167"}, "KM": {"lat": "-12.1667", "lon": "44.25"}, "ST": {"lat": "1", "lon": "7"}, "SK": {"lat": "48.6667", "lon": "19.5"}, "KR": {"lat": "37", "lon": "127.5"}, "SI": {"lat": "46", "lon": "15"}, "KP": {"lat": "40", "lon": "127"}, "KW": {"lat": "29.3375", "lon": "47.6581"}, "SN": {"lat": "14", "lon": "-14"}, "SM": {"lat": "43.7667", "lon": "12.4167"}, "SL": {"lat": "8.5", "lon": "-11.5"}, "SC": {"lat": "-4.5833", "lon": "55.6667"}, "KZ": {"lat": "48", "lon": "68"}, "KY": {"lat": "19.5", "lon": "-80.5"}, "SG": {"lat": "1.3667", "lon": "103.8"}, "SE": {"lat": "62", "lon": "15"}, "SD": {"lat": "15", "lon": "30"}, "DO": {"lat": "19", "lon": "-70.6667"}, "DM": {"lat": "15.4167", "lon": "-61.3333"}, "DJ": {"lat": "11.5", "lon": "43"}, "DK": {"lat": "56", "lon": "10"}, "VG": {"lat": "18.5", "lon": "-64.5"}, "DE": {"lat": "51", "lon": "9"}, "YE": {"lat": "15", "lon": "48"}, "DZ": {"lat": "28", "lon": "3"}, "US": {"lat": "38", "lon": "-97"}, "UY": {"lat": "-33", "lon": "-56"}, "YT": {"lat": "-12.8333", "lon": "45.1667"}, "UM": {"lat": "19.2833", "lon": "166.6"}, "LB": {"lat": "33.8333", "lon": "35.8333"}, "LC": {"lat": "13.8833", "lon": "-61.1333"}, "LA": {"lat": "18", "lon": "105"}, "TV": {"lat": "-8", "lon": "178"}, "TW": {"lat": "23.5", "lon": "121"}, "TT": {"lat": "11", "lon": "-61"}, "TR": {"lat": "39", "lon": "35"}, "LK": {"lat": "7", "lon": "81"}, "LI": {"lat": "47.1667", "lon": "9.5333"}, "LV": {"lat": "57", "lon": "25"}, "TO": {"lat": "-20", "lon": "-175"}, "LT": {"lat": "56", "lon": "24"}, "LU": {"lat": "49.75", "lon": "6.1667"}, "LR": {"lat": "6.5", "lon": "-9.5"}, "LS": {"lat": "-29.5", "lon": "28.5"}, "TH": {"lat": "15", "lon": "100"}, "TF": {"lat": "-43", "lon": "67"}, "TG": {"lat": "8", "lon": "1.1667"}, "TD": {"lat": "15", "lon": "19"}, "TC": {"lat": "21.75", "lon": "-71.5833"}, "LY": {"lat": "25", "lon": "17"}, "VA": {"lat": "41.9", "lon": "12.45"}, "VC": {"lat": "13.25", "lon": "-61.2"}, "AE": {"lat": "24", "lon": "54"}, "AD": {"lat": "42.5", "lon": "1.6"}, "AG": {"lat": "17.05", "lon": "-61.8"}, "AF": {"lat": "33", "lon": "65"}, "AI": {"lat": "18.25", "lon": "-63.1667"}, "VI": {"lat": "18.3333", "lon": "-64.8333"}, "IS": {"lat": "65", "lon": "-18"}, "IR": {"lat": "32", "lon": "53"}, "AM": {"lat": "40", "lon": "45"}, "AL": {"lat": "41", "lon": "20"}, "AO": {"lat": "-12.5", "lon": "18.5"}, "AN": {"lat": "12.25", "lon": "-68.75"}, "AQ": {"lat": "-90", "lon": "0"}, "AS": {"lat": "-14.3333", "lon": "-170"}, "AR": {"lat": "-34", "lon": "-64"}, "AU": {"lat": "-27", "lon": "133"}, "AT": {"lat": "47.3333", "lon": "13.3333"}, "IO": {"lat": "-6", "lon": "71.5"}, "IN": {"lat": "20", "lon": "77"}, "TZ": {"lat": "-6", "lon": "35"}, "AZ": {"lat": "40.5", "lon": "47.5"}, "IE": {"lat": "53", "lon": "-8"}, "ID": {"lat": "-5", "lon": "120"}, "UA": {"lat": "49", "lon": "32"}, "QA": {"lat": "25.5", "lon": "51.25"}, "MZ": {"lat": "-18.25", "lon": "35"}};

const countryColorMap: {[code: string]: number} = {
  'PE':1,
  'BF':2,'FR':3,'LY':4,'BY':5,'PK':6,'ID':7,'YE':8,'MG':9,'BO':10,'CI':11,'DZ':12,'CH':13,'CM':14,'MK':15,'BW':16,'UA':17,
  'KE':18,'TW':19,'JO':20,'MX':21,'AE':22,'BZ':23,'BR':24,'SL':25,'ML':26,'CD':27,'IT':28,'SO':29,'AF':30,'BD':31,'DO':32,'GW':33,
  'GH':34,'AT':35,'SE':36,'TR':37,'UG':38,'MZ':39,'JP':40,'NZ':41,'CU':42,'VE':43,'PT':44,'CO':45,'MR':46,'AO':47,'DE':48,'SD':49,
  'TH':50,'AU':51,'PG':52,'IQ':53,'HR':54,'GL':55,'NE':56,'DK':57,'LV':58,'RO':59,'ZM':60,'IR':61,'MM':62,'ET':63,'GT':64,'SR':65,
  'EH':66,'CZ':67,'TD':68,'AL':69,'FI':70,'SY':71,'KG':72,'SB':73,'OM':74,'PA':75,'AR':76,'GB':77,'CR':78,'PY':79,'GN':80,'IE':81,
  'NG':82,'TN':83,'PL':84,'NA':85,'ZA':86,'EG':87,'TZ':88,'GE':89,'SA':90,'VN':91,'RU':92,'HT':93,'BA':94,'IN':95,'CN':96,'CA':97,
  'SV':98,'GY':99,'BE':100,'GQ':101,'LS':102,'BG':103,'BI':104,'DJ':105,'AZ':106,'MY':107,'PH':108,'UY':109,'CG':110,'RS':111,'ME':112,'EE':113,
  'RW':114,'AM':115,'SN':116,'TG':117,'ES':118,'GA':119,'HU':120,'MW':121,'TJ':122,'KH':123,'KR':124,'HN':125,'IS':126,'NI':127,'CL':128,'MA':129,
  'LR':130,'NL':131,'CF':132,'SK':133,'LT':134,'ZW':135,'LK':136,'IL':137,'LA':138,'KP':139,'GR':140,'TM':141,'EC':142,'BJ':143,'SI':144,'NO':145,
  'MD':146,'LB':147,'NP':148,'ER':149,'US':150,'KZ':151,'AQ':152,'SZ':153,'UZ':154,'MN':155,'BT':156,'NC':157,'FJ':158,'KW':159,'TL':160,'BS':161,
  'VU':162,'FK':163,'GM':164,'QA':165,'JM':166,'CY':167,'PR':168,'PS':169,'BN':170,'TT':171,'CV':172,'PF':173,'WS':174,'LU':175,'KM':176,'MU':177,
  'FO':178,'ST':179,'AN':180,'DM':181,'TO':182,'KI':183,'FM':184,'BH':185,'AD':186,'MP':187,'PW':188,'SC':189,'AG':190,'BB':191,'TC':192,'VC':193,
  'LC':194,'YT':195,'VI':196,'GD':197,'MT':198,'MV':199,'KY':200,'KN':201,'MS':202,'BL':203,'NU':204,'PM':205,'CK':206,'WF':207,'AS':208,'MH':209,
  'AW':210,'LI':211,'VG':212,'SH':213,'JE':214,'AI':215,'MF_1_':216,'GG':217,'SM':218,'BM':219,'TV':220,'NR':221,'GI':222,'PN':223,'MC':224,'VA':225,
  'IM':226,'GU':227,'SG':228
};

export { currentCountry, countryAvailable, country, countryName, countryPos, countryColorMap };

