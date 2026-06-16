# Data Quality Report

## Items with COMPLETE metadata (can be fully filtered)
- **3691f475-65bd-4b55-a848-4b6e574b1a85**: Bracelet | metals=[18k Gold, Sterling Silver, Rose Gold, White Gold] | stones=[Diamond, Uncut Diamond] | styles=[Modern, Statement] | occasions=[Statement, Engagement, Everyday]
- **5ccdd2db-2761-4b0d-85ad-e037ef7157d3**: Ring | metals=[18k Gold] | stones=[Diamond] | styles=[Minimalist, Modern] | occasions=[Engagement, Everyday]
- **38dbd1bc-8347-4b4b-9af4-85f542b0b9dd**: Necklace | metals=[Platinum] | stones=[Diamond] | styles=[Art Deco, Vintage] | occasions=[Engagement]
- **e207c92f-00cc-4274-80f2-dfbd0bd485ea**: Bracelet | metals=[18k Gold] | stones=[Emerald] | styles=[Statement] | occasions=[Wedding, Statement]
- **4f5ef914-d8cd-4732-9e7a-62b26987c783**: Earrings | metals=[Rose Gold] | stones=[Pearl] | styles=[Modern] | occasions=[Everyday, Wedding]
- **aa3040d5-459d-4da2-83f2-f32a5661a012**: Necklace | metals=[White Gold] | styles=[Minimalist] | occasions=[Everyday]
- **6ace4bb8-c09f-4fe0-b949-0991c4e10513**: Ring | metals=[Sterling Silver] | stones=[Sapphire] | occasions=[Everyday, Engagement, Statement, Wedding]

## Items with PARTIAL metadata (missing 2+ fields)
- **955c875b-cc8e-4b74-a66f-9714ad99d5e4**: Ring | metals=[18k Gold, 22k Gold] | occasions=[Engagement, Everyday, Wedding]
- **c30fdc29-7748-46b0-afae-addab08d753a**: Ring | metals=[Sterling Silver] | styles=[Minimalist, Vintage] | occasions=[Everyday, Statement, Engagement, Wedding]
- **8520bc92-030b-4a88-ac35-25b2eb0ca822**: Bracelet | occasions=[Statement, Engagement]

## Items with EMPTY metadata (no tags at all)
- **144c25ae-a34c-4c44-bd7a-cb789f0e4f8e**: Bracelet (empty)
- **1502c2ce-4c51-43e6-a0f5-dd75d76168e1**: Bracelet (empty)
- **17cdb5a4-93a8-4022-b818-8f37915bfc9f**: Bracelet (empty)
- **1b6312ae-7a39-454a-aecb-ddb57909dc55**: Bracelet (empty)
- **50f7294d-8889-4ac4-ad24-83c545580979**: Bracelet (empty)
- **614f7b2b-8912-4922-80d3-23d89f322a24**: Bracelet (empty)
- **85396d46-f1d1-4ea4-acb4-0b78c9b6db04**: Bracelet (empty)
- **a45bde92-0f78-4f0b-b09d-c0dd700d523e**: Bracelet (empty)
- **ad4c0c41-eebe-4ced-9df4-891eb425639b**: Bracelet (empty)
- **e4e25015-1c9b-4a58-a2bb-acd1158c7e7f**: Bracelet (empty)
- **fd43c0bb-fb1f-4f54-9751-d321699bf93f**: Bracelet (empty)

## Analysis
- **7 items**: Complete metadata across all fields
- **3 items**: Partial metadata (missing some fields)
- **10 items**: Empty metadata (text patterns didn't match)

## Next Steps
1. **Option A**: Start CLIP worker and re-run `pinterest_sync.py` to fill missing tags
2. **Option B**: Test Discover flow with the 7 complete items (filtering will work well)
3. **Option C**: Clean up the CSV export to see which Pinterest pins need better titles/descriptions

## Why is metadata sparse?
The script has 3-tier tagging:
1. **Tier 1** (board name): Uses the Pinterest board names (e.g., "Engagement Rings", "Gold Jewelry")
2. **Tier 2** (text patterns): Regex matching on title + description
3. **Tier 3** (CLIP worker): Visual classification on the image

With CLIP worker **not running**, only Tier 1 + Tier 2 were used. Many Pinterest pins have generic titles that don't match the hardcoded patterns, so they end up with empty tags.
