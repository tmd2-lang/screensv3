/**
 * Real Georgetown content, September 2026.
 *
 * Club posts come from the Instagram Business Discovery corpus in
 * outputs/ig-corpus-2026-09-18/ (4,201 posts, 43 clubs). The game row comes
 * from the athletics ICS feed in lib/ligo/realFeedSnapshot.json.
 *
 * Captions are verbatim. The Philodemic room votes are the real tallies the
 * Society publishes in its own recaps. Everything labelled "illustrative" in
 * the UI (campus splits, vote counts on Ligo, streaks) is invented, because
 * no one has voted on any of this yet.
 */

export type Treatment = "plain" | "predict" | "collision" | "spread" | "route" | "calendar";

export type Item = {
  id: string;
  club: string;
  handle: string;
  avatar: string;
  tint: string;
  date: string; // ISO day the post went up
  kind: string;
  caption: string;
  likes: number | null;
  treatment: Treatment;
  /** Saved by scripts/instagram-image-pull.mjs; falls back to poster art. */
  photo?: string;
  /** Eyebrow chip shown above the headline, v2 style. */
  badge?: string;
  art?: { top: string; title: string; em?: string; bottom: string; theme: string };
  /**
   * What the post is asking of you, and therefore the one button it gets.
   * `gate` is how much authority the verb claims on the club's behalf, which
   * decides whether a parser may assign it unsupervised:
   *   auto   - wrong is harmless (a congrats on a post that didn't need one)
   *   fields - needs a real date/place parsed out, or it invents an event
   *   allow  - only fires for clubs on a list; it puts words in their mouth
   */
  verb?: {
    kind: "commit" | "acknowledge" | "predict" | "decide" | "consume";
    label: string;
    gate: "auto" | "fields" | "allow";
  };
  /**
   * A post that is a sequence of places, not one event. Hoya Blue's game day
   * is meet-here-then-go-there, so one RSVP has to cover both stops.
   */
  route?: {
    stops: { time: string; place: string; what: string }[];
    /** Illustrative. Turnout is the whole product for a spirit club. */
    going: number;
    goal: number;
  };
  /**
   * An event from the Georgetown events calendar rather than Instagram.
   * Every field below is real schema.org Event data from the source page,
   * which today's feed throws away in favour of a "Read more" link.
   */
  calendar?: {
    organizer: string;
    when: string;
    where: string;
    whereNote: string;
    body: string;
    url: string;
  };
  /** Only on interactive items. */
  unit?: {
    question: string;
    sub: string;
    options: [string, string];
    /** Day the card locks. */
    closes: string;
    /** Day the real answer lands. */
    resolves: string;
    /** Illustrative campus split, first option's share. */
    campus: number;
    /** The real outcome, verbatim from the club or the scoreboard. */
    truth: string;
    truthNote: string;
    /** Which option the truth matched. */
    winner: 0 | 1;
  };
};

export const FEED: Item[] = [
  {
    id: "hoyalytics-0918",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    photo: "/ig/hoyalytics-2026-09-18.jpg",
    club: "Hoyalytics",
    handle: "hoyalytics",
    avatar: "H",
    tint: "#2f5d8a",
    date: "2026-09-18",
    kind: "Post · Georgetown",
    caption:
      "Come by tomorrow for burgers, hot dogs, snacks, and, most importantly, to meet our newest general and applied members!",
    likes: 8,
    treatment: "plain",
  },
  {
    id: "hoyablue-0917",
    verb: { kind: "predict", label: "", gate: "allow" },
    badge: "Two events, one night",
    photo: "/ig/ibleedhoyablue-2026-09-17.jpg",
    club: "Hoya Blue",
    handle: "ibleedhoyablue",
    avatar: "B",
    tint: "#1d4b79",
    date: "2026-09-17",
    kind: "Game day · Georgetown",
    caption:
      "Two matches. One Night. Zero excuses. See you in McDonough and at Shaw. 📍Volleyball v GW | 6pm | McDonough Arena 📍Men's Soccer v Marquette | 7pm | Shaw Field",
    likes: 74,
    treatment: "collision",
    art: { top: "WED · SEP 17 · TWO VENUES", title: "TWO MATCHES.", em: "ONE NIGHT.", bottom: "MCDONOUGH 6PM · SHAW 7PM", theme: "blue" },
    unit: {
      question: "You can't be at both. Where are you?",
      sub: "Volleyball tips at six in McDonough. Soccer kicks at seven on Shaw.",
      options: ["Volleyball v GW", "Men's Soccer v Marquette"],
      closes: "2026-09-17",
      resolves: "2026-09-18",
      campus: 38,
      truth: "Shaw drew the bigger student crowd",
      truthNote: "Illustrative. A real version would resolve on gate counts or Hoya Blue's own recap.",
      winner: 1,
    },
  },
  {
    id: "gugs-0917",
    verb: { kind: "decide", label: "I'm interested", gate: "auto" },
    photo: "/ig/gugs_georgetown-2026-09-17.jpg",
    club: "GUGS",
    handle: "gugs_georgetown",
    avatar: "G",
    tint: "#8a4b22",
    date: "2026-09-17",
    kind: "Post · Georgetown",
    caption: "No need for a caption, the Grillmasters' testimonies speak for themselves… join GUGS 🫡",
    likes: 84,
    treatment: "plain",
  },
  {
    id: "philo-0917",
    verb: { kind: "predict", label: "", gate: "allow" },
    badge: "Debate night",
    photo: "/ig/philodemicsociety-2026-09-17.jpg",
    club: "Philodemic Society",
    handle: "philodemicsociety",
    avatar: "P",
    tint: "#492f65",
    date: "2026-09-17",
    kind: "Debate · Georgetown",
    caption:
      "This Saturday, the Philodemic Society will be teaming up with cadets from the United States Military Academy to debate \"Resolved: Economic inequality is the greatest threat to American democracy.\" We can't wait to see you at 7:45pm, with the debate starting promptly at 8pm, in Riggs Library (Healy 3)!",
    likes: 111,
    treatment: "predict",
    art: { top: "PHILODEMIC SOCIETY × WEST POINT", title: "ECONOMIC", em: "INEQUALITY.", bottom: "RIGGS LIBRARY · SAT 8PM", theme: "violet" },
    unit: {
      question: "How will the room vote?",
      sub: "Riggs seats about eighty. Call it before they do.",
      options: ["Affirm", "Negate"],
      closes: "2026-09-19",
      resolves: "2026-09-22",
      campus: 64,
      truth: "Motion negated · 31 for, 45 against",
      truthNote: "Illustrative result. Real recaps publish the exact tally, as they did for the two debates below.",
      winner: 1,
    },
  },
  {
    id: "gupride-0917",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    photo: "/ig/gupride-2026-09-17.jpg",
    club: "GU Pride",
    handle: "gupride",
    avatar: "P",
    tint: "#9c3f6b",
    date: "2026-09-17",
    kind: "Event · Georgetown",
    caption:
      "Buckle up and rev your engines…GU Pride's Speedfriending Social just pulled up to the starting line!!! Join us on Wednesday, September 23rd in the Arrupe Multipurpose Room for a night filled with boba, new friends, and drag-themed activities.",
    likes: 9,
    treatment: "plain",
  },
  {
    id: "indy-0917",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    photo: "/ig/thegeorgetownindy-2026-09-17.jpg",
    club: "The Georgetown Indy",
    handle: "thegeorgetownindy",
    avatar: "I",
    tint: "#4e5a9c",
    date: "2026-09-17",
    kind: "Post · Georgetown",
    caption:
      "INDY FRIENDS! come listen to Lizzy McAlpine's new album with us 🪽 pull up to leavey 409 tomorrow night or you're the OPPOSITE of an angel…",
    likes: 21,
    treatment: "plain",
  },
  {
    id: "soccer-0919",
    verb: { kind: "predict", label: "", gate: "allow" },
    badge: "Game day",
    club: "Georgetown Athletics",
    handle: "guhoyas",
    avatar: "G",
    tint: "#1d4b79",
    date: "2026-09-19",
    kind: "Game day · Georgetown",
    caption: "Men's Soccer vs Marquette · Shaw Field · Away side unbeaten in four.",
    likes: null,
    treatment: "spread",
    art: { top: "SAT · SEP 19 · SHAW FIELD", title: "GEORGETOWN", em: "vs MARQUETTE", bottom: "MEN'S SOCCER · 7:00 PM ET", theme: "navy" },
    unit: {
      question: "Hoyas by two or more?",
      sub: "Everyone here picks Georgetown. The margin is the actual question.",
      options: ["By two or more", "Closer than that"],
      closes: "2026-09-19",
      resolves: "2026-09-22",
      campus: 47,
      truth: "Georgetown 2 · Marquette 1",
      truthNote: "Illustrative score. The athletics feed publishes finals, but not yet joined to the schedule row.",
      winner: 1,
    },
  },
  {
    id: "irc-0917",
    photo: "/ig/georgetownirc-2026-09-17.jpg",
    club: "Georgetown IRC",
    handle: "georgetownirc",
    avatar: "I",
    tint: "#285b42",
    date: "2026-09-17",
    kind: "Post · Georgetown",
    caption:
      "First General Body Meeting in the books! 📖 Director of Academic Programming Mansimar and Chair Elizabeth led us in a workshop on getting the most out of speaker events across campus. Now go use what you learned! 🫡",
    likes: 73,
    treatment: "plain",
  },
  {
    id: "lecturefund-0916",
    verb: { kind: "acknowledge", label: "Congrats", gate: "auto" },
    photo: "/ig/lecturefundgu-2026-09-16.jpg",
    club: "GU Lecture Fund",
    handle: "lecturefundgu",
    avatar: "L",
    tint: "#2f6d63",
    date: "2026-09-16",
    kind: "Post · Georgetown",
    caption: "Meet the Lecture Fund '26-'27 Executive Board! 🎙️",
    likes: 97,
    treatment: "plain",
  },
  {
    id: "aasa-0916",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    photo: "/ig/georgetownaasa-2026-09-16.jpg",
    club: "Georgetown AASA",
    handle: "georgetownaasa",
    avatar: "A",
    tint: "#b65251",
    date: "2026-09-16",
    kind: "Event · Georgetown",
    caption:
      "Calling all bigs and littles, Bobapalooza is returning again THIS SUNDAY in HFSC Social Room! Pull up with your Temp Fam to enjoy delectable FREE boba and get to know your bigs and littles.",
    likes: 88,
    treatment: "plain",
  },
  {
    id: "innovo-0916",
    verb: { kind: "acknowledge", label: "Congrats", gate: "auto" },
    photo: "/ig/innovoconsulting-2026-09-16.jpg",
    club: "Innovo Consulting",
    handle: "innovoconsulting",
    avatar: "I",
    tint: "#384782",
    date: "2026-09-16",
    kind: "Post · Georgetown",
    caption:
      "Congratulations and welcome to our Fall 2026 New Hire class! We are so excited for you to join us 🧡💙",
    likes: 177,
    treatment: "plain",
  },
  {
    id: "philo-0912",
    verb: { kind: "consume", label: "Read the recap", gate: "auto" },
    photo: "/ig/philodemicsociety-2026-09-12.jpg",
    club: "Philodemic Society",
    handle: "philodemicsociety",
    avatar: "P",
    tint: "#492f65",
    date: "2026-09-12",
    kind: "Debate · Georgetown",
    caption:
      "On Thursday, September 10th, the Philodemic Society convened to debate \"Resolved: A life of leisure is a worthy pursuit.\" Ultimately, this resolution was affirmed after a vote of 43 to 33.",
    likes: 178,
    treatment: "plain",
  },
  {
    id: "gma-0916",
    verb: { kind: "acknowledge", label: "Congrats", gate: "auto" },
    photo: "/ig/gtownmarketingassociation-2026-09-16.jpg",
    club: "GU Marketing Association",
    handle: "gtownmarketingassociation",
    avatar: "M",
    tint: "#2f5d8a",
    date: "2026-09-16",
    kind: "Post · Georgetown",
    caption:
      "Meet the newest members of GMA 💙 We can't wait to see the ideas, energy, and perspective that they will bring to GMA this semester! Welcome to the team!!!",
    likes: 167,
    treatment: "plain",
  },
  {
    id: "hoyablue-0924",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    badge: "Two stops, one plan",
    club: "Hoya Blue",
    handle: "ibleedhoyablue",
    avatar: "B",
    tint: "#1d4b79",
    date: "2026-09-24",
    kind: "Game day · Georgetown",
    caption:
      "\u{1F6A8} GAME DAY ALERT \u{1F6A8} This Saturday, we're taking over Harbin Patio before kickoff and it's gonna be LOUD. Hoya Blue is bringing FREE Wingo's to fuel you up, then we're marching straight to Cooper Field.",
    likes: 61,
    treatment: "route",
    route: {
      stops: [
        { time: "12:00 PM", place: "Harbin Patio", what: "Pre-game Wingo's, free" },
        { time: "12:30 PM", place: "Cooper Field", what: "Kickoff vs. Columbia" },
      ],
      going: 142,
      goal: 200,
    },
  },
  {
    id: "dsan-0924",
    verb: { kind: "commit", label: "+ Going", gate: "fields" },
    club: "Data Science & Analytics Master's Program",
    handle: "events.georgetown.edu",
    avatar: "D",
    tint: "#3f4a6b",
    date: "2026-09-24",
    kind: "Georgetown events calendar",
    caption: "",
    likes: 1,
    treatment: "calendar",
    calendar: {
      organizer: "Data Science & Analytics Master's Program",
      when: "Fri, Sep 25 \u00b7 7:00 PM",
      where: "Car Barn patio",
      whereNote: "Pulled from the description. The calendar's own location field is empty.",
      body:
        "DSAN social committee is hosting a movie night at the Car Barn patio on Friday the 25th at sunset. Come enjoy snacks, good vibes, a movie, and maybe some after's! More details will be coming, keep an eye on your inbox :)",
      url: "https://events.georgetown.edu/event/42442-dsan-social-committee-movie-night-in-the-courtyard",
    },
  },
];

/** The three days the scrubber moves between. */
export const DAYS = [
  { id: "2026-09-17", label: "Wed Sep 17", note: "Two of the three units are open. Nothing has happened yet." },
  { id: "2026-09-19", label: "Sat Sep 19", note: "Game day. The collision already happened; the debate locks tonight." },
  { id: "2026-09-22", label: "Tue Sep 22", note: "Everything has resolved. This is the day the feed pays you back." },
  { id: "2026-09-24", label: "Thu Sep 24", note: "Two posts that are not predictions. A route you can commit to, and a calendar event with no image." },
];

/** A real, previously-resolved debate, used for the season record. */
export const HISTORY = [
  { topic: "A life of leisure is a worthy pursuit", truth: "affirmed 43–33", you: "Affirm", right: true },
  { topic: "China is a preferable dominant global power", truth: "negated 35–70", you: "Negate", right: true },
  { topic: "We have brought the surveillance state upon ourselves", truth: "negated 60–64", you: "Affirm", right: false },
];