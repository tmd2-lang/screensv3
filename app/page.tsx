/**
 * Ligo Lab, Exploration 03 — interactive units inside the REAL feed UI.
 *
 * Extracted from the ligo-home-mockup repo to stand on its own. Unlike the
 * component gallery there,
 * this renders in the actual app's design system: EvScreen, the real
 * ligo-feed-* classes from ligo.css, and the real tab bar. The only new
 * markup is the resolve block, which has no equivalent in the app yet.
 *
 * Content is real Georgetown posts from the week of September 14, 2026.
 * See feedData.ts for what is real and what is illustrative.
 */
"use client";

import React, { useMemo, useState } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import { LigoTabBar } from "@/components/ligo/TabBar";
import { EvScreen, EvAvatarCircle } from "@/components/ligo/primitives";
import { EV, FONT_HEADLINE, accentFor } from "@/lib/ligo/tokens";
import { DAYS, FEED, HISTORY, type Item } from "./feedData";
import "@/components/ligo/ligo.css";
import "./screensv3.css";

const VERB_LEGEND = [
  { kind: "acknowledge", label: "Congrats", what: "a person or a win", gate: "auto", gateLabel: "auto" },
  { kind: "consume", label: "Read", what: "they made a thing", gate: "auto", gateLabel: "auto" },
  { kind: "decide", label: "Interested", what: "a way in, no date", gate: "auto", gateLabel: "auto" },
  { kind: "commit", label: "Going", what: "a time and a place", gate: "fields", gateLabel: "needs fields" },
  { kind: "predict", label: "Affirm / Negate", what: "an open outcome", gate: "allow", gateLabel: "allowlist" },
] as const;

type Mode = "score" | "mirror";
/** "before" is the feed as it ships today: one action bar on every post. */
type View = "before" | "after";

export default function ScreensV3() {
  const [dayIndex, setDayIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("score");
  const [view, setView] = useState<View>("after");
  const [picks, setPicks] = useState<Record<string, 0 | 1>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const day = DAYS[dayIndex];

  const interactive = FEED.filter((item) => item.treatment !== "plain");
  const visible = useMemo(() => FEED.filter((item) => item.date <= day.id), [day.id]);
  const resolved = interactive.filter((item) => item.unit && day.id >= item.unit.resolves).length;

  const pick = (id: string, option: 0 | 1) =>
    setPicks((current) => (current[id] !== undefined ? current : { ...current, [id]: option }));

  return (
    <main className="v3">
      <header className="v3-top">
        <div className="v3-logo">
          <b>L</b> LIGO <em>LAB</em>
        </div>
        <div>
          Exploration 03
        </div>
      </header>

      <section className="v3-intro">
        <div>
          <small>EXPLORATION 03 / THE FEED IN PRACTICE</small>
          <h1>
            One week of <i>real</i> campus.
          </h1>
          <p>
            The same feed UI as the shipping app, not a lab mockup. Thirteen real posts from the
            week of September 14. Three are treated as interactive units and ten are left alone. Move through
            the week and watch the three change.
          </p>
        </div>
        <aside>
          <span className="v3-dot" /> Captions and the three Philodemic tallies are real. Campus splits, the
          streak and future results are illustrative.
        </aside>
      </section>

      <section className="v3-controls">
        <div className="v3-control">
          <small>01 / MOVE THROUGH THE WEEK</small>
          <div className="v3-seg">
            {DAYS.map((d, i) => (
              <button key={d.id} className={i === dayIndex ? "active" : ""} onClick={() => setDayIndex(i)} aria-pressed={i === dayIndex}>
                {d.label}
              </button>
            ))}
          </div>
          <p>{day.note}</p>
        </div>
        <div className="v3-control">
          <small>02 / WHAT THE LATER NUMBER MEANS</small>
          <div className="v3-seg">
            <button className={mode === "score" ? "active" : ""} onClick={() => setMode("score")} aria-pressed={mode === "score"}>
              Score
            </button>
            <button className={mode === "mirror" ? "active" : ""} onClick={() => setMode("mirror")} aria-pressed={mode === "mirror"}>
              Mirror
            </button>
          </div>
          <p>
            {mode === "score"
              ? "You guessed, the world answered. Builds a record."
              : "Campus sits beside the outcome. Nobody is wrong. Builds a portrait."}
          </p>
        </div>
        <div className="v3-control">
          <small>03 / ONE BUTTON PER POST</small>
          <div className="v3-seg">
            <button className={view === "before" ? "active" : ""} onClick={() => setView("before")} aria-pressed={view === "before"}>
              Before
            </button>
            <button className={view === "after" ? "active" : ""} onClick={() => setView("after")} aria-pressed={view === "after"}>
              After
            </button>
          </div>
          <p>
            {view === "before"
              ? "The feed as it ships today. Same three actions on all 15 posts, whatever the post is."
              : "Each post gets the one button that matches what it asks. 14 of 15 here; one asks nothing."}
          </p>
        </div>
      </section>

      <div className="v3-main">
        <section className="v3-stage">
          <IOSDevice width={402} height={874}>
            <div className="v3-phone-inner">
            <EvScreen style={{ flex: 1, minHeight: 0, position: "relative" }}>
              <div className="ligo-screen-top ligo-feed-top">
                <div className="ligo-feed-tabs" role="tablist" aria-label="Filter the campus feed">
                  <div className="ligo-feed-tabs-scroll">
                    {["All", "Sports", "Debate", "Events", "Recruiting"].map((label, i) => (
                      <button key={label} type="button" role="tab" aria-selected={i === 0} className={`ligo-pressable ligo-feed-tab${i === 0 ? " is-active" : ""}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="v3-daychip">{day.label}</span>
                </div>
              </div>

              <div className="ligo-screen-scroll" style={{ paddingBottom: 24 }}>
                <div className="ligo-feed-context-row">
                  <span>Georgetown · real sources</span>
                  <span>{visible.length} posts</span>
                </div>
                <ul className="ligo-feed-list">
                  {visible.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      today={day.id}
                      mode={mode}
                      view={view}
                      pick={picks[item.id]}
                      onPick={pick}
                      liked={!!liked[item.id]}
                      savedOn={!!saved[item.id]}
                      onLike={() => setLiked((c) => ({ ...c, [item.id]: !c[item.id] }))}
                      onSave={() => setSaved((c) => ({ ...c, [item.id]: !c[item.id] }))}
                    />
                  ))}
                  {mode === "score" && day.id >= "2026-09-22" && <RecordCard />}
                </ul>
              </div>

              <LigoTabBar active="chat" />
            </EvScreen>
            </div>
          </IOSDevice>
        </section>

        <aside className="v3-notes">
          <small>WHAT THIS IS TESTING</small>
          <h2>Does it hold up in a scroll?</h2>
          <p className="v3-lead">
            The gallery showed each format alone, in its own styling. This puts them in the real feed, buried in
            a real week, at the rate they would actually occur.
          </p>

          <div className="v3-note v3-verbs">
            <small>THE FIVE VERBS, BY HOW MUCH THEY CLAIM</small>
            {VERB_LEGEND.map((v) => (
              <div key={v.kind} className="v3-verbrow">
                <b className={`v3-vchip v3-verb-${v.kind}`}>{v.label}</b>
                <span>{v.what}</span>
                <em className={`v3-gate v3-gate-${v.gate}`}>{v.gateLabel}</em>
              </div>
            ))}
            <p className="v3-verbnote">
              A wrong Congrats is harmless. A wrong Affirm/Negate puts a question on a club&apos;s post they
              never asked. That difference is what decides which a parser may assign on its own.
            </p>
          </div>

          <div className="v3-note">
            <small>THE THREE UNITS</small>
            <ul>
              <li>
                <b>Collision.</b> Hoya Blue really posted two games on one night. You can&apos;t attend both, so
                the disagreement is built into the content.
              </li>
              <li>
                <b>Prediction.</b> The real September 17 Philodemic post, asked as a call on the room rather than
                an opinion. The Society publishes its tally, so this one genuinely resolves.
              </li>
              <li>
                <b>Spread.</b> The soccer game asked by margin instead of winner, because everyone here picks
                Georgetown.
              </li>
            </ul>
          </div>

          <div className="v3-note">
            <small>WHY THE OTHER TEN STAY PLAIN</small>
            <p>
              Meet-the-board posts, recaps and welcomes hold no contested question. Forcing a tap onto them turns
              the feed into a quiz. The Philodemic recap from September 12 is left plain on purpose, so you can
              see the same club with nothing to ask.
            </p>
          </div>

          <div className="v3-note">
            <small>THE OPEN DECISION</small>
            <p>
              Score and Mirror are different products. Score gives a semester record and a reason to return.
              Mirror never tells anyone they were wrong and reads as campus against its institutions. Toggle them
              on Tuesday to feel the gap.
            </p>
          </div>

          <div className="v3-disclaimer">
            <b>Prototype boundary</b>
            <p>
              Captions, club names and the three historical Philodemic tallies are real. Campus splits, the
              streak, the September 19 score and the September 22 result are invented. Nothing is sent or saved.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Card({
  item, today, mode, view, pick, onPick, liked, savedOn, onLike, onSave,
}: {
  item: Item; today: string; mode: Mode; view: View; pick: 0 | 1 | undefined;
  onPick: (id: string, option: 0 | 1) => void;
  liked: boolean; savedOn: boolean; onLike: () => void; onSave: () => void;
}) {
  const unit = item.unit;
  if (item.calendar) {
    return view === "before" ? (
      <CalendarStub item={item} liked={liked} onLike={onLike} />
    ) : (
      <CalendarCard item={item} savedOn={savedOn} onSave={onSave} />
    );
  }
  const open = unit ? today <= unit.closes : false;
  const done = unit ? today >= unit.resolves : false;
  const accent = accentFor(item.club);

  return (
    <li className={`v3-card${unit ? " is-unit" : ""}`}>
      <div className="v3-head">
        <EvAvatarCircle label={item.club} color={accent} size={36} />
        <div className="v3-head-copy">
          <b>
            {item.club}
            <VerifiedGlyph />
          </b>
          <span>{item.kind}</span>
        </div>
        {unit && view === "after" && <em className={`v3-state v3-state-${done ? "done" : open ? "open" : "locked"}`}>{done ? "Resolved" : open ? "Open" : "Locked"}</em>}
      </div>

      {item.photo ? (
        <div className="v3-photo" style={{ background: item.tint }}>
          {/* The placeholder sits underneath. If the file has not been pulled
              yet the img paints nothing and this shows through. */}
          <div className="v3-photo-missing">
            <b>@{item.handle}</b>
            <span>Image not pulled yet</span>
            <em>scripts/instagram-image-pull.mjs</em>
          </div>
          <img src={item.photo} alt="" />
          {item.badge && <span className="v3-photo-badge">{item.badge}</span>}
        </div>
      ) : item.art ? (
        <div className={`v3-art ${item.art.theme}`}>
          <small>{item.art.top}</small>
          <strong style={{ fontFamily: FONT_HEADLINE }}>
            {item.art.title}
            {item.art.em && (
              <>
                <br />
                <i>{item.art.em}</i>
              </>
            )}
          </strong>
          <small>{item.art.bottom}</small>
        </div>
      ) : null}

      <div className="v3-body">
        {view === "before" ? (
          <p className="v3-caption">{item.caption}</p>
        ) : item.route ? (
          <RouteBlock item={item} going={savedOn} onGoing={onSave} />
        ) : unit ? (
          <>
            {item.badge && !item.photo && <span className="v3-badge">{item.badge}</span>}
            <h3 style={{ fontFamily: FONT_HEADLINE }}>{unit.question}</h3>
            <p className="v3-sub">{unit.sub}</p>
            <p className="v3-source-line">{item.caption}</p>

            {!done && open && pick === undefined && (
              <div className="v3-options">
                {unit.options.map((label, i) => (
                  <button key={label} type="button" onClick={() => onPick(item.id, i as 0 | 1)}>
                    {label}
                    <b>↗</b>
                  </button>
                ))}
              </div>
            )}

            {!done && pick !== undefined && (
              <>
                <div className="v3-split-label">ILLUSTRATIVE CAMPUS SPLIT</div>
                {unit.options.map((label, i) => (
                  <Bar key={label} label={label} percent={i === 0 ? unit.campus : 100 - unit.campus} mine={pick === i} />
                ))}
                <div className="v3-picked">
                  <b>✓ Locked: {unit.options[pick]}</b>
                  <p>Come back {unit.resolves.slice(5).replace("-", "/")} for the result.</p>
                </div>
              </>
            )}

            {!done && !open && pick === undefined && (
              <div className="v3-statusbox">Voting closed. Result lands {unit.resolves.slice(5).replace("-", "/")}.</div>
            )}

            {done && (
              <>
                <div className="v3-split-label">ILLUSTRATIVE CAMPUS SPLIT</div>
                {unit.options.map((label, i) => (
                  <Bar key={label} label={label} percent={i === 0 ? unit.campus : 100 - unit.campus} mine={pick === i} />
                ))}
                <div className={`v3-resolve v3-resolve-${mode}`}>
                  <small>{mode === "score" ? "THE ANSWER" : "WHAT ACTUALLY HAPPENED"}</small>
                  <strong style={{ fontFamily: FONT_HEADLINE }}>{unit.truth}</strong>
                  {mode === "score" ? (
                    pick === undefined ? (
                      <b className="v3-miss">You didn&apos;t call this one.</b>
                    ) : pick === unit.winner ? (
                      <b className="v3-hit">You called it.</b>
                    ) : (
                      <b className="v3-wrong">You had {unit.options[pick]}.</b>
                    )
                  ) : (
                    <b className="v3-neutral">Campus leaned {unit.campus >= 50 ? unit.options[0] : unit.options[1]}. Side by side, not scored.</b>
                  )}
                  <em>{unit.truthNote}</em>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="v3-caption">{item.caption}</p>
        )}

        <div className="v3-actions">
          <button type="button" className={liked ? "is-on" : ""} onClick={onLike} aria-pressed={liked} aria-label="Like post">
            <HeartGlyph filled={liked} />
            <span>{(item.likes ?? 0) + (liked ? 1 : 0)}</span>
          </button>
          <button type="button" aria-label="Comments">
            <CommentGlyph />
            <span>{unit ? 12 : 3}</span>
          </button>
          <button type="button" aria-label="Share post">
            <ShareGlyph />
          </button>
          <button type="button" className={`v3-save${savedOn ? " is-on" : ""}`} onClick={onSave} aria-pressed={savedOn} aria-label="Save post">
            <BookmarkGlyph filled={savedOn} />
          </button>
        </div>
        {view === "after" && item.verb && item.verb.label && !item.route && (
          <button
            type="button"
            className={`v3-verb v3-verb-${item.verb.kind}${savedOn ? " is-on" : ""}`}
            onClick={onSave}
            aria-pressed={savedOn}
          >
            {savedOn ? doneLabel(item.verb) : item.verb.label}
          </button>
        )}
        {!unit && view === "after" && !item.verb && (
          <em className="v3-noprompt">Asks nothing. Left as a plain post.</em>
        )}
      </div>
    </li>
  );
}

function RouteBlock({ item, going, onGoing }: { item: Item; going: boolean; onGoing: () => void }) {
  const r = item.route!;
  const count = r.going + (going ? 1 : 0);
  const pct = Math.min(100, Math.round((count / r.goal) * 100));
  return (
    <>
      {item.badge && <span className="v3-badge">{item.badge}</span>}
      <h3 style={{ fontFamily: FONT_HEADLINE }}>Saturday, in two stops.</h3>
      <p className="v3-source-line">{item.caption}</p>

      <ol className="v3-route">
        {r.stops.map((s, i) => (
          <li key={s.place}>
            <span className="v3-route-dot">{i + 1}</span>
            <div>
              <b>{s.time}</b>
              <em>{s.place}</em>
              <span>{s.what}</span>
            </div>
          </li>
        ))}
      </ol>

      {/* Turnout is the product for a spirit club, so the number is the content. */}
      <div className="v3-turnout">
        <div className="v3-turnout-row">
          <b>{count} going</b>
          <span>Hoya Blue wants {r.goal} on the patio</span>
        </div>
        <span className="v3-turnout-bar">
          <i style={{ width: `${pct}%` }} />
        </span>
      </div>

      <button type="button" className={`v3-going${going ? " is-on" : ""}`} onClick={onGoing} aria-pressed={going}>
        {going ? "\u2713 Going \u00b7 both stops on your Saturday" : "+ Going \u00b7 adds both stops"}
      </button>
      <em className="v3-fineprint">One tap covers Harbin and Cooper Field. Count is illustrative.</em>
    </>
  );
}

function CalendarCard({ item, savedOn, onSave }: { item: Item; savedOn: boolean; onSave: () => void }) {
  const c = item.calendar!;
  const [d, mon] = ["25", "SEP"];
  return (
    <li className="v3-card v3-cal">
      <div className="v3-head">
        <EvAvatarCircle label="Data Science" color={item.tint} size={36} />
        <div className="v3-head-copy">
          {/* The real organizer, not "Georgetown University". */}
          <b>{c.organizer}</b>
          <span>{item.kind}</span>
        </div>
        <em className="v3-state v3-state-cal">Calendar</em>
      </div>

      <div className="v3-cal-body">
        <div className="v3-cal-top">
          <div className="v3-cal-date">
            <small>{mon}</small>
            <b>{d}</b>
          </div>
          <div>
            <h3 style={{ fontFamily: FONT_HEADLINE }}>Movie Night in the Courtyard</h3>
            <p className="v3-cal-meta">
              {c.when}
              <br />
              {c.where}
            </p>
          </div>
        </div>

        <p className="v3-cal-text">{c.body}</p>

        <button type="button" className={`v3-going${savedOn ? " is-on" : ""}`} onClick={onSave} aria-pressed={savedOn}>
          {savedOn ? "\u2713 Going" : "+ Going"}
        </button>

        <div className="v3-cal-foot">
          <a href={c.url} target="_blank" rel="noreferrer">
            Georgetown events calendar ↗
          </a>
          <em>{c.whereNote}</em>
        </div>
      </div>
    </li>
  );
}

function doneLabel(v: NonNullable<Item["verb"]>) {
  if (v.kind === "commit") return "\u2713 Going";
  if (v.kind === "acknowledge") return "\u2713 Sent";
  if (v.kind === "decide") return "\u2713 Saved";
  return "\u2713 Opened";
}

/** What a calendar event looks like today: a title and a link off-app. */
function CalendarStub({ item, liked, onLike }: { item: Item; liked: boolean; onLike: () => void }) {
  return (
    <li className="v3-card">
      <div className="v3-head">
        <EvAvatarCircle label="Georgetown" color="#1d3557" size={36} />
        <div className="v3-head-copy">
          <b>Georgetown University</b>
          <span>1h</span>
        </div>
      </div>
      <div className="v3-body">
        <p className="v3-caption">DSAN Social Committee: Movie Night in the Courtyard</p>
        <a className="v3-readmore" href={item.calendar!.url} target="_blank" rel="noreferrer">
          Read more \u2197
        </a>
        <div className="v3-actions">
          <button type="button" className={liked ? "is-on" : ""} onClick={onLike} aria-pressed={liked}>
            <HeartGlyph filled={liked} />
            <span>{1 + (liked ? 1 : 0)}</span>
          </button>
          <button type="button"><CommentGlyph /><span>0</span></button>
          <button type="button"><ShareGlyph /></button>
          <button type="button" className="v3-save"><BookmarkGlyph filled={false} /></button>
        </div>
      </div>
    </li>
  );
}

function Bar({ label, percent, mine }: { label: string; percent: number; mine: boolean }) {
  return (
    <div className={`v3-bar${mine ? " is-mine" : ""}`}>
      <b>{label}</b>
      <span>
        <i style={{ width: `${percent}%` }} />
      </span>
      <b>{percent}%</b>
    </div>
  );
}

function RecordCard() {
  const right = HISTORY.filter((h) => h.right).length;
  return (
    <li className="ligo-feed-card v3-record">
      <div className="v3-record-body">
        <small>YOUR SEMESTER</small>
        <h3 style={{ fontFamily: FONT_HEADLINE }}>
          {right}–{HISTORY.length - right} reading the Philodemic room
        </h3>
        <p className="v3-sub">The three tallies are real, published by the Society. The picks are invented.</p>
        {HISTORY.map((h) => (
          <div key={h.topic} className="v3-history">
            <b className={h.right ? "hit" : "miss"}>{h.right ? "✓" : "✕"}</b>
            <div>
              <p>{h.topic}</p>
              <span>
                Room {h.truth} · you said {h.you}
              </span>
            </div>
          </div>
        ))}
        <p className="v3-record-note">Score mode only. Mirror has nothing to accumulate.</p>
      </div>
    </li>
  );
}

function VerifiedGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={EV.orange} aria-label="Verified organization" role="img">
      <path d="M12 1.5l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1.4 2.9 1.4 2.9-2.8 1.6-.9 3.1-3.2-.3L12 22.5l-2.4-2.1-3.2.3-.9-3.1-2.8-1.6L4.1 13 2.7 10.1l2.8-1.6.9-3.1 3.2.3z" />
      <path d="M10.6 15.2l-2.8-2.8 1.3-1.3 1.5 1.5 3.9-3.9 1.3 1.3z" fill="#fff" />
    </svg>
  );
}
function HeartGlyph({ filled }: { filled: boolean }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z" />
    </svg>
  );
}
function CommentGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.7-4.5A8.6 8.6 0 1 1 21 11.5Z" />
    </svg>
  );
}
function ShareGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 15V3m0 0L8 7m4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}
function BookmarkGlyph({ filled }: { filled: boolean }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
