"""tools/youtube_stats.py — channel + per-video stats (Data API v3) and YouTube Analytics v2 reports.

  python3 tools/youtube_stats.py --start 2026-11-01 [--out channel/analytics/2026-11-22.json]

Token: an OAuth access token injected by the network proxy for BOTH hosts www.googleapis.com and
youtubeanalytics.googleapis.com, with scopes youtube.readonly + yt-analytics.readonly (add youtube.upload to reuse it).
Each section fails on its own (missing scope / quota) and the rest still runs. Analytics data lags ~1-2 days.
"""
import argparse, datetime, json, sys, urllib.error, urllib.parse, urllib.request

DATA = "https://www.googleapis.com/youtube/v3"
ANA = "https://youtubeanalytics.googleapis.com/v2/reports"

def get(url, params):
    req = urllib.request.Request(url + "?" + urllib.parse.urlencode(params), headers={"Authorization": "Bearer proxy-injected"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try: msg = json.loads(body)["error"]["message"]
        except Exception: msg = body[:300]
        raise RuntimeError(f"HTTP {e.code}: {msg}")

ap = argparse.ArgumentParser(); ap.add_argument("--start", default="2026-11-01"); ap.add_argument("--end", default=datetime.date.today().isoformat()); ap.add_argument("--out")
a = ap.parse_args(); R = {"start": a.start, "end": a.end, "errors": {}}

def section(name, fn):
    try: R[name] = fn(); return R[name]
    except Exception as e: R["errors"][name] = str(e); print(f"[{name}] FAILED: {e}", file=sys.stderr)

def channel():
    c = get(f"{DATA}/channels", {"part": "snippet,statistics,contentDetails", "mine": "true"})["items"][0]
    return {"id": c["id"], "title": c["snippet"]["title"], **{k: int(v) for k, v in c["statistics"].items() if v.isdigit()}, "uploads": c["contentDetails"]["relatedPlaylists"]["uploads"]}
def videos():
    ids, tok = [], None
    while True:
        p = {"part": "contentDetails", "playlistId": R["channel"]["uploads"], "maxResults": 50}
        if tok: p["pageToken"] = tok
        r = get(f"{DATA}/playlistItems", p); ids += [i["contentDetails"]["videoId"] for i in r["items"]]; tok = r.get("nextPageToken")
        if not tok: break
    out = []
    for i in range(0, len(ids), 50):
        for v in get(f"{DATA}/videos", {"part": "snippet,statistics,contentDetails,status", "id": ",".join(ids[i:i + 50])})["items"]:
            s = v["statistics"]; out.append({"id": v["id"], "title": v["snippet"]["title"], "published": v["snippet"]["publishedAt"], "privacy": v["status"]["privacyStatus"],
                "publishAt": v["status"].get("publishAt"), "duration": v["contentDetails"]["duration"], "views": int(s.get("viewCount", 0)), "likes": int(s.get("likeCount", 0)), "comments": int(s.get("commentCount", 0))})
    return sorted(out, key=lambda v: v["published"])
def report(dims, metrics, **extra):
    p = {"ids": "channel==MINE", "startDate": a.start, "endDate": a.end, "metrics": metrics}
    if dims: p["dimensions"] = dims
    p.update(extra); r = get(ANA, p); cols = [h["name"] for h in r["columnHeaders"]]
    return [dict(zip(cols, row)) for row in r.get("rows", [])]

section("channel", channel)
if "channel" in R: section("videos", videos)
M = "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost,likes,shares,comments"
section("by_video", lambda: report("video", M, sort="-views", maxResults=200))
section("by_day", lambda: report("day", "views,estimatedMinutesWatched,subscribersGained,subscribersLost", sort="day"))
section("traffic", lambda: report("insightTrafficSourceType", "views,estimatedMinutesWatched", sort="-views"))
section("countries", lambda: report("country", "views,subscribersGained", sort="-views", maxResults=10))
section("subscribed_status", lambda: report("subscribedStatus", "views"))

if a.out: json.dump(R, open(a.out, "w"), indent=1, ensure_ascii=False)
c = R.get("channel", {}); print(f"CHANNEL {c.get('title')}: subs {c.get('subscriberCount')}  views {c.get('viewCount')}  videos {c.get('videoCount')}")
bv = {r["video"]: r for r in R.get("by_video", [])}
for v in R.get("videos", []):
    x = bv.get(v["id"], {}); print(f"{v['published'][:16]} {v['privacy'][:4]:4} {v['views']:6} views {v['likes']:4} lk {v['comments']:3} cm | subs+{x.get('subscribersGained', '-')} avg%{x.get('averageViewPercentage', '-')} shares {x.get('shares', '-')} | {v['title'][:60]}")
for k in ("traffic", "countries", "subscribed_status"):
    if R.get(k): print(k.upper(), R[k])
if R.get("by_day"): print("DAYS", [(d["day"][5:], d["views"], d["subscribersGained"]) for d in R["by_day"]])
if R["errors"]: print("ERRORS", R["errors"])
