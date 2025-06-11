// upload-media.js

const fs = require("fs")
const path = require("path")
const axios = require("axios")
const FormData = require("form-data")
require("dotenv").config()

const WP_USER = process.env.WP_USER
const APP_PASSWORD = process.env.APP_PASSWORD
const WP_URL = process.env.WP_URL // e.g. https://staging-palladiocanadacom-staging.kinsta.cloud

const mediaItems = [
	// —— U-Boat ——
	{
		filePath:
			"./new-images/u-boat/u-boat-classico-45-titanium-tungsten-black-right-hook-watch-palladio-jewellers.png",
		title: "Classico 45 Titanium Tungsten Black Right Hook",
		alt: "U-Boat Classico 45 Titanium Tungsten Black Right Hook Watches - Palladio Jewellers",
		caption:
			"Classico | Classico 45 Titanium Tungsten Black Right Hook by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Classico 45 Titanium Tungsten Black Right Hook, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-classico-45-titanium-tungsten-black-watch-palladio-jewellers.png",
		title: "Classico 45 Titanium Tungsten Black",
		alt: "U-Boat Classico 45 Titanium Tungsten Black Watches - Palladio Jewellers",
		caption:
			"Classico | Classico 45 Titanium Tungsten Black by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Classico 45 Titanium Tungsten Black, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-classico-45-titanium-tungsten-blue-watch-palladio-jewellers.png",
		title: "Classico 45 Titanium Tungsten Blue",
		alt: "U-Boat Classico 45 Titanium Tungsten Blue Watches - Palladio Jewellers",
		caption:
			"Classico | Classico 45 Titanium Tungsten Blue by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Classico 45 Titanium Tungsten Blue, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-classico-45-titanium-tungsten-gray-watch-palladio-jewellers.png",
		title: "Classico 45 Titanium Tungsten Gray",
		alt: "U-Boat Classico 45 Titanium Tungsten Gray Watches - Palladio Jewellers",
		caption:
			"Classico | Classico 45 Titanium Tungsten Gray by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Classico 45 Titanium Tungsten Gray, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-classico-55-1001-blue-watch-palladio-jewellers.png",
		title: "Classico 55 1001 Blue",
		alt: "U-Boat Classico 55 1001 Blue Watches - Palladio Jewellers",
		caption: "Classico | Classico 55 1001 Blue by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Classico 55 1001 Blue, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-sommerso-46mm-damascus-right-watch-palladio-jewellers.png",
		title: "Sommerso 46mm Damascus Right",
		alt: "U-Boat Sommerso 46mm Damascus Right Watches - Palladio Jewellers",
		caption:
			"Sommerso | Sommerso 46mm Damascus Right by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat Sommerso 46mm Damascus Right, available at Palladio Jewellers in Vancouver.",
	},
	{
		filePath:
			"./new-images/u-boat/u-boat-u-65-44mm-pvd-white-watch-palladio-jewellers.png",
		title: "U-65 44mm PVD White",
		alt: "U-Boat U-65 44mm PVD White Watches - Palladio Jewellers",
		caption: "U-65 | U-65 44mm PVD White by U-Boat - Palladio Jewellers",
		description:
			"Discover the U-Boat U-65 44mm PVD White, available at Palladio Jewellers in Vancouver.",
	},
	// // —— Parmigiani Fleurier ——
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-tonda-pf-gmt-rattrapante-verzasca-watch-palladio-jewellers.png",
	// 	title: "Tonda PF GMT Rattrapante Verzasca",
	// 	alt: "Parmigiani Fleurier Tonda PF GMT Rattrapante Verzasca Watches - Palladio Jewellers",
	// 	caption:
	// 		"Tonda PF Collection | Tonda PF GMT Rattrapante Verzasca by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Tonda PF GMT Rattrapante Verzasca, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-tonda-pf-chronograph-40mm-mineral-blue-watch-palladio-jewellers.png",
	// 	title: "Tonda PF Chronograph 40 mm Mineral Blue",
	// 	alt: "Parmigiani Fleurier Tonda PF Chronograph 40 mm Mineral Blue Watches - Palladio Jewellers",
	// 	caption:
	// 		"Tonda PF Collection | Tonda PF Chronograph 40 mm Mineral Blue by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Tonda PF Chronograph 40 mm Mineral Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-tonda-pf-skeleton-watch-palladio-jewellers.png",
	// 	title: "Tonda PF Skeleton",
	// 	alt: "Parmigiani Fleurier Tonda PF Skeleton Watches - Palladio Jewellers",
	// 	caption: "Tonda PF Collection | Tonda PF Skeleton by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Tonda PF Skeleton, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-tonda-pf-sport-cermet-london-grey-watch-palladio-jewellers.png",
	// 	title: "Tonda PF Sport Cermet London Grey",
	// 	alt: "Parmigiani Fleurier Tonda PF Sport Cermet London Grey Watches - Palladio Jewellers",
	// 	caption:
	// 		"Tonda PF Sport Collection | Tonda PF Sport Cermet London Grey by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Tonda PF Sport Cermet London Grey, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-tonda-pf-sport-cermet-milano-blue-watch-palladio-jewellers.png",
	// 	title: "Tonda PF Sport Cermet Milano Blue",
	// 	alt: "Parmigiani Fleurier Tonda PF Sport Cermet Milano Blue Watches - Palladio Jewellers",
	// 	caption:
	// 		"Tonda PF Sport Collection | Tonda PF Sport Cermet Milano Blue by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Tonda PF Sport Cermet Milano Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-toric-quantieme-perpetuel-golden-hour-watch-palladio-jewellers.png",
	// 	title: "Toric Quantième Perpétuel Golden Hour",
	// 	alt: "Parmigiani Fleurier Toric Quantième Perpétuel Golden Hour Watches - Palladio Jewellers",
	// 	caption:
	// 		"Toric Collection | Toric Quantième Perpétuel Golden Hour by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Toric Quantième Perpétuel Golden Hour, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/parmigiani-fleurier/parmigiani-toric-quantieme-perpetuel-morning-blue-watch-palladio-jewellers.png",
	// 	title: "Toric Quantième Perpétuel Morning Blue",
	// 	alt: "Parmigiani Fleurier Toric Quantième Perpétuel Morning Blue Watches - Palladio Jewellers",
	// 	caption:
	// 		"Toric Collection | Toric Quantième Perpétuel Morning Blue by Parmigiani Fleurier",
	// 	description:
	// 		"Discover the Parmigiani Fleurier Toric Quantième Perpétuel Morning Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },

	// // —— Czapek ——
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-passage-de-drake-deep-blue-watch-palladio-jewellers.png",
	// 	title: "Antarctique Passage de Drake Deep Blue",
	// 	alt: "Czapek Antarctique Passage de Drake Deep Blue Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Passage de Drake Deep Blue by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Passage de Drake Deep Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-passage-de-drake-salmon-red-tip-watch-palladio-jewellers.png",
	// 	title: "Antarctique Passage de Drake Salmon Red Tip",
	// 	alt: "Czapek Antarctique Passage de Drake Salmon Red Tip Watches - Palladio Jewellers",
	// 	caption:
	// 		"Antarctique Collection | Passage de Drake Salmon Red Tip by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Passage de Drake Salmon Red Tip, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-tourbillon-glacier-blue-watch-palladio-jewellers.png",
	// 	title: "Antarctique Tourbillon Glacier Blue",
	// 	alt: "Czapek Antarctique Tourbillon Glacier Blue Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Tourbillon Glacier Blue by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Tourbillon Glacier Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-tourbillon-photon-sphere-watch-palladio-jewellers.png",
	// 	title: "Antarctique Tourbillon Photon Sphere",
	// 	alt: "Czapek Antarctique Tourbillon Photon Sphere Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Tourbillon Photon Sphere by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Tourbillon Photon Sphere, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-tourbillon-secret-alloy-watch-palladio-jewellers.png",
	// 	title: "Antarctique Tourbillon Secret Alloy",
	// 	alt: "Czapek Antarctique Tourbillon Secret Alloy Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Tourbillon Secret Alloy by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Tourbillon Secret Alloy, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-titanium-dark-sector-red-tip-watch-palladio-jewellers.png",
	// 	title: "Antarctique Titanium Dark Sector",
	// 	alt: "Czapek Antarctique Titanium Dark Sector Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Titanium Dark Sector by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Titanium Dark Sector, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-promenade-plisse-white-pearl-watch-palladio-jewellers.png",
	// 	title: "Promenade Plissé White Pearl",
	// 	alt: "Czapek Promenade Plissé White Pearl Watches - Palladio Jewellers",
	// 	caption: "Promenade Collection | Plissé White Pearl by Czapek",
	// 	description:
	// 		"Discover the Czapek Promenade Plissé White Pearl, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-promenade-plisse-ivory-watch-palladio-jewellers.png",
	// 	title: "Promenade Plissé Ivory",
	// 	alt: "Czapek Promenade Plissé Ivory Watches - Palladio Jewellers",
	// 	caption: "Promenade Collection | Plissé Ivory by Czapek",
	// 	description:
	// 		"Discover the Czapek Promenade Plissé Ivory, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-promenade-plisse-rose-watch-palladio-jewellers.png",
	// 	title: "Promenade Plissé Rose",
	// 	alt: "Czapek Promenade Plissé Rose Watches - Palladio Jewellers",
	// 	caption: "Promenade Collection | Plissé Rose by Czapek",
	// 	description:
	// 		"Discover the Czapek Promenade Plissé Rose, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-passage-de-drake-glacier-blue-watch-palladio-jewellers.png",
	// 	title: "Antarctique Passage de Drake Glacier Blue",
	// 	alt: "Czapek Antarctique Passage de Drake Glacier Blue Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Passage de Drake Glacier Blue by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Passage de Drake Glacier Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-antarctique-passage-de-drake-ice-white-watch-palladio-jewellers.png",
	// 	title: "Antarctique Passage de Drake Ice White",
	// 	alt: "Czapek Antarctique Passage de Drake Ice White Watches - Palladio Jewellers",
	// 	caption: "Antarctique Collection | Passage de Drake Ice White by Czapek",
	// 	description:
	// 		"Discover the Czapek Antarctique Passage de Drake Ice White, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-quai-de-bergues-green-emerald-watch-palladio-jewellers.png",
	// 	title: "Quai de Bergues Green Emerald",
	// 	alt: "Czapek Quai de Bergues Green Emerald Watches - Palladio Jewellers",
	// 	caption: "New Collection | Quai de Bergues Green Emerald by Czapek",
	// 	description:
	// 		"Discover the Czapek Quai de Bergues Green Emerald, available exclusively at Palladio Jewellers in Vancouver.",
	// },
	// {
	// 	filePath:
	// 		"./new-images/czapek/czapek-quai-de-bergues-sapphire-blue-watch-palladio-jewellers.png",
	// 	title: "Quai de Bergues Sapphire Blue",
	// 	alt: "Czapek Quai de Bergues Sapphire Blue Watches - Palladio Jewellers",
	// 	caption: "New Collection | Quai de Bergues Sapphire Blue by Czapek",
	// 	description:
	// 		"Discover the Czapek Quai de Bergues Sapphire Blue, available exclusively at Palladio Jewellers in Vancouver.",
	// },
]

async function uploadMedia(item) {
	const file = fs.createReadStream(item.filePath)
	const filename = path.basename(item.filePath)
	const form = new FormData()

	form.append("file", file, filename)
	form.append("title", item.title)
	form.append("caption", item.caption)
	form.append("description", item.description)
	form.append("alt_text", item.alt)

	try {
		await axios.post(`${WP_URL}/wp-json/wp/v2/media`, form, {
			headers: {
				...form.getHeaders(),
				Authorization: `Basic ${Buffer.from(
					`${WP_USER}:${APP_PASSWORD}`
				).toString("base64")}`,
			},
		})
		console.log(`✅ Uploaded: ${filename}`)
	} catch (err) {
		console.error(
			`❌ Failed ${filename}:`,
			err.response?.data?.message || err.message
		)
	}
}

;(async () => {
	for (const item of mediaItems) {
		await uploadMedia(item)
	}
})()

// const fs = require("fs")
// const path = require("path")
// const axios = require("axios")
// const FormData = require("form-data")
// require("dotenv").config()

// // Replace with your details

// const WP_USER = process.env.WP_USER
// const APP_PASSWORD = process.env.APP_PASSWORD
// const WP_URL = process.env.WP_URL

// // Media file path & metadata - Raymond Weil - in case - size changes is needed, rerun below this.

// const mediaItems = [
// 	// Freelancer Collection
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/Raymond Weil_Freelancer_Complete Calendar Dune Sunray Dial Watch_40mm_2766-PC5-64001.webp",
// 		title:
// 			"Freelancer Complete Calendar Dune Sunray Dial 40 mm (2766‑PC5‑64001)",
// 		alt: "Raymond Weil Freelancer Complete Calendar Dune Sunray Dial 40 mm - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Complete Calendar Dune Sunray Dial by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Complete Calendar Dune Sunray Dial 40 mm (Ref. 2766‑PC5‑64001), available exclusively at Palladio Jewellers in Vancouver.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/RW_Freelancer_Ladies Automatic Moon Phase_2496-P5S-40051_Rose Gold.webp",
// 		title: "Freelancer Ladies Automatic Moon Phase Rose Gold (2496‑P5S‑40051)",
// 		alt: "Raymond Weil Freelancer Ladies Automatic Moon Phase Rose Gold - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Ladies Automatic Moon Phase by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Ladies Automatic Moon Phase in Rose Gold (Ref. 2496‑P5S‑40051), available at Palladio Jewellers in Vancouver.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/RW_Freelancer_Ladies Automatic Moon Phase_2496-C5S-40051_Cream Dial.webp",
// 		title: "Freelancer Ladies Automatic Moon Phase Cream Dial (2496‑C5S‑40051)",
// 		alt: "Raymond Weil Freelancer Ladies Automatic Moon Phase Cream Dial - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Ladies Automatic Moon Phase Cream Dial by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Ladies Automatic Moon Phase with Cream Dial (Ref. 2496‑C5S‑40051), exclusively at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/RW_Freelancer_Automatic Cushion Skeleton Limited Editio_2795-BKC-20000.webp",
// 		title:
// 			"Freelancer Automatic Cushion Skeleton Limited Edition (2795‑BKC‑20000)",
// 		alt: "Raymond Weil Freelancer Automatic Cushion Skeleton Limited Edition - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Automatic Cushion Skeleton Limited Edition by Raymond Weil",
// 		description:
// 			"Experience the Raymond Weil Freelancer Automatic Cushion Skeleton Limited Edition (Ref. 2795‑BKC‑20000), available at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/Raymond Weil_Freelancer Complete Calendar_Blue Sunray Dial Watch_40mm_2766-ST-50001.webp",
// 		title:
// 			"Freelancer Complete Calendar Blue Sunray Dial 40 mm (2766‑ST‑50001)",
// 		alt: "Raymond Weil Freelancer Complete Calendar Blue Sunray Dial 40 mm - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Complete Calendar Blue Sunray Dial by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Complete Calendar Blue Sunray Dial 40 mm (Ref. 2766‑ST‑50001) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/freelancer-collection/RW_Freelancer_Ladies Automatic Moon Phase_2490-P-10051_Yellow Gold.webp",
// 		title: "Freelancer Ladies Automatic Moon Phase Yellow Gold (2490‑P‑10051)",
// 		alt: "Raymond Weil Freelancer Ladies Automatic Moon Phase Yellow Gold - Palladio Jewellers",
// 		caption:
// 			"Freelancer Collection | Ladies Automatic Moon Phase by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Ladies Automatic Moon Phase in Yellow Gold (Ref. 2490‑P‑10051), only at Palladio Jewellers.",
// 	},

// 	// Millesime Collection
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/RW_Millesime_Automatic Tri-Compax Chronograph_7765-STC-60651.webp",
// 		title: "Millesime Automatic Tri‑Compax Chronograph (7765‑STC‑60651)",
// 		alt: "Raymond Weil Millesime Automatic Tri‑Compax Chronograph - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Tri‑Compax Chronograph by Raymond Weil",
// 		description:
// 			"Explore the Raymond Weil Millesime Automatic Tri‑Compax Chronograph (Ref. 7765‑STC‑60651), available at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/RW_Millesime_Automatic Tri-Compax Chronograph_SS_7765-ST-60651.webp",
// 		title: "Millesime Automatic Tri‑Compax Chronograph SS (7765‑ST‑60651)",
// 		alt: "Raymond Weil Millesime Automatic Tri‑Compax Chronograph SS - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Tri‑Compax Chronograph SS by Raymond Weil",
// 		description:
// 			"Explore the Raymond Weil Millesime Automatic Tri‑Compax Chronograph SS (Ref. 7765‑ST‑60651) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/Raymond Weil_Millesime_Automatic Small Seconds_Diamonds Watch_2130-C5S-64001.webp",
// 		title: "Millesime Automatic Small Seconds Diamonds (2130‑C5S‑64001)",
// 		alt: "Raymond Weil Millesime Automatic Small Seconds Diamonds - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Small Seconds Diamonds by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Millesime Automatic Small Seconds with Diamonds (Ref. 2130‑C5S‑64001) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/RW_Millesime_Automatic Small Seconds Menthol Minute Track Watch_2130-STC-60521.webp",
// 		title:
// 			"Millesime Automatic Small Seconds Menthol Minute Track (2130‑STC‑60521)",
// 		alt: "Raymond Weil Millesime Automatic Small Seconds Menthol Minute Track - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Small Seconds Menthol Minute Track by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Millesime Automatic Small Seconds Menthol Minute Track (Ref. 2130‑STC‑60521) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/Raymond Weil_Millesime_Infinite Burgandy_Limited Edition_2925-stc-APC01.webp",
// 		title: "Millesime Infinite Burgundy Limited Edition (2925‑STC‑APC01)",
// 		alt: "Raymond Weil Millesime Infinite Burgundy Limited Edition - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Infinite Burgundy Limited Edition by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Millesime Infinite Burgundy Limited Edition (Ref. 2925‑STC‑APC01) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/RW_Millesime_Automatic Tri-Compax Chronograph Black_7765-PC5-20631.webp",
// 		title: "Millesime Automatic Tri‑Compax Chronograph Black (7765‑PC5‑20631)",
// 		alt: "Raymond Weil Millesime Automatic Tri‑Compax Chronograph Black - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Tri‑Compax Chronograph Black by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Millesime Automatic Tri‑Compax Chronograph Black (Ref. 7765‑PC5‑20631) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/Raymind Weil_Millesime_Automatic Small Seconds_Rose Gold_Diamonds Watch_2130-C5-64001i.webp",
// 		title:
// 			"Millesime Automatic Small Seconds Rose Gold Diamonds (2130‑C5‑64001i)",
// 		alt: "Raymond Weil Millesime Automatic Small Seconds Rose Gold Diamonds - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Automatic Small Seconds Rose Gold Diamonds by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Millesime Automatic Small Seconds in Rose Gold with Diamonds (Ref. 2130‑C5‑64001i) at Palladio Jewellers.",
// 	},
// 	{
// 		filePath:
// 			"./images/raymond-weil-watches/millesime-collection/RW_Freelancer_Moon Phase_Midnight Blue_2945-pc5-50001.webp",
// 		title: "Freelancer Moon Phase Midnight Blue (2945‑PC5‑50001)",
// 		alt: "Raymond Weil Freelancer Moon Phase Midnight Blue - Palladio Jewellers",
// 		caption:
// 			"Millesime Collection | Freelancer Moon Phase Midnight Blue by Raymond Weil",
// 		description:
// 			"Discover the Raymond Weil Freelancer Moon Phase in Midnight Blue (Ref. 2945‑PC5‑50001) at Palladio Jewellers.",
// 	},
// ]

// // Media file path & metadata - Czapek - in case - size changes is needed, rerun below this.

// // const mediaItems = [
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-antarctique-tourbillon-glacier-blue-watches-palladio-jewellers.jpg",
// // 		"title": "Tourbillon Glacier Blue",
// // 		"alt": "Czapek Tourbillon Glacier Blue Watches - Palladio Jewellers",
// // 		"caption": "Antarctique Collection | Tourbillon Glacier Blue by Czapek",
// // 		"description":
// // 			"Tourbillon Glacier Blue from the Antarctique Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-antarctique-tourbillon-photon-sphere-watches-palladio-jewellers.jpg",
// // 		"title": "Tourbillon Photon Sphere",
// // 		"alt": "Czapek Tourbillon Photon Sphere Watches - Palladio Jewellers",
// // 		"caption": "Antarctique Collection | Tourbillon Photon Sphere by Czapek",
// // 		"description":
// // 			"Tourbillon Photon Sphere from the Antarctique Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-antarctique-tourbillon-secret-alloy-watches-palladio-jewellers.jpg",
// // 		"title": "Tourbillon Secret Alloy",
// // 		"alt": "Czapek Tourbillon Secret Alloy Watches - Palladio Jewellers",
// // 		"caption": "Antarctique Collection | Tourbillon Secret Alloy by Czapek",
// // 		"description":
// // 			"Tourbillon Secret Alloy from the Antarctique Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-antarctique-titanium-dark-sector-red-tip-watches-palladio-jewellers.jpg",
// // 		"title": "Titanium Dark Sector",
// // 		"alt": "Czapek Titanium Dark Sector Watches - Palladio Jewellers",
// // 		"caption": "Antarctique Collection | Titanium Dark Sector by Czapek",
// // 		"description":
// // 			"Titanium Dark Sector from the Antarctique Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-promenade-plisse-white-pearl-watches-palladio-jewellers.jpg",
// // 		"title": "Plisse White Pearl",
// // 		"alt": "Czapek Plisse White Pearl Watches - Palladio Jewellers",
// // 		"caption": "Promenade Collection | Plisse White Pearl by Czapek",
// // 		"description":
// // 			"Plisse White Pearl from the Promenade Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-promenade-plisse-ivory-watches-palladio-jewellers.jpg",
// // 		"title": "Plisse Ivory",
// // 		"alt": "Czapek Plisse Ivory Watches - Palladio Jewellers",
// // 		"caption": "Promenade Collection | Plisse Ivory by Czapek",
// // 		"description":
// // 			"Plisse Ivory from the Promenade Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // 	{
// // 		"filePath":
// // 			"./images/czapek/czapek-promenade-plisse-rose-watches-palladio-jewellers.jpg",
// // 		"title": "Plisse Rose",
// // 		"alt": "Czapek Plisse Rose Watches - Palladio Jewellers",
// // 		"caption": "Promenade Collection | Plisse Rose by Czapek",
// // 		"description":
// // 			"Plisse Rose from the Promenade Collection by Czapek, at Palladio Jewellers in Vancouver",
// // 	},
// // ]

// async function uploadMedia(item) {
// 	const file = fs.createReadStream(item.filePath)
// 	const filename = path.basename(item.filePath)
// 	const form = new FormData()

// 	form.append("file", file, filename)
// 	form.append("title", item.title)
// 	form.append("caption", item.caption)
// 	form.append("description", item.description)
// 	form.append("alt_text", item.alt)

// 	try {
// 		const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, form, {
// 			headers: {
// 				...form.getHeaders(),
// 				Authorization: `Basic ${Buffer.from(
// 					`${WP_USER}:${APP_PASSWORD}`
// 				).toString("base64")}`,
// 			},
// 		})
// 		console.log(`✅ Uploaded: ${filename}`)
// 	} catch (error) {
// 		console.error(
// 			`❌ Failed: ${filename} -> ${
// 				error.response?.data?.message || error.message
// 			}`
// 		)
// 	}
// }

// ;(async () => {
// 	for (const item of mediaItems) {
// 		await uploadMedia(item)
// 	}
// })()
