#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Complete descriptions from the syntax file
const PRODUCT_DESCRIPTIONS = {
  'ALT42-MT-TI-BKBK-B': `<p><strong>Bremont Altitude MB Meteor - Precision Engineered for Those Who Push Limits</strong><br />
Introducing the Altitude MB Meteor — the most advanced evolution of Bremont's legendary MB series. Inspired by the Gloster Meteor, Britain's first jet fighter and the aircraft used in Martin-Baker's inaugural live ejection test in 1946, this timepiece pays homage to aviation history while showcasing cutting-edge watchmaking.</p>
<p>Crafted from lightweight yet ultra-durable Grade 2 titanium, the 42mm Trip-Tick® case has been thoughtfully refined with a slimmer profile and shortened lug-to-lug length for enhanced comfort and wearability. Bremont's upgraded dual-crown system ensures seamless control — with the 2 o'clock crown for setting and winding, and the 4 o'clock crown operating the re-engineered bi-directional Roto-Click inner bezel, delivering a smooth, tactile, and precise rotation.</p>
<p>The cockpit-inspired dial is built for clarity, featuring applied Super-LumiNova® indexes and subtle stencilled detailing. A hallmark of the MB design, the signature 'lollipop' seconds hand with its striped 'ejection' pull handle counterweight remains — a bold nod to its aviation roots.</p>
<p>At its core lies the robust BB14 automatic movement with an impressive 68-hour power reserve. Suspended in a shock-absorbing rubber mount, it offers superior resistance to impacts. The exhibition case back reveals the finely finished movement, complete with gunmetal grey tones and Geneva Stripes, while retaining anti-magnetic protection via an integrated soft iron ring based on Faraday cage principles.</p>
<p>Completing the piece is a newly designed titanium bracelet, brushed for a sleek finish and equipped with a quick-release system. Curved connecting bars provide fluid articulation and optimal comfort on the wrist.</p>
<p>The <strong>Altitude MB Meteor</strong> embodies innovation, resilience, and heritage — purpose-built for those who live to test the limits.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Seconds</p>
<p>Date at 3 O'clock</p>
<p><b>Movement</b></p>
<p>Calibre: BB14-AH</p>
<p>No of Jewels: 24 Jewels</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 68-hour</p>
<p>Decorated Bremont rotor</p>
<p><b>Case specifications</b></p>
<p>Satin &amp; polished titanium Trip-Tick case construction with knurled Black DLC barrel</p>
<p>Inner anti-magnetic movement protection ring</p>
<p>Protective anti-shock movement mount</p>
<p>Inner bi-directional Roto-Click bezel, operated by crown at 4 O'clock</p>
<p>Case Diameter: 42mm</p>
<p>Case Length: 49.3mm</p>
<p>Case Depth: 12.23mm</p>
<p>Lug width: 22mm</p>
<p>Case back: Decorated titanium open case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Brushed Black Galvanic metal dial including: Applied Numerals and Indexes filled with white Super-LumiNova® (Blue emission)</p>
<p>Black Inner Roto-Click Bezel</p>
<p>Gloss Black hour and minute hands with white Super-LumiNova® (Blue emission)</p>
<p>Black Seconds hand with lollipop red tip and a monochrome pullcord tail</p>
<p><b>Crystal</b></p>
<p>Glass Box anti-reflective sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>10 ATM, 100 metres</p>
<p><strong>Strap</strong></p>
<p>Quick release titanium bracelet</p>
<p><b>Weight</b></p>
<p>53.29g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: ALT42-MT-TI-BKBK-B</span></p>`,

  'ALT42-MT-TI-BKBK-L-S': `<p><strong>Bremont Altitude MB Meteor - Engineered for Extremes. Inspired by Aviation.</strong><br />
The Altitude MB Meteor represents the pinnacle of Bremont's iconic MB series — a bold fusion of technical innovation, aviation heritage, and uncompromising performance.</p>
<p>Named after the Gloster Meteor, Britain's first jet fighter and the aircraft used in Martin-Baker's groundbreaking live ejection test in 1946, this exceptional timepiece is housed in a lightweight yet robust 42mm Grade 2 titanium case. Its refined Trip-Tick® construction features a slimmer profile and shortened lug-to-lug distance for enhanced comfort on the wrist.</p>
<p>Designed for functionality and precision, the MB Meteor is equipped with dual crowns — one for winding and time-setting, the other for effortless control of the bi-directional Roto-Click® inner bezel. The upgraded bezel mechanism delivers precise feedback with each turn, offering the unmistakable tactile experience familiar to MB owners.</p>
<p>The aviation-inspired dial ensures maximum legibility, with applied Super-LumiNova® indexes and subtle stencil detailing. A standout feature, the 'lollipop' seconds hand with a striped looped 'ejection' pull handle, remains a defining symbol of the MB series.</p>
<p>At its core, the BB14 automatic movement delivers a 68-hour power reserve and is housed within a flexible rubber mount to minimize shock and impact. The open case-back showcases the beautifully finished movement, adorned with Geneva Stripes in gunmetal grey. A soft iron ring surrounds the movement, offering anti-magnetic protection based on Faraday cage principles.</p>
<p>Purpose-built for extreme environments and those who challenge boundaries, the Altitude MB Meteor is a testament to Bremont's dedication to precision engineering and timeless design.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Seconds</p>
<p>Date at 3 O'clock</p>
<p><b>Movement</b></p>
<p>Calibre: BB14-AH</p>
<p>No of Jewels: 24 Jewels</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 68-hour</p>
<p>Decorated Bremont rotor</p>
<p><b>Case specifications</b></p>
<p>Satin &amp; polished titanium Trip-Tick case construction with knurled Black DLC barrel</p>
<p>Inner anti-magnetic movement protection ring</p>
<p>Protective anti-shock movement mount</p>
<p>Inner bi-directional Roto-Click bezel, operated by crown at 4 O'clock</p>
<p>Case Diameter: 42mm</p>
<p>Case Length: 49.3mm</p>
<p>Case Depth: 12.23mm</p>
<p>Lug width: 22mm</p>
<p>Case back: Decorated titanium open case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Brushed Black Galvanic metal dial including: Applied Numerals and Indexes filled with white Super-LumiNova® (Blue emission)</p>
<p>Black Inner Roto-Click Bezel</p>
<p>Gloss Black hour and minute hands with white Super-LumiNova® (Blue emission)</p>
<p>Black Seconds hand with lollipop red tip and a monochrome pullcord tail</p>
<p><b>Crystal</b></p>
<p>Glass Box anti-reflective sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>10 ATM, 100 metres</p>
<p><strong>Strap</strong></p>
<p>Quick-release dual-material black rubber outer &amp; leather lined strap</p>
<p><b>Weight</b></p>
<p>53.29g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: ALT42-MT-TI-BKBK-L-S</span></p>`,

  'ALT42-MT-TI-SITI-B': `<p><strong>Bremont Altitude MB Meteor - Precision. Performance. Purpose.</strong><br />
Inspired by the Gloster Meteor — Britain's first jet fighter and the aircraft used in Martin-Baker's historic 1946 ejection test — the Altitude MB Meteor marks the most advanced evolution of Bremont's renowned MB series.</p>
<p>Crafted for durability and lightweight wear, this striking timepiece features a 42mm Grade 2 titanium case with a refined Trip-Tick® construction. The case has been thoughtfully re-engineered with a slimmer profile and shortened lug-to-lug dimensions for improved comfort and wearability.</p>
<p>Dual crowns at 2 and 4 o'clock provide seamless control of both time-setting and the upgraded bi-directional Roto-Click® inner bezel, delivering smooth, precise feedback with every adjustment — a hallmark of the MB design legacy.</p>
<p>Designed with legibility in mind, the dial features applied Super-LumiNova® indexes and subtle stencilled accents. Bremont's signature 'lollipop' seconds hand, counterbalanced by the iconic ejection-pull loop, serves as a nod to the watch's aviation roots.</p>
<p>Powering the Altitude MB Meteor is the robust BB14 movement with an impressive 68-hour power reserve. Housed within a flexible rubber mount for enhanced shock resistance, the movement is visible through the open case-back — showcasing gunmetal grey finishing and Geneva Stripes. A soft iron ring encircles the movement to ensure anti-magnetic protection, inspired by Faraday Cage principles.</p>
<p>This exceptional model is paired with a new brushed titanium bracelet featuring quick-release functionality and curved links for a smooth, ergonomic fit.</p>
<p>Engineered for those who defy boundaries, the <strong>Altitude MB Meteor</strong> is a bold expression of technical innovation and timeless design.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Seconds</p>
<p>Date at 3 O'clock</p>
<p><b>Movement</b></p>
<p>Calibre: BB14-AH</p>
<p>No of Jewels: 24 Jewels</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 68-hour</p>
<p>Decorated Bremont rotor</p>
<p><b>Case specifications</b></p>
<p>Satin &amp; polished titanium Trip-Tick case construction with knurled Titanium barrel</p>
<p>Inner anti-magnetic movement protection ring</p>
<p>Protective anti-shock movement mount</p>
<p>Inner bi-directional Roto-Click bezel, operated by crown at 4 O'clock</p>
<p>Case Diameter: 42mm</p>
<p>Case Length: 49.3mm</p>
<p>Case Depth: 12.23mm</p>
<p>Lug width: 22mm</p>
<p>Case back: Decorated titanium open case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Brushed Black Galvanic metal dial including: Applied Numerals and Indexes filled with white Super-LumiNova® (Blue emission)</p>
<p>Black Inner Roto-Click Bezel</p>
<p>Gloss Black hour and minute hands with white Super-LumiNova® (Blue emission)</p>
<p>Black Seconds hand with lollipop red tip and a monochrome pullcord tail</p>
<p><b>Crystal</b></p>
<p>Glass Box anti-reflective sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>10 ATM, 100 metres</p>
<p><strong>Strap</strong></p>
<p>Quick-release titanium bracelet</p>
<p><b>Weight</b></p>
<p>53.29g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: ALT42-MT-TI-SITI-B</span></p>`,

  'ALT42-MT-TI-SITI-L-S': `<p><strong>Bremont Altitude MB Meteor - Engineered for the Bold. Inspired by Aviation History.</strong></p>
<p>The Altitude MB Meteor represents the pinnacle of Bremont's legendary MB series — an aviation-inspired timepiece built for those who challenge limits.</p>
<p>Named in honour of the Gloster Meteor, Britain's first jet fighter and the aircraft used in Martin-Baker's groundbreaking ejection seat test in 1946, this model is a tribute to resilience and innovation. The 42mm case is crafted from lightweight Grade 2 titanium and showcases Bremont's refined Trip-Tick® construction, redesigned for a slimmer profile and enhanced comfort on the wrist.</p>
<p>Ergonomic dual crowns — positioned at 2 and 4 o'clock — control time-setting and the upgraded bi-directional Roto-Click® inner bezel, which offers a satisfyingly smooth and precise operation.</p>
<p>The clean, highly legible dial features applied Super-LumiNova® indexes and subtle stencilled details, paired with Bremont's iconic 'lollipop' seconds hand and striped ejection-pull counterbalance — a distinctive nod to its aviation heritage.</p>
<p>At its core, the Altitude MB Meteor is powered by the BB14 automatic movement with a 68-hour power reserve. Housed in a flexible rubber mount to absorb shocks and reduce impact, the movement is visible through a sapphire crystal open case-back, revealing its fine gunmetal grey finishing with Geneva Stripes. A soft iron ring provides anti-magnetic protection based on Faraday Cage engineering.</p>
<p>Whether in the air or on the ground, the Altitude MB Meteor is built for uncompromising performance and unmistakable style.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Seconds</p>
<p>Date at 3 O'clock</p>
<p><b>Movement</b></p>
<p>Calibre: BB14-AH</p>
<p>No of Jewels: 24 Jewels</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 68-hour</p>
<p>Decorated Bremont rotor</p>
<p><b>Case specifications</b></p>
<p>Satin &amp; polished titanium Trip-Tick case construction with knurled Titanium barrel</p>
<p>Inner anti-magnetic movement protection ring</p>
<p>Protective anti-shock movement mount</p>
<p>Inner bi-directional Roto-Click bezel, operated by crown at 4 O'clock</p>
<p>Case Diameter: 42mm</p>
<p>Case Length: 49.3mm</p>
<p>Case Depth: 12.23mm</p>
<p>Lug width: 22mm</p>
<p>Case back: Decorated titanium open case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Brushed Silver Galvanic metal dial including: Applied Numerals and Indexes filled with white Super-LumiNova® (Blue emission)</p>
<p>Silver Inner Roto-Click Bezel</p>
<p>Gloss Black hour and minute hands with white Super-LumiNova® (Blue emission)</p>
<p>Black Seconds hand with lollipop red tip and a monochrome pullcord tail</p>
<p><b>Crystal</b></p>
<p>Glass Box anti-reflective sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>10 ATM, 100 metres</p>
<p><strong>Strap</strong></p>
<p>Quick-release dual-material black rubber outer &amp; leather lined strap</p>
<p><b>Weight</b></p>
<p>53.29g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: ALT42-MT-TI-SITI-L-S</span></p>`,

  'SM40-GMT-SS-GNBK-G': `<p><strong>Bremont Supermarine GMT 'Tundra' Green – Crafted for the World Explorer</strong><br />
Born from the raw beauty of Iceland's rugged terrain and tested in its unforgiving elements, the Supermarine GMT in 'Tundra' Green is Bremont's ultimate expression of resilience, precision, and style. This bold 300m water-resistant GMT timepiece is built for those who traverse time zones, dive deep, and thrive in the extraordinary.</p>
<p>The watch features a captivating linear gradient dial in tundra green, drawing focus to the center with a sense of depth and motion. A bi-directional, bi-colored 24-hour aluminium bezel enhances global functionality, while vivid orange accents on the GMT hand and markers bring dynamic contrast and clarity. Equipped with Super-LumiNova® technology, the dial ensures superior legibility in all light conditions—with blue-emission on indexes and green-emission on the GMT hand beneath a domed anti-reflective sapphire crystal.</p>
<p>Housed in a robust yet refined 904L stainless steel case, the <strong>Supermarine GMT</strong> boasts a slimmer silhouette and an ergonomic quick-release bracelet with polished-satin infinity links and a micro-adjust clasp for a seamless, comfortable fit. An optional durable chevron rubber strap adds versatility for land, sea, or sky.</p>
<p>Powered by a modified automatic movement with a 50-hour power reserve, this timepiece is as dependable as it is distinctive. The engraved case back, featuring a map of the world's oceans, pays tribute to Bremont's deep-rooted passion for marine exploration.</p>
<p>The Supermarine GMT 'Tundra' Green stands as a signature model in Bremont's celebrated Supermarine collection—built for adventure, designed to endure.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Second/GMT</p>
<p>Date at 3H</p>
<p>Bi-directional rotating bezel</p>
<p><b>Movement</b></p>
<p>Calibre: Modified Calibre 11 1/2''' BE-93-2AV</p>
<p>No of Jewels: 25 Jewels</p>
<p>Glucydur balance wheel</p>
<p>Anachron balance spring</p>
<p>Nivaflex mainspring</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 50-hour</p>
<p><b>Case specifications</b></p>
<p>Case construction made from 904L stainless steel</p>
<p>24H bi-directional bezel with a bi-colour aluminium bezel insert</p>
<p>Screw-in crown</p>
<p>Case Diameter: 40mm</p>
<p>Case Length: 48mm</p>
<p>Case Depth: 13mm</p>
<p>Lug Width: 20mm</p>
<p>Case back: Stainless steel screw-in and decorated closed case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Green gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)</p>
<p>Black dial ring with printed minutes track</p>
<p>Polished rhodium-plated hour, minute and second hands infilled with white Super- LumiNova® (Blue emission)</p>
<p>Polished rhodium-plated GMT hand with coloured tip infilled with white Super-LumiNova® (Green emission to match bezel lume).</p>
<p><b>Crystal</b></p>
<p>Domed anti-reflective, scratch resistant sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>30 ATM, 300 metres</p>
<p><strong>Strap</strong></p>
<p>Quick release stainless steel bracelet with micro adjustment feature</p>
<p><b>Weight</b></p>
<p>78g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: SM40-GMT-SS-GNBK-G</span></p>`,

  'SM40-GMT-SS-BLBK-B': `<p><strong>Bremont Supermarine GMT 'Glacier' Blue – Limited Edition of 500</strong><br />
Inspired by Iceland's icy landscapes and engineered to thrive in nature's most demanding conditions, the Supermarine GMT in 'Glacier' Blue is a tribute to the spirit of exploration. Limited to just 500 pieces, this 300m water-resistant GMT watch combines Bremont's uncompromising precision with bold, contemporary styling—ideal for globetrotters, divers, and adventurers alike.</p>
<p>At the heart of the design is a striking glacier-blue linear gradient dial, evoking the light and depth of polar terrain. A bi-directional, dual-tone 24-hour aluminium bezel surrounds the dial, while vibrant orange accents on the GMT hand and hour markers add clarity and a sharp visual pop. Protected by a domed, anti-reflective sapphire crystal, the dial is equipped with advanced Super-LumiNova®, providing blue-glow visibility on the indexes and green-glow on the GMT hand for superb legibility at all hours.</p>
<p>Built from high-grade 904L stainless steel, the 43mm case features a slim profile and enhanced ergonomics for lasting comfort. It comes fitted with Bremont's quick-release bracelet, crafted with polished-satin infinity links and a micro-adjust clasp for a precision fit. For added versatility, it also pairs effortlessly with a durable chevron rubber strap—ready for any terrain.</p>
<p>Inside, a modified automatic movement with a 50-hour power reserve powers the Supermarine GMT with rugged reliability. The closed case back is engraved with a global ocean map, a nod to Bremont's deep-rooted connection to marine exploration.</p>
<p>Exclusive, refined, and adventure-ready—the <strong>Supermarine GMT 'Glacier' Blue</strong> stands as a true collector's piece within Bremont's acclaimed Supermarine collection.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Second/GMT</p>
<p>Date at 3H</p>
<p>Bi-directional rotating bezel</p>
<p><b>Movement</b></p>
<p>Calibre: Modified Calibre 11 1/2''' BE-93-2AV</p>
<p>No of Jewels: 25 Jewels</p>
<p>Glucydur balance wheel</p>
<p>Anachron balance spring</p>
<p>Nivaflex mainspring</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 50-hour</p>
<p><b>Case specifications</b></p>
<p>Case construction made from 904L stainless steel</p>
<p>24H bi-directional bezel with a bi-colour aluminium bezel insert</p>
<p>Screw-in crown</p>
<p>Case Diameter: 40mm</p>
<p>Case Length: 48mm</p>
<p>Case Depth: 13mm</p>
<p>Lug Width: 20mm</p>
<p>Case back: Stainless steel screw-in and decorated closed case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Blue gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)</p>
<p>Black dial ring with printed minutes track</p>
<p>Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)</p>
<p>Polished rhodium-plated GMT hand with coloured tip infilled with white Super-LumiNova® (Green emission to match bezel lume)</p>
<p><b>Crystal</b></p>
<p>Domed anti-reflective, scratch resistant sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>30 ATM, 300 metres</p>
<p><strong>Strap</strong></p>
<p>Quick release bracelet with micro adjustment feature</p>
<p><b>Weight</b></p>
<p>78g (watch head only)</p>
<p><b>Limited Edition</b></p>
<p>Limited to 500 pieces</p>
<p><span style="display: none;">Tags : Ref No: SM40-GMT-SS-BLBK-B</span></p>`,

  'SM40-ND-SS-GN-B': `<p><strong>Redesigned for Adventure: The New Bremont Supermarine 300m &amp; 300m Date</strong></p>
<p>The latest Bremont Supermarine 300m and 300m Date models have been completely reimagined, now featuring a refined, slimmer case profile crafted from robust 904L stainless steel—enhancing both durability and comfort.</p>
<p>The redesigned case showcases a perfectly symmetrical silhouette with integrated crown and bezel guards, delivering practical functionality while protecting against accidental adjustments or impacts.</p>
<p>A knurled-edge anodised aluminium bezel with trapezoid markers flows seamlessly into the dial, creating a naval-inspired crosshair that draws attention to the centre of its bold gradient display. Applied indexes and advanced Super-LumiNova® technology ensure outstanding clarity and visibility, even in low-light conditions.</p>
<p>Complementing the new case is an entirely redesigned 904L steel bracelet—engineered with an undulating profile and alternating polished and satin-finished infinity-shaped links for exceptional fluidity, comfort, and fit. The Supermarine is also available with a military-style chevron performance rubber strap or a vintage-inspired brown leather strap with refined topstitching.</p>
<p>Completing the piece is an engraved case back, featuring a map of the world's oceans—paying tribute to the watch's marine heritage and its purpose as a refined yet rugged companion for every journey.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Second</p>
<p>Unidirectional rotating bezel</p>
<p><b>Movement</b></p>
<p>Calibre: Modified Calibre 11 1/2''' BE-92AO</p>
<p>No of Jewels: 25 Jewels</p>
<p>Glucydur balance wheel</p>
<p>Anachron balance spring</p>
<p>Nivaflex mainspring</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 50-hour</p>
<p><b>Case specifications</b></p>
<p>Case construction made from 904L stainless steel</p>
<p>Green Aluminium uni-directional dive bezel</p>
<p>Screw-in crown</p>
<p>Case Diameter: 40mm</p>
<p>Case Length: 49mm</p>
<p>Case Depth: 12mm</p>
<p>Lug Width: 20mm</p>
<p>Case back: Stainless steel screw-in and decorated closed case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Green gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)</p>
<p>Green dial ring with printed minutes track</p>
<p>Polished nickel-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)</p>
<p><b>Crystal</b></p>
<p>Domed anti-reflective, scratch resistant sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>30 ATM, 300 metres</p>
<p><strong>Strap</strong></p>
<p>Quick release bracelet with micro adjustment feature</p>
<p><b>Weight</b></p>
<p>75g (watch head only)</p>
<p><span style="display: none;">Tags : Ref No: SM40-ND-SS-GN-B</span></p>`,

  'SM40-DT-BI-BR-B': `<p><strong>Bremont Supermarine 300M Date Bi-Colour</strong><br />
Automatic | 904L Stainless Steel &amp; 18ct Rose Gold | 300M Water Resistance</p>
<p>Introducing the Supermarine 300m Date Bi-Colour, where rugged performance meets refined elegance. This striking timepiece pairs 904L stainless steel—renowned for its superior corrosion resistance and lustrous finish—with 18ct rose gold accents, delivering a luxurious yet highly functional dive watch.</p>
<p>The sleek case profile houses a rose gold-capped, knurled-edge bezel, featuring a rich brown aluminum insert with trapezoid indexes. This nautical-inspired aesthetic is continued on the brown gradient dial, where a subtle crosshair design nods to marine instrumentation, drawing the eye to its center. Applied indexes and Super-LumiNova®-filled hands ensure clarity and legibility in any light condition.</p>
<p>A rose gold-capped screw-down crown adds a final touch of elegance, while the engraved case back, adorned with a map of the world's oceans, reflects the watch's adventurous spirit and maritime heritage.</p>
<p>The <strong>Supermarine 300m Bi-Colour</strong> is fitted with Bremont's newly engineered 904L stainless steel bracelet, featuring polished and satin-finished infinity links and an easy quick-release system with micro-adjustment, offering both sophistication and comfort.</p>
<p>For an alternate look, the watch can also be worn with a brown leather strap featuring cream side stitching, providing a warm, versatile finish that transitions effortlessly from sea to city.</p>
<p><b>Functions</b></p>
<p>Central Hour/Minute/Second</p>
<p>Date at 3 O'clock</p>
<p>Unidirectional rotating bezel</p>
<p><b>Movement</b></p>
<p>Calibre: Modified Calibre 11 1/2''' BE-92AV</p>
<p>No of Jewels: 25 Jewels</p>
<p>Glucydur balance wheel</p>
<p>Anachron balance spring</p>
<p>Nivaflex mainspring</p>
<p>Frequency: 28,800bph (4Hz)</p>
<p>Power reserve: 50-hour</p>
<p><b>Case specifications</b></p>
<p>Case construction made from 904L stainless steel and rose gold</p>
<p>18ct rose gold capped knurled edged uni-directional dive bezel with brown aluminium insert</p>
<p>18ct rose gold capped screw-in crown</p>
<p>Case Diameter: 40mm</p>
<p>Case Length: 49mm</p>
<p>Case Depth: 12mm</p>
<p>Lug Width: 20mm</p>
<p>Case back: Stainless steel screw-in and decorated closed case back</p>
<p><b>Dial and Hands specifications</b></p>
<p>Brown gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)</p>
<p>Brown dial ring with printed minutes track</p>
<p>Rose gold coloured hour, minute and second hands infilled with light brown Super-LumiNova® (Blue emission)</p>
<p><b>Crystal</b></p>
<p>Domed anti-reflective, scratch resistant sapphire crystal</p>
<p><b>Water Resistance</b></p>
<p>30 ATM, 300 metres</p>
<p><strong>Strap</strong></p>
<p>Quick release stainless steel bracelet with micro adjustment feature</p>
<p><span style="display: none;">Tags : Ref No: SM40-DT-BI-BR-B</span></p>`
};

async function updateMissingDescriptions() {
  try {
    console.log('🔧 UPDATING PRODUCTS WITH COMPLETE DESCRIPTIONS FROM SYNTAX FILE...\n');
    
    // Get the products that need updating
    const productsToUpdate = [
      { id: 28801, ref: 'ALT42-MT-TI-BKBK-B', name: 'Altitude MB Meteor, Black Dial, Ti Bracelet' },
      { id: 28802, ref: 'ALT42-MT-TI-BKBK-L-S', name: 'Altitude MB Meteor, Black Dial, Leather Strap' },
      { id: 28803, ref: 'ALT42-MT-TI-SITI-B', name: 'Altitude MB Meteor, Silver Dial, Ti Bracelet' },
      { id: 28804, ref: 'ALT42-MT-TI-SITI-L-S', name: 'Altitude MB Meteor, Silver Dial, Leather Strap' },
      { id: 28805, ref: 'SM40-GMT-SS-GNBK-G', name: 'Supermarine 300M GMT "Tundra" Green' },
      { id: 28806, ref: 'SM40-GMT-SS-BLBK-B', name: 'Supermarine 300M GMT "Glacier" Blue' },
      { id: 28807, ref: 'SM40-ND-SS-GN-B', name: 'Supermarine 300M, Green Dial, Bracelet' },
      { id: 28808, ref: 'SM40-DT-BI-BR-B', name: 'Supermarine 300M Date Bi-Colour, Bracelet' }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    for (const product of productsToUpdate) {
      console.log(`📝 Updating product ${product.id}: ${product.name}`);
      console.log(`   Reference: ${product.ref}`);
      
      const description = PRODUCT_DESCRIPTIONS[product.ref];
      if (!description) {
        console.log(`   ❌ No description found for ${product.ref}\n`);
        failCount++;
        continue;
      }
      
      try {
        await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
          description: description
        }, {
          auth: {
            username: WP_USER,
            password: APP_PASSWORD
          }
        });
        
        console.log(`   ✅ Description updated successfully\n`);
        successCount++;
        
      } catch (err) {
        console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}\n`);
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('📊 DESCRIPTION UPDATE SUMMARY:');
    console.log(`✅ Successfully updated: ${successCount}/8`);
    console.log(`❌ Failed to update: ${failCount}/8`);
    
    if (successCount === 8) {
      console.log('\n🎉 All products now have complete descriptions from the syntax file!');
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

updateMissingDescriptions();