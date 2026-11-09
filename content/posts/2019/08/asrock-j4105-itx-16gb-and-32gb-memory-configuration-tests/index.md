---
title: Asrock J4105-ITX 16GB and 32GB memory configuration tests
description: I saw this on a German web site called speicher.de and I thought it was pretty significant so I thought I'd share a copy of the translation to English The Asrock J4105-ITX is a useful low-power build that has been confirmed to work as an ESXi IGD GPU passthrough computer with 4K…
summary: I saw this on a German web site called speicher.de and I thought it was pretty significant so I thought I'd share a copy of the translation to English The Asrock J4105-ITX is a useful low-power build that has been confirmed to work as an ESXi IGD GPU passthrough computer with 4K…
date: 2019-08-02T01:35:26Z
author: Avery Freeman
slug: asrock-j4105-itx-16gb-and-32gb-memory-configuration-tests
categories:
  - Random
thumbnail: https://www.speicher.de/media/magpleasure/mpblog/post_thumbnail_file/7/2/cache/1/ece9a24a761836a70934a998c163f8c8/72ba419605c67eb128fb6d102a7237db.jpg
thumbnail_alt: 32GB Memory - ASRock J4105-ITX - overRAMing Test
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2019/08/asrock-j4105-itx-16gb-and-32gb-memory-configuration-tests/
---

<!-- Imported from WordPress post 244. -->

I saw this on a German web site called [speicher.de](https://speicher.de) and I thought it was pretty significant so I thought I'd share a copy of the translation to English

The Asrock J4105-ITX is a useful low-power build that has been confirmed to work as an ESXi IGD GPU passthrough computer with 4K@60Hz HDMI 2.0. It can be had for around $110 for the motherboard.

The real sticking point for ESXi, besides the realtek NIC, is who wants to run an ESXi host that can only support up to 8GB RAM? As that is the official specifications listed on the Asrock web site...

Well this group of hardware testers in Germany has laid that myth to rest by doing their own testing, and they confirm that configurations of up to 32GB work just fine. Have a look:

<!-- more -->

## 32GB Memory - ASRock J4105-ITX - overRAMing Test

**LATEST POSTS**

-   [](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/arbeitsspeicher-blog/aktuelle-overraming-geraete&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhhJGnQFPn476nkLzfhAd9ZuEXC0Tg)[Current overRAMing devices](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/arbeitsspeicher-blog/aktuelle-overraming-geraete&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhhJGnQFPn476nkLzfhAd9ZuEXC0Tg) Every day we find new devices, with far more memory than the manufacturer reports (in German)
-   [](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/arbeitsspeicher-blog/32gb-arbeitsspeicher-asrock-j4105-itx&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhgSmGHcA-v6qO2vs9UM53wb3zLGug)[32GB Memory - ASRock J4105-ITX - overRAMing Test](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/arbeitsspeicher-blog/32gb-arbeitsspeicher-asrock-j4105-itx&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhgSmGHcA-v6qO2vs9UM53wb3zLGug)1 years ago32 GB RAM in the ASRock - motherboard J4105-ITX - tested and works perfectly! ... Continued below:

# 32GB Memory - ASRock J4105-ITX - overRAMing Test

![32GB Memory - ASRock J4105-ITX - overRAMing Test](https://www.speicher.de/media/magpleasure/mpblog/post_thumbnail_file/7/2/cache/1/ece9a24a761836a70934a998c163f8c8/72ba419605c67eb128fb6d102a7237db.jpg)

By Jürgen Hartmann 1 years ago

For all **Gemini Lake processors** , the current data sheets show a **maximum RAM of only 8GB (2x 4GB)** . The processor series of the **Gemini Lake series** include the following Intel CPUs:   
  
Pentium Silver J5005 (4M cache, up to 2.80 GHz)Pentium Silver N5000 (4M cache, up to 2.70 GHz)Celeron J4105 (4M cache, up to 2.50 GHz)Celeron J4005 (4M cache, up to 2.70 GHz)Celeron N4100 (4M cache, up to 2.40 GHz)

Using the example of the current **ASRock motherboard J4105-ITX** with the **Celeron J4105 processor of** the same name, we were able to prove in the **overRAMing test** that the values ​​described in the specifications for maximum RAM are incorrect. So we could prove in the memory **duration test** that **32GB (2x 16GB) are** possible.

![](https://www.speicher.de/media/magpleasure/mpblog/upload/e/7/e774bb31a307386c544d6ad315d1a9a8.jpg)

## Test scenario:

In our **overRAMing test** , we extensively tested the **ASRock J4105-ITX Mini-ITX motherboard** in **continuous testing** with different memory configurations.

-   The following memory configurations have been tested: 
-   **12GB Memory** - (8GB + 4GB)
-   **16GB Memory** - (8GB + 8GB)
-   **24GB memory** - (16GB + 8GB)
-   **32GB Memory** - (16GB + 16GB)

The memory tests were performed with **MemTest86**

![](https://www.speicher.de/media/magpleasure/mpblog/upload/d/d/dd807946681b39bc1a02b5842e050a11.jpg)

The complete **32GB memory** was recognized and could be fully utilized. The first initialization of the 32GB requires some patience. The **ASRock J4105 Mini-ITX** needs **approx. 35 seconds** until the system starts.

![](https://www.speicher.de/media/magpleasure/mpblog/upload/c/a/ca2ad3444d87687890d05002d9371b2b.jpg)

The two **16GB memory modules** have been described and read in the **ASrock motherboard for more than 6 hours,** including the "Hammer Test." All tests were performed **3 times in a row** , and none of the tested memory configurations found an abnormality, error or problem in the memory **duration** test become.

Why the manufacturers limit the maximum RAM to only 8GB (2x 4GB) in the manuals and documentation is incomprehensible. Our tests were convincing in every configuration of the main memory.

## Where are the new processors used?

The new Gemini Lake processors are used eg in the following motherboards / mini-PCs:   
  
[ASRock motherboard J4105 Mini-ITX](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/catalogsearch/result/%3Fq%3DJ4105%2Basrock&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhgkJR7YYGYTBnBEppO5x4on5X8vbg)[ASRock motherboard J5005 Mini-ITXi](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/catalogsearch/result/%3Fq%3DJ5005%2Basrock&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhj1gSKPDS2-utNfaF-JsVFKvTC9-Q)[Fujitsu motherboard D3543-S1 / -S2 / -S3](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/catalogsearch/result/%3Fq%3D%2BD3543&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhhH171XteEDgGuXTH9FYtCJILUWVA)[Fujitsu Mini STX Boards D3544-S1 / -S2](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/catalogsearch/result/%3Fq%3DD3544&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhigTlX6-2pmMjQl7INjJUKtvkJqqA)[Intel NUC KIT NUC7CJYH](https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=de&sp=nmt4&tl=en&u=https://www.speicher.de/catalogsearch/result/%3Fq%3DNUC7CJYH&xid=17259,15700021,15700186,15700191,15700256,15700259,15700262,15700265&usg=ALkJrhimRxnBZiayesU0XmrNSJYQDqCIkA)Intel NUC KIT NUC7PJYHMSI Cubi N 8GL (MS-B171)

The 8GB and 16GB memory modules have been tested, approved and successfully sold by us due to the successful tests.

## Another note from the manual!

When changing the memory modules, we noticed that the BIOS of the ASRock motherboard J4105-ITX does not always recognize the new memory. In this case, the motherboard does not start anymore. The screen will stay black.

![ASRock motherboard J4105-ITX](https://www.speicher.de/media/magpleasure/mpblog/upload/0/9/0962e15c26ac63cbf9a6a934725b933e.jpg)

The cause is not due to the memory sizes that are used. We were also able to reproduce this phenomenon with 2GB and 4GB RAM.

The remedy here is the **function CRLCMOS1** as described in the manual under **1.3 Jumper****settings** .

**Quote from the ASRock manual:**   
_CRLMOS1 allows you to delete the data in CMOS._ _The data in CMOS includes system setup information such as system password, date, time, and system setup parameters ..._ _Please turn off your computer and unplug the power cord._ _Then you can short-circuit the solder points on CLRCMOS1 with a metal part, such as a paperclip, for 3 seconds ..._

Once the CMOS was cleared, any memory configuration could be installed. This was then always recognized immediately and the system booted on the 1st attempt.
