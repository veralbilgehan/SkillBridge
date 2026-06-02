"use client";

import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
const KEYS = ["tarih","mevsim","rumi_mevsim","ay_hareketi","aya_gore","hava","doga","tarimsal","ekim","cogaltma","budama","gubreleme","hasat"];
const RAW_T = [["2026-01-01","KIŞ","KASIM GÜNLER (KIŞ)","SON HİLAL",null,"ERBAİN",null,null,"Turp, patlıcan, ıspanak, domates, maydanoz, karnabahar ve sarımsak ekilir.","ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-01-06","KIŞ","KASIM GÜNLER (KIŞ)","YENİ AY","TOPRAK ÜSTÜ İŞLER","ERBAİN",null,null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-01-07","KIŞ","KASIM GÜNLER (KIŞ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER","ERBAİN",null,"Ürün artıkları toplanıp yakılarak yok edilir.",null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-01-08","KIŞ","KASIM GÜNLER (KIŞ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER","ERBAİN",null,"Azot, fosfor ve potaslı gübrelerle gübreleme yapılır.","Turfanda patates ekimine başlanır.","ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-01-14","KIŞ","KASIM GÜNLER (KIŞ)","İLK DÖRDÜN","EKİM","ERBAİN",null,null,null,"Çift ürün fideleri seralara nakledilir.","KALIN DAL BUDAMA",null,null],["2026-01-21","KIŞ","KASIM GÜNLER (KIŞ)","DOLUNAY","HASAT","ERBAİN",null,null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-01-28","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,"AYONDON FIRTINASI",null,null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-02-04","KIŞ","KASIM GÜNLER (KIŞ)","YENİ AY","TOPRAK ÜSTÜ İŞLER","HAMSİN (Soğuk Hava)","HAYVANLARIN ÇİFTLEŞME ZAMANI",null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-02-10","KIŞ","KASIM GÜNLER (KIŞ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER","HAMSİN (Soğuk Hava)","AĞAÇ DİKME ZAMANI",null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA","Fidelik toprağı ilaçlanır.",null],["2026-02-20","KIŞ","KASIM GÜNLER (KIŞ)","İLK ŞİŞKİN","EKİM","HAMSİN (Soğuk Hava)","1. CEMRE HAVAYA",null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-02-23","KIŞ","KASIM GÜNLER (KIŞ)","DOLUNAY","HASAT","HAMSİN (Soğuk Hava)",null,null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-02-26","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,"HAMSİN (Soğuk Hava)","2. CEMRE HAVAYA",null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-02-28","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,"HAMSİN (Soğuk Hava)","LEYLEKLERİN GELME ZAMANI",null,null,"ÇOĞALTMA ZAMANI","KALIN DAL BUDAMA",null,null],["2026-03-01","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,"HAMSİN (Soğuk Hava)",null,null,"Ispanak, bezelye, patates, roka, havuç, kabak, salatalık ekilir.","ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-03-06","KIŞ","KASIM GÜNLER (KIŞ)","SON HİLAL",null,"HAMSİN (Soğuk Hava)","3. CEMRE TOPRAGA",null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-03-10","KIŞ","HIZIR GÜNLERİ (YAZ)","YENİ AY","TOPRAK ÜSTÜ İŞLER","HAMSİN (Soğuk Hava)","ASMALARA SU YÜRÜMESİ","Patateste tarla hazırlıkları tamamlanır.","PATATES","ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-03-21","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","İLK ŞİŞKİN","EKİM","HAMSİN (Soğuk Hava)","NEVRUZ — GÜNLE GECE EŞİT",null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-03-25","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,null,null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-03-29","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"ÇAYLAKLARIN GELME ZAMANI",null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-01","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,null,null,"Yeşil biber, semizotu, ıspanak, enginar, patates, roka, nane, salatalık ekilir.","ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-03","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,"BÜLBÜLLERİN ÖTMEYE BAŞLAMASI",null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-08","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,"KIRLANGIÇ FIRTINASI",null,null,null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-09","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","YENİ AY","TOPRAK ÜSTÜ İŞLER",null,null,"Tarlaların son sürümü yapılır ve diskaro çekilir.",null,"ÇOĞALTMA ZAMANI","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-14","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER",null,"LALELERİN YEŞERMESİ",null,null,"Fidelerin dikimi başlar.","İNCE DAL BUDAMA","GÜBRE ATIM",null],["2026-04-22","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,null,null,null,"ÇOĞALTMA ZAMANI","Yabancı otlar temizlenir.","GÜBRE ATIM",null],["2026-05-01","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON DÖRDÜN","HASAT",null,null,null,"Yeşil biber, fasulye, salatalık, domates, ıspanak, kabak, patlıcan, bamya, pırasa ekilir.",null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-05-05","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,"HIDIRELLEZ",null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-05-18","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","İLK ŞİŞKİN","EKİM",null,"GÜLLERİN AÇMASI",null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-05-23","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,"DENİZ KAPLUMBAĞALARININ GELİŞİ",null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-06-01","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,null,null,"Yeşil biber, salatalık, domates, lahana, kabak, patlıcan, bamya, fasulye ekilir.",null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-06-07","İLKBAHAR","HIZIR GÜNLERİ (YAZ)","YENİ AY","TOPRAK ÜSTÜ İŞLER",null,"EKİN BİÇME ZAMANI",null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-06-21","YAZ","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,"EN UZUN GÜN — YAZ MEVSİMİ",null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-06-24","YAZ","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,"GÜN DÖNÜMÜ FIRTINASI",null,null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-07-01","YAZ","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,null,null,"Semizotu, ıspanak, kabak, roka, maydanoz, nane, taze soğan ekilir",null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-07-03","YAZ","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,"ŞAM RÜZGARLARININ BAŞLAMASI",null,null,null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-07-11","YAZ","HIZIR GÜNLERİ (YAZ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER","ÇARK DÖNDÜ FIRTINASI",null,"Yaprak bitleri, kırmızı örümcek mücadelesine devam edilir.",null,null,"SÜRGÜN BUDAMA","GÜBRE ATIM",null],["2026-07-21","YAZ","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,null,null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-07-26","YAZ","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"ÜZÜMLERE ALACA DÜŞMESİ",null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-08-01","YAZ","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,null,null,"Semizotu, ıspanak, kabak, roka, maydanoz, nane, taze soğan ekilir.","ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-08-15","YAZ","HIZIR GÜNLERİ (YAZ)","İLK ŞİŞKİN","EKİM",null,"MEYVELERİN OLGUNLAŞMASI",null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-08-19","YAZ","HIZIR GÜNLERİ (YAZ)","DOLUNAY","HASAT",null,null,null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-08-26","YAZ","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"YAPRAKLARIN SARARMASI",null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-08-28","YAZ","HIZIR GÜNLERİ (YAZ)","SON DÖRDÜN","HASAT",null,"LEYLEKLERİN GİTME ZAMANI",null,null,"ÇOĞALTMA ZAMANI",null,"GÜBRE ATIM",null],["2026-09-01","YAZ","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,null,null,"Semizotu, bakla, kekik, ıspanak, kabak, roka, maydanoz, nane ekilir.","ÇOĞALTMA ZAMANI",null,null,null],["2026-09-09","YAZ","HIZIR GÜNLERİ (YAZ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER",null,"CEVİZ ÇIRPMA ZAMANI",null,null,"ÇOĞALTMA ZAMANI",null,null,null],["2026-09-19","YAZ","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"BAĞ BOZUMU",null,null,"ÇOĞALTMA ZAMANI",null,null,null],["2026-09-23","SONBAHAR","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"GÜNLE GECE EŞİTLENİR — SONBAHAR",null,null,"ÇOĞALTMA ZAMANI",null,null,null],["2026-09-25","SONBAHAR","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"YAPRAK DÖKÜMÜ ZAMANI",null,null,"ÇOĞALTMA ZAMANI",null,null,null],["2026-10-01","SONBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,null,"SICAKLARIN SONA ERMESİ",null,"Semizotu, ıspanak, brokoli, roka, maydanoz, nane ekilir.","ÇOĞALTMA ZAMANI",null,null,null],["2026-10-20","SONBAHAR","HIZIR GÜNLERİ (YAZ)","SON ŞİŞKİN AY",null,null,"AĞAÇ DİKME ZAMANI",null,null,null,null,null,null],["2026-10-27","SONBAHAR","HIZIR GÜNLERİ (YAZ)","SON HİLAL",null,"BALIK FIRTINASI",null,null,null,null,null,null,null],["2026-11-05","SONBAHAR","HIZIR GÜNLERİ (YAZ)","YENİ HİLAL","TOPRAK ÜSTÜ İŞLER",null,null,null,"Taze soğan ekimi yapılır.",null,null,null,null],["2026-11-12","SONBAHAR","KASIM GÜNLER (KIŞ)","İLK ŞİŞKİN","EKİM","PASTIRMA YAZI",null,null,null,null,null,null,null],["2026-11-29","SONBAHAR","KASIM GÜNLER (KIŞ)","SON HİLAL",null,null,"AĞAÇLARIN SUYUNUN ÇEKİLMESİ",null,null,null,null,null,null],["2026-12-01","SONBAHAR","KASIM GÜNLER (KIŞ)","YENİ AY","TOPRAK ÜSTÜ İŞLER","KESKİN RÜZGARLAR",null,null,"Çilek dikimi ve çapasına devam edilir.",null,null,null,null],["2026-12-08","SONBAHAR","KASIM GÜNLER (KIŞ)","İLK DÖRDÜN","EKİM","KARAKIŞ BAŞLANGICI",null,null,null,null,null,null,null],["2026-12-21","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,null,null,null,null,null,null,null,null],["2026-12-22","KIŞ","KASIM GÜNLER (KIŞ)","SON ŞİŞKİN AY",null,"ERBAİN KIRK GÜN",null,null,null,null,null,null,null]];

type DayRecord = Record<string, string | null>;
const DATA_MAP: Record<string, DayRecord> = {};
RAW_T.forEach(r => {
  const o = Object.fromEntries(KEYS.map((k, i) => [k, r[i] as string | null]));
  DATA_MAP[o.tarih as string] = o;
});

const MEVSIM_BY_M: Record<number, string> = {0:"KIŞ",1:"KIŞ",2:"KIŞ",3:"İLKBAHAR",4:"İLKBAHAR",5:"İLKBAHAR",6:"YAZ",7:"YAZ",8:"YAZ",9:"SONBAHAR",10:"SONBAHAR",11:"SONBAHAR"};
const ALL_DAYS: Record<string, DayRecord> = {};
function p2(n: number) { return String(n).padStart(2, "0"); }
for (let m = 0; m < 12; m++) {
  const days = new Date(2026, m + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const iso = `2026-${p2(m + 1)}-${p2(d)}`;
    ALL_DAYS[iso] = DATA_MAP[iso] || { tarih: iso, mevsim: MEVSIM_BY_M[m] };
  }
}

const MONTHS_FULL = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const MONTHS_S = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const DAYS_TR = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const MEVSIM_C: Record<string, string> = {"KIŞ":"#7cb9e8","İLKBAHAR":"#a8c76a","YAZ":"#f5c542","SONBAHAR":"#e0874a"};
const AY_EMO: Record<string, string> = {"YENİ AY":"🌑","YENİ HİLAL":"🌒","İLK DÖRDÜN":"🌓","İLK ŞİŞKİN":"🌔","DOLUNAY":"🌕","SON ŞİŞKİN AY":"🌖","SON DÖRDÜN":"🌗","SON HİLAL":"🌘"};

const EVENT_DEF = [
  {icon:"🌙",label:"Ay Evresi",key:"ay_hareketi"},
  {icon:"🌿",label:"Aya Göre",key:"aya_gore"},
  {icon:"⛈",label:"Hava / Fırtına",key:"hava"},
  {icon:"🦅",label:"Doğa Hareketi",key:"doga"},
  {icon:"🌱",label:"Ekim",key:"ekim"},
  {icon:"🪴",label:"Çoğaltma",key:"cogaltma"},
  {icon:"✂️",label:"Budama",key:"budama"},
  {icon:"🧪",label:"Gübreleme",key:"gubreleme"},
  {icon:"🌾",label:"Hasat",key:"hasat"},
  {icon:"📋",label:"Tarımsal İşler",key:"tarimsal"},
];

const BOLGELER = [
  {bolge:"Marmara",iller:"İst, Bursa, Kocaeli",ay:[4,4,6,11,16,21,24,24,19,14,9,5]},
  {bolge:"B. Karadeniz",iller:"Zonguldak, Sinop",ay:[5,5,7,11,16,20,23,23,20,15,10,7]},
  {bolge:"D. Karadeniz",iller:"Rize, Trabzon",ay:[7,7,9,12,16,20,23,23,20,16,12,8]},
  {bolge:"D. Anadolu",iller:"Erzurum, Kars",ay:[-12,-11,-6,4,10,14,19,19,13,5,-3,-10]},
  {bolge:"G. Doğu",iller:"Antep, Urfa",ay:[2,4,9,16,23,29,33,33,27,18,9,4]},
  {bolge:"D. Akdeniz",iller:"Adana, Mersin",ay:[9,10,13,17,21,26,30,30,26,21,15,10]},
  {bolge:"B. Akdeniz",iller:"Antalya, Fethiye",ay:[8,9,12,16,20,25,29,29,25,19,14,9]},
  {bolge:"Kıyı Ege",iller:"İzmir, Aydın",ay:[8,9,12,17,21,26,30,30,25,19,14,9]},
  {bolge:"İç Anadolu",iller:"Ankara, Konya",ay:[-1,0,5,10,15,19,23,23,18,11,5,1]},
  {bolge:"Trakya",iller:"Edirne, Tekirdağ",ay:[3,4,7,12,17,21,24,24,19,14,8,4]},
];
const BOLGE_C = ["#8bc34a","#4fc3f7","#ffb74d","#f48fb1","#ce93d8","#80cbc4","#fff176","#ff8a65","#a5d6a7","#90caf9"];

const mevsimPie = [{name:"KIŞ",value:91,fill:"#7cb9e8"},{name:"İLKBAHAR",value:92,fill:"#a8c76a"},{name:"YAZ",value:94,fill:"#f5c542"},{name:"SONBAHAR",value:89,fill:"#e0874a"}];
const ayEvresi = [{name:"🌖 Son Şişkin",count:81},{name:"🌒 Yeni Hilal",count:80},{name:"🌘 Son Hilal",count:70},{name:"🌔 İlk Şişkin",count:63},{name:"🌓 İlk Dördün",count:21},{name:"🌕 Dolunay",count:18},{name:"🌗 Son Dördün",count:17},{name:"🌑 Yeni Ay",count:16}];
const monthAct = MONTHS_S.map((m, i) => ({name:m,ekim:[3,2,4,5,4,3,2,2,2,2,2,1][i],hasat:[1,1,1,2,2,2,2,2,2,2,1,1][i],doga:[1,2,3,3,3,2,2,2,3,2,2,1][i]}));

const today = new Date();
const todayISO = `2026-${p2(today.getMonth() + 1)}-${p2(today.getDate())}`;

// ─── FULL APP ────────────────────────────────────────────────────────────────
export default function AgriCalendarStrip() {
  const [page, setPage]             = useState(0);
  const [showEvents, setShowEvents] = useState(false);
  const [curMonth, setCurMonth]     = useState(today.getMonth());
  const [selDate, setSelDate]       = useState(todayISO);
  const [selBolge, setSelBolge]     = useState(0);
  const [chartVis, setChartVis]     = useState([false, false, false]);
  const [expanded, setExpanded]     = useState(false);

  const touchX  = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (page === 1) {
      setChartVis([false, false, false]);
      [0, 1, 2].forEach(i =>
        setTimeout(() => setChartVis(v => { const n = [...v]; n[i] = true; return n; }), 150 + i * 280)
      );
    }
  }, [page]);

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragging.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging.current || touchX.current === null) return;
    const ex = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const dx = touchX.current - ex;
    if (Math.abs(dx) > 48 && !showEvents)
      setPage(p => Math.max(0, Math.min(2, p + (dx > 0 ? 1 : -1))));
    touchX.current = null;
    dragging.current = false;
  };

  const selDay  = ALL_DAYS[selDate] || {};
  const mv      = (selDay.mevsim as string) || "KIŞ";
  const mvC     = MEVSIM_C[mv] || "#8bc34a";
  const moonEmo = AY_EMO[(selDay.ay_hareketi as string)] || "🌙";
  const selDObj = new Date(selDate + "T12:00:00");
  const wdIdx   = selDObj.getDay() === 0 ? 6 : selDObj.getDay() - 1;

  const daysInMon = new Date(2026, curMonth + 1, 0).getDate();
  const firstOff  = (new Date(2026, curMonth, 1).getDay() + 6) % 7;
  const cells     = [...Array(firstOff).fill(null), ...Array.from({length: daysInMon}, (_, i) => i + 1)];
  const isoD      = (d: number) => `2026-${p2(curMonth + 1)}-${p2(d)}`;
  const isToday   = (d: number) => isoD(d) === todayISO;
  const isSel     = (d: number) => isoD(d) === selDate;
  const dayC      = (d: number) => MEVSIM_C[(ALL_DAYS[isoD(d)] || {}).mevsim as string] || "#8bc34a";
  const dotC      = (d: number) => {
    const day = ALL_DAYS[isoD(d)];
    if (!day) return null;
    if (day.hava) return "#c8a44a";
    if (day.doga) return "#7ec8a0";
    if (day.ekim) return "#8bc34a";
    return null;
  };

  const events = EVENT_DEF.filter(e => selDay[e.key]);
  const bolge  = BOLGELER[selBolge];
  const bMin   = Math.min(...bolge.ay);
  const bMax   = Math.max(...bolge.ay);
  const normB  = (v: number) => Math.max(4, ((v - bMin) / (bMax - bMin || 1)) * 100);

  // ── STRIP (collapsed) — 3 cm ≈ 113px ──────────────────────────────────────
  if (!expanded) {
    return (
      <div
        style={{
          height: "113px",
          background: "linear-gradient(180deg,#0b1d0c 0%,#0d190d 100%)",
          borderBottom: "1px solid #1a3a1a",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: "14px",
          flexShrink: 0,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setExpanded(true)}
      >
        {/* Moon */}
        <div style={{fontSize: 38, lineHeight: 1, flexShrink: 0}}>{moonEmo}</div>

        {/* Date info */}
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: "flex", alignItems: "baseline", gap: 8}}>
            <span style={{fontFamily: "serif", fontSize: 32, fontWeight: 700, color: "#8bc34a", lineHeight: 1}}>
              {selDObj.getDate()}
            </span>
            <div>
              <div style={{fontSize: 10, fontWeight: 700, color: "#6a8a6a", letterSpacing: 2, textTransform: "uppercase"}}>
                {DAYS_TR[wdIdx]}
              </div>
              <div style={{fontFamily: "serif", fontSize: 13, color: "#c8a44a", letterSpacing: 1}}>
                {MONTHS_FULL[selDObj.getMonth()]} 2026
              </div>
            </div>
          </div>
          <div style={{display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap"}}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              padding: "2px 10px", borderRadius: 20,
              background: mvC + "22", color: mvC, border: `1px solid ${mvC}55`,
            }}>{mv}</span>
            {selDay.hava && (
              <span style={{fontSize: 10, color: "#c8a44a", background: "rgba(200,164,74,0.12)", padding: "2px 10px", borderRadius: 20}}>
                ⛈ {(selDay.hava as string).slice(0, 24)}
              </span>
            )}
            {selDay.ay_hareketi && (
              <span style={{fontSize: 10, color: "#7aaa8a", background: "rgba(100,180,100,0.1)", padding: "2px 10px", borderRadius: 20}}>
                {selDay.ay_hareketi as string}
              </span>
            )}
          </div>
        </div>

        {/* Expand hint */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
          <span style={{fontSize:18,color:"#3a6a3a"}}>⌄</span>
          <span style={{fontSize:9,color:"#3a6a3a",letterSpacing:1}}>TAKVİM</span>
        </div>
      </div>
    );
  }

  // ── EXPANDED: full app ─────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#0a140a",
        color: "#d4c9a8",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
        zIndex: 50,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={() => setExpanded(false)}
        style={{
          position: "fixed", top: 12, right: 14, zIndex: 100,
          background: "#132213", border: "none", color: "#8bc34a",
          width: 36, height: 36, borderRadius: "50%", fontSize: 20,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>

      {/* SWIPE TRACK */}
      <div style={{
        display: "flex", height: "100%",
        transform: `translateX(-${page * 100}%)`,
        transition: "transform 0.38s cubic-bezier(0.35,0,0.25,1)",
      }}>

        {/* PAGE 0: TAKVİM */}
        <div style={{flex: "0 0 100%", width: "100%", height: "100%", overflow: "hidden", position: "relative"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(180deg,#0b1d0c,#0d190d)",padding:"22px 20px 18px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"baseline",gap:12}}>
                <div style={{fontFamily:"serif",fontSize:64,lineHeight:1,fontWeight:700,color:"#8bc34a",letterSpacing:-2}}>
                  {selDObj.getDate()}
                </div>
                <div style={{display:"flex",flexDirection:"column",paddingTop:4}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#6a8a6a",letterSpacing:3,textTransform:"uppercase"}}>
                    {DAYS_TR[wdIdx]}
                  </div>
                  <div style={{fontFamily:"serif",fontSize:18,color:"#c8a44a",letterSpacing:1,marginTop:2}}>
                    {MONTHS_FULL[selDObj.getMonth()]} 2026
                  </div>
                </div>
              </div>
              <div style={{fontSize:42,lineHeight:1,marginTop:4}}>{moonEmo}</div>
            </div>
            <div style={{fontSize:11,fontWeight:600,color:"#4a6a4a",letterSpacing:2,textTransform:"uppercase",marginTop:10}}>
              {(selDay.rumi_mevsim as string) || "—"}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
              <div style={{
                display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:24,
                fontSize:12,fontWeight:700,letterSpacing:1.5,
                background:mvC+"18",color:mvC,border:`1.5px solid ${mvC}55`,
              }}>{mv}</div>
              <div
                style={{
                  display:"inline-flex",alignItems:"center",gap:5,padding:"5px 14px",borderRadius:24,
                  fontSize:12,fontWeight:700,letterSpacing:1,
                  background:"#1a3a1a",border:"1.5px solid #3a6a3a",color:"#8bc34a",cursor:"pointer",
                }}
                onClick={() => setShowEvents(true)}
              >GÜNÜN OLAYLARI ›</div>
            </div>
            {selDay.hava && (
              <div style={{
                marginTop:10,padding:"6px 12px",borderRadius:10,
                background:"rgba(200,164,74,0.12)",
                fontSize:12,fontWeight:600,color:"#c8a44a",display:"inline-block",
              }}>⛈ {selDay.hava as string}</div>
            )}
          </div>

          {/* Mini calendar */}
          <div style={{padding:"10px 14px 4px",overflowY:"auto",height:"calc(100% - 220px)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <button onClick={() => setCurMonth(m => Math.max(0, m - 1))}
                style={{background:"#132213",border:"none",color:"#7aaa5a",width:28,height:28,borderRadius:"50%",fontSize:16,cursor:"pointer"}}>‹</button>
              <div style={{fontFamily:"serif",fontSize:13,color:"#c8a44a",letterSpacing:1}}>{MONTHS_FULL[curMonth]}</div>
              <button onClick={() => setCurMonth(m => Math.min(11, m + 1))}
                style={{background:"#132213",border:"none",color:"#7aaa5a",width:28,height:28,borderRadius:"50%",fontSize:16,cursor:"pointer"}}>›</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
              {DAYS_TR.map(d => (
                <div key={d} style={{textAlign:"center",fontSize:9,fontWeight:700,color:"#3a5a3a",letterSpacing:.5,padding:"3px 0"}}>{d}</div>
              ))}
              {cells.map((d, i) => d === null ? (
                <div key={`e${i}`} />
              ) : (
                <div key={d}
                  style={{
                    borderRadius:6,padding:"3px 1px",cursor:"pointer",textAlign:"center",
                    minHeight:34,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    background:isSel(d)?"#1b3a1a":isToday(d)?"#0f2210":"transparent",
                    outline:isSel(d)?"1.5px solid #8bc34a":"none",
                  }}
                  onClick={() => setSelDate(isoD(d))}
                >
                  <div style={{fontSize:12,fontWeight:600,color:isSel(d)?mvC:dayC(d)}}>{d}</div>
                  {AY_EMO[(ALL_DAYS[isoD(d)] || {}).ay_hareketi as string] && (
                    <div style={{fontSize:8,lineHeight:1,marginTop:1}}>
                      {AY_EMO[(ALL_DAYS[isoD(d)] || {}).ay_hareketi as string]}
                    </div>
                  )}
                  {dotC(d) && <div style={{width:4,height:4,borderRadius:"50%",background:dotC(d)!,marginTop:1}}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Events slide-in */}
          <div style={{
            position:"absolute",inset:0,background:"#0a140a",zIndex:20,
            transform:showEvents?"translateX(0)":"translateX(100%)",
            transition:"transform 0.32s cubic-bezier(0.35,0,0.25,1)",overflowY:"auto",
          }}>
            <div style={{
              background:"linear-gradient(180deg,#0b1d0c,#0d190d)",
              padding:"18px 18px 14px",display:"flex",alignItems:"center",gap:14,
              borderBottom:"1px solid #1a3a1a",position:"sticky",top:0,zIndex:5,
            }}>
              <button onClick={() => setShowEvents(false)}
                style={{background:"#132213",border:"none",color:"#8bc34a",width:32,height:32,borderRadius:"50%",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"serif",fontSize:16,color:"#c8a44a",letterSpacing:1}}>Günün Olayları</div>
                <div style={{fontSize:11,color:"#5a8a5a",letterSpacing:1,marginTop:2}}>
                  {selDObj.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})} · {mv}
                </div>
              </div>
              <div style={{fontSize:28}}>{moonEmo}</div>
            </div>
            <div style={{padding:"10px 14px 40px"}}>
              {events.length === 0
                ? <div style={{textAlign:"center",padding:"40px 20px",color:"#3a5a3a",fontStyle:"italic",fontSize:14}}>Bu gün için kayıtlı olay bulunamadı.</div>
                : events.map(e => (
                  <div key={e.key} style={{
                    display:"flex",alignItems:"flex-start",gap:14,
                    background:"#0e1e0e",border:"1px solid #1a3a1a",borderRadius:12,
                    padding:"14px 16px",marginBottom:8,
                  }}>
                    <div style={{fontSize:22,flexShrink:0,marginTop:1}}>{e.icon}</div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"#4a7a4a",textTransform:"uppercase",marginBottom:4}}>{e.label}</div>
                      <div style={{fontSize:13,color:"#d4c9a8",lineHeight:1.5}}>{selDay[e.key] as string}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* PAGE 1: ANALİZ */}
        <div style={{flex:"0 0 100%",width:"100%",height:"100%",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(180deg,#0b1d0c,#0d190d)",padding:"22px 18px 14px"}}>
            <div style={{fontFamily:"serif",fontSize:22,color:"#c8a44a",letterSpacing:2}}>Analiz</div>
            <div style={{fontSize:12,color:"#4a7a4a",marginTop:4,letterSpacing:1}}>2026 · Yıllık Veri Dökümü</div>
          </div>
          <div style={{height:"calc(100% - 76px)",overflowY:"auto",paddingBottom:40}}>
            {[
              {
                title:"🌿 Mevsim Dağılımı", vis:chartVis[0],
                chart:(
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie data={mevsimPie} cx="50%" cy="50%" innerRadius={42} outerRadius={70} dataKey="value">
                        {mevsimPie.map((d, i) => <Cell key={i} fill={d.fill}/>)}
                      </Pie>
                      <Tooltip contentStyle={{background:"#0e1e0e",border:"1px solid #2a4a2a",color:"#d4c9a8",fontSize:12}}/>
                    </PieChart>
                  </ResponsiveContainer>
                ),
              },
              {
                title:"🌙 Ay Evresi Dağılımı", vis:chartVis[1],
                chart:(
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={ayEvresi} layout="vertical" margin={{left:4,right:10}}>
                      <XAxis type="number" tick={{fill:"#4a7a4a",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis dataKey="name" type="category" width={120} tick={{fill:"#c4b898",fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"#0e1e0e",border:"1px solid #2a4a2a",color:"#d4c9a8",fontSize:12}}/>
                      <Bar dataKey="count" fill="#4a7a3a" radius={[0,6,6,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                ),
              },
              {
                title:"📅 Aylık Aktivite", vis:chartVis[2],
                chart:(
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={monthAct} margin={{left:0,right:6}}>
                      <XAxis dataKey="name" tick={{fill:"#4a7a4a",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#4a7a4a",fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"#0e1e0e",border:"1px solid #2a4a2a",color:"#d4c9a8",fontSize:12}}/>
                      <Legend wrapperStyle={{fontSize:11,color:"#7a9a7a"}}/>
                      <Bar dataKey="ekim" name="Ekim" fill="#8bc34a" stackId="a" radius={[3,3,0,0]}/>
                      <Bar dataKey="hasat" name="Hasat" fill="#c8a44a" stackId="a"/>
                      <Bar dataKey="doga" name="Doğa" fill="#7cb9e8" stackId="a" radius={[0,0,3,3]}/>
                    </BarChart>
                  </ResponsiveContainer>
                ),
              },
            ].map(({title, vis, chart}) => (
              <div key={title} style={{
                background:"#0e1e0e",border:"1px solid #1e3a1e",borderRadius:14,
                padding:16,margin:"0 14px 12px",
                opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(18px)",
                transition:"opacity 0.5s,transform 0.5s",
              }}>
                <div style={{fontFamily:"serif",fontSize:13,color:"#8bc34a",letterSpacing:.5,marginBottom:14}}>{title}</div>
                {chart}
              </div>
            ))}
          </div>
        </div>

        {/* PAGE 2: BÖLGELER */}
        <div style={{flex:"0 0 100%",width:"100%",height:"100%",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(180deg,#0b1d0c,#0d190d)",padding:"22px 18px 14px"}}>
            <div style={{fontFamily:"serif",fontSize:22,color:"#c8a44a",letterSpacing:2}}>Bölgeler</div>
            <div style={{fontSize:12,color:"#4a7a4a",marginTop:4,letterSpacing:1}}>Türkiye · Aylık Sıcaklıklar</div>
          </div>
          <div style={{height:"calc(100% - 76px)",overflowY:"auto",paddingBottom:40}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"10px 14px 6px"}}>
              {BOLGELER.map((b, i) => (
                <div key={b.bolge}
                  style={{
                    padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",
                    letterSpacing:.5,background:selBolge===i?BOLGE_C[i]+"18":"#0e1e0e",
                    color:BOLGE_C[i],border:`1.5px solid ${selBolge===i?BOLGE_C[i]:"#1a3a1a"}`,
                  }}
                  onClick={() => setSelBolge(i)}
                >{b.bolge}</div>
              ))}
            </div>
            <div style={{background:"#0e1e0e",border:"1px solid #1e3a1e",borderRadius:14,margin:"0 14px",padding:16}}>
              <div style={{fontFamily:"serif",fontSize:17,color:BOLGE_C[selBolge],marginBottom:3}}>{bolge.bolge}</div>
              <div style={{fontSize:12,color:"#5a8a5a",marginBottom:14}}>{bolge.iller}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {[
                  {val:`${bolge.ay[0]}°`,lbl:"OCAK",col:"#7cb9e8"},
                  {val:`${bolge.ay[6]}°`,lbl:"TEMMUZ",col:"#f5c542"},
                  {val:`${Math.round(bolge.ay.reduce((a,b)=>a+b,0)/12)}°`,lbl:"ORTALAMA",col:"#8bc34a"},
                  {val:`${bolge.ay[6]-bolge.ay[0]}°`,lbl:"YILLIK FARK",col:"#e0874a"},
                ].map(s => (
                  <div key={s.lbl} style={{background:"#0a140a",border:"1px solid #152515",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontFamily:"serif",fontSize:22,fontWeight:700,color:s.col}}>{s.val}</div>
                    <div style={{fontSize:10,color:"#4a7a4a",letterSpacing:1,marginTop:2}}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              {MONTHS_S.map((m, i) => {
                const v = bolge.ay[i];
                const pct = normB(v);
                const col = v < 0 ? "#7cb9e8" : v < 10 ? "#a5c8a0" : v < 20 ? "#c8a44a" : "#e0874a";
                return (
                  <div key={m} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <div style={{fontSize:10,color:"#5a7a5a",width:28,textAlign:"right",flexShrink:0}}>{m}</div>
                    <div style={{flex:1,height:13,background:"#0a140a",borderRadius:7,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:7,background:col,width:`${pct}%`,transition:"width 0.6s ease"}}/>
                    </div>
                    <div style={{fontSize:10,width:36,textAlign:"right",flexShrink:0,fontWeight:700,color:col}}>{v}°</div>
                  </div>
                );
              })}
              <div style={{fontSize:10,fontWeight:700,color:"#4a7a4a",letterSpacing:1.5,textTransform:"uppercase",margin:"16px 0 10px"}}>Tüm Bölgeler Karşılaştırma</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart margin={{left:0,right:8}}>
                  <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} tick={{fill:"#4a7a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#4a7a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"#0e1e0e",border:"1px solid #2a4a2a",color:"#d4c9a8",fontSize:11}}/>
                  {BOLGELER.map((b, i) => (
                    <Line key={b.bolge} type="monotone"
                      data={b.ay.map((v, j) => ({name:MONTHS_S[j],temp:v}))}
                      dataKey="temp" name={b.bolge}
                      stroke={BOLGE_C[i]} strokeWidth={selBolge===i?2.5:1}
                      dot={false} opacity={selBolge===i?1:0.25}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Page dots */}
      <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:7,zIndex:99}}>
        {[0,1,2].map(i => (
          <div key={i}
            style={{
              width:i===page?22:7,height:7,borderRadius:i===page?4:50,
              background:i===page?"#8bc34a":"#2a3a2a",transition:"all 0.3s",cursor:"pointer",
            }}
            onClick={() => !showEvents && setPage(i)}
          />
        ))}
      </div>
    </div>
  );
}
