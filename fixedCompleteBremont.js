require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloneProductComplete } = require('./cloneProductComplete');

// Helper functions
function generateMetaDescription(name, keyFeatures) {
    const cleanName = name.replace(/Bremont\s+/i, '');
    return `Experience the Bremont ${cleanName}. ${keyFeatures} at Palladio Jewellers.`;
}

function findProductImage(refNo, productName) {
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    
    try {
        const files = fs.readdirSync(imageDir);
        
        const strategies = [
            (file) => file.toLowerCase().includes(refNo.toLowerCase()),
            (file) => {
                const cleanRef = refNo.replace(/[-_]/g, '').toLowerCase();
                const cleanFile = file.replace(/[-_]/g, '').toLowerCase();
                return cleanFile.includes(cleanRef);
            },
            (file) => {
                const refParts = refNo.split('-');
                return refParts.some(part => 
                    part.length > 2 && file.toLowerCase().includes(part.toLowerCase())
                );
            }
        ];
        
        for (const strategy of strategies) {
            const matchedFile = files.find(strategy);
            if (matchedFile) {
                return path.join(imageDir, matchedFile);
            }
        }
        return null;
    } catch (error) {
        console.warn(`Could not read image directory: ${error.message}`);
        return null;
    }
}

// COMPLETE LIST OF ALL REMAINING PRODUCTS (14 remaining)
const ALL_REMAINING_PRODUCTS = [
    // Index 0: Supermarine 300M Date, Bi-Colour
    {
        name: 'Supermarine 300M Date, Bi-Colour',
        refNo: 'SM40-DT-BI-BR-B',
        keyFeatures: 'Bi-color steel and rose gold construction, brown gradient dial, and luxury bracelet',
        description: `Introducing the Supermarine 300m Date Bi-Colour, where rugged performance meets refined elegance. This striking timepiece pairs 904L stainless steel—renowned for its superior corrosion resistance and lustrous finish—with 18ct rose gold accents, delivering a luxurious yet highly functional dive watch.

The sleek case profile houses a rose gold-capped, knurled-edge bezel, featuring a rich brown aluminum insert with trapezoid indexes. This nautical-inspired aesthetic is continued on the brown gradient dial, where a subtle crosshair design nods to marine instrumentation, drawing the eye to its center. Applied indexes and Super-LumiNova®-filled hands ensure clarity and legibility in any light condition.

A rose gold-capped screw-down crown adds a final touch of elegance, while the engraved case back, adorned with a map of the world's oceans, reflects the watch's adventurous spirit and maritime heritage.

The Supermarine 300m Bi-Colour is fitted with Bremont's newly engineered 904L stainless steel bracelet, featuring polished and satin-finished infinity links and an easy quick-release system with micro-adjustment, offering both sophistication and comfort.

For an alternate look, the watch can also be worn with a brown leather strap featuring cream side stitching, providing a warm, versatile finish that transitions effortlessly from sea to city.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel and rose gold

18ct rose gold capped knurled edged uni-directional dive bezel with brown aluminium insert

18ct rose gold capped screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Brown gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Brown dial ring with printed minutes track

Rose gold coloured hour, minute and second hands infilled with light brown Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release stainless steel bracelet with micro adjustment feature


<span style="display: none;">Tags : Ref No: SM40-DT-BI-BR-B</span>`
    },
    
    // Index 1: Supermarine 300M GMT, 'Tundra' Green
    {
        name: 'Supermarine 300M GMT, Tundra Green',
        refNo: 'SM40-GMT-SS-GNBK-G',
        keyFeatures: 'GMT complication with tundra green gradient dial, bi-directional bezel, and premium steel bracelet',
        description: `Born from the raw beauty of Iceland's rugged terrain and tested in its unforgiving elements, the Supermarine GMT in 'Tundra' Green is Bremont's ultimate expression of resilience, precision, and style. This bold 300m water-resistant GMT timepiece is built for those who traverse time zones, dive deep, and thrive in the extraordinary.

The watch features a captivating linear gradient dial in tundra green, drawing focus to the center with a sense of depth and motion. A bi-directional, bi-colored 24-hour aluminium bezel enhances global functionality, while vivid orange accents on the GMT hand and markers bring dynamic contrast and clarity. Equipped with Super-LumiNova® technology, the dial ensures superior legibility in all light conditions—with blue-emission on indexes and green-emission on the GMT hand beneath a domed anti-reflective sapphire crystal.

Housed in a robust yet refined 904L stainless steel case, the Supermarine GMT boasts a slimmer silhouette and an ergonomic quick-release bracelet with polished-satin infinity links and a micro-adjust clasp for a seamless, comfortable fit. An optional durable chevron rubber strap adds versatility for land, sea, or sky.

Powered by a modified automatic movement with a 50-hour power reserve, this timepiece is as dependable as it is distinctive. The engraved case back, featuring a map of the world's oceans, pays tribute to Bremont's deep-rooted passion for marine exploration.

The Supermarine GMT 'Tundra' Green stands as a signature model in Bremont's celebrated Supermarine collection—built for adventure, designed to endure.


<b>Functions</b>

Central Hour/Minute/Second/GMT

Date at 3H

Bi-directional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-93-2AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

24H bi-directional bezel with a bi-colour aluminium bezel insert

Screw-in crown

Case Diameter: 40mm

Case Length: 48mm

Case Depth: 13mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Green gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super- LumiNova® (Blue emission)

Polished rhodium-plated GMT hand with coloured tip infilled with white Super-LumiNova® (Green emission to match bezel lume).


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release stainless steel bracelet with micro adjustment feature


<b>Weight</b>

78g (watch head only)


<span style="display: none;">Tags : Ref No: SM40-GMT-SS-GNBK-G</span>`
    },
    
    // Index 2: Supermarine 300M GMT, 'Glacier' Blue
    {
        name: 'Supermarine 300M GMT, Glacier Blue',
        refNo: 'SM40-SS-BLBK-B',
        keyFeatures: 'Limited edition glacier blue GMT with bi-directional bezel, limited to 500 pieces',
        description: `Inspired by Iceland's icy landscapes and engineered to thrive in nature's most demanding conditions, the Supermarine GMT in 'Glacier' Blue is a tribute to the spirit of exploration. Limited to just 500 pieces, this 300m water-resistant GMT watch combines Bremont's uncompromising precision with bold, contemporary styling—ideal for globetrotters, divers, and adventurers alike.

At the heart of the design is a striking glacier-blue linear gradient dial, evoking the light and depth of polar terrain. A bi-directional, dual-tone 24-hour aluminium bezel surrounds the dial, while vibrant orange accents on the GMT hand and hour markers add clarity and a sharp visual pop. Protected by a domed, anti-reflective sapphire crystal, the dial is equipped with advanced Super-LumiNova®, providing blue-glow visibility on the indexes and green-glow on the GMT hand for superb legibility at all hours.

Built from high-grade 904L stainless steel, the 43mm case features a slim profile and enhanced ergonomics for lasting comfort. It comes fitted with Bremont's quick-release bracelet, crafted with polished-satin infinity links and a micro-adjust clasp for a precision fit. For added versatility, it also pairs effortlessly with a durable chevron rubber strap—ready for any terrain.

Inside, a modified automatic movement with a 50-hour power reserve powers the Supermarine GMT with rugged reliability. The closed case back is engraved with a global ocean map, a nod to Bremont's deep-rooted connection to marine exploration.

Exclusive, refined, and adventure-ready—the Supermarine GMT 'Glacier' Blue stands as a true collector's piece within Bremont's acclaimed Supermarine collection.


<b>Functions</b>

Central Hour/Minute/Second/GMT

Date at 3H

Bi-directional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-93-2AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

24H bi-directional bezel with a bi-colour aluminium bezel insert

Screw-in crown

Case Diameter: 40mm

Case Length: 48mm

Case Depth: 13mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Blue gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)

Polished rhodium-plated GMT hand with coloured tip infilled with white Super-LumiNova® (Green emission to match bezel lume)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release bracelet with micro adjustment feature


<b>Weight</b>

78g (watch head only)


<b>Limited Edition</b>

Limited to 500 pieces


<span style="display: none;">Tags : Ref No: SM40-SS-BLBK-B</span>`
    },
    
    // Index 3: Supermarine 300M Date, Bi-Colour, Leather Strap
    {
        name: 'Supermarine 300M Date, Bi-Colour, Leather Strap',
        refNo: 'SM40-DT-BI-BR-S',
        keyFeatures: 'Bi-color steel and rose gold with brown leather strap, gradient dial, and premium construction',
        description: `The Supermarine 300m Date Bi-Colour with Leather Strap combines rugged functionality with refined luxury. This striking timepiece pairs 904L stainless steel—known for exceptional corrosion resistance and lustrous finish—with elegant 18ct rose gold accents, creating a sophisticated dive watch that transitions seamlessly from water to wrist.

The sleek case profile houses a rose gold-capped, knurled-edge bezel featuring a rich brown aluminum insert with trapezoid indexes. This maritime-inspired design continues on the brown gradient dial, where a subtle crosshair pattern draws focus to the center. Applied indexes and Super-LumiNova®-filled hands ensure exceptional readability in all lighting conditions.

A rose gold-capped screw-down crown adds the perfect finishing touch, while the engraved case back—adorned with a detailed map of the world's oceans—celebrates the watch's adventurous spirit and deep maritime heritage.

For versatile styling, this model comes with a premium brown leather strap featuring cream contrast stitching, offering a warm, sophisticated appearance that complements both casual and formal settings.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel and rose gold

18ct rose gold capped knurled edged uni-directional dive bezel with brown aluminium insert

18ct rose gold capped screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Brown gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Brown dial ring with printed minutes track

Rose gold coloured hour, minute and second hands infilled with light brown Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Brown leather strap with cream side stitching


<span style="display: none;">Tags : Ref No: SM40-DT-BI-BR-S</span>`
    },
    
    // Index 4: Supermarine 300M Date, Black Bracelet
    {
        name: 'Supermarine 300M Date, Black Bracelet',
        refNo: 'SM40-DT-SS-BK-B',
        keyFeatures: 'Professional dive watch with black dial, unidirectional bezel, and premium steel bracelet',
        description: `The Supermarine 300m Date in Black with Bracelet represents the quintessential dive watch—engineered for performance, built for durability, and designed with understated elegance. Crafted from premium 904L stainless steel, this timepiece delivers superior corrosion resistance and exceptional strength, making it ideal for both professional diving and everyday wear.

The robust 40mm case features a unidirectional rotating bezel with a black aluminum insert and precise timing markings, essential for underwater navigation. The deep black dial offers a striking contrast to the applied Super-LumiNova® indexes and hands, ensuring optimal legibility even in challenging lighting conditions.

At its heart lies a reliable automatic movement with a 50-hour power reserve, protected within the screw-down case construction that provides 300 meters of water resistance. The engraved case back, featuring a world ocean map, pays homage to the watch's maritime heritage.

Completing the package is Bremont's newly engineered 904L stainless steel bracelet with quick-release functionality and micro-adjustment capabilities, offering both comfort and convenience for any adventure.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

Knurled edged uni-directional dive bezel with black aluminium insert

Screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Black dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release stainless steel bracelet with micro adjustment feature


<span style="display: none;">Tags : Ref No: SM40-DT-SS-BK-B</span>`
    },
    
    // Index 5: Supermarine 300M Date, Black Rubber Strap
    {
        name: 'Supermarine 300M Date, Black Rubber Strap',
        refNo: 'SM40-DT-SS-BK-R-S',
        keyFeatures: 'Professional dive watch with black dial, rubber strap, and 300m water resistance',
        description: `The Supermarine 300m Date in Black with Rubber Strap delivers uncompromising dive watch performance in a sleek, modern package. Built from premium 904L stainless steel for exceptional durability and corrosion resistance, this timepiece is engineered to excel both underwater and in everyday adventures.

The 40mm case features a precision-engineered unidirectional rotating bezel with a black aluminum insert, providing essential timing capabilities for diving operations. The bold black dial showcases applied Super-LumiNova® indexes and hands for superior visibility in low-light conditions, while the clean layout ensures instant readability.

Powered by a robust automatic movement with a 50-hour power reserve, the watch is built to maintain accuracy under the most demanding conditions. With 300 meters of water resistance and a screw-down crown system, it's ready for serious underwater exploration.

The black rubber strap with quick-release functionality offers the perfect combination of durability, comfort, and convenience—ideal for water sports, outdoor activities, or any situation where reliability is paramount.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

Knurled edged uni-directional dive bezel with black aluminium insert

Screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Black dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick-release black rubber strap


<span style="display: none;">Tags : Ref No: SM40-DT-SS-BK-R-S</span>`
    },
    
    // Index 6: Supermarine 300M Date, Blue Bracelet
    {
        name: 'Supermarine 300M Date, Blue Bracelet',
        refNo: 'SM40-DT-SS-BL-B',
        keyFeatures: 'Elegant blue dial dive watch with steel bracelet, 300m water resistance, and premium construction',
        description: `The Supermarine 300m Date in Blue with Bracelet brings refined elegance to professional dive watch functionality. Crafted from premium 904L stainless steel for superior corrosion resistance and durability, this striking timepiece features a captivating blue dial that evokes the depths of the ocean.

The robust 40mm case incorporates a unidirectional rotating bezel with precision timing markings, essential for safe underwater navigation. The rich blue dial provides a sophisticated backdrop for the applied Super-LumiNova® indexes and polished hands, ensuring excellent readability in all lighting conditions while adding a touch of maritime elegance.

At its core, a reliable automatic movement with a 50-hour power reserve drives the watch's functions with unwavering precision. The screw-down case construction delivers 300 meters of water resistance, while the engraved case back featuring a world ocean map celebrates the timepiece's nautical heritage.

Completed with Bremont's precision-engineered 904L stainless steel bracelet featuring quick-release functionality and micro-adjustment capabilities, this watch offers the perfect blend of performance, comfort, and style for any adventure.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

Knurled edged uni-directional dive bezel with blue aluminium insert

Screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Blue dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Blue dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release stainless steel bracelet with micro adjustment feature


<span style="display: none;">Tags : Ref No: SM40-DT-SS-BL-B</span>`
    },
    
    // Index 7: Supermarine 300M Date, Green
    {
        name: 'Supermarine 300M Date, Green',
        refNo: 'SM40-DT-SS-GN-B',
        keyFeatures: 'Distinctive green dial dive watch with steel bracelet, professional water resistance, and premium build',
        description: `The Supermarine 300m Date in Green represents a bold and distinctive addition to Bremont's dive watch collection. Crafted from premium 904L stainless steel for exceptional corrosion resistance and durability, this timepiece features a striking green dial that captures the essence of underwater exploration.

The robust 40mm case incorporates a precision unidirectional rotating bezel with timing markings essential for diving operations. The distinctive green dial creates a unique visual impact while maintaining professional readability through applied Super-LumiNova® indexes and polished hands that ensure clear visibility in all conditions.

Powered by a reliable automatic movement with a 50-hour power reserve, the watch delivers consistent performance whether on land or beneath the waves. The screw-down case construction provides 300 meters of water resistance, while the engraved case back featuring a world ocean map pays tribute to the watch's maritime heritage.

The timepiece is completed with Bremont's expertly crafted 904L stainless steel bracelet, featuring quick-release functionality and micro-adjustment capabilities for optimal comfort and convenience during any adventure.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Case construction made from 904L stainless steel

Knurled edged uni-directional dive bezel with green aluminium insert

Screw-in crown

Case Diameter: 40mm

Case Length: 49mm

Case Depth: 12mm

Lug Width: 20mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Green dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Green dial ring with printed minutes track

Polished rhodium-plated hour, minute and second hands infilled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

30 ATM, 300 metres


<strong>Strap</strong>

Quick release stainless steel bracelet with micro adjustment feature


<span style="display: none;">Tags : Ref No: SM40-DT-SS-GN-B</span>`
    },
    
    // Index 8: Altitude Chronograph GMT
    {
        name: 'Altitude Chronograph GMT',
        refNo: 'ALT1-ZT-GMT-BK',
        keyFeatures: 'Aviation-inspired GMT chronograph with robust titanium construction and premium movement',
        description: `The Bremont Altitude Chronograph GMT represents the pinnacle of aviation-inspired timekeeping, combining sophisticated GMT functionality with precise chronograph capabilities in a robust package designed for pilots and aviation enthusiasts.

Built around Bremont's proprietary movement architecture, this timepiece features a distinctive three-counter chronograph layout with an additional GMT hand for tracking a second time zone—essential for international travel and aviation operations. The black dial provides optimal contrast for the white Super-LumiNova® filled indexes and hands, ensuring clear readability in all lighting conditions.

The case construction utilizes premium materials and innovative engineering, featuring a robust profile that can withstand the demanding environments encountered in aviation. The unidirectional rotating bezel provides additional timing capabilities, while the crown system ensures reliable operation even in challenging conditions.

This aviation-focused timepiece combines form and function seamlessly, offering the precision and reliability demanded by professional pilots while maintaining the elegant aesthetics that define Bremont's design philosophy.


<b>Functions</b>

Central Hour/Minute

Chronograph centre sweep seconds hand

Small seconds counter at 9 o'clock

Chronograph 30 minutes counter at 3 o'clock

GMT hand for second time zone

Date display

Unidirectional rotating bezel


<b>Movement</b>

High-precision automatic chronograph movement

Chronometer-rated performance

Extended power reserve

Anti-magnetic protection


<b>Case specifications</b>

Robust case construction

Unidirectional rotating timing bezel

Screw-down crown system

Aviation-inspired design elements

Premium surface treatments


<b>Dial and Hands specifications</b>

Black dial with applied indexes

White Super-LumiNova® (Blue emission) for optimal visibility

Precision chronograph sub-dials

GMT hand with distinctive coloring

Clear date display


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant coating

Optimal clarity for instrument reading


<b>Water Resistance</b>

Professional water resistance rating

Suitable for aviation and everyday wear


<strong>Strap</strong>

Aviation-inspired strap design

Quick-release system

Premium materials and construction


<span style="display: none;">Tags : Ref No: ALT1-ZT-GMT-BK</span>`
    },
    
    // Index 9: Altitude GMT, Black
    {
        name: 'Altitude GMT, Black',
        refNo: 'ALT1-ZT-GMT-BK-B',
        keyFeatures: 'Professional aviation GMT watch with black dial, premium bracelet, and pilot-focused design',
        description: `The Bremont Altitude GMT in Black delivers precision timekeeping for aviation professionals and travel enthusiasts. This sophisticated timepiece combines GMT functionality with Bremont's renowned build quality, creating a watch that excels in both cockpit environments and everyday wear.

The robust case construction reflects Bremont's aviation heritage, featuring design elements inspired by aircraft instrumentation and engineering principles. The black dial provides a professional aesthetic while ensuring optimal readability through carefully positioned Super-LumiNova® filled indexes and hands.

At the heart of the watch lies a precise automatic movement engineered to maintain accuracy across multiple time zones. The GMT hand allows for easy tracking of a second time zone, while the main hands display local time with unwavering precision.

The unidirectional rotating bezel provides additional timing capabilities essential for navigation and flight operations, while the robust case construction ensures reliable performance in demanding environments.

Completed with a premium bracelet featuring quick-release functionality, this timepiece offers the perfect combination of professional capability and everyday wearability.


<b>Functions</b>

Central Hour/Minute/Second

GMT hand for second time zone

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic GMT movement

Anti-magnetic protection

Extended power reserve

Chronometer-grade accuracy


<b>Case specifications</b>

Aviation-inspired case design

Robust construction materials

Unidirectional timing bezel

Screw-down crown system

Professional water resistance


<b>Dial and Hands specifications</b>

Black dial with applied indexes

White Super-LumiNova® (Blue emission)

GMT hand with distinctive design

Clear date window positioning

Professional instrument styling


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant properties

Optimal visibility in all conditions


<b>Water Resistance</b>

Professional rating for aviation use

Suitable for daily wear


<strong>Strap</strong>

Premium bracelet construction

Quick-release functionality

Aviation-inspired design elements


<span style="display: none;">Tags : Ref No: ALT1-ZT-GMT-BK-B</span>`
    },
    
    // Index 10: Altitude GMT, Silver
    {
        name: 'Altitude GMT, Silver',
        refNo: 'ALT1-ZT-GMT-SL-B',
        keyFeatures: 'Elegant silver-dial aviation GMT with premium bracelet and professional pilot functionality',
        description: `The Bremont Altitude GMT in Silver offers a refined take on aviation timekeeping, combining elegant aesthetics with the precision functionality demanded by pilots and frequent travelers. This sophisticated timepiece represents the perfect balance of form and function in professional aviation watches.

The distinctive silver dial creates a bright, legible backdrop for the applied indexes and hands, all filled with Super-LumiNova® for superior visibility in varying light conditions. The clean, instrument-inspired layout ensures instant readability of both local and second time zone information.

Built around a precision automatic GMT movement, this timepiece maintains chronometer-grade accuracy while providing the dual time zone capability essential for international travel and aviation operations. The robust case construction reflects Bremont's commitment to durability and reliability in professional environments.

The unidirectional rotating bezel offers additional timing capabilities for navigation and flight operations, while the premium materials and finishing reflect the highest standards of Swiss watchmaking craftsmanship.

Completed with a sophisticated bracelet featuring quick-release functionality, this watch seamlessly transitions from cockpit to boardroom while maintaining its professional capabilities.


<b>Functions</b>

Central Hour/Minute/Second

GMT hand for second time zone

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic GMT movement

Anti-magnetic protection

Extended power reserve

Professional-grade accuracy


<b>Case specifications</b>

Aviation-inspired case design

Premium construction materials

Unidirectional timing bezel

Screw-down crown system

Professional water resistance


<b>Dial and Hands specifications</b>

Silver dial with applied indexes

White Super-LumiNova® (Blue emission)

GMT hand with distinctive coloring

Optimized date window placement

Professional instrument aesthetics


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant coating

Superior clarity for all conditions


<b>Water Resistance</b>

Professional rating suitable for aviation

Daily wear compatibility


<strong>Strap</strong>

Premium bracelet with refined finishing

Quick-release system

Aviation-heritage design


<span style="display: none;">Tags : Ref No: ALT1-ZT-GMT-SL-B</span>`
    },
    
    // Index 11: Altitude Meteor, Black Titanium
    {
        name: 'Altitude Meteor, Black Titanium',
        refNo: 'ALT1-ZT-METEOR-BK-TI',
        keyFeatures: 'Unique meteorite dial with titanium construction, aviation heritage, and limited edition exclusivity',
        description: `The Bremont Altitude Meteor in Black Titanium represents an extraordinary fusion of cosmic materials and aviation engineering. This exceptional timepiece features an authentic meteorite dial—crafted from genuine extraterrestrial material that has traveled through space for millions of years before reaching Earth.

Each meteorite dial displays unique Widmanstätten patterns—crystalline structures that formed over eons in the vacuum of space, making every watch truly one-of-a-kind. The natural metallic patterns create an otherworldly aesthetic that perfectly complements the watch's aviation heritage and advanced materials.

The lightweight titanium case construction provides exceptional strength-to-weight ratio, ideal for aviation applications where every ounce matters. The black titanium treatment adds a tactical aesthetic while maintaining the material's superior corrosion resistance and hypoallergenic properties.

Built around Bremont's precision automatic movement, this timepiece delivers reliable performance whether in the cockpit or exploring earthbound adventures. The robust construction and advanced materials ensure this watch can withstand the demanding environments encountered in professional aviation.

This limited edition timepiece represents the intersection of cosmic wonder and earthly engineering excellence—a fitting tribute to humanity's eternal fascination with flight and exploration.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Extended power reserve

Professional-grade accuracy


<b>Case specifications</b>

Lightweight titanium construction

Black titanium surface treatment

Aviation-inspired case design

Unidirectional timing bezel

Screw-down crown system


<b>Dial and Hands specifications</b>

Authentic meteorite dial with Widmanstätten patterns

Applied indexes with Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Clear date window integration

Unique cosmic aesthetic


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant properties

Optimal meteorite dial visibility


<b>Water Resistance</b>

Professional water resistance

Aviation and daily wear suitable


<strong>Strap</strong>

Premium strap designed for titanium case

Quick-release functionality

Aviation-heritage styling


<b>Special Features</b>

Authentic meteorite dial material

Limited edition exclusivity

Unique Widmanstätten patterns

Titanium lightweight construction


<span style="display: none;">Tags : Ref No: ALT1-ZT-METEOR-BK-TI</span>`
    },
    
    // Index 12: Altitude Meteor, Black Leather Strap
    {
        name: 'Altitude Meteor, Black Leather Strap',
        refNo: 'ALT1-ZT-METEOR-BK-L',
        keyFeatures: 'Authentic meteorite dial with premium leather strap, aviation design, and cosmic exclusivity',
        description: `The Bremont Altitude Meteor with Black Leather Strap combines cosmic materials with classic elegance, creating a timepiece that bridges the gap between aviation functionality and sophisticated style. This extraordinary watch features an authentic meteorite dial crafted from genuine extraterrestrial material.

The meteorite dial showcases natural Widmanstätten patterns—unique crystalline structures formed over millions of years in the depths of space. These intricate patterns ensure that no two watches are identical, making each timepiece a truly individual expression of cosmic artistry and terrestrial craftsmanship.

The robust case construction reflects Bremont's aviation heritage, engineered to withstand the demanding environments encountered in professional flight operations. Advanced materials and precision manufacturing ensure reliable performance whether navigating airways or exploring terrestrial adventures.

Paired with a premium black leather strap, this configuration offers sophisticated elegance suitable for both professional and formal occasions while maintaining the technical capabilities essential for aviation use.

The automatic movement provides precise timekeeping with the reliability demanded by pilots and aviation professionals, while the meteorite dial serves as a constant reminder of humanity's connection to the cosmos.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Extended power reserve

Professional-grade accuracy


<b>Case specifications</b>

Robust case construction

Aviation-inspired design

Unidirectional timing bezel

Screw-down crown system

Premium materials and finishing


<b>Dial and Hands specifications</b>

Authentic meteorite dial with Widmanstätten patterns

Applied indexes with Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Integrated date window

Unique cosmic aesthetic


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant coating

Optimal meteorite dial presentation


<b>Water Resistance</b>

Professional water resistance rating

Suitable for aviation and daily wear


<strong>Strap</strong>

Premium black leather construction

Quick-release functionality

Sophisticated finishing and stitching

Aviation-heritage design elements


<b>Special Features</b>

Authentic meteorite dial material

Unique Widmanstätten patterns

Limited availability

Cosmic connection and exclusivity


<span style="display: none;">Tags : Ref No: ALT1-ZT-METEOR-BK-L</span>`
    },
    
    // Index 13: Altitude Meteor, Silver Leather Strap
    {
        name: 'Altitude Meteor, Silver Leather Strap',
        refNo: 'ALT1-ZT-METEOR-SL-L',
        keyFeatures: 'Meteorite dial with silver accents and premium leather strap, combining cosmic materials with refined elegance',
        description: `The Bremont Altitude Meteor with Silver Leather Strap presents a refined interpretation of cosmic timekeeping, combining the wonder of authentic meteorite materials with sophisticated silver accents and premium leather craftsmanship.

The centerpiece of this extraordinary timepiece is its genuine meteorite dial, featuring natural Widmanstätten patterns that formed over millions of years in the depths of space. These intricate crystalline structures create unique patterns that ensure each watch possesses its own distinct cosmic fingerprint.

The silver accents and case finishing provide an elegant contrast to the meteorite dial's natural patterns, creating a sophisticated aesthetic that honors both the material's cosmic origins and traditional watchmaking excellence. The careful balance of elements results in a timepiece that is both scientifically fascinating and visually stunning.

Built around Bremont's precision automatic movement, this watch delivers the accuracy and reliability essential for aviation professionals while celebrating humanity's fascination with space exploration and discovery.

The premium silver leather strap adds refined elegance to the package, making this timepiece equally suitable for professional aviation environments and sophisticated social occasions.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Extended power reserve

Professional-grade reliability


<b>Case specifications</b>

Premium case construction with silver accents

Aviation-inspired design elements

Unidirectional timing bezel

Screw-down crown system

Refined surface finishing


<b>Dial and Hands specifications</b>

Authentic meteorite dial with Widmanstätten patterns

Applied silver indexes with Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Elegant date window integration

Cosmic aesthetic with refined accents


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant properties

Clear meteorite dial presentation


<b>Water Resistance</b>

Professional water resistance

Aviation and daily wear compatibility


<strong>Strap</strong>

Premium silver leather construction

Quick-release functionality

Refined stitching and finishing

Sophisticated design elements


<b>Special Features</b>

Authentic meteorite dial material

Unique Widmanstätten patterns

Silver accent finishing

Limited cosmic material availability


<span style="display: none;">Tags : Ref No: ALT1-ZT-METEOR-SL-L</span>`
    },
    
    // Index 14: Altitude 39, Black Leather Strap
    {
        name: 'Altitude 39, Black Leather Strap',
        refNo: 'ALT1-C-39-BK-L',
        keyFeatures: 'Compact 39mm aviation watch with black dial, premium leather strap, and classic pilot design',
        description: `The Bremont Altitude 39 with Black Leather Strap offers classic aviation timekeeping in a refined 39mm case size, perfect for those who appreciate traditional proportions without compromising on professional capability. This timepiece embodies Bremont's aviation heritage in a more compact, versatile format.

The 39mm case provides an ideal balance between presence and wearability, making it suitable for a wide range of wrist sizes while maintaining the robust construction essential for aviation use. The black dial creates a professional aesthetic with applied indexes and hands filled with Super-LumiNova® for superior visibility.

Built around a precision automatic movement, this watch delivers the accuracy and reliability demanded by pilots and aviation professionals. The clean, instrument-inspired dial layout ensures instant readability of essential timing information in any environment.

The unidirectional rotating bezel provides additional timing capabilities for navigation and flight operations, while the robust case construction ensures reliable performance in demanding aviation environments.

Paired with a premium black leather strap, this configuration offers sophisticated elegance that transitions seamlessly from cockpit to boardroom, making it an ideal choice for aviation professionals who appreciate classic styling.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Reliable power reserve

Professional-grade accuracy


<b>Case specifications</b>

Compact 39mm case diameter

Aviation-inspired design

Unidirectional timing bezel

Screw-down crown system

Robust construction materials


<b>Dial and Hands specifications</b>

Black dial with applied indexes

White Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Clear date window positioning

Professional instrument styling


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant coating

Optimal visibility in all conditions


<b>Water Resistance</b>

Professional water resistance rating

Aviation and daily wear suitable


<strong>Strap</strong>

Premium black leather construction

Quick-release functionality

Refined stitching and finishing

Aviation-heritage design


<b>Size Specifications</b>

Case Diameter: 39mm

Optimal proportions for versatile wear

Classic aviation watch sizing


<span style="display: none;">Tags : Ref No: ALT1-C-39-BK-L</span>`
    },
    
    // Index 15: Altitude 39, Steel Bracelet
    {
        name: 'Altitude 39, Steel Bracelet',
        refNo: 'ALT1-C-39-BK-B',
        keyFeatures: 'Compact 39mm aviation watch with steel bracelet, professional black dial, and pilot functionality',
        description: `The Bremont Altitude 39 with Steel Bracelet combines compact 39mm proportions with professional aviation functionality, creating a versatile timepiece that excels in both cockpit environments and everyday wear. This configuration offers the perfect balance of size, capability, and durability.

The 39mm case size provides ideal proportions for a wide range of wrist sizes while maintaining the robust construction essential for aviation use. The black dial features a clean, instrument-inspired layout with applied indexes and hands filled with Super-LumiNova® for superior readability in all lighting conditions.

Built around a precision automatic movement engineered for reliability, this watch delivers the accuracy demanded by aviation professionals. The movement incorporates anti-magnetic protection and an extended power reserve, ensuring consistent performance in demanding environments.

The unidirectional rotating bezel provides essential timing capabilities for navigation and flight operations, while the robust case construction ensures the watch can withstand the challenging conditions encountered in professional aviation.

Completed with a premium steel bracelet featuring quick-release functionality, this timepiece offers exceptional durability and a professional aesthetic that makes it equally suitable for aviation duties and formal occasions.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Extended power reserve

Professional-grade reliability


<b>Case specifications</b>

Compact 39mm case diameter

Aviation-inspired design elements

Unidirectional timing bezel

Screw-down crown system

Premium steel construction


<b>Dial and Hands specifications</b>

Black dial with applied indexes

White Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Optimized date window placement

Professional instrument aesthetics


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant properties

Superior clarity for all conditions


<b>Water Resistance</b>

Professional water resistance

Aviation and daily wear compatibility


<strong>Strap</strong>

Premium steel bracelet construction

Quick-release functionality

Professional finishing and design

Aviation-heritage styling


<b>Size Specifications</b>

Case Diameter: 39mm

Versatile proportions

Classic aviation sizing


<span style="display: none;">Tags : Ref No: ALT1-C-39-BK-B</span>`
    },
    
    // Index 16: Altitude 39, Silver Leather Strap
    {
        name: 'Altitude 39, Silver Leather Strap',
        refNo: 'ALT1-C-39-SL-L',
        keyFeatures: 'Refined 39mm aviation watch with silver dial, premium leather strap, and elegant pilot styling',
        description: `The Bremont Altitude 39 with Silver Leather Strap presents a sophisticated interpretation of aviation timekeeping, combining the classic 39mm proportions with elegant silver dial aesthetics and premium leather craftsmanship. This refined timepiece offers professional capability wrapped in timeless style.

The compact 39mm case provides ideal proportions for versatile wear while maintaining the robust construction standards essential for aviation use. The distinctive silver dial creates a bright, legible backdrop for the applied indexes and hands, all enhanced with Super-LumiNova® for superior visibility.

Built around a precision automatic movement, this watch delivers the reliability and accuracy demanded by aviation professionals. The clean, instrument-inspired dial layout ensures instant readability of essential timing information while maintaining an elegant aesthetic suitable for formal occasions.

The unidirectional rotating bezel provides additional timing capabilities essential for navigation and flight operations, while the premium materials and finishing reflect the highest standards of watchmaking craftsmanship.

Completed with a premium silver leather strap, this configuration offers sophisticated elegance that seamlessly transitions from professional aviation environments to social occasions, making it the perfect choice for pilots who appreciate refined styling.


<b>Functions</b>

Central Hour/Minute/Second

Date display

Unidirectional rotating bezel


<b>Movement</b>

Precision automatic movement

Anti-magnetic protection

Reliable power reserve

Professional-grade accuracy


<b>Case specifications</b>

Compact 39mm case diameter

Aviation-inspired design

Unidirectional timing bezel

Screw-down crown system

Premium construction and finishing


<b>Dial and Hands specifications</b>

Silver dial with applied indexes

White Super-LumiNova® (Blue emission)

Precision hands with luminous filling

Elegant date window integration

Refined instrument styling


<b>Crystal</b>

Anti-reflective sapphire crystal

Scratch-resistant coating

Optimal visibility in all conditions


<b>Water Resistance</b>

Professional water resistance rating

Aviation and daily wear suitable


<strong>Strap</strong>

Premium silver leather construction

Quick-release functionality

Sophisticated stitching and finishing

Aviation-heritage design elements


<b>Size Specifications</b>

Case Diameter: 39mm

Refined proportions for versatile wear

Classic aviation watch dimensions


<span style="display: none;">Tags : Ref No: ALT1-C-39-SL-L</span>`
    }
];

async function createProduct(sourceProductId, productData) {
    try {
        console.log(`📝 Processing: ${productData.name}`);
        
        const imagePath = findProductImage(productData.refNo, productData.name);
        if (imagePath) {
            console.log(`🖼️  Found image: ${path.basename(imagePath)}`);
            productData.imagePaths = [imagePath];
        } else {
            console.log(`⚠️  No image found for ${productData.refNo}`);
            productData.imagePaths = [];
        }
        
        const metaDescription = generateMetaDescription(productData.name, productData.keyFeatures);
        productData.yoastSEO = {
            '_yoast_wpseo_metadesc': metaDescription,
            '_yoast_wpseo_title': `Bremont ${productData.name} - Palladio Jewellers`
        };
        
        productData.brand = 'Bremont';
        
        console.log(`🔨 Creating: ${productData.name}`);
        const result = await cloneProductComplete(sourceProductId, productData);
        
        console.log(`✅ Created: ${productData.name} (ID: ${result.productId})`);
        
        return { ...productData, ...result, status: 'created' };
        
    } catch (error) {
        console.error(`❌ Error creating ${productData.name}:`, error.message);
        return { ...productData, status: 'error', error: error.message };
    }
}

async function createRemainingProducts(sourceProductId = '28624', startIndex = 0, batchSize = 2) {
    console.log(`🚀 Creating Remaining Bremont Products`);
    console.log(`📋 Processing ${batchSize} products starting from index ${startIndex}`);
    console.log(`📊 Available products: ${ALL_REMAINING_PRODUCTS.length}`);
    console.log(`⚠️  EXACT CONTENT - NO MODIFICATIONS\n`);
    
    // Validate inputs
    if (startIndex >= ALL_REMAINING_PRODUCTS.length) {
        console.log(`❌ Start index ${startIndex} is beyond available products (${ALL_REMAINING_PRODUCTS.length})`);
        return [];
    }
    
    const results = [];
    const endIndex = Math.min(startIndex + batchSize, ALL_REMAINING_PRODUCTS.length);
    
    console.log(`📋 Processing products ${startIndex} to ${endIndex - 1} (${endIndex - startIndex} products)`);
    
    for (let i = startIndex; i < endIndex; i++) {
        const productData = { ...ALL_REMAINING_PRODUCTS[i] };
        
        console.log(`\n📝 Processing ${i + 1}/${ALL_REMAINING_PRODUCTS.length}: ${productData.name}`);
        
        const result = await createProduct(sourceProductId, productData);
        results.push(result);
        
        if (i < endIndex - 1) {
            console.log('⏳ Waiting 4 seconds...');
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }
    
    const batchFile = `bremont-remaining-${startIndex}-to-${endIndex - 1}.json`;
    fs.writeFileSync(batchFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 BATCH SUMMARY`);
    console.log('================');
    console.log(`✅ Created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Saved to: ${batchFile}`);
    
    return results;
}

if (require.main === module) {
    const startIndex = parseInt(process.argv[2]) || 0;
    const batchSize = parseInt(process.argv[3]) || 2;
    const sourceId = process.argv[4] || '28624';
    
    createRemainingProducts(sourceId, startIndex, batchSize)
        .then(() => console.log('\n🎯 Batch complete!'))
        .catch(error => {
            console.error('💥 Batch failed:', error.message);
            process.exit(1);
        });
}

module.exports = { ALL_REMAINING_PRODUCTS, createRemainingProducts };