# Country and capital data

`countries.js` is a reduced snapshot of the MIT-licensed
[annexare/Countries dataset](https://github.com/annexare/Countries), retrieved
on October 16, 2026. Its source revision is recorded at the top of the file.
The original license is preserved in `COUNTRIES-LICENSE.txt`.

Only the two-letter country code, English name, primary continent, and capital are retained.
The browser includes countries and territories that have a capital in the
source. Entries without capitals and all Antarctic entries are omitted.
Antarctica has no national capitals and receives an explicit empty state.

For transcontinental locations the source's primary continent is used. Where
there are multiple capitals, the single capital supplied by the source is used
(for example, Pretoria for South Africa). This is a browsing convention, not
a statement about recognition or boundaries.

Weather requests use `capital, country` so Visual Crossing resolves the city
rather than the country's geographic center. Source coordinates for capitals
are not provided by this dataset. Country data is bundled; it is not fetched
at runtime. To update it, use the linked source, retain these fields and the
license, record the new revision, and run the catalog tests.
