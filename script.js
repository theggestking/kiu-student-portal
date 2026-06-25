// KIU Student Portal - Final Project JavaScript
// This file adds DOM manipulation, event listeners, ES6+ syntax, and localStorage.

"use strict";

const STORAGE_KEYS = {
    theme: "kiu-theme-preference",
    lastSearch: "kiu-last-search",
    programFavorites: "kiu-program-favorites",
    language: "kiu-language-preference"
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const readFromStorage = (key, fallback = null) => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch {
        return fallback;
    }
};

const SUPPORTED_LANGUAGES = ["en", "ka"];
let currentLanguage = "en";
let lastCampusWeatherData = null;

const I18N = {
    en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.programs": "Programs",
        "nav.services": "Services",
        "nav.weather": "Weather",
        "nav.events": "Events",
        "nav.news": "News",
        "nav.contact": "Contact",
        "search.label": "Search",
        "search.placeholder": "Search portal",
        "search.clear": "Clear search",
        "search.submit": "Go",
        "search.empty": "Type a word to search the portal.",
        "search.none": "No section matches \"{query}\". Try programs, weather, services, or contact.",
        "search.jumped": "Jumped to {section}.",
        "section.home": "Home",
        "section.about": "About the Portal",
        "section.aboutKiu": "About KIU",
        "section.campusLife": "Campus Life",
        "section.weather": "Campus Weather",
        "section.programs": "Academic Programs",
        "section.openDay": "Campus Visit",
        "section.services": "Student Services",
        "section.events": "Events",
        "section.news": "News",
        "section.gallery": "Video Gallery",
        "section.contact": "Contact Information",
        "hero.label": "Kutaisi International University",
        "hero.title": "Welcome to the KIU Student Portal",
        "hero.text": "Your academic life, campus services, student requests, news, and events in one clean digital space.",
        "hero.programs": "Explore Programs",
        "hero.visit": "Book Campus Visit",
        "about.label": "About the Portal",
        "about.title": "Designed for a Better Student Experience",
        "about.p1": "The KIU Student Portal is a concept platform created to help students access academic information, student services, campus requests, university news, events, and media from one organized place.",
        "aboutKiu.label": "About KIU",
        "aboutKiu.title": "A Place Where Knowledge Creates the Future",
        "aboutKiu.p1": "Kutaisi International University is a modern higher education institution focused on academic excellence, innovation, and international perspectives.",
        "aboutKiu.p2": "The university supports students through strong academic programs, modern infrastructure, and a growing learning community.",
        "campusLife.label": "Campus Life",
        "campusLife.title": "Study, Connect, and Grow on a Modern Campus",
        "campusLife.p1": "Campus life at KIU brings together learning, collaboration, and student experience in one environment.",
        "campusLife.p2": "With its large campus area and student-centered atmosphere, KIU provides a place where learning continues beyond the classroom.",
        "weather.label": "Campus Check",
        "weather.title": "Campus Weather in Kutaisi",
        "weather.intro": "Check the latest Kutaisi weather before leaving for lectures, labs, campus events, or an Open Day visit.",
        "weather.panelTitle": "Plan your day with confidence",
        "weather.panelText": "We keep a live weather snapshot here so you can prepare for the day, choose the right clothes, and travel to campus comfortably.",
        "weather.ready": "Weather data is ready to load.",
        "weather.refresh": "Refresh Weather",
        "weather.updating": "Updating...",
        "weather.loading": "Checking the latest campus weather...",
        "weather.error": "We could not update the campus weather right now. Please try again in a moment.",
        "weather.location": "Kutaisi, Georgia",
        "weather.feelsLike": "Feels like",
        "weather.humidity": "Humidity",
        "weather.wind": "Wind",
        "weather.updated": "Last updated: {time}",
        "weather.tipPreparing": "Preparing campus tip...",
        "weather.tipHot": "Campus tip: It feels hot. Carry water before heading across campus.",
        "weather.tipCold": "Campus tip: It feels cold. Wear warm clothes before going outside.",
        "weather.tipComfortable": "Campus tip: Weather looks comfortable for lectures, study breaks, and campus walks.",
        "weather.unavailable": "Weather condition unavailable",
        "programs.label": "Academic Programs",
        "programs.title": "Explore KIU Study Areas",
        "programs.text": "Choose a study level and view available academic programs.",
        "programs.searchLabel": "Search programs",
        "programs.searchPlaceholder": "Try computer science, law, design",
        "programs.clear": "Clear program search",
        "programs.savedOnly": "Saved only",
        "programs.noPrograms": "No programs found",
        "programs.emptyDefault": "Try another search term or turn off the saved-only filter.",
        "programs.noSaved": "No saved programs in {level} yet",
        "programs.noSavedText": "Use the star on a program card to save it here.",
        "programs.noSavedMatches": "No saved matches for \"{query}\"",
        "programs.noSavedMatchesText": "Try a different keyword or turn off the saved-only filter.",
        "programs.noMatches": "No matches for \"{query}\"",
        "programs.noMatchesText": "Try another keyword such as computer, law, design, or clear the search.",
        "level.bachelor": "Bachelor",
        "level.singleCycle": "Single-Cycle",
        "level.master": "Master",
        "level.doctoral": "Doctoral",
        "openDay.label": "Open Day",
        "openDay.title": "Visit KIU Campus",
        "openDay.open": "Open Campus Visit Application",
        "openDay.close": "Close Campus Visit Application",
        "services.label": "Student Services",
        "services.title": "Campus and Dormitory Requests",
        "events.label": "Upcoming Events",
        "events.title": "Important Campus Activities",
        "news.label": "News",
        "news.title": "Latest Portal Updates",
        "gallery.label": "Video Gallery",
        "gallery.title": "Campus Media",
        "footer.map": "Find Us on Campus",
        "footer.expand": "Expand Map",
        "footer.contact": "Contact Information",
        "footer.links": "Useful Links",
        "footer.legal": "Legal address",
        "footer.international": "International student and visitor enquiries",
        "footer.phone": "Phone",
        "footer.email": "Email",
        "footer.tum": "Technical University of Munich",
        "footer.openDay": "Campus Tour / Open Days",
        "footer.ministry": "Ministry of Education, Science and Youth of Georgia",
        "footer.naec": "National Assessment and Examinations Center",
        "footer.copyright": "© 2024 KIU Student Portal. All rights reserved.",
        "copy.default": "Copy",
        "copy.copied": "Copied",
        "copy.error": "Try again",
        "assistant.needHelp": "Need help?"
    },
    ka: {
        "nav.home": "მთავარი",
        "nav.about": "შესახებ",
        "nav.programs": "პროგრამები",
        "nav.services": "სერვისები",
        "nav.weather": "ამინდი",
        "nav.events": "ღონისძიებები",
        "nav.news": "სიახლეები",
        "nav.contact": "კონტაქტი",
        "search.label": "ძებნა",
        "search.placeholder": "ძებნა პორტალში",
        "search.clear": "ძებნის გასუფთავება",
        "search.submit": "ძებნა",
        "search.empty": "ჩაწერე სიტყვა პორტალში მოსაძებნად.",
        "search.none": "\"{query}\" ვერ მოიძებნა. სცადე: პროგრამები, ამინდი, სერვისები ან კონტაქტი.",
        "search.jumped": "გადავედით სექციაზე: {section}.",
        "section.home": "მთავარი",
        "section.about": "პორტალის შესახებ",
        "section.aboutKiu": "KIU-ის შესახებ",
        "section.campusLife": "კამპუსის ცხოვრება",
        "section.weather": "კამპუსის ამინდი",
        "section.programs": "აკადემიური პროგრამები",
        "section.openDay": "კამპუსის ვიზიტი",
        "section.services": "სტუდენტური სერვისები",
        "section.events": "ღონისძიებები",
        "section.news": "სიახლეები",
        "section.gallery": "ვიდეო გალერეა",
        "section.contact": "საკონტაქტო ინფორმაცია",
        "hero.label": "ქუთაისის საერთაშორისო უნივერსიტეტი",
        "hero.title": "კეთილი იყოს თქვენი მობრძანება KIU-ის სტუდენტურ პორტალში",
        "hero.text": "აკადემიური ცხოვრება, კამპუსის სერვისები, სტუდენტური მოთხოვნები, სიახლეები და ღონისძიებები ერთ სივრცეში.",
        "hero.programs": "პროგრამების ნახვა",
        "hero.visit": "კამპუსის ვიზიტის დაჯავშნა",
        "about.label": "პორტალის შესახებ",
        "about.title": "უკეთესი სტუდენტური გამოცდილებისთვის",
        "about.p1": "KIU-ის სტუდენტური პორტალი არის კონცეპტუალური პლატფორმა, რომელიც სტუდენტებს ეხმარება აკადემიური ინფორმაციის, სერვისების, მოთხოვნების, სიახლეების, ღონისძიებებისა და მედიის ერთ სივრცეში ნახვაში.",
        "aboutKiu.label": "KIU-ის შესახებ",
        "aboutKiu.title": "ადგილი, სადაც ცოდნა ქმნის მომავალს!",
        "aboutKiu.p1": "ქუთაისის საერთაშორისო უნივერსიტეტი თანამედროვე უმაღლესი საგანმანათლებლო დაწესებულებაა, რომელიც აკადემიურ ხარისხზე, ინოვაციებსა და საერთაშორისო ხედვაზეა ორიენტირებული.",
        "aboutKiu.p2": "უნივერსიტეტი სტუდენტებს მხარს უჭერს ძლიერი აკადემიური პროგრამებით, თანამედროვე ინფრასტრუქტურითა და მზარდი სასწავლო საზოგადოებით.",
        "campusLife.label": "კამპუსის ცხოვრება",
        "campusLife.title": "ისწავლე, დაუკავშირდი და გაიზარდე თანამედროვე კამპუსში",
        "campusLife.p1": "KIU-ში კამპუსის ცხოვრება აერთიანებს სწავლას, თანამშრომლობასა და სტუდენტურ გამოცდილებას ერთ გარემოში.",
        "campusLife.p2": "დიდი კამპუსითა და სტუდენტზე ორიენტირებული გარემოთი KIU ქმნის სივრცეს, სადაც სწავლა აუდიტორიის გარეთაც გრძელდება.",
        "weather.label": "კამპუსის შემოწმება",
        "weather.title": "ამინდი ქუთაისში",
        "weather.intro": "შეამოწმე ქუთაისის ამინდი ლექციებზე, ლაბორატორიებში, კამპუსის ღონისძიებებზე ან Open Day-ზე წასვლამდე.",
        "weather.panelTitle": "დაგეგმე დღე მშვიდად",
        "weather.panelText": "აქ ვინახავთ ამინდის ცოცხალ მოკლე სურათს, რომ დღის დაგეგმვა, ტანსაცმლის სწორად შერჩევა და კამპუსამდე კომფორტულად მისვლა შეძლო.",
        "weather.ready": "ამინდის მონაცემები მზად არის ჩასატვირთად.",
        "weather.refresh": "ამინდის განახლება",
        "weather.updating": "ახლდება...",
        "weather.loading": "ვამოწმებთ კამპუსის უახლეს ამინდს...",
        "weather.error": "ამინდის განახლება ახლა ვერ მოხერხდა. სცადე ცოტა ხანში.",
        "weather.location": "ქუთაისი, საქართველო",
        "weather.feelsLike": "იგრძნობა როგორც",
        "weather.humidity": "ტენიანობა",
        "weather.wind": "ქარი",
        "weather.updated": "ბოლო განახლება: {time}",
        "weather.tipPreparing": "ვამზადებთ კამპუსის რჩევას...",
        "weather.tipHot": "კამპუსის რჩევა: ცხელა. კამპუსში გასვლამდე წყალი წაიღე.",
        "weather.tipCold": "კამპუსის რჩევა: ცივა. გარეთ გასვლამდე თბილად ჩაიცვი.",
        "weather.tipComfortable": "კამპუსის რჩევა: ამინდი კომფორტულია ლექციებისთვის, შესვენებებისთვის და კამპუსში სეირნობისთვის.",
        "weather.unavailable": "ამინდის მდგომარეობა მიუწვდომელია",
        "programs.label": "აკადემიური პროგრამები",
        "programs.title": "გაეცანი KIU-ის სასწავლო მიმართულებებს",
        "programs.text": "აირჩიე სწავლების საფეხური და ნახე ხელმისაწვდომი აკადემიური პროგრამები.",
        "programs.searchLabel": "პროგრამების ძებნა",
        "programs.searchPlaceholder": "სცადე computer science, law, design",
        "programs.clear": "პროგრამების ძებნის გასუფთავება",
        "programs.savedOnly": "მხოლოდ შენახული",
        "programs.noPrograms": "პროგრამები ვერ მოიძებნა",
        "programs.emptyDefault": "სცადე სხვა სიტყვა ან გამორთე მხოლოდ შენახულების ფილტრი.",
        "programs.noSaved": "შენახული პროგრამები ჯერ არ არის: {level}",
        "programs.noSavedText": "პროგრამის ბარათზე ვარსკვლავით შეგიძლია მისი შენახვა.",
        "programs.noSavedMatches": "\"{query}\" შენახულ პროგრამებში ვერ მოიძებნა",
        "programs.noSavedMatchesText": "სცადე სხვა სიტყვა ან გამორთე მხოლოდ შენახულების ფილტრი.",
        "programs.noMatches": "\"{query}\" ვერ მოიძებნა",
        "programs.noMatchesText": "სცადე სხვა სიტყვა, მაგალითად computer, law, design, ან გაასუფთავე ძებნა.",
        "level.bachelor": "ბაკალავრიატი",
        "level.singleCycle": "ერთსაფეხურიანი",
        "level.master": "მაგისტრატურა",
        "level.doctoral": "დოქტორანტურა",
        "openDay.label": "Open Day",
        "openDay.title": "ეწვიე KIU-ის კამპუსს",
        "openDay.open": "კამპუსის ვიზიტის განაცხადის გახსნა",
        "openDay.close": "კამპუსის ვიზიტის განაცხადის დახურვა",
        "services.label": "სტუდენტური სერვისები",
        "services.title": "კამპუსისა და საერთო საცხოვრებლის მოთხოვნები",
        "events.label": "მომავალი ღონისძიებები",
        "events.title": "მნიშვნელოვანი კამპუსის აქტივობები",
        "news.label": "სიახლეები",
        "news.title": "პორტალის ბოლო განახლებები",
        "gallery.label": "ვიდეო გალერეა",
        "gallery.title": "კამპუსის მედია",
        "footer.map": "გვიპოვე კამპუსში",
        "footer.expand": "რუკის გაფართოება",
        "footer.contact": "საკონტაქტო ინფორმაცია",
        "footer.links": "სასარგებლო ბმულები",
        "footer.legal": "იურიდიული მისამართი",
        "footer.international": "საერთაშორისო სტუდენტებისა და სტუმრების კითხვები",
        "footer.phone": "ტელეფონი",
        "footer.email": "ელფოსტა",
        "footer.tum": "მიუნხენის ტექნიკური უნივერსიტეტი",
        "footer.openDay": "კამპუსის ტური/ ღია კარის დღე",
        "footer.ministry": "საქართველოს განათლების, მეცნიერებისა და ახალგაზრდობის სამინისტრო",
        "footer.naec": "შეფასებისა და გამოცდების ეროვნული ცენტრი",
        "footer.copyright": "© 2024 KIU Student Portal. ყველა უფლება დაცულია.",
        "copy.default": "კოპირება",
        "copy.copied": "დაკოპირდა",
        "copy.error": "სცადე თავიდან",
        "assistant.needHelp": "დახმარება გჭირდება?"
    }
};

const TEXT_TRANSLATION_TARGETS = [
    [".nav-list a[href='#home']", "nav.home"],
    [".nav-list a[href='#about']", "nav.about"],
    [".nav-list a[href='#programs']", "nav.programs"],
    [".nav-list a[href='#services']", "nav.services"],
    [".nav-list a[href='#campus-weather']", "nav.weather"],
    [".nav-list a[href='#events']", "nav.events"],
    [".nav-list a[href='#news']", "nav.news"],
    [".nav-list a[href='#contact']", "nav.contact"],
    [".search-form label", "search.label"],
    [".search-form button[type='submit']", "search.submit"],
    [".hero-content .section-label", "hero.label"],
    [".hero-content h1", "hero.title"],
    [".hero-text", "hero.text"],
    [".hero-buttons .btn-primary", "hero.programs"],
    [".hero-buttons .btn-outline", "hero.visit"],
    ["#about .about-content .section-label", "about.label"],
    ["#about .about-content h2", "about.title"],
    ["#about .about-content p:nth-of-type(2)", "about.p1"],
    ["#about-kiu .about-content .section-label", "aboutKiu.label"],
    ["#about-kiu .about-content h2", "aboutKiu.title"],
    ["#about-kiu .about-content p:nth-of-type(2)", "aboutKiu.p1"],
    ["#about-kiu .about-content p:nth-of-type(3)", "aboutKiu.p2"],
    ["#campus-life .about-content .section-label", "campusLife.label"],
    ["#campus-life .about-content h2", "campusLife.title"],
    ["#campus-life .about-content p:nth-of-type(2)", "campusLife.p1"],
    ["#campus-life .about-content p:nth-of-type(3)", "campusLife.p2"],
    ["#campus-weather .section-heading .section-label", "weather.label"],
    ["#campus-weather .section-heading h2", "weather.title"],
    ["#campus-weather .section-heading p:nth-of-type(2)", "weather.intro"],
    ["#campus-weather-card .weather-loading", "weather.ready"],
    [".weather-info-panel h3", "weather.panelTitle"],
    [".weather-info-panel p", "weather.panelText"],
    ["#weather-refresh-btn", "weather.refresh"],
    ["#programs .section-heading .section-label", "programs.label"],
    ["#programs .section-heading h2", "programs.title"],
    ["#programs .section-heading p:nth-of-type(2)", "programs.text"],
    [".tab-labels label[for='bachelor-tab']", "level.bachelor"],
    [".tab-labels label[for='single-cycle-tab']", "level.singleCycle"],
    [".tab-labels label[for='master-tab']", "level.master"],
    [".tab-labels label[for='doctoral-tab']", "level.doctoral"],
    ["#open-day .section-label", "openDay.label"],
    ["#open-day h2", "openDay.title"],
    [".open-day-open-text", "openDay.open"],
    [".open-day-close-text", "openDay.close"],
    ["#services .section-heading .section-label", "services.label"],
    ["#services .section-heading h2", "services.title"],
    ["#events .section-heading .section-label", "events.label"],
    ["#events .section-heading h2", "events.title"],
    ["#news .section-heading .section-label", "news.label"],
    ["#news .section-heading h2", "news.title"],
    ["#gallery .section-heading .section-label", "gallery.label"],
    ["#gallery .section-heading h2", "gallery.title"],
    ["#map-title", "footer.map"],
    [".map-expand-button", "footer.expand"],
    ["#contact-title", "footer.contact"],
    ["#links-title", "footer.links"],
    [".copy-contact-button[data-copy-label='Legal address'] .contact-label", "footer.legal"],
    [".copy-contact-button[data-copy-label='International enquiries'] .contact-label", "footer.international"],
    [".copy-contact-button[data-copy-label='Phone number'] .contact-label", "footer.phone"],
    [".copy-contact-button[data-copy-label='Email address'] .contact-label", "footer.email"],
    [".footer-links a[href='https://www.tum.de/en/']", "footer.tum"],
    [".footer-links a[href='#open-day']", "footer.openDay"],
    [".footer-links a[href='https://mes.gov.ge/']", "footer.ministry"],
    [".footer-links a[href='https://naec.ge/']", "footer.naec"],
    [".footer-bottom p", "footer.copyright"],
    [".assistant-bubble", "assistant.needHelp"]
];

const ATTRIBUTE_TRANSLATION_TARGETS = [
    ["#site-search", "placeholder", "search.placeholder"],
    [".search-clear-button", "aria-label", "search.clear"],
    ["#program-filter-search", "placeholder", "programs.searchPlaceholder"],
    [".program-search-clear-button", "aria-label", "programs.clear"]
];

const t = (key, replacements = {}) => {
    const template = I18N[currentLanguage]?.[key] || I18N.en[key] || key;

    return Object.entries(replacements).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        template
    );
};

const setLanguageText = (selector, key) => {
    $$(selector).forEach(element => {
        element.textContent = t(key);
    });
};

const setLanguageAttribute = (selector, attribute, key) => {
    $$(selector).forEach(element => {
        element.setAttribute(attribute, t(key));
    });
};

const updateLanguageControls = () => {
    $$("[data-language-option]").forEach(link => {
        const isActive = link.dataset.languageOption === currentLanguage;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-current", isActive ? "true" : "false");
    });

    document.documentElement.lang = currentLanguage;
};

const applyStaticTranslations = () => {
    TEXT_TRANSLATION_TARGETS.forEach(([selector, key]) => {
        setLanguageText(selector, key);
    });

    ATTRIBUTE_TRANSLATION_TARGETS.forEach(([selector, attribute, key]) => {
        setLanguageAttribute(selector, attribute, key);
    });

    $$(".contact-copy-text").forEach(copyText => {
        const button = copyText.closest(".copy-contact-button");
        if (!button?.classList.contains("is-copied")) {
            copyText.textContent = t("copy.default");
        }
    });

    updateLanguageControls();
};

const setLanguage = language => {
    currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
    saveToStorage(STORAGE_KEYS.language, currentLanguage);
    applyStaticTranslations();
    document.dispatchEvent(new CustomEvent("languagechange"));
};

const initLanguageSwitch = () => {
    currentLanguage = readFromStorage(STORAGE_KEYS.language, "en");

    if (!SUPPORTED_LANGUAGES.includes(currentLanguage)) {
        currentLanguage = "en";
    }

    $$("[data-language-option]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            setLanguage(link.dataset.languageOption);
        });
    });

    applyStaticTranslations();
};

const createSlug = (...parts) =>
    parts
        .join("-")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const showMessage = (targetElement, message, type = "info") => {
    if (!targetElement) return;

    let messageBox = targetElement.querySelector(".js-message");

    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.className = "js-message";
        targetElement.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.dataset.type = type;
    messageBox.setAttribute("role", type === "error" ? "alert" : "status");
    messageBox.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

    setTimeout(() => {
        messageBox.remove();
    }, 3500);
};

const initThemeToggle = () => {
    const themeToggle = $("#theme-toggle");
    if (!themeToggle) return;

    const savedTheme = readFromStorage(STORAGE_KEYS.theme, "light");

    themeToggle.checked = savedTheme === "dark";

    themeToggle.addEventListener("change", event => {
        const selectedTheme = event.target.checked ? "dark" : "light";
        saveToStorage(STORAGE_KEYS.theme, selectedTheme);
    });
};

const initSmoothNavigation = () => {
    const mobileMenuToggle = $("#mobile-menu-toggle");
    const navLinks = $$('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetSection = $(targetId);

            if (targetSection) {
                const usesNativeHash = link.classList.contains("map-expand-button") ||
                    link.closest(".map-modal") ||
                    targetSection.classList.contains("map-modal");

                if (usesNativeHash) {
                    return;
                }

                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (mobileMenuToggle) {
                    mobileMenuToggle.checked = false;
                }
            }
        });
    });
};

const clearSearchHighlights = () => {
    $$(".js-search-highlight").forEach(section => {
        section.classList.remove("js-search-highlight");
    });
};

const SEARCH_RESULT_LABELS = {
    home: "section.home",
    about: "section.about",
    "about-kiu": "section.aboutKiu",
    "campus-life": "section.campusLife",
    "campus-weather": "section.weather",
    programs: "section.programs",
    "open-day": "section.openDay",
    services: "section.services",
    events: "section.events",
    news: "section.news",
    gallery: "section.gallery",
    contact: "section.contact"
};

const initSiteSearch = () => {
    const searchForm = $(".search-form");
    const searchInput = $("#site-search");

    if (!searchForm || !searchInput) return;

    const searchClearButton = $(".search-clear-button", searchForm);
    const searchableSections = $$("main section, footer");
    const updateSearchClearButton = () => {
        if (searchClearButton) {
            searchClearButton.hidden = !searchInput.value.trim();
        }
    };

    searchInput.addEventListener("input", () => {
        updateSearchClearButton();

        if (!searchInput.value.trim()) {
            clearSearchHighlights();
            $(".js-message", searchForm)?.remove();
        }
    });

    searchClearButton?.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        clearSearchHighlights();
        $(".js-message", searchForm)?.remove();
        updateSearchClearButton();
    });

    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        clearSearchHighlights();

        if (!query) {
            showMessage(searchForm, t("search.empty"), "warning");
            return;
        }

        saveToStorage(STORAGE_KEYS.lastSearch, query);

        const foundSection = searchableSections.find(section =>
            section.textContent.toLowerCase().includes(query)
        );

        if (!foundSection) {
            showMessage(
                searchForm,
                t("search.none", { query }),
                "error"
            );
            return;
        }

        const { id } = foundSection;

        foundSection.classList.add("js-search-highlight");

        foundSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        const sectionName = t(SEARCH_RESULT_LABELS[id] || "section.home");

        showMessage(
            searchForm,
            t("search.jumped", { section: sectionName }),
            "success"
        );
    });

    updateSearchClearButton();
};

const getProgramLevel = card => {
    const contentBlock = card.closest(".program-content");

    if (!contentBlock) return "unknown";
    if (contentBlock.classList.contains("bachelor-content")) return "bachelor";
    if (contentBlock.classList.contains("single-cycle-content")) return "single-cycle";
    if (contentBlock.classList.contains("master-content")) return "master";
    if (contentBlock.classList.contains("doctoral-content")) return "doctoral";

    return "unknown";
};

const PROGRAM_LEVEL_LABELS = {
    bachelor: "level.bachelor",
    "single-cycle": "level.singleCycle",
    master: "level.master",
    doctoral: "level.doctoral"
};

const getActiveProgramLevel = programsSection => {
    const activeTab = $('input[name="program-level"]:checked', programsSection);
    return activeTab ? activeTab.id.replace("-tab", "") : "bachelor";
};

const getProgramLevelLabel = level =>
    t(PROGRAM_LEVEL_LABELS[level] || "section.programs");

const getActiveProgramContent = programsSection => {
    const activeLevel = getActiveProgramLevel(programsSection);
    return $(`.${activeLevel}-content`, programsSection);
};

const formatProgramResultCount = ({ visibleCount, activeTotal, showFavoritesOnly, query, activeLabel }) => {
    if (currentLanguage === "ka") {
        if (showFavoritesOnly && query) {
            return `ნაჩვენებია ${visibleCount} შენახული შედეგი: ${activeLabel}.`;
        }

        if (showFavoritesOnly) {
            return visibleCount
                ? `ნაჩვენებია ${visibleCount} შენახული პროგრამა: ${activeLabel}.`
                : `${activeLabel}: შენახული პროგრამები ჯერ არ არის.`;
        }

        if (query) {
            return `ნაჩვენებია ${visibleCount} შედეგი: ${activeLabel}.`;
        }

        return activeTotal
            ? `${activeLabel}: ${activeTotal} პროგრამა.`
            : `${activeLabel}: ინფორმაცია მალე დაემატება.`;
    }

    if (showFavoritesOnly && query) {
        return `Showing ${visibleCount} saved match${visibleCount === 1 ? "" : "es"} in ${activeLabel}.`;
    }

    if (showFavoritesOnly) {
        return visibleCount
            ? `Showing ${visibleCount} saved program${visibleCount === 1 ? "" : "s"} in ${activeLabel}.`
            : `No saved programs in ${activeLabel} yet.`;
    }

    if (query) {
        return `Showing ${visibleCount} match${visibleCount === 1 ? "" : "es"} in ${activeLabel}.`;
    }

    return activeTotal
        ? `${activeTotal} program${activeTotal === 1 ? "" : "s"} in ${activeLabel}.`
        : `${activeLabel} details coming soon.`;
};

const initProgramExplorer = () => {
    const programsSection = $("#programs");
    if (!programsSection) return;

    const tabLabels = $(".tab-labels", programsSection);
    const programCards = $$(".program-card", programsSection);
    const levelTabs = $$('input[name="program-level"]', programsSection);

    if (!tabLabels || !programCards.length) return;

    if (!$(".program-tools", programsSection)) {
        tabLabels.insertAdjacentHTML(
            "afterend",
            `
        <div class="program-tools" aria-label="Program filtering tools">
          <div class="program-search-panel">
            <div class="program-tool-group">
              <label for="program-filter-search">${t("programs.searchLabel")}</label>
              <div class="program-search-field">
                <input id="program-filter-search" type="search" placeholder="${t("programs.searchPlaceholder")}">
                <button class="program-search-clear-button" type="button" aria-label="${t("programs.clear")}" hidden>×</button>
              </div>
            </div>
          </div>

          <div class="program-tool-actions">
            <label class="program-favorites-filter">
              <input id="program-favorites-only" type="checkbox">
              <span>${t("programs.savedOnly")}</span>
            </label>

            <p class="program-result-count" aria-live="polite"></p>
          </div>
        </div>
      `
        );
    }

    const programContentBlocks = $$(".program-content", programsSection);

    programContentBlocks.forEach(contentBlock => {
        if ($(".program-empty-state-js", contentBlock)) return;

        contentBlock.insertAdjacentHTML(
            "beforeend",
            `
        <div class="program-empty-state-js" aria-live="polite">
          <h3>${t("programs.noPrograms")}</h3>
          <p>${t("programs.emptyDefault")}</p>
        </div>
      `
        );
    });

    let favoritePrograms = readFromStorage(STORAGE_KEYS.programFavorites, []);

    const programs = programCards.map((card, index) => {
        const titleElement = $("h3", card);
        const descriptionElement = $("p", card);
        const degreeElement = $("span", card);

        const title = titleElement?.textContent.trim() || `Program ${index + 1}`;
        const description = descriptionElement?.textContent.trim() || "";
        const degree = degreeElement?.textContent.trim() || "";
        const level = getProgramLevel(card);
        const id = createSlug(level, degree, title);

        const program = {
            id,
            title,
            description,
            degree,
            level,
            element: card
        };

        card.dataset.programId = id;
        card.dataset.programSearch = `${title} ${description} ${degree} ${level}`.toLowerCase();

        if (!$(".program-favorite-btn", card)) {
            card.insertAdjacentHTML(
                "beforeend",
                `
          <button class="program-favorite-btn" type="button" data-program-id="${id}" aria-label="Save ${title}">
            ☆
          </button>
        `
            );
        }

        return program;
    });

    const programSearch = $("#program-filter-search", programsSection);
    const programSearchClearButton = $(".program-search-clear-button", programsSection);
    const favoritesOnly = $("#program-favorites-only", programsSection);
    const resultCount = $(".program-result-count", programsSection);

    const updateProgramToolText = () => {
        const searchLabel = $(".program-tool-group label", programsSection);
        const savedLabel = $(".program-favorites-filter span", programsSection);

        if (searchLabel) searchLabel.textContent = t("programs.searchLabel");
        if (programSearch) programSearch.placeholder = t("programs.searchPlaceholder");
        if (programSearchClearButton) {
            programSearchClearButton.setAttribute("aria-label", t("programs.clear"));
        }
        if (savedLabel) savedLabel.textContent = t("programs.savedOnly");

        $$(".program-empty-state-js", programsSection).forEach(emptyState => {
            const emptyTitle = $("h3", emptyState);
            const emptyText = $("p", emptyState);

            if (!emptyState.classList.contains("is-active")) {
                if (emptyTitle) emptyTitle.textContent = t("programs.noPrograms");
                if (emptyText) emptyText.textContent = t("programs.emptyDefault");
            }
        });
    };

    const renderFavoriteButtons = () => {
        const favoriteSet = new Set(favoritePrograms);

        programs.forEach(({ id, element }) => {
            const favoriteButton = $(".program-favorite-btn", element);
            const isFavorite = favoriteSet.has(id);

            if (!favoriteButton) return;

            favoriteButton.textContent = isFavorite ? "★" : "☆";
            favoriteButton.classList.toggle("is-favorite", isFavorite);
            favoriteButton.setAttribute(
                "aria-label",
                isFavorite ? "Remove from saved programs" : "Save this program"
            );
        });
    };

    const applyProgramFilters = () => {
        const rawQuery = programSearch.value.trim();
        const query = rawQuery.toLowerCase();
        const showFavoritesOnly = favoritesOnly.checked;
        const activeLevel = getActiveProgramLevel(programsSection);
        const activeLabel = getProgramLevelLabel(activeLevel);

        if (programSearchClearButton) {
            programSearchClearButton.hidden = !rawQuery;
        }

        let visibleCount = 0;
        let activeTotal = 0;
        let savedInActiveLevel = 0;

        programs.forEach(({ id, level, element }) => {
            const matchesActiveTab = level === activeLevel;
            const matchesSearch = element.dataset.programSearch.includes(query);
            const matchesFavoriteFilter = !showFavoritesOnly || favoritePrograms.includes(id);

            const shouldShow = matchesSearch && matchesFavoriteFilter;

            element.classList.toggle("is-hidden-by-js", !shouldShow);

            if (matchesActiveTab) {
                activeTotal += 1;

                if (favoritePrograms.includes(id)) {
                    savedInActiveLevel += 1;
                }
            }

            if (matchesActiveTab && shouldShow) {
                visibleCount += 1;
            }
        });

        const isFiltering = Boolean(query || showFavoritesOnly);
        const activeContent = getActiveProgramContent(programsSection);
        const activeEmptyState = activeContent
            ? $(".program-empty-state-js", activeContent)
            : null;

        $$(".program-empty-state-js", programsSection).forEach(emptyState => {
            emptyState.classList.remove("is-active");
        });

        $$(".empty-program-state", programsSection).forEach(emptyState => {
            emptyState.classList.toggle("is-hidden-by-js", isFiltering);
        });

        if (activeEmptyState && isFiltering && visibleCount === 0) {
            const emptyTitle = $("h3", activeEmptyState);
            const emptyText = $("p", activeEmptyState);

            if (showFavoritesOnly && !savedInActiveLevel && !query) {
                emptyTitle.textContent = t("programs.noSaved", { level: activeLabel });
                emptyText.textContent = t("programs.noSavedText");
            } else if (showFavoritesOnly && query) {
                emptyTitle.textContent = t("programs.noSavedMatches", { query: rawQuery });
                emptyText.textContent = t("programs.noSavedMatchesText");
            } else {
                emptyTitle.textContent = t("programs.noMatches", { query: rawQuery });
                emptyText.textContent = t("programs.noMatchesText");
            }

            activeEmptyState.classList.add("is-active");
        }

        resultCount.textContent = formatProgramResultCount({
            visibleCount,
            activeTotal,
            showFavoritesOnly,
            query,
            activeLabel
        });
    };

    programsSection.addEventListener("click", event => {
        const favoriteButton = event.target.closest(".program-favorite-btn");
        if (!favoriteButton) return;

        const { programId } = favoriteButton.dataset;

        favoritePrograms = favoritePrograms.includes(programId)
            ? favoritePrograms.filter(id => id !== programId)
            : [...favoritePrograms, programId];

        saveToStorage(STORAGE_KEYS.programFavorites, favoritePrograms);

        renderFavoriteButtons();
        applyProgramFilters();
    });

    programSearch.addEventListener("input", applyProgramFilters);
    programSearchClearButton?.addEventListener("click", () => {
        programSearch.value = "";
        programSearch.focus();
        applyProgramFilters();
    });
    favoritesOnly.addEventListener("change", applyProgramFilters);

    levelTabs.forEach(tab => {
        tab.addEventListener("change", applyProgramFilters);
    });

    document.addEventListener("languagechange", () => {
        updateProgramToolText();
        applyProgramFilters();
    });

    updateProgramToolText();
    renderFavoriteButtons();
    applyProgramFilters();
};

const getFormTitle = form => {
    const titleElement = $("h3", form);

    if (titleElement) return titleElement.textContent.trim();
    if (form.classList.contains("open-day-form")) return "Campus Visit Application";
    if (form.classList.contains("assistant-form")) return "Contact Message";
    if (form.classList.contains("verification-form")) return "Student Verification";

    return "Student Request";
};

const collectFormData = form => {
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());

    const checkedOptions = $$('input[type="radio"]:checked, input[type="checkbox"]:checked', form)
        .map(input => input.value || "confirmed");

    return {
        ...entries,
        checkedOptions
    };
};

const clearFormErrors = form => {
    $$(".field-error", form).forEach(error => error.remove());
    $$(".has-error", form).forEach(input => input.classList.remove("has-error"));
};

const showFieldError = (input, message) => {
    input.classList.add("has-error");

    const error = document.createElement("small");
    error.className = "field-error";
    error.textContent = message;

    input.insertAdjacentElement("afterend", error);
};

const validateForm = form => {
    clearFormErrors(form);

    const requiredFields = $$("input[required], select[required], textarea[required]", form);
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.type === "checkbox" ? field.checked : field.value.trim();

        if (!value) {
            showFieldError(field, "This field is required.");
            isValid = false;
        }
    });

    const emailInput = $('input[type="email"]', form);

    if (emailInput && emailInput.value.trim()) {
        const email = emailInput.value.trim();
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isEmailValid) {
            showFieldError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }
    }

    const phoneInput = $('input[type="tel"]', form);

    if (phoneInput && phoneInput.value.trim()) {
        const phone = phoneInput.value.trim();
        const isPhoneValid = /^[0-9+() -]{6,20}$/.test(phone);

        if (!isPhoneValid) {
            showFieldError(phoneInput, "Please enter a valid phone number.");
            isValid = false;
        }
    }

    return isValid;
};

const getSavedSubmissions = storageKey => readFromStorage(storageKey, []);

const saveSubmission = (storageKey, submission) => {
    const previousSubmissions = getSavedSubmissions(storageKey);

    const updatedSubmissions = [
        submission,
        ...previousSubmissions
    ].slice(0, 5);

    saveToStorage(storageKey, updatedSubmissions);

    return updatedSubmissions;
};

const renderSubmissionHistory = (form, submissions) => {
    if (!form || !submissions.length) return;

    let historyBox = form.parentElement.querySelector(".submission-history");

    if (!historyBox) {
        historyBox = document.createElement("div");
        historyBox.className = "submission-history";
        form.insertAdjacentElement("afterend", historyBox);
    }

    const shortList = submissions.slice(0, 3);

    historyBox.innerHTML = `
    <h4>Recently saved submissions</h4>
    <ul>
      ${shortList.map(({ title, createdAt }) => `
        <li>
          <span>${title}</span>
          <small>${createdAt}</small>
        </li>
      `).join("")}
    </ul>
  `;
};

const runAfterDelay = (callback, delay = 300) => {
    setTimeout(callback, delay);
};

const handleStoredFormSubmit = (form, storageKey) => {
    form.addEventListener("submit", event => {
        event.preventDefault();

        const isValid = validateForm(form);

        if (!isValid) {
            showMessage(form, "Please fix the highlighted fields.", "error");
            return;
        }

        const title = getFormTitle(form);
        const formValues = collectFormData(form);

        const submission = {
            id: crypto.randomUUID ? crypto.randomUUID() : createSlug(title, Date.now()),
            title,
            data: formValues,
            createdAt: new Date().toLocaleString()
        };

        const updatedSubmissions = saveSubmission(storageKey, submission);

        showMessage(form, `${title} was saved locally.`, "success");
        renderSubmissionHistory(form, updatedSubmissions);

        runAfterDelay(() => {
            form.reset();
        });
    });
};

const initStudentVerification = () => {
    const verificationForm = $(".verification-form");
    if (!verificationForm) return;

    verificationForm.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = $("#login-email", verificationForm);
        const passwordInput = $("#login-password", verificationForm);

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        clearFormErrors(verificationForm);

        if (!email.endsWith("@students.kiu.ac.ge") && !email.endsWith("@kiu.edu.ge")) {
            showFieldError(emailInput, "Use a KIU student or KIU email address.");
            showMessage(verificationForm, "Verification failed. KIU email is required.", "error");
            return;
        }

        if (password.length < 4) {
            showFieldError(passwordInput, "Password must contain at least 4 characters.");
            showMessage(verificationForm, "Verification failed. Password is too short.", "error");
            return;
        }

        sessionStorage.setItem("kiu-services-verified", "true");

        showMessage(
            verificationForm,
            "Verification successful. You can now submit student service requests.",
            "success"
        );
    });
};

const initProjectForms = () => {
    const openDayForm = $(".open-day-form");
    const requestForms = $$(".request-form");
    const assistantForm = $(".assistant-form");

    if (openDayForm) {
        handleStoredFormSubmit(openDayForm, "kiu-open-day-applications");
        renderSubmissionHistory(openDayForm, getSavedSubmissions("kiu-open-day-applications"));
    }

    requestForms.forEach(form => {
        handleStoredFormSubmit(form, "kiu-service-requests");
    });

    if (requestForms[0]) {
        renderSubmissionHistory(requestForms[0], getSavedSubmissions("kiu-service-requests"));
    }

    if (assistantForm) {
        handleStoredFormSubmit(assistantForm, "kiu-contact-messages");
        renderSubmissionHistory(assistantForm, getSavedSubmissions("kiu-contact-messages"));
    }

    initStudentVerification();
};

const copyTextFallback = text =>
    new Promise((resolve, reject) => {
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.left = "-9999px";

        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        try {
            const wasCopied = document.execCommand("copy");

            if (wasCopied) {
                resolve();
            } else {
                reject(new Error("Copy command was not successful."));
            }
        } catch (error) {
            reject(error);
        } finally {
            temporaryInput.remove();
        }
    });

const copyTextToClipboard = async text => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            await copyTextFallback(text);
            return;
        }
    }

    await copyTextFallback(text);
};

const initContactCopy = () => {
    const contactButtons = $$(".copy-contact-button");

    contactButtons.forEach(button => {
        const statusText = $(".contact-copy-text", button);

        button.addEventListener("click", async () => {
            const copyValue = button.dataset.copyValue;
            const copyLabel = button.dataset.copyLabel || "contact information";

            if (!copyValue || !statusText) return;

            button.classList.remove("is-copy-error");
            button.disabled = true;

            try {
                await copyTextToClipboard(copyValue);

                statusText.textContent = t("copy.copied");
                button.classList.add("is-copied");
                button.setAttribute("aria-label", `${copyLabel} copied`);

                setTimeout(() => {
                    statusText.textContent = t("copy.default");
                    button.classList.remove("is-copied");
                    button.removeAttribute("aria-label");
                    button.disabled = false;
                }, 1800);
            } catch (error) {
                statusText.textContent = t("copy.error");
                button.classList.add("is-copy-error");
                button.disabled = false;
                console.error(error);

                setTimeout(() => {
                    statusText.textContent = t("copy.default");
                    button.classList.remove("is-copy-error");
                }, 2200);
            }
        });
    });
};

const CAMPUS_LOCATION = {
    city: "Kutaisi",
    country: "Georgia",
    latitude: 42.2679,
    longitude: 42.6946
};

const WEATHER_CODE_LABELS = {
    en: {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm"
    },
    ka: {
        0: "მოწმენდილი ცა",
        1: "უმეტესად მოწმენდილი",
        2: "ნაწილობრივ ღრუბლიანი",
        3: "ღრუბლიანი",
        45: "ნისლი",
        48: "ყინულოვანი ნისლი",
        51: "მსუბუქი ჟინჟღლი",
        53: "ზომიერი ჟინჟღლი",
        55: "ძლიერი ჟინჟღლი",
        61: "მსუბუქი წვიმა",
        63: "ზომიერი წვიმა",
        65: "ძლიერი წვიმა",
        71: "მსუბუქი თოვა",
        73: "ზომიერი თოვა",
        75: "ძლიერი თოვა",
        80: "მსუბუქი წვიმის შხაპი",
        81: "ზომიერი წვიმის შხაპი",
        82: "ძლიერი წვიმის შხაპი",
        95: "ჭექა-ქუხილი"
    }
};

const getWeatherDescription = code =>
    WEATHER_CODE_LABELS[currentLanguage]?.[code] ||
    WEATHER_CODE_LABELS.en[code] ||
    t("weather.unavailable");

const buildWeatherUrl = ({ latitude, longitude }) => {
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m"
        ].join(","),
        timezone: "auto"
    });

    return `${baseUrl}?${params.toString()}`;
};

const fetchCampusWeather = url =>
    new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    reject(new Error("Weather API request failed."));
                    return null;
                }

                return response.json();
            })
            .then(data => {
                if (data) resolve(data);
            })
            .catch(error => reject(error));
    });

const createCampusWeatherTip = (apparentTemperature, callback) => {
    setTimeout(() => {
        if (apparentTemperature >= 30) {
            callback(t("weather.tipHot"));
            return;
        }

        if (apparentTemperature <= 8) {
            callback(t("weather.tipCold"));
            return;
        }

        callback(t("weather.tipComfortable"));
    }, 400);
};

const renderCampusWeather = weatherData => {
    const weatherCard = $("#campus-weather-card");
    if (!weatherCard) return;

    lastCampusWeatherData = weatherData;

    const {
        current,
        current_units: units
    } = weatherData;

    const {
        temperature_2m,
        apparent_temperature,
        relative_humidity_2m,
        weather_code,
        wind_speed_10m,
        time
    } = current;

    weatherCard.innerHTML = `
    <div class="weather-main">
      <span class="weather-location">${t("weather.location")}</span>
      <strong>${Math.round(temperature_2m)}${units.temperature_2m}</strong>
      <p>${getWeatherDescription(weather_code)}</p>
    </div>

    <div class="weather-details">
      <div>
        <span>${t("weather.feelsLike")}</span>
        <strong>${Math.round(apparent_temperature)}${units.apparent_temperature}</strong>
      </div>

      <div>
        <span>${t("weather.humidity")}</span>
        <strong>${relative_humidity_2m}${units.relative_humidity_2m}</strong>
      </div>

      <div>
        <span>${t("weather.wind")}</span>
        <strong>${wind_speed_10m} ${units.wind_speed_10m}</strong>
      </div>
    </div>

    <p class="weather-time">${t("weather.updated", { time: new Date(time).toLocaleString() })}</p>
    <p class="weather-tip" id="campus-weather-tip">${t("weather.tipPreparing")}</p>
  `;

    createCampusWeatherTip(apparent_temperature, tip => {
        const tipElement = $("#campus-weather-tip");
        if (tipElement) {
            tipElement.textContent = tip;
        }
    });
};

const renderCampusWeatherError = message => {
    const weatherCard = $("#campus-weather-card");
    if (!weatherCard) return;

    weatherCard.innerHTML = `
    <p class="weather-error">${message}</p>
  `;
};

const loadCampusWeather = async () => {
    const weatherCard = $("#campus-weather-card");
    const refreshButton = $("#weather-refresh-btn");

    if (!weatherCard || !refreshButton) return;

    try {
        refreshButton.disabled = true;
        refreshButton.textContent = t("weather.updating");

        weatherCard.innerHTML = `
      <p class="weather-loading">${t("weather.loading")}</p>
    `;

        const apiUrl = buildWeatherUrl(CAMPUS_LOCATION);
        const weatherData = await fetchCampusWeather(apiUrl);

        renderCampusWeather(weatherData);
    } catch (error) {
        renderCampusWeatherError(
            t("weather.error")
        );
        console.error(error);
    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = t("weather.refresh");
    }
};

const initCampusWeather = () => {
    const refreshButton = $("#weather-refresh-btn");
    if (!refreshButton) return;

    refreshButton.addEventListener("click", loadCampusWeather);
    document.addEventListener("languagechange", () => {
        if (lastCampusWeatherData) {
            renderCampusWeather(lastCampusWeatherData);
        }
    });
    loadCampusWeather();
};

document.addEventListener("DOMContentLoaded", () => {
    initLanguageSwitch();
    initThemeToggle();
    initSmoothNavigation();
    initSiteSearch();
    initProgramExplorer();
    initProjectForms();
    initContactCopy();
    initCampusWeather();

    console.log("Final project JavaScript loaded successfully.");
});
