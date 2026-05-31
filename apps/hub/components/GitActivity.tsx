"use client";

import { useEffect, useState } from "react";

type Commit = {
  repo: string;
  message: string;
  date: string;
};

const REPOS = ["reflow", "hub", "clipo", "unblock"];
const OWNER = "sanacode2200-spec";
const PREFIX_RE = /^(feat|fix|chore|docs|style|refactor|test|build|ci|perf|revert)(\(.+?\))?!?:\s*/i;

export function GitActivity() {
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    Promise.allSettled(
      REPOS.map((repo) =>
        fetch(`https://api.github.com/repos/${OWNER}/${repo}/commits?per_page=3`)
          .then((r) => r.json())
          .then((data: { commit: { message: string; author: { date: string } } }[]) =>
            data.slice(0, 3).map((c) => ({
              repo,
              message: c.commit.message.split("\n")[0].replace(PREFIX_RE, ""),
              date: c.commit.author.date,
            }))
          )
      )
    ).then((results) => {
      const all = results
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => (r as PromiseFulfilledResult<Commit[]>).value)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);
      setCommits(all);
    });
  }, []);

  if (!commits.length) return null;

  const items = [...commits, ...commits];

  return (
    <div className="git-ticker">
      <span className="git-ticker-label">git log</span>
      <div className="git-ticker-track">
        <div className="git-ticker-inner">
          {items.map((c, i) => (
            <span key={i} className="git-ticker-item">
              <span className="git-ticker-repo">{c.repo}</span>
              <span className="git-ticker-msg">{c.message}</span>
              <span className="git-ticker-dot" aria-hidden>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
