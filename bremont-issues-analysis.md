# BREMONT CATALOG CLEANUP ANALYSIS
*Generated: 2025-06-19T08:44:37.517Z*

## CURRENT STATUS: 31 Products Found

✅ **Data successfully fetched from WordPress**
- All 31 products have valid reference numbers
- All 31 products have featured images  
- 0/31 products have SKUs set
- All products have proper metadata and descriptions

---

## 🔍 ISSUE ANALYSIS COMPARISON

### 1. DUPLICATE PRODUCTS (6 sets to resolve)

| Ref Number | Current IDs | User's Requirement | Status |
|------------|-------------|-------------------|---------|
| **TN40-DT-SS-BK-B** | 28689, 28640 | Keep latest (28689), delete 28640 | ✅ **MATCHES** |
| **TN40-JH-SS-BK-B** | 28687, 28638 | Keep 28687, delete 28638 | ✅ **MATCHES** |
| **TN40-PWR-SS-BK-L-S** | 28685, 28681, 28636 | User said "missing -S" but ALL THREE already have -S | ⚠️ **DISCREPANCY** |
| **TN40-PWR-SS-BL-B** | 28683, 28679, 28634 | Keep 28683, delete others | ✅ **MATCHES** |
| **ALT42-MT-TI-BKBK-L** | Not found | User said 28670, 28668, 28666 but these have different refs | ⚠️ **DISCREPANCY** |
| **SM40-ND-SS-BL-S** | Not found | User said 28658, 28652 but 28658=SM40-DT-SS-BL-B, 28652=SM40-DT-BI-BR-S | ⚠️ **DISCREPANCY** |

### 2. REFERENCE NUMBER ANALYSIS

**✅ CORRECTLY IMPLEMENTED (Already Fixed):**
- 28642: `TN40-DT-SS-GN-L-S` ✓ (User said missing -S but it's there)
- 28632: `TN42-CHR-SS-BK-L-S` ✓ (User said missing -S but it's there)  
- 28629: `TN42-CHR-BZ-GN-L-S` ✓ (User said missing -S but it's there)
- 28656: `SM40-DT-SS-BK-R-S` ✓ (User said missing -S but it's there)
- 28650: `SM43-DT-SS-BK-R-S` ✓ (User said missing -S but it's there)
- 28646: `SM43-DT-BKCER-BK-N-S` ✓ (User said missing -S but it's there)

**⚠️ ACTUAL ISSUES FOUND:**
- 28662: `ALT1-ZT-GMT-BK-B` (User expected ALT42-CHR-G-SS-BK but found different ref)
- 28658: `SM40-DT-SS-BL-B` (User said wrong title for "300M Date Blue Bracelet")
- 28652: `SM40-DT-BI-BR-S` (User expected SM40-DT-BI-BR-B, found -S instead)

**❌ METEOR PRODUCTS HAVE WRONG REFERENCES:**
- 28670: `ALT1-ZT-METEOR-SL-L` (Should be ALT42-MT-TI-SITI-L-S)
- 28668: `ALT1-ZT-METEOR-BK-L` (Should be ALT42-MT-TI-BKBK-L-S) 
- 28666: `ALT1-ZT-METEOR-BK-TI` (Should be ALT42-MT-TI-BKBK-B)

---

## 📋 PRODUCT MAPPING: CURRENT vs REQUIRED

### TERRA NOVA COLLECTION (15 current → should be 15)

| ID | Current Name | Current Ref | Status |
|----|--------------|-------------|---------|
| 28689 | Terra Nova 40.5 Date | TN40-DT-SS-BK-B | ✅ Keep (newer duplicate) |
| 28640 | Terra Nova 40.5 Date | TN40-DT-SS-BK-B | ❌ Delete (older duplicate) |
| 28687 | Terra Nova 40.5 Jumping Hour | TN40-JH-SS-BK-B | ✅ Keep (newer duplicate) |
| 28638 | Terra Nova 40.5 Jumping Hour | TN40-JH-SS-BK-B | ❌ Delete (older duplicate) |
| 28685 | Terra Nova 40.5 Turning Bezel Power Reserve Black | TN40-PWR-SS-BK-L-S | ✅ Keep (newest) |
| 28681 | Terra Nova 40.5 Turning Bezel Power Reserve Black | TN40-PWR-SS-BK-L-S | ❌ Delete (duplicate) |
| 28636 | Terra Nova 40.5 Turning Bezel Power Reserve Black | TN40-PWR-SS-BK-L-S | ❌ Delete (duplicate) |
| 28683 | Terra Nova 40.5 Turning Bezel Power Reserve | TN40-PWR-SS-BL-B | ✅ Keep (newest) |
| 28679 | Terra Nova 40.5 Turning Bezel Power Reserve | TN40-PWR-SS-BL-B | ❌ Delete (duplicate) |
| 28634 | Terra Nova 40.5 Turning Bezel Power Reserve | TN40-PWR-SS-BL-B | ❌ Delete (duplicate) |
| 28644 | Terra Nova 38 'Pink' | TN38-ND-SS-PK-B | ✅ Correct |
| 28642 | Terra Nova 40.5 Date, Green Dial | TN40-DT-SS-GN-L-S | ✅ Correct |
| 28632 | Terra Nova 42.5 Chronograph, Leather Strap | TN42-CHR-SS-BK-L-S | ✅ Correct |
| 28629 | Terra Nova 42.5 Chronograph Bronze | TN42-CHR-BZ-GN-L-S | ✅ Correct |
| 28624 | Terra Nova 42.5 Chronograph, Bracelet | TN42-CHR-SS-BK-B | ✅ Correct |

### ALTITUDE COLLECTION (9 current → should be 9 + 4 missing)

| ID | Current Name | Current Ref | Required Ref | Status |
|----|--------------|-------------|--------------|---------|
| 28674 | Altitude 39 Date, Silver Dial, Leather Strap | ALT39-DT-SS-SI-L-S | ✓ | ✅ Correct |
| 28673 | Altitude 39 Date, Black Dial, Steel Bracelet | ALT39-DT-SS-BK-B | ✓ | ✅ Correct |
| 28672 | Altitude 39 Date, Black Dial, Leather Strap | ALT39-DT-SS-BK-L-S | ✓ | ✅ Correct |
| 28670 | Altitude Meteor, Silver Leather Strap | ALT1-ZT-METEOR-SL-L | ALT42-MT-TI-SITI-L-S | ❌ Fix ref |
| 28668 | Altitude Meteor, Black Leather Strap | ALT1-ZT-METEOR-BK-L | ALT42-MT-TI-BKBK-L-S | ❌ Fix ref |
| 28666 | Altitude Meteor, Black Titanium | ALT1-ZT-METEOR-BK-TI | ALT42-MT-TI-BKBK-B | ❌ Fix ref |
| 28664 | Altitude Chronograph GMT, Silver Dial, Steel Bracelet | ALT42-CHR-G-SS-SI-B | ✓ | ✅ Correct |
| 28662 | Altitude GMT, Black | ALT1-ZT-GMT-BK-B | ALT42-CHR-G-SS-BK-L-S | ❌ Wrong product |
| 28660 | Altitude Chronograph GMT | ALT42-CHR-G-SS-BK-B | ✓ | ✅ Correct |

**MISSING ALTITUDE PRODUCTS (4):**
- ALT42-MT-TI-BKBK-B (MB Meteor, Black Dial, Ti Bracelet)
- ALT42-MT-TI-SITI-B (MB Meteor, Silver Dial, Ti Bracelet)  
- ALT42-MT-TI-SITI-L-S (MB Meteor, Silver Dial, Leather Strap) - **Actually exists as 28670**
- ALT42-CHR-G-SS-BK-L-S (Chronograph GMT, Black Dial, Leather Strap) - **Need to fix 28662**

### SUPERMARINE COLLECTION (7 current → should be 7 + 4 missing)

| ID | Current Name | Current Ref | Required Ref | Status |
|----|--------------|-------------|--------------|---------|
| 28658 | Supermarine 300M Date, Blue Bracelet | SM40-DT-SS-BL-B | SM40-ND-SS-BL-S | ❌ Wrong ref/name |
| 28656 | Supermarine 300M Date, Black Dial, Rubber Strap | SM40-DT-SS-BK-R-S | ✓ | ✅ Correct |
| 28654 | Supermarine 300M Date, Black Dial, Bracelet | SM40-DT-SS-BK-B | ✓ | ✅ Correct |
| 28652 | Supermarine 300M Date, Bi-Colour, Leather Strap | SM40-DT-BI-BR-S | SM40-DT-BI-BR-B | ❌ Fix ref |
| 28650 | Supermarine 500m, Black Rubber Strap | SM43-DT-SS-BK-R-S | ✓ | ✅ Correct |
| 28648 | Supermarine 500m | SM43-DT-SS-BK-B | ✓ | ✅ Correct |
| 28646 | Supermarine Full Ceramic Tactical Black, NATO Strap | SM43-DT-BKCER-BK-N-S | ✓ | ✅ Correct |

**MISSING SUPERMARINE PRODUCTS (4):**
- SM40-GMT-SS-GNBK-G (300M GMT "Tundra" Green)
- SM40-GMT-SS-BLBK-B (300M GMT "Glacier" Blue)
- SM40-ND-SS-GN-B (300M, Green Dial, Bracelet no-date)
- SM40-DT-BI-BR-B (300M Date Bi-Colour, Bracelet) - **Need to fix 28652**

---

## 📝 CORRECTED ACTION PLAN

### Actions Required:
1. **Delete 6 duplicate products**: 28640, 28638, 28681, 28636, 28679, 28634
2. **Fix 5 reference numbers**: 28670, 28668, 28666, 28662, 28658, 28652
3. **Create 6 missing products** (not 8, since 2 exist but need fixing)

### Final Result: 29 products matching master SKU list exactly

---

## 🎯 VERIFICATION NOTES

**Good News:** Most reference numbers are actually correct! The user's analysis appears to be based on an earlier state. Current findings show:

- ✅ All Terra Nova leather strap products already have "-S" suffix
- ✅ All Supermarine rubber strap products already have "-S" suffix  
- ✅ Most products are correctly named and referenced
- ❌ Main issues are with Meteor product references and a few title/reference mismatches

**Files Created:**
- `current-bremont-analysis.json` - Complete current product data
- `bremont-cleanup-plan.json` - Detailed cleanup actions
- `bremont-issues-analysis.md` - This analysis document