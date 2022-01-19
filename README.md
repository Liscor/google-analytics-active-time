# Active Time for Google Analytics

This script tracks the time which is spent on different parts on a website without idle time and associates a scroll depth to it. The result is an array which consists of 100 slices, where the values represent the spent time for this website part in milliseconds.

Additionally, the readibility scores Flesch Reading Ease German, Flesh Reading Ease English, Läsbarkeitsindex Swedish and Coleman-Liau Index Englisch are tracked.

The values for the different readability scores are pushed into the dataLayer as soon as the script finished calculating the values.  The data for the active time spent on the different scroll depths is pushed into the dataLayer when a "beforeunload" is triggered. Expect data loss for some browsers.
