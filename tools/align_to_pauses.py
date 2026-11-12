import re, json, sys, subprocess, math
audio, textfile, out = sys.argv[1], sys.argv[2], sys.argv[3]
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",audio],capture_output=True,text=True).stdout)
log = subprocess.run(["ffmpeg","-i",audio,"-af","silencedetect=noise=-35dB:d=0.3","-f","null","-"],capture_output=True,text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
# leading speech start / trailing end
lead = 0.0
if ss and ss[0] < 0.05: lead = se[0]; ss, se = ss[1:], se[1:]
end = dur
if len(ss) > len(se): end = ss[-1]; ss = ss[:-1]
chunks = []; cur = lead
for a, b in zip(ss, se): chunks.append((cur, a)); cur = b
chunks.append((cur, end))
words = open(textfile).read().split()
def syl(w):
    w2 = w.lower()
    if re.search(r"\d", w2):
        m = {"1980s":5, "'90s":2, "2010,":4}; return m.get(w2, 3)
    w2 = re.sub(r"[^a-z]", "", w2); n = len(re.findall(r"[aeiouy]+", w2))
    if w2.endswith("e") and n > 1 and not w2.endswith("le"): n -= 1
    return max(1, n)
wt = [0.6 + syl(w) for w in words]
N, K = len(words), len(chunks)
cum = [0]
for x in wt: cum.append(cum[-1] + x)
speech = sum(b - a for a, b in chunks); r = speech / cum[-1]
def pen(i):  # boundary after word i (1-based)
    w = words[i - 1]
    if re.search(r"(\.\.\.|…|[.?!])[\"'”’)]*$", w): return 0.0
    if re.search(r"[,:;][\"'”’)]*$", w) or w.endswith('"'): return 0.6
    return 3.0
INF = 1e18; MAXW = 45
dp = [[INF] * (N + 1) for _ in range(K + 1)]; bk = [[0] * (N + 1) for _ in range(K + 1)]
dp[0][0] = 0
for j in range(1, K + 1):
    a, b = chunks[j - 1]; d = b - a
    for i in range(j, N + 1):
        best, arg = INF, 0
        for p in range(max(j - 1, i - MAXW), i):
            if dp[j - 1][p] >= INF: continue
            pred = (cum[i] - cum[p]) * r
            c = dp[j - 1][p] + 6 * math.log(pred / d) ** 2 + (pen(i) if i < N else 0)
            if c < best: best, arg = c, p
        dp[j][i], bk[j][i] = best, arg
bounds = [N]; i = N
for j in range(K, 0, -1): i = bk[j][i]; bounds.append(i)
bounds = bounds[::-1]
res = []
for j in range(K):
    p, i = bounds[j], bounds[j + 1]; a, b = chunks[j]; tot = cum[i] - cum[p]; t = a
    seg = []
    for k in range(p, i):
        d = (b - a) * wt[k] / tot; res.append({"word": words[k], "start": round(t, 3), "end": round(t + d * 0.92, 3)}); t += d
    print(f"[{a:6.2f}-{b:6.2f}] {' '.join(words[p:i])}")
json.dump({"source": "pause-aligned script", "words": res}, open(out, "w"), indent=0)
print("cost", round(dp[K][N], 2), "words", N, "chunks", K)
